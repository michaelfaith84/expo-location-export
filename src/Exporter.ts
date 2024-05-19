import {CommonParams, ConstructorParams, ExporterDump, ExportFormat, GlobalParams,} from "../types";

/**
 * This handles raw GPS returns and load/dump. It should represent one object.
 * IE, a point/multi-point, linestring, etc.
 */
export class Exporter {
  data: CommonParams[];
  global: GlobalParams;

  /**
   * The constructor takes an object with one required field: gps.
   */
  constructor(params: ConstructorParams) {
    if (params.global !== undefined) {
      /**
       * Use the app info provided then remove it.
       */
      this.global = params.global;
      delete params.global;
    } else {
      /**
       * Let's use the Exporter.
       */
      this.global = {
        name: "SpotterTracker",
        url: "https://github.com/michaelfaith84/expo-location-export",
      };
    }

    if (params.hasOwnProperty("gps")) {
      /**
       * Let's add the remaining data as an array.
       */
      this.data = [params];
    } else {
      throw new Error("Constructor requires 'gps'");
    }
  }

  /**
   *
   * @param params
   */
  add(params: CommonParams) {
    if (params.hasOwnProperty("gps")) {
      this.data.push(params);
    } else {
      throw new Error("Cannot add to Exporter with 'gps'");
    }
  }

  /**
   * Ingests a saved dump and returns an Explorer object.
   */
  static load(dump: ExporterDump): Exporter {
    if (
      dump.hasOwnProperty("data") &&
      dump.data.length > 0 &&
      dump.hasOwnProperty("global")
    ) {
      const first = dump.data.shift();
      const exporter = new Exporter({
        global: dump.global,
        ...(first as CommonParams),
      });

      dump.data.forEach((entry) => exporter.add(entry));

      return exporter;
    } else {
      throw new Error("Unable to load: missing data.");
    }
  }

  /**
   * Returns a string for persisting data.
   */
  dump(): ExporterDump {
    return {
      data: this.data,
      global: this.global,
    };
  }

  toPoint(format: ExportFormat, raw = false) {
    switch (format.toLowerCase()) {
      case "gpx":
        return "";
      case "kml":
        return "";
      case "geojson":
        return "";
      default:
        throw new Error(`Unknown format: ${format}`);
    }
  }

  toSeries(format: ExportFormat, raw = false) {
    switch (format.toLowerCase()) {
      case "gpx":
        return "";
      case "kml":
        return "";
      case "geojson":
        return "";
      default:
        throw new Error(`Unknown format: ${format}`);
    }
  }
}
