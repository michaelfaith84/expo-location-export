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

// export type ExportPointHandler<A extends ExportFormat> = A extends 'gpx' ? GPX:
// export type ExportSeriesHandler<A extends ExportFormat> = A extends 'gpx' ? GPX:
