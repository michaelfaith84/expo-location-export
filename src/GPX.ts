// https://www.topografix.com/gpx.asp
import { XMLBuilder } from "fast-xml-parser";
import {
  Data,
  GlobalParams,
  GPXExportOptions,
  GPXExportTrackOptions,
  GPXLink,
  GPXMetaData,
  GPXPerson,
  Props,
} from "./types";
import { isValidUrl, splitEmail, validateEmail } from "./utilities";

const options = {
  ignoreAttributes: false,
  attributeNamePrefix: "attr-",
};
const builder = new XMLBuilder(options);

const xsi = "https://www.w3.org/2001/XMLSchema-instance";
const gpxNS = "https://www.topografix.com/GPX/1/1";
const gpxNSXSD = "https://www.topografix.com/GPX/11.xsd";

const validators = {
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
};

const formatters = {
  email: (email: string) => {
    const parts = splitEmail(email);
    return { email: { "attr-id": parts[0], "attr-domain": parts[1] } };
  },
  link: (link: GPXLink) => {
    return { text: link.text };
  },
  person: (person: GPXPerson) => {},
};

class GPX {
  private _buildXML(data: Props, global: GlobalParams) {
    const gpx = {
      "attr-version": "1.1",
      "attr-creator": global.name,
      metadata: this._generateGPXMetaData(data),
    };

    Object.keys(data).forEach((ea) => {
      Object.assign(gpx, data[ea]);
    });

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
            metadata["author"] = global.metadata?.author;
            break;
          case "copyright":
            metadata["copyright"] = global.metadata?.copyright;
            break;
          case "link":
            metadata["link"] = global.metadata?.link;
            break;
          case "time":
            metadata["time"] = global.metadata?.time;
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
  private _toWaypoint(data: Data, global: GlobalParams) {}

  /**
   * A line composed of segments.
   */
  private _toRoute() {}

  /**
   * A line with timestamps
   */
  private _toTrack() {}

  /**
   *
   */
  toTrack(data: Data[], global: GlobalParams, options: GPXExportTrackOptions) {}

  /**
   *
   */
  toPoint(data: Data[], global: GlobalParams, options: GPXExportOptions) {}
}

export default GPX;
