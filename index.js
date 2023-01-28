const { create } = require("xmlbuilder2");
const bbox = require("@turf/bbox");
const {
  lineString,
  point,
  featureCollection,
  multiPoint,
} = require("@turf/helpers");
const center = require("@turf/center");
const lineToPolygon = require("@turf/line-to-polygon");

const xsi = "http://www.w3.org/2001/XMLSchema-instance";
const gpxNS = "http://www.topografix.com/GPX/1/1";
const kmlNS = "http://www.opengis.net/kml/2.2";

const version = "1.0.0";

class Exporter {
  /**
   * Exporter
   * @param gps {object|array}        - Expo-location object or an array of them
   * @param props {object|array}      - Properties object or an array of them
   * @param options {object}          - General options
   * @param options.app {object}      - Used for GPX. Contains the creation info (expo-location-export by default)
   * @param options.app.name {string}
   * @param options.app.url {string}
   * @param options.id                - Non-existent by default. Used for an id for the point feature collection.
   *
   * @add         - Used to add to the existing collection of gps and props
   *
   * @dump        - Used to dump our raw data for persistence using local storage or the similar
   *
   * @load        - Used to load our dump
   *
   * @toGeoJSON   - Used to generate a variety of geojson objects
   *
   * @toGPX       - Used to generate a variety of gpx objects
   *
   * @toKML       - Used to generate a variety of kml objects
   *
   * @returns {Error}
   */
  constructor({ gps, props = [], options = {} }) {
    let defaultOptions = {
      app: {
        name: "SpotterTracker",
        url: "https://github.com/michaelfaith84/expo-location-export",
      },
    };
    if (!Array.isArray(gps)) {
      this.gps = [gps];
    } else if (typeof gps === "object") {
      this.gps = gps;
    } else {
      this.gps = [];
    }
    if (props && Array.isArray(props)) {
      this.props = props;
    } else if (props && typeof props === "object") {
      this.props = [props];
    } else {
      this.props = [];
    }
    this.options = defaultOptions;
    Object.assign(this.options, options);
  }

  /**
   * add  - Adds to the existing arrays
   * @param gps {object}           - The object returned from expo-location
   * @param props {object} [empty] - A key-value set. Commonly used: id, name
   */
  add({ gps, props = null }) {
    this.gps.push(gps);
    if (props) {
      this.props.push(props);
    }
  }

  /**
   * dump - dump all the data into an object containing our arrays
   * @returns {{gps: [Object|Array], props: (Object|Array)}}
   */
  dump() {
    return { gps: this.gps, props: this.props, options: this.options };
  }

  /**
   * load - load our dump
   * @param data
   */
  load(data) {
    if (
      !data.hasOwnProperty("gps") ||
      !data.hasOwnProperty("props") ||
      !data.hasOwnProperty("options")
    ) {
      return new Error("Invalid dump");
    }
    this.gps = data.gps;
    this.props = data.props;
    this.options = data.options;
  }

