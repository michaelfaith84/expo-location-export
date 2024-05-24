import GPX, { gpxNS, gpxSchema, gpxVersion, gpxXSI } from "../src/GPX";
import PACKAGE_INFO from "../package.json";
import {
  defaultGlobal,
  exampleGPSReturn,
  exampleGPSReturnSeries,
} from "./test.data";
import { getBBox } from "../src/utilities";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import cloneDeep from "lodash.clonedeep";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "attr-",
});

const gpx = new GPX();

describe("GPX Point conversion", () => {
  test("Single Point to Waypoint", () => {
    const xml = gpx.toPoint(
      [cloneDeep(exampleGPSReturn)],
      {
        ...defaultGlobal,
        metadata: {
          copyright: { license: "https://mit-license.org/" },
        },
      },
      {},
    );
    expect(XMLValidator.validate(xml)).toBeTruthy();
    const parsed = parser.parse(xml);
    expect(parsed.gpx.metadata).toBeDefined();
    expect(parsed.gpx.metadata.copyright).toBeDefined();
    expect(parsed.gpx.metadata.copyright.license).toBeDefined();
    expect(parsed.gpx.metadata.copyright.license).toEqual(
      "https://mit-license.org/",
    );
    expect(parsed.gpx.metadata.copyright.year).toBeDefined();
    expect(parsed.gpx.metadata.copyright.year).toEqual(
      new Date().getFullYear(),
    );
    expect(parseFloat(parsed.gpx.wpt["attr-lat"])).toEqual(
      exampleGPSReturn.coords.latitude,
    );
    expect(parseFloat(parsed.gpx.wpt["attr-lon"])).toEqual(
      exampleGPSReturn.coords.longitude,
    );
    expect(parseFloat(parsed.gpx["attr-version"])).toEqual(gpxVersion);
    expect(parsed.gpx["attr-xmlns"]).toEqual(gpxNS);
    expect(parsed.gpx["attr-xmlns:xsi"]).toEqual(gpxXSI);
    expect(parsed.gpx["attr-xsi:schemaLocation"]).toEqual(gpxSchema);
    expect(parsed.gpx["attr-creator"]).toEqual(
      `${PACKAGE_INFO.name}@${PACKAGE_INFO.version}`,
    );
    expect(parsed.gpx.wpt.ele).toEqual(exampleGPSReturn.coords.altitude);
  });
  test("Many Points to Waypoint with Bounds", () => {
    const xml = gpx.toPoint(cloneDeep(exampleGPSReturnSeries), defaultGlobal, {
      bbox: getBBox(exampleGPSReturnSeries),
    });
    expect(XMLValidator.validate(xml)).toBeTruthy();
  });
});

describe("GPX Track conversion", () => {
  test("To Track with Bounds", () => {
    const xml = gpx.toTrack(cloneDeep(exampleGPSReturnSeries), defaultGlobal, {
      bbox: getBBox(exampleGPSReturnSeries),
    });
    expect(XMLValidator.validate(xml)).toBeTruthy();
  });
});
