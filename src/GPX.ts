// https://www.topografix.com/gpx.asp
import { XMLBuilder } from "fast-xml-parser";
import {
  BBox2d,
  BBox3d,
  Data,
  GlobalParams,
  GPXCopyright,
  GPXEmail,
  GPXExportOptions,
  GPXLink,
  GPXMetaData,
  GPXPerson,
  GPXTag,
  GPXTrack,
  GPXWaypointTag,
  Props,
} from "./types";
import {
  bboxToBounds,
  isValidAltitude,
  isValidEmail,
  isValidUrl,
  splitEmail,
  timestampToDatetime,
} from "./utilities";

// GPX version attributes
export const gpxVersion = 1.1;
export const gpxNS = "https://www.topografix.com/GPX/1/1";
export const gpxXSI = "https://www.w3.org/2001/XMLSchema-instance";
export const gpxSchema =
  "http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd";

// Builder config
const builderOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: "attr-",
  format: true,
};

const validators = {
  altitude: (altitude: number, altitudeAccuracy: number) =>
    isValidAltitude(altitude, altitudeAccuracy),
  copyright: (copyright: GPXCopyright) => {
    return !(
      copyright.hasOwnProperty("license") && !isValidUrl(copyright.license)
    );
  },
  email: (email: string) => isValidEmail(email),
  link: (link: GPXLink) => {
    return link.hasOwnProperty("text") && isValidUrl(link.text);
  },
  person: (person: GPXPerson) => {
    if (person.hasOwnProperty("name") && typeof person.name !== "string") {
      return false;
    }

    if (
      person.hasOwnProperty("link") &&
      !validators["link"](person.link as GPXLink)
    ) {
      return false;
    }

    if (
      person.hasOwnProperty("email") &&
      !validators["email"](person.email as string)
    ) {
      return false;
    }

    return true;
  },
  time: (time: number) => time >= 1427328000000 && time <= 32503680000000,
  url: (url: string) => isValidUrl(url),
  year: (year: number) => year > 2015 && year <= 3000,
};

const serializers = {
  copyright: (copyright: GPXCopyright) => {
    return {
      license: copyright.license,
      year:
        copyright.hasOwnProperty("year") &&
        validators["year"](copyright.year as number)
          ? copyright.year
          : new Date().getFullYear(),
    };
  },
  email: (email: string): GPXEmail => {
    const parts = splitEmail(email);
    return {
      "attr-id": parts[0],
      "attr-domain": parts[1],
    };
  },
  /**
   * This exists mostly to prune potentially incorrect mime types.
   *
   * @param link
   */
  link: (link: GPXLink) => {
    return {
      text: link.text,
    };
  },
  person: (person: GPXPerson) => {
    const serialized: GPXPerson = {};

    Object.keys(person).forEach((key: string) => {
      switch (key) {
        case "name":
          serialized["name"] = person.name;
          break;
        case "email":
          serialized["email"] = serializers["email"](person.email as string);
          break;
        case "link":
          serialized["link"] = serializers["link"](person.link as GPXLink);
          break;
      }
    });

    return serialized;
  },
  time: (time: number) => timestampToDatetime(time),
};

class GPX {
  /**
   *
   *
   * @param data
   * @param global
   * @param options
   * @private
   */
  private _buildGPX(
    data: Props,
    global: GlobalParams,
    options: GPXExportOptions,
  ): string {
    const gpx: GPXTag = {
      "attr-xmlns": gpxNS,
      "attr-xmlns:xsi": gpxXSI,
      "attr-xsi:schemaLocation": gpxSchema,
      "attr-version": gpxVersion,
      "attr-creator": global.name,
      metadata: this._generateGPXMetaData(global, options),
    };

    if (Object.keys(gpx.metadata as GPXMetaData).length === 0) {
      delete gpx.metadata;
    }

    if (data.hasOwnProperty("length")) {
      gpx["wpt"] = data as GPXWaypointTag[];

      Object.assign(builderOptions, { arrayNodeName: "wpt" });
    } else {
      gpx["trk"] = data as GPXTrack;

      Object.assign(builderOptions, { arrayNodeName: "trkpt" });
    }

    const builder = new XMLBuilder(builderOptions);

    // Generate the XML
    return builder.build({ gpx: gpx });
  }

