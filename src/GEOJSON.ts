// https://datatracker.ietf.org/doc/html/rfc7946

import {
  BBox2d,
  BBox3d,
  Data,
  GEOJSONExportOptions,
  GEOJSONExportPointOptions,
  GlobalParams,
} from "./types";
import {
  Feature,
  featureCollection,
  Geometry,
  geometryCollection,
  Id,
  LineString,
  lineString,
  MultiLineString,
  MultiPoint,
  multiPoint,
  MultiPolygon,
  Point,
  point,
  Polygon,
} from "@turf/helpers";
import { getBBox, getCoords, manyToOnePropsHandler } from "./utilities";

const validators = {};
const serializers = {};

/**
 * Used to convert raw GPS returns to GEOJSON objects.
 *
 * Defaults to returning a Feature or FeatureCollection.
 */
class GEOJSON {
  /**
   * Converts an array of Features to a GeometryCollection
   *
   * @param objects
   * @param global
   * @param options
   */
  private _toGeometry(
    objects: Feature[],
    global: GlobalParams,
    options: GEOJSONExportOptions,
  ) {
    const geometries = objects.map((feature) => feature.geometry) as (
      | Point
      | LineString
      | Polygon
      | MultiPoint
      | MultiLineString
      | MultiPolygon
    )[];

    // geometryCollection annoyingly returns a Feature containing a GC...
    const gc = geometryCollection(geometries).geometry;

    if (options.bbox) {
      gc.bbox = options.bbox as BBox2d | BBox3d;
    }

    return gc;
  }

  /**
   * Converts a Feature to a raw geometry.
   *
   * @param object
   * @param options
   * @private
   */
  private _toUnwrapped(object: Feature, options: GEOJSONExportOptions) {
    return object.geometry;
  }

  /**
   * Creates a FeatureCollection of Points
   *
   * @param data
   * @param global
   * @param options
   * @private
   */
  private _toPoint(
    data: Data[],
    global: GlobalParams,
    options: GEOJSONExportPointOptions,
  ) {
    const coords = getCoords(data);
    let points: Feature[] = data.map((ea, i) => {
      const p = point(coords[i]);

      if (ea.id !== undefined) {
        p.id = ea.id as Id;
      }

      if (ea.props !== undefined) {
        p.properties = ea.props;
      }

      return p;
    });

    if (
      options.wrapper &&
      (options.wrapper === "geometry" ||
        (options.wrapper === "none" && points.length > 1))
    ) {
      // Return GeometryCollection
      return this._toGeometry(points, global, options);
    } else if (
      options.wrapper &&
      options.wrapper === "none" &&
      points.length == 1
    ) {
      // Return Point
      return this._toUnwrapped(points[0], options);
    }

    if (points.length > 1) {
      const fc = featureCollection(points);

      if (options.bbox) {
        fc.bbox = options.bbox as BBox2d | BBox3d;
      }

      return fc;
    }

    if (global.id) {
      points[0].id = global.id;
    }

    // Return Feature
    return points[0];
  }

  /**
   * Creates a MultiPoint Feature
   *
   * @param data
   * @param global
   * @param options
   * @private
   */
  private _toMultiPoint(
    data: Data[],
    global: GlobalParams,
    options: GEOJSONExportPointOptions,
  ): Feature | Geometry {
    let mp: Feature<MultiPoint> | MultiPoint = multiPoint(getCoords(data));

    if (global.id) {
      mp.id = global.id;
    }

    // If we have props, use the first instance
    if (data.some((ea) => ea.props)) {
      mp.properties = manyToOnePropsHandler(data);
    }

    // Returns a MultiPoint
    if (
      options.wrapper &&
      (options.wrapper === "geometry" || options.wrapper === "none")
    ) {
      return this._toUnwrapped(mp, options) as Geometry;
    }

    if (options.bbox) {
      mp.bbox = options.bbox as BBox2d | BBox3d;
    }

    // Returns a Feature
    return mp;
  }

  /**
   * Wrapper method for converting raw data to the specified Point format
   *
   * @param data
   * @param global
   * @param options
   */
  toPoint(
    data: Data[],
    global: GlobalParams,
    options: GEOJSONExportPointOptions,
  ) {
    if (options.bbox) {
      options.bbox = getBBox(data);
    }

    if (options.multiPoint !== undefined && options.multiPoint) {
      return this._toMultiPoint(data, global, options);
    } else {
      return this._toPoint(data, global, options);
    }
  }

  /**
   * Wrapper method for converting raw data to the specified LineString format.
   * MultiLineString used for crossing the anti-meridian.
   *
   * @param data
   * @param global
   * @param options
   */
  toLineString(
    data: Data[],
    global: GlobalParams,
    options: GEOJSONExportOptions,
  ) {
    const ls = lineString(getCoords(data));

    // Returns a LineString
    if (
      options.wrapper !== undefined &&
      (options.wrapper === "geometry" || options.wrapper === "none")
    ) {
      return this._toUnwrapped(ls, options);
    }

    if (global.id) {
      ls.id = global.id;
    }

    if (options.bbox) {
      ls.bbox = getBBox(data);
    }

    // If we have props, use the first instance
    if (data.some((ea) => ea.props)) {
      ls.properties = manyToOnePropsHandler(data);
    }

    // Returns a Feature
    return ls;
  }
}

export default GEOJSON;
