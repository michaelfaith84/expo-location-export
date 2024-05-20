// https://datatracker.ietf.org/doc/html/rfc7946

import {
  AddParams,
  ExporterDump,
  Flattened,
  GEOJSONExportOptions,
  GEOJSONExportPointOptions,
  GlobalParams,
} from "./types";
import {
  Feature,
  FeatureCollection,
  geometryCollection,
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
} from "@turf/helpers";

/**
 * Used to convert raw GPS returns to GEOJSON objects.
 */
export default class GEOJSON {
  /**
   * Converts a FeatureCollection to a GeometryCollection
   *
   * @param object
   */
  private _toGeometry(object: FeatureCollection) {
    const geometries = object.features.map((feature) => feature.geometry) as (
      | Point
      | LineString
      | Polygon
      | MultiPoint
      | MultiLineString
      | MultiPolygon
    )[];
    return geometryCollection(geometries);
  }

  /**
   * Converts a Feature to a raw geometry.
   *
   * @param object
   * @private
   */
  private _toUnwrapped(object: Feature) {
    return object.geometry;
  }

  /**
   * Creates a FeatureCollection of Points
   *
   * @param dump
   * @param options
   * @private
   */
  private _toPoint(dump: ExporterDump, options: GEOJSONExportPointOptions) {}

  /**
   * Creates a MultiPoint Feature
   *
   * @param dump
   * @param options
   * @private
   */
  private _toMultiPoint(
    dump: ExporterDump,
    options: GEOJSONExportPointOptions,
  ) {}

  /**
   * Wrapper method for converting raw data to the specified Point format
   *
   * @param dump
   * @param options
   */
  toPoint(
    dump: { data: AddParams[] | Flattened[]; global: GlobalParams },
    options: GEOJSONExportPointOptions,
  ) {
    if (options.multiPoint !== undefined && options.multiPoint) {
      return this._toMultiPoint(dump, options);
    } else {
      return this._toPoint(dump, options);
    }
  }

  /**
   * Wrapper method for converting raw data to the specified LineString format.
   * MultiLineString used for crossing the anti-meridian.
   *
   * @param dump
   * @param options
   */
  toLineString(dump: ExporterDump, options: GEOJSONExportOptions) {}
}
