// https://www.topografix.com/gpx.asp
import { XMLBuilder } from "fast-xml-parser";
import {
  Data,
  GlobalParams,
  GPXExportLineOptions,
  GPXExportOptions,
  GPXMetaData,
  Props,
} from "./types";

const options = {
  ignoreAttributes: false,
  attributeNamePrefix: "attr-",
};
const builder = new XMLBuilder(options);

const xsi = "https://www.w3.org/2001/XMLSchema-instance";
const gpxNS = "https://www.topografix.com/GPX/1/1";
const gpxNSXSD = "https://www.topografix.com/GPX/11.xsd";

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
  toLine(data: Data[], global: GlobalParams, options: GPXExportLineOptions) {}

  /**
   *
   */
  toPoint(data: Data[], global: GlobalParams, options: GPXExportOptions) {}
}

export default GPX;
