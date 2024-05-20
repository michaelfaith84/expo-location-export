import PACKAGE_INFO from "../package.json";
import {
  Data,
  ExporterDump,
  ExportFormat,
  ExportOptions,
  GlobalParams,
} from "./types";
import GEOJSON from "./GEOJSON";
import GPX from "./GPX";
import KML from "./KML";
import { flatten, getBBox } from "./utilities";
import cloneDeep from "lodash.clonedeep";

const geojson = new GEOJSON();
const gpx = new GPX();
const kml = new KML();

/**
 * This handles raw GPS returns and load/dump. It should represent one object.
 * IE, a point/multi-point, linestring, etc.
 */
export class Exporter {
  private _data: Data[];
  private _global: GlobalParams;

  /**
   *
   * @param {GlobalParams} params Global params for the collection
   * @param {ID} [params.id] Collection id
   * @param {string} [params.name=] Application name. Defaults to this package
   * @param {string} [params.url=] Application url. Defaults to this repo
   */
  constructor(params: GlobalParams = {}) {
    this._data = [];
    this._global = {};

    if (params.id) {
      this._global.id = params.id;
    }

    this._global.name =
      params.name ?? `${PACKAGE_INFO.name}@${PACKAGE_INFO.version}`;
    this._global.url = params.url ?? PACKAGE_INFO.homepage;
  }

  get data(): Data[] {
    return cloneDeep(this._data);
  }

  get global(): GlobalParams {
    return cloneDeep(this._global);
  }

  /**
   * Removes altitude fields.
   *
   * @private
   */
  private _flatten() {
    return this.data.map((ea) => flatten(ea));
  }

  /**
   *
   *
   * @param params
   */
  add(params: Data) {
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
   * Export as a Point or MultiPoint.
   *
   * @param {ExportFormat} format
   * @param {ExportPointOptions} options
   */
  toPoint(format: ExportFormat, options: ExportOptions = {}) {
    // Prep our data as a new object
    const data = options.flatten ? this._flatten() : this.data;

    if (options.bbox) {
      options.bbox = getBBox(data);
    }

    switch (format.toLowerCase()) {
      case "geojson":
        return geojson.toPoint(data, this.global, options);
      case "gpx":
        return "";
      case "kml":
        return "";
      default:
        throw new Error(`Unknown format: ${format}`);
    }
  }

  /**
   * Export as a LineString.
   *
   * @param format
   * @param options
   */
  toLine(format: ExportFormat, options: ExportOptions = {}) {
    // Prep our data as a new object
    const data = options.flatten ? this._flatten() : this.data;
    if (options.bbox) {
      options.bbox = getBBox(data);
    }

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
