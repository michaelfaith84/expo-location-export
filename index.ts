import {Feature, featureCollection, lineString, multiPoint, point} from "@turf/helpers";
import {AddParams, ConstructorParams, CoordinatesArray, CoordinatesStringArray, GPSReturn, ID, Options} from "./types";

import {create} from "xmlbuilder2";

import bbox from "@turf/bbox";
import center from "@turf/center";
import lineToPolygon from "@turf/line-to-polygon";

// expo-location-export
const version = '1.0.1';
const defaultApp = 'expo-location-export'
const defaultAppUrl = 'https://github.com/michaelfaith84/expo-location-export'

// GPX
const xsi = "https://www.w3.org/2001/XMLSchema-instance";
const gpxNS = "https://www.topografix.com/GPX/1/1";
const gpxNSXSD = "https://www.topografix.com/GPX/11.xsd";

// KML
const kmlVersion = "2.2"
const kmlNS = "https://www.opengis.net/kml/2.2";

export class Exporter {
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
     * @toGeoJSON   - Used to generate a variety of geojson objects
     *
     * @toGPX       - Used to generate a variety of gpx objects
     *
     * @toKML       - Used to generate a variety of kml objects
     *
     * @returns {Error}
     */

    gps: Array<GPSReturn>;
    props;
    options: Partial<Options>;

