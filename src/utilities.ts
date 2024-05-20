import {AddParams, BBox2d, BBox3d, Flattened} from "./types";

/**
 * Removes altitude fields from a GPS return.
 *
 * @param data
 */
export const flatten = (data: AddParams): Flattened => {
  return {
    ...data,
    coords: (({ altitude, altitudeAccuracy, ...o }) => o)(data.coords),
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
export const getBBox = (data: AddParams[] | Flattened[]): BBox2d | BBox3d => {
  if (data[0].coords.hasOwnProperty("altitude")) {
    const result = [
      Infinity,
      Infinity,
      Infinity,
      -Infinity,
      -Infinity,
      -Infinity,
    ];

    data.forEach((ea: AddParams) => {
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
