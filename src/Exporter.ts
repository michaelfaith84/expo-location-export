import { PACKAGE_INFO } from "./pkgInfo";
import {
  AddParams,
  ExporterDump,
  ExportFormat,
  ExportOptions,
  GlobalParams,
} from "./types";
import GEOJSON from "./GEOJSON";
import GPX from "./GPX";
import KML from "./KML";
import { flatten } from "./utlities";

const geojson = new GEOJSON();
const gpx = new GPX();
const kml = new KML();

/**
 * This handles raw GPS returns and load/dump. It should represent one object.
 * IE, a point/multi-point, linestring, etc.
 */
export class Exporter {
  data: AddParams[];
  global: GlobalParams;

  /**
   *
   * @param {GlobalParams} params Global params for the collection
   * @param {ID} [params.id] Collection id
   * @param {string} [params.name=] Application name. Defaults to this package
   * @param {string} [params.url=] Application url. Defaults to this repo
   */
  constructor(params: GlobalParams = {}) {
    this.data = [];
    this.global = {};

    if (params.id) {
      this.global.id = params.id;
    }

    this.global.name =
      params.name ?? `${PACKAGE_INFO.name}@${PACKAGE_INFO.version}`;
    this.global.url = params.url ?? PACKAGE_INFO.homepage;
  }

  /**
   * Removes altitude fields.
   *
   * @param data
   * @private
   */
  private _flatten() {
    return this.data.map((ea) => flatten(ea));
  }

  private _getBBOX() {}

  /**
   *
   * @param params
   */
  add(params: AddParams) {
    if (params.hasOwnProperty("coords")) {
      this.data.push(params);
    } else {
      throw new Error("Cannot add to Exporter with 'gps'");
    }
  }

  /**
   * Ingests a dump and returns an Exporter object.
   */
  static load(dump: string): Exporter {
    const parsed: ExporterDump = JSON.parse(dump);

    if (parsed.hasOwnProperty("global")) {
      const exporter = new Exporter(parsed.global);

      if (parsed.hasOwnProperty("data")) {
        parsed.data.forEach((item) => exporter.add(item));
      }

      return exporter;
    } else {
      throw new Error("Unable to load: missing data.");
    }
  }

  /**
   * Returns a string for persisting data.
   */
  dump(): string {
    return JSON.stringify({
      data: [...this.data],
      global: { ...this.global },
    });
  }

  /**
   *
   * @param format
   * @param options
   */
  toPoint(format: ExportFormat, options: ExportOptions) {
    const dump = this.dump();

    switch (format.toLowerCase()) {
      case "geojson":
      // return geojson.toPoint(dump, options);
      case "gpx":
        return "";
      case "kml":
        return "";
      default:
        throw new Error(`Unknown format: ${format}`);
    }
  }

  /**
   *
   * @param format
   * @param raw
   */
  toSeries(format: ExportFormat, raw = false) {
    switch (format.toLowerCase()) {
      case "geojson":
        return "";
      case "gpx":
        return "";
      case "kml":
        return "";
      default:
        throw new Error(`Unknown format: ${format}`);
    }
  }
}

export default Exporter;
