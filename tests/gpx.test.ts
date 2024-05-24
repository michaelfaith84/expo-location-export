import GPX from "../src/GPX";
import {
  defaultGlobal,
  exampleGPSReturn,
  exampleGPSReturnSeries,
} from "./test.data";

const gpx = new GPX();

describe("GPX Point conversion", () => {
  test("Single Point to Waypoint", () => {
    const xml = gpx.toPoint([exampleGPSReturn], defaultGlobal, {});
  });
  test("Many Points to Waypoint", () => {
    const xml = gpx.toPoint(exampleGPSReturnSeries, defaultGlobal, {});

    // console.log(xml);
  });
});

describe("GPX Track conversion", () => {
  test("To Track", () => {
    const xml = gpx.toTrack(exampleGPSReturnSeries, defaultGlobal, {});
    console.log(xml);
  });
});