  /**
   * toGeoJSON
   * @param type {string} [point]     - The type of object you want to return
   *                        point       - Can return a feature of a point or multipoint or a feature collection of points
   *                          point            - single gps item with or without props
   *                          multi-point      - multiple gps items with no props or mismatched gps and props lengths
   *                          point collection - multiple gps items with a matching number of props
   *                        lineString  - Requires at least two gps items
   *                        polygon     - Requires at least four gps items
   * @param raw {boolean} [false]     - returns a string unless true, then it returns an object
   * @returns {string|json|Error}
   */
  toGeoJSON(type = "point", raw = false) {
    const gps = this.gps;
    const props = this.props;
    const options = {};
    const params = [];
    // Array for making point feature collection
    const points = [];
    // Array for making a linestring (also used to make a polygon)
    const coords = [];
    let returnItem = null;

    if (this.options.hasOwnProperty("id")) {
      Object.assign(options, { id: this.options.id });
    }

    switch (type) {
      /*
          Point

          One gps item -> point feature
          Equal gps and props -> feature collection of point features
          Else -> multi-point feature
       */
      case "point":
        //  Feature Collection of Points
        if (gps.length === props.length && gps.length > 1) {
          let id = null;
          gps.forEach((e, i) => {
            // If they stashed the id in the props, let's put it on the feature
            if (props[i].hasOwnProperty("id")) {
              id = props[i].id;
              delete props[i].id;
            }
            points.push(
              point(
                [e.coords.longitude, e.coords.latitude, e.coords.altitude],
                params[i],
                id ? { id } : {}
              )
            );
          });
          Object.assign(options, {
            bbox: bbox.default(featureCollection(points)),
          });
          returnItem = featureCollection(points, options);
          break;

          //   Multi-Point
        } else if (gps.length > 1) {
          params.push([]);
          gps.forEach((e) =>
            params[0].push([
              e.coords.longitude,
              e.coords.latitude,
              e.coords.altitude,
            ])
          );
          params.push(props[0] ? props[0] : {});
          Object.assign(options, { bbox: bbox.default(multiPoint(...params)) });
          params.push(options);
          returnItem = multiPoint(...params);
          break;

          //   Single Point - doesn't include a bounding box
        } else {
          params.push(
            [
              gps[0].coords.longitude,
              gps[0].coords.latitude,
              gps[0].coords.altitude,
            ],
            props[0] ? props[0] : {}
          );
          if (Object.keys(options).length > 0) {
            params.push(options);
          }
          returnItem = point(...params);
          break;
        }

      /*
          LineString
      */

      case "lineString":
      case "linestring":
        if (gps.length < 2) {
          return new Error("LineStrings need at least two points");
        }
        gps.forEach((e) =>
          coords.push([
            e.coords.longitude,
            e.coords.latitude,
            e.coords.altitude,
          ])
        );
        Object.assign(options, { bbox: bbox.default(lineString(coords)) });
        returnItem = lineString(coords, props[0], options);
        break;

      /*
          Polygon
      */

      case "polygon":
        if (gps.length < 4) {
          return new Error("Polygons need at least four points");
        }
        gps.forEach((e) =>
          coords.push([
            e.coords.longitude,
            e.coords.latitude,
            e.coords.altitude,
          ])
        );
        const ls = lineString(coords);
        Object.assign(options, { bbox: bbox.default(ls) });
        if (props[0]) {
          Object.assign(options, { properties: props[0] });
        }
        returnItem = lineToPolygon.default(ls, options);
        break;

      default:
        return new Error(`Unknown type: ${type}`);
    }
    return raw ? returnItem : JSON.stringify(returnItem, null, 2);
  }

  /**
   * toGPX
   * @param type {string} [waypoint] - Can return either (a) waypoint(s) or a track
   * @param raw {boolean} [false]    - Either returns a string or if true, an xmlbuilder2 object that hasn't been end()'d
   * @returns {string|xml|Error}
   */
  toGPX(type = "waypoint", raw = false) {
    const options = this.options;
    const gps = this.gps;
    const props = this.props;

    const root = create({ version: "1.0", defaultNamespace: { ele: gpxNS } })
      .ele("gpx", {
        creator: "expo-location-export",
        version: version,
      })
      .att(
        xsi,
        "xsi:schemaLocation",
        "http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/11.xsd"
      )
      .ele("metadata")
      .ele("link")
      .att(
        "href",
        options.hasOwnProperty("app")
          ? options.app.url
          : "https://github.com/michaelfaith84/expo-location-export"
      )
      .ele("text")
      .txt(
        options.hasOwnProperty("app")
          ? options.app.name
          : "expo-location-export"
      )
      .up()
      .ele("time")
      .txt(new Date(gps[0].timestamp).toISOString())
      .up();

    switch (type) {
      case "waypoint":
        gps.forEach((e, i) => {
          root
            .ele("wpt")
            .att("lat", e.coords.latitude)
            .att("lon", e.coords.longitude)
            .ele("ele")
            .txt(e.coords.altitude)
            .up()
            .ele("time")
            .txt(new Date(e.timestamp).toISOString())
            .up();
          if (i < props.length && props[i].hasOwnProperty("name")) {
            root.last().ele("name").txt(props[i].name).up();
          }
          if (i < props.length && props[i].hasOwnProperty("desc")) {
            root.last().ele("desc").txt(props[i].desc).up();
          } else if (
            i < props.length &&
            props[i].hasOwnProperty("description")
          ) {
            root.last().ele("desc").txt(props[i].description).up();
          }
        });
        break;

      case "track":
        gps.forEach((e) =>
          root
            .ele("trk")
            .ele("trkseg")
            .ele("trkpt")
            .att("lat", e.coords.latitude)
            .att("lon", e.coords.longitude)
            .ele("ele")
            .txt(e.coords.altitude)
            .up()
            .ele("time")
            .txt(new Date(e.timestamp).toISOString())
            .up()
        );
        break;

      default:
        return new Error(`Unknown type: ${type}`);
    }
    return raw ? root.doc() : root.end({ prettyPrint: true });
  }

