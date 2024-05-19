import { AddParams, Flattened } from "./types";

export const flatten = (data: AddParams): Flattened => {
  return {
    ...data,
    coords: (({ altitude, altitudeAccuracy, ...o }) => o)(data.coords),
  };
};