  /**
   *
   *
   * @param global
   * @param options
   */
  private _generateGPXMetaData = (
    global: GlobalParams,
    options: GPXExportOptions,
  ): GPXMetaData => {
    const metadata: GPXMetaData = {};

    if (options.hasOwnProperty("bbox")) {
      metadata["bounds"] = bboxToBounds(options.bbox as BBox2d | BBox3d);
    }

    if (global.metadata) {
      Object.keys(global.metadata).forEach((key) => {
        switch (key.toLowerCase()) {
          case "name":
            metadata["name"] = global.metadata?.name;
            break;
          case "desc":
            metadata["desc"] = global.metadata?.desc;
            break;
          case "author":
            if (validators["person"](global.metadata?.author as GPXPerson)) {
              metadata["author"] = serializers["person"](
                global.metadata?.author as GPXPerson,
              );
            }
            break;
          case "copyright":
            if (
              validators["copyright"](
                global.metadata?.copyright as GPXCopyright,
              )
            ) {
              metadata["copyright"] = serializers["copyright"](
                global.metadata?.copyright as GPXCopyright,
              );
            }
            break;
          case "link":
            if (validators["link"](global.metadata?.link as GPXLink)) {
              metadata["link"] = serializers["link"](
                global.metadata?.link as GPXLink,
              );
            }
            break;
          case "time":
            if (validators["time"](global.metadata?.time as number)) {
              metadata["time"] = serializers["time"](
                global.metadata?.time as number,
              );
            }
            break;
          default:
            if (!metadata.hasOwnProperty("extensions")) {
              metadata["extensions"] = {};
            }

            // Map extraneous props to extensions
            // @ts-ignore
            metadata.extensions[key.toLowerCase()] = global.metadata[key];
        }
      });
    }

    return metadata;
  };

  /**
   * Generates an individual waypoint.
   *
   * @param data
   * @param options
   * @private
   */
  private _toWaypoint(data: Data, options: GPXExportOptions) {
    const wpt: GPXWaypointTag = {
      time: serializers["time"](data["timestamp"]),
    };

    if (data.id) {
      wpt["name"] = data.id.toString();
      delete data.id;
    }

    if (data.props) {
      if (data.props.hasOwnProperty("name")) {
        wpt["name"] = data.props.name;
        delete data.props.name;
      }

      wpt["extensions"] = data.props;
    }

    Object.keys(data.coords).forEach((key) => {
      switch (key) {
        case "altitude":
          if (
            validators["altitude"](
              data.coords.altitude,
              data.coords.altitudeAccuracy,
            )
          ) {
            wpt["ele"] = data.coords["altitude"];
          }
          break;
        case "latitude":
          wpt["attr-lat"] = data.coords["latitude"];
          break;
        case "longitude":
          wpt["attr-lon"] = data.coords["longitude"];
          break;
        case "heading":
          wpt["magvar"] = data.coords.heading;
          break;
      }
    });

    return wpt;
  }

  /**
   * A collection of timestamped waypoints in a track segment.
   *
   * @param data
   * @param global
   * @param options
   */
  toTrack(data: Data[], global: GlobalParams, options: GPXExportOptions) {
    const trk: GPXTrack = {
      trkseg: [
        {
          trkpt: data.map((ea, i) =>
            this._toWaypoint(Object.assign(ea, { name: i }), options),
          ),
        },
      ],
    };

    if (global.id) {
      trk["name"] = global.id.toString();
    }

    return this._buildGPX(trk, global, options);
  }

  /**
   * A series of single waypoints.
   *
   * @param data
   * @param global
   * @param options
   */
  toPoint(data: Data[], global: GlobalParams, options: GPXExportOptions) {
    const wpt = data.map((ea, i) => {
      return this._toWaypoint(Object.assign(ea, { id: i }), options);
    });

    return this._buildGPX(wpt, global, options);
  }
}

export default GPX;
