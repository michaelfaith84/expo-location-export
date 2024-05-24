import GEOJSON from "../src/GEOJSON";
import {
  defaultGlobal,
  exampleGPSReturn,
  exampleGPSReturnSeries,
} from "./test.data";
import {
  Feature,
  FeatureCollection,
  GeometryCollection,
  LineString,
  MultiPoint,
  Point,
} from "@turf/helpers";
import { flatten, getCoords } from "../src/utilities";
import { Data } from "../src/types";
import cloneDeep from "lodash.clonedeep";

const geojson = new GEOJSON();

describe("GeoJSON Point conversion", () => {
  test("Single Point to Feature", () => {
    const p = geojson.toPoint(
      [exampleGPSReturn],
      defaultGlobal,
      {},
    ) as Feature<Point>;
    expect(p.type).toEqual("Feature");
    expect(p?.id).toBeUndefined();
    expect(p?.properties).toEqual({});
    expect(p.geometry.type).toEqual("Point");
    expect(p.geometry.coordinates).toEqual(getCoords([exampleGPSReturn])[0]);
  });

  test("Single Point to Feature with id and props", () => {
    const testProps = { name: "potato", population: 5, items: [5, 6, 7] };
    const p = geojson.toPoint(
      [
        {
          ...exampleGPSReturn,
          props: testProps,
        },
      ],
      { ...defaultGlobal, id: "test" },
      {},
    ) as Feature<Point>;
    expect(p.type).toEqual("Feature");
    expect(p.id).toEqual("test");
    expect(p.properties).toEqual(testProps);
    expect(p.geometry.type).toEqual("Point");
    expect(p.geometry.coordinates).toEqual(getCoords([exampleGPSReturn])[0]);
  });

  test("Single Point to Point", () => {
    const p = geojson.toPoint([exampleGPSReturn], defaultGlobal, {
      wrapper: "none",
    }) as Point;
    expect(p.type).toEqual("Point");
    expect(p.coordinates).toEqual(getCoords([exampleGPSReturn])[0]);
  });

  test("Many Points to FeatureCollection", () => {
    const data = cloneDeep(exampleGPSReturnSeries) as Data[];
    data.forEach((ea, i) => {
      data[i].id = i;
    });
    const points = geojson.toPoint(data, defaultGlobal, {
      bbox: true,
    }) as FeatureCollection<Point>;
    expect(points.type).toEqual("FeatureCollection");
    expect(points.features.length).toBe(exampleGPSReturnSeries.length);
    expect(points.bbox).toBeDefined();
    expect(points.bbox?.length).toBe(6);
    expect(points.features.every((ea, i) => ea.id === i)).toBeTruthy();
  });

  test("Many Points to 2d FeatureCollection", () => {
    const points = geojson.toPoint(
      [...exampleGPSReturnSeries].map((ea) => flatten(ea)),
      defaultGlobal,
      {
        bbox: true,
      },
    ) as FeatureCollection<Point>;
    expect(points.type).toEqual("FeatureCollection");
    expect(points.features.length).toBe(exampleGPSReturnSeries.length);
    expect(points.bbox).toBeDefined();
    expect(points.bbox?.length).toBe(4);
  });

  test("Many Points to GeometryCollection", () => {
    const points = geojson.toPoint([...exampleGPSReturnSeries], defaultGlobal, {
      wrapper: "geometry",
      bbox: true,
    }) as GeometryCollection;
    expect(points.type).toEqual("GeometryCollection");
    expect(points.geometries.length).toBe(exampleGPSReturnSeries.length);
    expect(points.bbox).toBeDefined();
    expect(points.bbox?.length).toBe(6);
  });

  test("Many Points to MultiPoint Feature", () => {
    const testProps = { name: "jive" };
    const data = [...exampleGPSReturnSeries] as Data[];
    data[0].props = testProps;
    const points = geojson.toPoint(
      data,
      { ...defaultGlobal, id: "test mp" },
      {
        multiPoint: true,
        bbox: true,
      },
    ) as Feature<MultiPoint>;
    expect(points.type).toEqual("Feature");
    expect(points.id).toEqual("test mp");
    expect(points.geometry.type).toBe("MultiPoint");
    expect(points.geometry.coordinates.length).toBe(
      exampleGPSReturnSeries.length,
    );
    expect(points.bbox).toBeDefined();
    expect(points.bbox?.length).toBe(6);
    expect(points.properties).toEqual(testProps);
  });

  test("Many Points to MultiPoint", () => {
    const points = geojson.toPoint(
      [...exampleGPSReturnSeries],
      { ...defaultGlobal, id: "test mp" },
      {
        multiPoint: true,
        wrapper: "none",
      },
    ) as MultiPoint;
    expect(points.type).toEqual("MultiPoint");
    expect(points.coordinates.length).toBe(exampleGPSReturnSeries.length);
  });
});

describe("GEOJSON LineString conversion", () => {
  test("LineString with one Point as Feature", () => {
    const res = () =>
      geojson.toLineString([exampleGPSReturn], defaultGlobal, {});
    expect(res).toThrowError(
      "coordinates must be an array of two or more positions",
    );
  });

  test("LineString as Feature", () => {
    const ls = geojson.toLineString(
      [...exampleGPSReturnSeries],
      { ...defaultGlobal, id: "test ls" },
      {},
    ) as Feature<LineString>;
    expect(ls.type).toEqual("Feature");
    expect(ls.geometry.type).toEqual("LineString");
    expect(ls.id).toEqual("test ls");
  });

  test("LineString as Feature with Props and bbox", () => {
    const testProps = { name: "hey", destination: "a park" };
    const data = [...exampleGPSReturnSeries] as Data[];
    data[0]["props"] = testProps;
    const ls = geojson.toLineString(
      data,
      { ...defaultGlobal, id: "test ls" },
      { bbox: true },
    ) as Feature<LineString>;
    expect(ls.type).toEqual("Feature");
    expect(ls.geometry.type).toEqual("LineString");
    expect(ls.id).toEqual("test ls");
    expect(ls.properties).toEqual(testProps);
  });

  test("LineString as LineString", () => {
    const ls = geojson.toLineString(
      [...exampleGPSReturnSeries],
      { ...defaultGlobal, id: "test ls" },
      { wrapper: "geometry" },
    ) as LineString;
    expect(ls.type).toEqual("LineString");
  });
});
