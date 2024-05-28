import {
  flatten,
  getBBox,
  getCoords,
  manyToOnePropsHandler,
} from "../src/utilities";
import {
  exampleGPSReturn,
  exampleGPSReturnFlattened,
  exampleGPSReturnSeries,
} from "./test.data";
import bboxPolygon from "@turf/bbox-polygon";
import booleanContains from "@turf/boolean-contains";
import { point } from "@turf/helpers";
import buffer from "@turf/buffer";
import { Data, Position3D } from "../src/types";
import cloneDeep from "lodash.clonedeep";

describe("flatten", () => {
  test("Does it flatten?", () => {
    const flattened = flatten({ ...exampleGPSReturn });
    expect(flattened).not.toMatchObject(exampleGPSReturn);
    expect(flattened).toMatchObject(exampleGPSReturnFlattened);
  });
});

describe("getBBox", () => {
  test("2d bbox (single)", () => {
    const bbox = getBBox([flatten({ ...exampleGPSReturn })]);
    const p = point([
      exampleGPSReturn.coords.longitude,
      exampleGPSReturn.coords.latitude,
    ]);
    const polygon = buffer(bboxPolygon(bbox), 1, { units: "feet" });

    expect(booleanContains(polygon, p)).toBeTruthy();
  });

  test("2d bbox (series)", () => {
    const bbox = getBBox([...exampleGPSReturnSeries.map((ea) => flatten(ea))]);
    const p = point([
      exampleGPSReturnSeries[0].coords.longitude,
      exampleGPSReturnSeries[0].coords.latitude,
    ]);
    const polygon = buffer(bboxPolygon(bbox), 1, { units: "feet" });

    expect(booleanContains(polygon, p)).toBeTruthy();
  });
});

describe("manyToOnePropsHandler", () => {
  const testProps1 = { name: "potato" };
  const testProps2 = {
    name: "jive",
    description: "a place",
    members: [1, 7, 5],
  };

  test("index: 0", () => {
    const data = cloneDeep(exampleGPSReturnSeries) as Data[];
    data[0].props = testProps1;
    expect(manyToOnePropsHandler(data)).toEqual(testProps1);
  });

  test("index: 2", () => {
    const data = cloneDeep(exampleGPSReturnSeries) as Data[];
    data[2].props = testProps2;
    expect(manyToOnePropsHandler(data)).toEqual(testProps2);
  });

  test("index: 7", () => {
    const data = cloneDeep(exampleGPSReturnSeries) as Data[];
    data[7].props = testProps2;
    expect(manyToOnePropsHandler(data)).toEqual(testProps2);
  });

  test("index: last", () => {
    const data = cloneDeep(exampleGPSReturnSeries) as Data[];
    data[exampleGPSReturnSeries.length - 1].props = testProps1;
    expect(manyToOnePropsHandler(data)).toEqual(testProps1);
  });

  test("No data", () => {
    const res = () => manyToOnePropsHandler([]);
    expect(res).toThrowError("No props found.");
  });
});

describe("getCoords", () => {
  test("Single GPSReturn", () => {
    const res = getCoords([{ ...exampleGPSReturn }]) as Position3D[];
    expect(res.length).toBe(1);
    expect(res[0].length).toBe(3);
  });

  test("Many GPS returns", () => {
    const res = getCoords(exampleGPSReturnSeries);
    expect(res.length).toBe(exampleGPSReturnSeries.length);
    expect(res[0].length).toBe(3);
  });
});
