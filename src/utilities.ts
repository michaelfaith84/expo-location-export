import {BBox2d, BBox3d, Data, Flattened, GPXBounds} from "./types";
import {Position, Properties} from "@turf/helpers";
import cloneDeep from "lodash.clonedeep";

/**
 * Removes altitude fields from a GPS return.
 *
 * @param data
 */
export const flatten = (data: Data): Flattened => {
  const cloned = cloneDeep(data);

  return {
    ...cloned,
    coords: (({ altitude, altitudeAccuracy, ...o }) => o)(cloned.coords),
  };
};

/**
 * Creates a bounding box from GPS returns.
 *
 * 2d: [west, south, east, north]
 *
 * 3d: [west, south, min-altitude, east, north, max-altitude]
 *
 * @param data
 */
export const getBBox = (data: Data[] | Flattened[]): BBox2d | BBox3d => {
  if (data[0].coords.hasOwnProperty("altitude")) {
    const result = [
      Infinity,
      Infinity,
      Infinity,
      -Infinity,
      -Infinity,
      -Infinity,
    ];

    data.forEach((ea: Data) => {
      if (result[0] > ea.coords.longitude) {
        result[0] = ea.coords.longitude;
      }
      if (result[1] > ea.coords.latitude) {
        result[1] = ea.coords.latitude;
      }
      if (result[2] > ea.coords.altitude) {
        result[2] = ea.coords.altitude;
      }
      if (result[3] < ea.coords.longitude) {
        result[3] = ea.coords.longitude;
      }
      if (result[4] < ea.coords.latitude) {
        result[4] = ea.coords.latitude;
      }
      if (result[5] < ea.coords.altitude) {
        result[5] = ea.coords.altitude;
      }
    });

    return result as BBox3d;
  } else {
    const result = [Infinity, Infinity, -Infinity, -Infinity];

    data.forEach((ea) => {
      if (result[0] > ea.coords.longitude) {
        result[0] = ea.coords.longitude;
      }
      if (result[1] > ea.coords.latitude) {
        result[1] = ea.coords.latitude;
      }
      if (result[2] < ea.coords.longitude) {
        result[2] = ea.coords.longitude;
      }
      if (result[3] < ea.coords.latitude) {
        result[3] = ea.coords.latitude;
      }
    });

    return result as BBox2d;
  }
};

/**
 * Returns an array of Positions.
 *
 * @param data
 */
export const getCoords = (data: Data[]): Position[] => {
  return data.map((ea) => {
    let coords = [ea.coords.longitude, ea.coords.latitude];

    if (ea.coords.hasOwnProperty("altitude")) {
      coords.push(ea.coords.altitude);
    }

    return coords;
  });
};

/**
 * Returns the first set of props found or throws an error.
 *
 * Used for mapping props on individual returns to a single Feature, ie,
 * Feature<MultiPolygon> or Feature<MultiPoint>.
 *
 * @param data
 */
export const manyToOnePropsHandler = (data: Data[]): Properties | null => {
  const cloned = cloneDeep(data);

  for (let i = 0; i < cloned.length; i++) {
    if (cloned[i].props) {
      return cloned[i].props as Properties;
    }
  }

  throw new Error("No props found.");
};

/**
 * Bounds are used by GPX.
 *
 * @param bbox
 */
export const bboxToBounds = (bbox: BBox2d | BBox3d) => {
  const bounds: GPXBounds = {
    minlat: Infinity,
    minlon: Infinity,
    maxlat: -Infinity,
    maxlon: -Infinity,
  };

  if (bbox.length == 4) {
    bounds.minlat = bbox[1] < bbox[3] ? bbox[1] : bbox[3];
    bounds.minlon = bbox[0] < bbox[2] ? bbox[0] : bbox[2];
    bounds.maxlat = bbox[1] > bbox[3] ? bbox[1] : bbox[3];
    bounds.minlon = bbox[0] > bbox[2] ? bbox[0] : bbox[2];
  } else {
    bounds.minlat = bbox[1] < bbox[4] ? bbox[1] : bbox[4];
    bounds.minlon = bbox[0] < bbox[3] ? bbox[0] : bbox[3];
    bounds.maxlat = bbox[1] > bbox[4] ? bbox[1] : bbox[4];
    bounds.minlon = bbox[0] > bbox[3] ? bbox[0] : bbox[3];
  }

  return bounds;
};

export const isValidEmail = (email: string): boolean => {
  const re = new RegExp(/^[^s@]+@[^s@]+.[^s@]+$/);
  return re.test(email);
};

/**
 * Returns the [user, domain]
 *
 * @param email
 */
export const splitEmail = (email: string): string[] => {
  return email.split("@");
};

/**
 * In decimal degrees.
 *
 * @param latitude
 */
export const isValidLatitude = (latitude: number) => {
  return latitude <= 90 && latitude >= -90;
};

/**
 * In decimal degrees.
 *
 * @param longitude
 */
export const isValidLongitude = (longitude: number) => {
  return longitude <= 180 && longitude >= -180;
};

/**
 * Positions in GeoJSON as [longitude, latitude] per a traditional graph (x, y).
 *
 * @param position
 */
export const isValidPosition = (position: Position) => {
  return isValidLongitude(position[0]) && isValidLatitude(position[1]);
};

export const isValidUrl = (string: string) => {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
};

/**
 * Lower bound is the Dead Sea and the upper is Everest.
 *
 * @param altitude In meters
 * @param [accuracy=0] Margin for error in meters
 */
export const isValidAltitude = (altitude: number, accuracy: number = 0) => {
  return altitude + accuracy >= 432.65 && altitude - accuracy <= 8849;
};

/**
 *
 *
 * @param timestamp
 */
export const timestampToDatetime = (timestamp: number) => {
  return new Date(timestamp).toISOString();
};
