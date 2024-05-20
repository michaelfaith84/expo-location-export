import { flatten, getBBox } from "../src/utilities";
import {
  exampleGPSReturn,
  exampleGPSReturnFlattened,
  exampleGPSReturnSeries,
} from "./test.data";
import bboxPolygon from "@turf/bbox-polygon";
import booleanContains from "@turf/boolean-contains";
import { point } from "@turf/helpers";
import buffer from "@turf/buffer";

describe("flatten", () => {
  test("Does it flatten?", () => {
    const flattened = flatten({ ...exampleGPSReturn });
    expect(flattened).not.toMatchObject(exampleGPSReturn);
    expect(flattened).toMatchObject(exampleGPSReturnFlattened);
  });
});

describe("getBBox", () => {
  test("2d bbox (single)", () => {
    const bbox = getBBox([flatten(exampleGPSReturn)]);
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
