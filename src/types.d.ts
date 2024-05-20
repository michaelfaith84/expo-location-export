import {
  Feature,
  FeatureCollection,
  GeometryCollection,
  MultiPoint,
  Point,
} from "@turf/helpers";

export interface GPSCoords {
  accuracy: number;
  altitude: number;
  altitudeAccuracy: number;
  heading: number;
  latitude: number;
  longitude: number;
  speed: number;
}

export interface GPSReturn {
  coords: GPSCoords;
  mocked: boolean;
  timestamp: number;
}

export interface ID {
  id?: string | number;
}

export interface Options extends ID {
  app: {
    name: string;
    url: string;
  };
  name: string;
}

export interface Props {
  [index: number]: any;
}

type FlattenedGPSReturn = Omit<
  GPSReturn,
  "coords.altitude",
  "coords.altitudeAccuracy"
>;

export interface GPSReturnFlattened {
  coords: Omit<GPSCoords, "altitude", "altitudeAccuracy">;
  mocked: boolean;
  timestamp: number;
}

export interface GlobalParams extends ID {
  name?: string;
  url?: string;
}

export interface AddParams extends GPSReturn {
  props?: Props;
  id?: ID;
}

export interface Flattened extends GPSReturnFlattened {
  props?: Props;
  id?: ID;
}

export type ExporterDump = { data: AddParams[]; global: GlobalParams };

export type ExportFormat = "gpx" | "kml" | "geojson";

export type Position2D = [number, number];
export type Position3D = [number, number, number];

/**
 * [west, south, east, north]
 */
export type BBox2d = [number, number, number, number];
/**
 * [west, south, min-altitude, east, north, max-altitude]
 */
export type BBox3d = [number, number, number, number, number, number];

export interface CommonExportOptions {
  flatten?: boolean;
  bbox?: boolean;
}

type GEOJSONWrapper = "feature" | "geometry" | "none";

export interface GEOJSONExportOptions extends CommonExportOptions {
  wrapper?: GEOJSONWrapper;
}

export interface GEOJSONExportPointOptions extends GEOJSONExportOptions {
  multiPoint?: boolean;
}

export type GEOJSONExportPointReturn<A extends GEOJSONWrapper> = A extends
  | "feature"
  | undefined
  ? Feature | FeatureCollection
  : A extends "geometry"
    ? GeometryCollection | Point | MultiPoint
    : A extends "none"
      ? Point | MultiPoint
      : never;

export interface GPXExportOptions extends CommonExportOptions {}

export interface KMLExportOptions extends CommonExportOptions {}

export type ExportPointOptions = GEOJSONExportPointOptions;

export type ExportOptions =
  | GEOJSONExportPointOptions
  | KMLExportOptions
  | GPXExportOptions;
