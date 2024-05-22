import {
  Feature,
  FeatureCollection,
  GeometryCollection,
  MultiPoint,
  Point,
} from "@turf/helpers";

type CreateArrayWithLengthX<
  LENGTH extends number,
  ACC extends unknown[] = [],
> = ACC["length"] extends LENGTH
  ? ACC
  : CreateArrayWithLengthX<LENGTH, [...ACC, 1]>;

type NumericRange<
  START_ARR extends number[],
  END extends number,
  ACC extends number = never,
> = START_ARR["length"] extends END
  ? ACC | END
  : NumericRange<[...START_ARR, 1], END, ACC | START_ARR["length"]>;

// export type Longitude = NumericRange<CreateArrayWithLengthX<-180>, 180>;
// export type Latitude = NumericRange<CreateArrayWithLengthX<-90>, 90>;

export type Longitude = number;
export type Latitude = number;

/**
 * 2015 - 3000
 *
 * React Native was released in 2015 and Futurama.
 */
export type DateRange = NumericRange<CreateArrayWithLengthX<2015>, 3000>;

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

export type ID = string | number;

export interface Props {
  [index: number | string]: any;
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

export interface GlobalParams {
  name?: string;
  url?: string;
  id?: ID;
}

export interface Data extends GPSReturn {
  props?: Props;
  id?: ID;
}

export interface Flattened extends GPSReturnFlattened {
  props?: Props;
  id?: ID;
}

export type ExporterDump = { data: AddParams[]; global: GlobalParams };

export type ExportFormat = "gpx" | "kml" | "geojson";

export type Position2D = [Longitude, Latitude];
export type Position3D = [Longitude, Latitude, number];

/**
 * [west, south, east, north]
 */
export type BBox2d = [Longitude, Latitude, Longitude, Latitude];
/**
 * [west, south, min-altitude, east, north, max-altitude]
 */
export type BBox3d = [Longitude, Latitude, number, Longitude, Latitude, number];

export interface CommonExportOptions {
  flatten?: boolean;
  bbox?: boolean | BBox2d | BBox3d;
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

export interface GPXExportLineOptions extends GPXExportOptions {
  type?: "track" | "route";
}

export interface GPXExportOptions extends CommonExportOptions {}

export interface KMLExportOptions extends CommonExportOptions {}

export type ExportPointOptions = GEOJSONExportPointOptions;

export type ExportOptions =
  | GEOJSONExportPointOptions
  | KMLExportOptions
  | GPXExportOptions;

/**
 *
 *        GPX Types
 *
 */

// Attributes: version: 1.1, creator: software that made the GPX doc - name or url
export interface GPXTag {
  metadata?: GPXMetaData;
  // Extensions to this document
  extensions?: Props;
}

// Link has an href attribute
export interface GPXLink {
  // Hyperlink text
  text: string;
  // Mime type
  type: string;
}

export interface GPXPerson {
  name?: string;
  // Emails is a self-closing tag with id (bob) and domain (hisdomain.com) attributes
  email?: string;
  link?: GPXLink;
}

export interface GPXBounds {
  minlat: Latitude;
  minlon: Longitude;
  maxlat: Latitude;
  maxlon: Longitude;
}

export interface GPXMetaData {
  name?: string;
  desc?: string;
  author?: GPXPerson;
  // Copyright has an author attribute which represents the copyright holder
  copyright?: {
    year: DateRange;
    license: URL;
  };
  link?: GPXLink;
  // Creation datetime
  // Formats: 2002-05-30T09:00:00 or 2002-05-30T09:30:10.5
  time?: unknown;
  keywords?: string;
  bounds?: GPXBounds;
  // Metadata extensions
  extensions?: Props;
}

export interface GPXCommon {
  name?: string;
  desc?: string;
  // Source of data. Included to give user some idea of reliability and accuracy of data.
  //  "Garmin eTrex", "USGS quad Boston North", e.g.
  src?: string;
  link?: string;
  extensions?: Props;
}

// lat, lon attributes
export interface GPXWaypointTag extends GPXCommon {
  // Elevation in meters
  ele?: number;
  // Datetime
  time?: string;
  // Magnetic variation
  magvar?: NumericRange<0, 360>;
  // Height (in meters) of geoid (mean sea level) above WGS84 earth ellipsoid.
  //  As defined in NMEA GGA message.
  geoidheight?: number;
}

export interface GPXRoute extends GPXCommon {
  number?: number;
  rtept?: GPXWaypointTag[];
}

export interface GPXTrackSegment {
  trkpt?: GPXWaypointTag[];
  extensions?: Props;
}

export interface GPXTrack extends GPXCommon {
  number?: number;
  trkseg?: GPXTrackSegment[];
}
