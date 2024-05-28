import {
  Feature,
  FeatureCollection,
  GeometryCollection,
  MultiPoint,
  Point,
} from "@turf/helpers";

export interface GPSCoords {
  // Radius of uncertainty in meters
  accuracy: number;
  // Altitude in meters relative to sea level.
  altitude: number;
  // Radius of uncertainty in meters
  altitudeAccuracy: number;
  // In degrees
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
  metadata?: GPXMetaData;
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
  "attr-xmlns"?: string;
  "attr-xmlns:xsi"?: string;
  "attr-xsi:schemaLocation"?: string;
  "attr-version"?: number;
  "attr-creator"?: string;
  metadata?: GPXMetaData;
  // Extensions to this document
  extensions?: Props;
  wpt?: GPXWaypointTag[];
  trk?: GPXTrack;
}

// Link has an href attribute
export interface GPXLink {
  // Hyperlink text
  text: string;
  // Mime type
  type?: string;
}

export interface GPXEmail {
  "attr-id": string;
  "attr-domain": string;
}

export interface GPXPerson {
  name?: string;
  // Emails is a self-closing tag with id (bob) and domain (hisdomain.com) attributes
  email?: string | GPXEmail;
  link?: GPXLink;
}

export interface GPXBounds {
  minlat: number;
  minlon: number;
  maxlat: number;
  maxlon: number;
}

export interface GPXCopyright {
  year?: number;
  // Url
  license: string;
}

export interface GPXMetaData {
  name?: string;
  desc?: string;
  author?: GPXPerson;
  // Copyright has an author attribute which represents the copyright holder
  copyright?: GPXCopyright;
  link?: GPXLink;
  // Creation datetime
  // Formats: 2002-05-30T09:00:00 or 2002-05-30T09:30:10.5
  time?: string | number;
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
  magvar?: number;
  // Height (in meters) of geoid (mean sea level) above WGS84 earth ellipsoid.
  //  As defined in NMEA GGA message.
  geoidheight?: number;
  "attr-lat"?: number;
  "attr-lon"?: number;
}

export interface GPXTrackSegment {
  trkpt?: GPXWaypointTag[];
  extensions?: Props;
}

export interface GPXTrack extends GPXCommon {
  name?: string;
  desc?: string;
  link?: GPXLink;
  number?: number;
  trkseg?: GPXTrackSegment[];
}

// KML

export interface KMLGeometry {
  name?: ID;
  description?: string;
}

export interface KMLPoint extends KMLGeometry {
  Point: {
    coordinates: string;
  };
}

export interface KMLLineString extends KMLGeometry {
  LineString: {
    coordinates: string;
  };
}