    constructor(params: ConstructorParams) {
        const {gps, props, options} = params;
        let defaultOptions = {
            app: {
                name: defaultApp,
                url: defaultAppUrl,
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
        } else if (props && typeof props === 'object') {
            this.props = [props];
        } else {
            this.props = [];
        }
        this.options = defaultOptions;
        Object.assign(this.options, options);
    }

    /**
     * add  - Adds to the existing arrays
     * @param params
     */
    add(params: AddParams) {
        const {gps, props} = params;

        this.gps.push(gps);
        if (props) {
            this.props.push(props);
        }
    }

    /**
     * dump - dump all the data into an object containing our arrays
     * @returns {{gps: [Object|Array], props: (Object|Array)}}
     */
    dump(): ConstructorParams {
        return {
            gps: this.gps,
            props: this.props,
            options: this.options,
        };
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
        const params: any = [];
        // Array for making point feature collection
        const points: Array<Feature> = [];
        // Array for making a linestring (also used to make a polygon)
        const coords: Partial<CoordinatesArray> = [];
        let returnItem = null;

        if (this.options.hasOwnProperty("id")) {
            Object.assign(options, {id: this.options.id});
        }

        switch (type.toLowerCase()) {
            /*
                      Point

                      One gps item -> point feature
                      Equal gps and props -> feature collection of point features
                      Else -> multi-point feature
                   */
            case "point":
                //  Feature Collection of Points
                if (gps.length === props.length && gps.length > 1) {
                    let id: ID = null!;
                    gps.forEach((e, i) => {
                        // If they stashed the id in the props, let's put it on the feature
                        if (props[i].hasOwnProperty("id")) {
                            id = props[i].id;
                            delete props[i].id;
                        }
                        points.push(
                            id ? point(
                                [
                                    e.coords.longitude,
                                    e.coords.latitude,
                                    e.coords.altitude
                                ],
                                params[i],
                                {id}
                            ) : point(
                                [
                                    e.coords.longitude,
                                    e.coords.latitude,
                                    e.coords.altitude
                                ],
                                params[i]
                            )
                        );
                    });
                    Object.assign(options, {
                        bbox: bbox(featureCollection(points)),
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
                    Object.assign(options, {bbox: bbox(multiPoint(...params))});
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
                    throw new Error("LineStrings need at least two points");
                }
                gps.forEach((e) =>
                    coords.push([
                        e.coords.longitude,
                        e.coords.latitude,
                        e.coords.altitude,
                    ])
                );
                Object.assign(options, {bbox: bbox(lineString(coords))});
                returnItem = lineString(coords, props[0], options);
                break;

            /*
                      Polygon
                  */

            case "polygon":
                if (gps.length < 4) {
                    throw new Error("Polygons need at least four points");
                }
                gps.forEach((e) =>
                    coords.push([
                        e.coords.longitude,
                        e.coords.latitude,
                        e.coords.altitude,
                    ])
                );
                const ls = lineString(coords);
                Object.assign(options, {bbox: bbox(ls)});
                if (props[0]) {
                    Object.assign(options, {properties: props[0]});
                }
                returnItem = lineToPolygon(ls, options);
                break;

            default:
                throw new Error(`Unknown type: ${type}`);
        }
        return raw ? returnItem : JSON.stringify(returnItem, null, 2);
    }

    /**
     * toGPX
     * @param type {string} [waypoint] - Can return either (a) waypoint(s) or a track
     * @param raw {boolean} [false]    - Either returns a string or if true, a xmlbuilder2 object that hasn't been end()'d
     * @returns {string}
     */
    toGPX(type = "waypoint", raw = false) {
        const options = this.options;
        const gps = this.gps;
        const props = this.props;

        const root = create({
            version: "1.0",
            defaultNamespace: {ele: gpxNS},
        })
            .ele("gpx", {
                creator: defaultApp,
                version: version,
            })
            .att(xsi, "xsi:schemaLocation", `${gpxNS} ${gpxNSXSD}`)
            .ele("metadata")
            .ele("link")
            .att(
                "href",
                options.hasOwnProperty("app")
                    ? options.app!.url!
                    : defaultAppUrl
            )
            .ele("text")
            .txt(
                options.hasOwnProperty("app")
                    ? options.app!.name!
                    : defaultApp
            )
            .up()
            .ele("time")
            .txt(new Date(gps[0].timestamp).toISOString())
            .up();

        switch (type.toLowerCase()) {
            case "waypoint":
                gps.forEach((e, i) => {
                    root
                        .ele("wpt")
                        .att("lat", e.coords.latitude.toString())
                        .att("lon", e.coords.longitude.toString())
                        .ele("ele")
                        .txt(e.coords.altitude.toString())
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
                        .att("lat", e.coords.latitude.toString())
                        .att("lon", e.coords.longitude.toString())
                        .ele("ele")
                        .txt(e.coords.altitude.toString())
                        .up()
                        .ele("time")
                        .txt(new Date(e.timestamp).toISOString())
                        .up()
                );
                break;

            default:
                throw new Error(`Unknown type: ${type}`);
        }
        return raw ? root.doc() : root.end({prettyPrint: true});
    }

    /**
     * toKML
     * @param type {string} [point] - can return (a) point(s) or linestring
     *                          point       - requires a name and description for each
     *                          linestring  - requires a name
     * @param raw {boolean} - returns a string or xmlbuilder2 object
     * @returns {string}
     */
    toKML(type = "point", raw = false) {
        const gps = this.gps;
        const props = this.props;
        let name: string | null = null;
        const coords: CoordinatesArray = [];
        const coordStrings: CoordinatesStringArray = [];

        const root = create({
            version: kmlVersion,
            defaultNamespace: {ele: kmlNS},
        }).ele("kml");

        switch (type.toLowerCase()) {
            case "point":
                if (props.length !== gps.length) {
                    throw new Error(
                        "Props 'name' and 'description' are required for each Point"
                    );
                }
                props.forEach((e) => {
                    if (!e.hasOwnProperty("name")) {
                        throw new Error("Prop 'name' is required for each Point");
                    }
                });
                props.forEach((e) => {
                    if (
                        !e.hasOwnProperty("desc") ||
                        !e.hasOwnProperty("description")
                    ) {
                        throw new Error("Prop 'description' is required for each Point");
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
                    throw new Error("At least two points are required.");
                }
                if (this.options.hasOwnProperty("name")) {
                    name = this.options.name!;
                } else if (props.length > 0 && props[0].hasOwnProperty("name")) {
                    name = props[0].name;
                } else {
                    throw new Error("A 'name' in options or props is required.");
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

                const centerPoint = center(lineString(coords));

                root
                    .ele("Placemark")
                    .ele("name")
                    .txt(name ?? "")
                    .up()
                    .ele("LookAt")
                    .ele("longitude")
                    .txt(centerPoint.geometry.coordinates[0].toString())
                    .up()
                    .ele("latitude")
                    .txt(centerPoint.geometry.coordinates[1].toString())
                    .up()
                    .ele("heading")
                    .txt("-60")
                    .up()
                    .ele("tilt")
                    .txt("70")
                    .up()
                    .ele("range")
                    .txt("6000")
                    .up()
                    .up()
                    .ele("LineString")
                    .ele("extrude")
                    .txt("1")
                    .up()
                    .ele("coordinates")
                    .txt(coordStrings.join("\n"))
                    .up();
                break;

            default:
                throw new Error(`Unknown type: ${type}`);
        }
        return raw ? root.doc() : root.end({prettyPrint: true});
    }
}

exports.Exporter = Exporter;