  /**
   * toKML
   * @param type {string} [point] - can return (a) point(s) or linestring
   *                          point       - requires a name and description for each
   *                          linestring  - requires a name
   * @param raw {boolean} - returns a string or xmlbuilder2 object
   * @returns {string|xml|Error}
   */
  toKML(type = "point", raw = false) {
    const gps = this.gps;
    const props = this.props;
    let name = null;
    const coords = [];
    const coordStrings = [];

    const root = create({
      version: "1.0",
      defaultNamespace: { ele: kmlNS },
    }).ele("kml");

    switch (type) {
      case "point":
        if (props.length !== gps.length) {
          return new Error(
            "Props 'name' and 'description' are required for each Point"
          );
        }
        props.forEach((e) => {
          if (!Object.hasOwnProperty("name", e)) {
            return new Error("Prop 'name' is required for each Point");
          }
        });
        props.forEach((e) => {
          if (
            !Object.hasOwnProperty("desc", e) ||
            !Object.hasOwnProperty("description", e)
          ) {
            return new Error("Prop 'description' is required for each Point");
          }
        });

        gps.forEach((e, i) => {
          root
            .ele("Placemark")
            .ele("name")
            .txt(props[i].name)
            .up()
            .ele("description")
            .txt(
              props[i].hasOwnProperty("desc")
                ? props[i].desc
                : props[i].description
            )
            .up()
            .ele("Point")
            .ele("coordinates")
            .txt(
              `${e.coords.longitude},${e.coords.latitude},${e.coords.altitude}`
            )
            .up()
            .up();
        });
        break;

      case "linestring":
        if (gps.length < 2) {
          return new Error("At least two points are required.");
        }
        if (this.options.hasOwnProperty("name")) {
          name = this.options.name;
        } else if (props.length > 0 && props[0].hasOwnProperty("name")) {
          name = props[0].name;
        } else {
          return new Error("A 'name' in options or props is required.");
        }

        gps.forEach((e) => {
          coords.push([
            e.coords.longitude,
            e.coords.latitude,
            e.coords.altitude,
          ]);
          coordStrings.push(
            `${e.coords.longitude},${e.coords.latitude},${e.coords.altitude}`
          );
        });

        const centerPoint = center.default(lineString(coords));

        root
          .ele("Placemark")
          .ele("name")
          .txt(name)
          .up()
          .ele("LookAt")
          .ele("longitude")
          .txt(centerPoint.geometry.coordinates[0])
          .up()
          .ele("latitude")
          .txt(centerPoint.geometry.coordinates[1])
          .up()
          .ele("heading")
          .txt(-60)
          .up()
          .ele("tilt")
          .txt(70)
          .up()
          .ele("range")
          .txt(6000)
          .up()
          .up()
          .ele("LineString")
          .ele("extrude")
          .txt(1)
          .up()
          .ele("coordinates")
          .txt(coordStrings.join("\n"))
          .up();
        break;

      default:
        return new Error(`Unknown type: ${type}`);
    }
    return raw ? root.doc() : root.end({ prettyPrint: true });
  }
}

exports.Exporter = Exporter;
