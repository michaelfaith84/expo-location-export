// https://www.topografix.com/gpx.asp
import { XMLBuilder } from "fast-xml-parser";
import {
  Data,
  GlobalParams,
  GPXCopyright,
  GPXEmail,
  GPXExportOptions,
  GPXExportTrackOptions,
  GPXLink,
  GPXMetaData,
  GPXPerson,
  GPXWaypointTag,
  Props,
} from "./types";
import { isValidUrl, splitEmail, validateEmail } from "./utilities";

const options = {
  ignoreAttributes: false,
  attributeNamePrefix: "attr-",
};
const builder = new XMLBuilder(options);

const gpxNS = "https://www.topografix.com/GPX/1/1";
const gpxXSI = "https://www.w3.org/2001/XMLSchema-instance";
const gpxSchema =
  "http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd";

const validators = {
  copyright: (copyright: GPXCopyright) => {
    if (copyright.hasOwnProperty("license") && !isValidUrl(copyright.license)) {
      return false;
    }
  },
  email: (email: string) => validateEmail(email),
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
  time: (time: string) => true,
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
};

class GPX {
  private _buildXML(data: Props, global: GlobalParams): XMLBuilder {
    const gpx = {
      "attr-xmlns": gpxNS,
      "attr-xmlns:xsi": gpxXSI,
      "attr-xsi:schemaLocation": gpxSchema,
      "attr-version": "1.1",
      "attr-creator": global.name,
      metadata: this._generateGPXMetaData(data),
    };

    // Add the rest of the tags
    Object.keys(data).forEach((ea) => {
      Object.assign(gpx, data[ea]);
    });

    // Generate the XML
    return builder.build(gpx);
  }

  /**
   *
   *
   * @param global
   */
  private _generateGPXMetaData = (global: GlobalParams): GPXMetaData => {
    const metadata: GPXMetaData = {};

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
            if (validators["time"](global.metadata?.time as string)) {
              metadata["time"] = global.metadata?.time;
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
   * Collection of points
   */
  private _toWaypoint(data: Data, global: GlobalParams) {
    const wpt: GPXWaypointTag = {};
    Object.keys(data).forEach((key) => {
      switch (key) {
        case "altitude":
          break;
      }
    });
  }

  /**
   * A line with timestamps -- This will probably get nuked
   */
  private _toTrack() {}

  /**
   * A line with timestamps
   */
  toTrack(data: Data[], global: GlobalParams, options: GPXExportTrackOptions) {}

  /**
   *
   */
  toPoint(data: Data[], global: GlobalParams, options: GPXExportOptions) {}
}

export default GPX;
