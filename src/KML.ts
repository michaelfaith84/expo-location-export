// https://developers.google.com/kml/documentation/kml_tut

import {Data, GlobalParams, KMLExportOptions, KMLLineString, KMLPoint, Props,} from "./types";
import {XMLBuilder} from "fast-xml-parser";

const kmlNS = "https://www.opengis.net/kml/2.2";

// Builder config
const builderOptions = {
    ignoreAttributes: false,
    attributeNamePrefix: "attr-",
    format: true,
};

class KML {
    private _buildKML(data: Props, global: GlobalParams, options: KMLExportOptions) {
        const kml: any = {
            "attr-xmlns": kmlNS,
        };

        if (data.hasOwnProperty("length")) {
            Object.assign(builderOptions, {arrayNodeName: "Placemark"});
        }
        kml["Placemark"] = data;

        const builder = new XMLBuilder(builderOptions);

        // Generate the XML
        return builder.build({kml});
    }


    /**
     *
     *
     * @param data
     * @param global
     * @param options
     */
    toPoint(data: Data[], global: GlobalParams, options: KMLExportOptions) {
        const points: KMLPoint[] = data.map((each) => {
            const point: KMLPoint = {} as KMLPoint;

            if (each.id) {
                point["name"] = each.id;
            }

            if (each.props) {
                Object.keys(each.props).forEach((key) => {
                    switch (key.toLowerCase()) {
                        case "name":
                            point["name"] = each.props?.name;
                            break;
                        case "desc":
                            point["description"] = each.props?.desc;
                            break;
                    }
                });
            }

            point["Point"] = {
                coordinates: `${each.coords.longitude},${each.coords.latitude},${each.coords.altitude}`,
            };

            return point;
        });

        return this._buildKML(points, global, options);
    }


    /**
     *
     *
     * @param data
     * @param global
     * @param options
     */
    toLineString(data: Data[], global: GlobalParams, options: KMLExportOptions) {
        const linestring: KMLLineString = {
            LineString: {coordinates: "\n"},
        } as KMLLineString;

        if (global.id) {
            linestring["name"] = global.id;
        }

        data.forEach((each) => {
            linestring.LineString.coordinates += `${" ".repeat(8)}${each.coords.longitude},${each.coords.latitude},${each.coords.altitude}\n`;
        });

        linestring.LineString.coordinates.trimEnd();

        return this._buildKML(linestring, global, options);
    }
}

export default KML;
