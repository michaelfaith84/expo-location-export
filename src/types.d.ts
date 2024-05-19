import {
  Feature,
  FeatureCollection,
  GeometryCollection,
  LineString,
  MultiPoint,
  Point,
} from "@turf/helpers";

export interface GPSReturn {
  coords: {
    accuracy: number;
    altitude: number;
    altitudeAccuracy: number;
    heading: number;
    latitude: number;
    longitude: number;
    speed: number;
  };
  mocked: boolean;
  timestamp: number;
}

// export interface DataDump {
//     gps: Array<GPSReturn>;
//     props;
//     options: Partial<Options>;
// }

export interface ID {
  id: string | number;
}

export interface Options {
  app: {
    name: string;
    url: string;
  };
  id: ID;
  name: string;
}

export interface CommonParams {
  gps: GPSReturn;
  id?: ID;
  props?: any;
}

export interface ConstructorParams extends CommonParams {
  global?: GlobalParams;
}

export interface GlobalParams {
  name?: string;
  url?: string;
  id?: ID;
}

export interface AddParams {
  gps: GPSReturn;
  props: any;
}

export interface LoadParams {
  gps: Array<GPSReturn>;
  props: any[];
  options: Options;
}

export type CoordinatesArray = Array<[number, number, number]>;

export type CoordinatesStringArray = Array<string>;

export type ExporterDump = { data: CommonParams[]; global: GlobalParams };

export type ExportFormat = "gpx" | "kml" | "geojson";

export type Position2D = [number, number];
export type Position3D = [number, number, number];

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

export type GEOJSONExportLineStringReturn<A extends GEOJSONWrapper> = A extends
  | "feature"
  | undefined
  ? Feature
  : A extends "geometry" | "none"
    ? LineString
    : never;

export interface GPXExportOptions extends CommonExportOptions {}

export interface KMLExportOptions extends CommonExportOptions {}

export type ExportOptions =
  | GEOJSONExportPointOptions
  | KMLExportOptions
  | GPXExportOptions;

// export type ExportPointHandler<A extends ExportFormat> = A extends 'gpx' ? GPX:
// export type ExportSeriesHandler<A extends ExportFormat> = A extends 'gpx' ? GPX:
