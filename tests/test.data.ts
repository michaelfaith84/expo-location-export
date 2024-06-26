import PACKAGE_INFO from "../package.json";
import { FlattenedGPSReturn, GPSReturn } from "../src/types";

export const defaultGlobal = {
  name: `${PACKAGE_INFO.name}@${PACKAGE_INFO.version}`,
  url: PACKAGE_INFO.homepage,
};

export const exampleGPSReturn: GPSReturn = {
  coords: {
    accuracy: 11.553999900817871,
    altitude: 36.900001525878906,
    altitudeAccuracy: 2.5298962593078613,
    heading: 0,
    latitude: 48.8317425,
    longitude: -121.4438241,
    speed: 0,
  },
  mocked: false,
  timestamp: 1674709638052,
};

export const exampleGPSReturnFlattened: FlattenedGPSReturn = {
  coords: {
    accuracy: 11.553999900817871,
    heading: 0,
    latitude: 48.8317425,
    longitude: -121.4438241,
    speed: 0,
  },
  mocked: false,
  timestamp: 1674709638052,
};

export const exampleGPSReturnSeries: GPSReturn[] = [
  {
    coords: {
      accuracy: 11.553999900817871,
      altitude: 20.900001525878906,
      altitudeAccuracy: 2.5298962593078613,
      heading: 0,
      latitude: 48.757579457500185,
      longitude: -122.48654571097599,
      speed: 0,
    },
    mocked: false,
    timestamp: 1674709638172,
  },
  {
    coords: {
      accuracy: 11.553999900817871,
      altitude: 24.900001525878906,
      altitudeAccuracy: 2.5298962593078613,
      heading: 0,
      latitude: 48.75744351363383,
      longitude: -122.48635422956822,
      speed: 0,
    },
    mocked: false,
    timestamp: 1674709738292,
  },
  {
    coords: {
      accuracy: 11.553999900817871,
      altitude: 22.900001525878906,
      altitudeAccuracy: 2.5298962593078613,
      heading: 0,
      latitude: 48.7573367003379,
      longitude: -122.48611856014325,
      speed: 0,
    },
    mocked: false,
    timestamp: 1674709838412,
  },
  {
    coords: {
      accuracy: 11.553999900817871,
      altitude: 28.900001525878906,
      altitudeAccuracy: 2.5298962593078613,
      heading: 0,
      latitude: 48.757161914454656,
      longitude: -122.48591234939643,
      speed: 0,
    },
    mocked: false,
    timestamp: 1674709938532,
  },
  {
    coords: {
      accuracy: 11.553999900817871,
      altitude: 32.900001525878906,
      altitudeAccuracy: 2.5298962593078613,
      heading: 0,
      latitude: 48.75703567982737,
      longitude: -122.48575032666636,
      speed: 0,
    },
    mocked: false,
    timestamp: 1674710038652,
  },
  {
    coords: {
      accuracy: 11.553999900817871,
      altitude: 36.900001525878906,
      altitudeAccuracy: 2.5298962593078613,
      heading: 0,
      latitude: 48.756890024094105,
      longitude: -122.48545573988517,
      speed: 0,
    },
    mocked: false,
    timestamp: 1674709638772,
  },
  {
    coords: {
      accuracy: 11.553999900817871,
      altitude: 45.900001525878906,
      altitudeAccuracy: 2.5298962593078613,
      heading: 0,
      latitude: 48.75698712796324,
      longitude: -122.48511696508679,
      speed: 0,
    },
    mocked: false,
    timestamp: 1674712038892,
  },
  {
    coords: {
      accuracy: 11.553999900817871,
      altitude: 36.900001525878906,
      altitudeAccuracy: 2.5298962593078613,
      heading: 0,
      latitude: 48.75731727971424,
      longitude: -122.48476346094935,
      speed: 0,
    },
    mocked: false,
    timestamp: 1674713639052,
  },
  {
    coords: {
      accuracy: 11.553999900817871,
      altitude: 36.900001525878906,
      altitudeAccuracy: 2.5298962593078613,
      heading: 0,
      latitude: 48.75751148561301,
      longitude: -122.48429212209945,
      speed: 0,
    },
    mocked: false,
    timestamp: 1674714639172,
  },
  {
    coords: {
      accuracy: 11.553999900817871,
      altitude: 36.900001525878906,
      altitudeAccuracy: 2.5298962593078613,
      heading: 0,
      latitude: 48.75779308283259,
      longitude: -122.48396807663973,
      speed: 0,
    },
    mocked: false,
    timestamp: 1674715639292,
  },
  {
    coords: {
      accuracy: 11.553999900817871,
      altitude: 36.900001525878906,
      altitudeAccuracy: 2.5298962593078613,
      heading: 0,
      latitude: 48.7580067072565,
      longitude: -122.48361457250229,
      speed: 0,
    },
    mocked: false,
    timestamp: 1674716639412,
  },
  {
    coords: {
      accuracy: 11.553999900817871,
      altitude: 36.900001525878906,
      altitudeAccuracy: 2.5298962593078613,
      heading: 0,
      latitude: 48.75793873594745,
      longitude: -122.48340836175544,
      speed: 0,
    },
    mocked: false,
    timestamp: 1674717639532,
  },
  {
    coords: {
      accuracy: 11.553999900817871,
      altitude: 36.900001525878906,
      altitudeAccuracy: 2.5298962593078613,
      heading: 0,
      latitude: 48.75784163391779,
      longitude: -122.48311377497426,
      speed: 0,
    },
    mocked: false,
    timestamp: 1674718639652,
  },
  {
    coords: {
      accuracy: 11.553999900817871,
      altitude: 36.900001525878906,
      altitudeAccuracy: 2.5298962593078613,
      heading: 0,
      latitude: 48.75776395215891,
      longitude: -122.48292229356647,
      speed: 0,
    },
    mocked: false,
    timestamp: 1674719639772,
  },
  {
    coords: {
      accuracy: 11.553999900817871,
      altitude: 36.900001525878906,
      altitudeAccuracy: 2.5298962593078613,
      heading: 0,
      latitude: 48.75779308283259,
      longitude: -122.48262770678528,
      speed: 0,
    },
    mocked: false,
    timestamp: 1674720639892,
  },
];
