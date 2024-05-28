import { XMLParser } from "fast-xml-parser";
import KML from "../src/KML";
import cloneDeep from "lodash.clonedeep";
import {
  defaultGlobal,
  exampleGPSReturn,
  exampleGPSReturnSeries,
} from "./test.data";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "attr-",
});

const kml = new KML();

describe("KML Point conversion", () => {
  test("Single Point", () => {
    const xml = kml.toPoint(
      [cloneDeep(exampleGPSReturn)],
      {
        ...defaultGlobal,
        id: "some point",
      },
      {},
    );
    expect(xml).toBeDefined();
  });

  test("Many Points", () => {
    const xml = kml.toPoint(
      cloneDeep(exampleGPSReturnSeries),
      {
        ...defaultGlobal,
        metadata: {
          copyright: { license: "https://mit-license.org/" },
        },
      },
      {},
    );
    expect(xml).toBeDefined();
  });
});

describe("KML LineString conversion", () => {
  test("Many Points", () => {
    const xml = kml.toLineString(
      cloneDeep(exampleGPSReturnSeries),
      {
        ...defaultGlobal,
        id: "some line",
      },
      {},
    );
  });
});
