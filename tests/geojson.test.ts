import {exampleGPSReturn} from "./test.data";
import {Exporter} from "../index";

describe('General tests', () => {
    const exporter = new Exporter({gps: exampleGPSReturn});
    test("Initialize Exporter", () => {
        expect(exporter).toBeDefined()
    })
    test("Make a point", () => {
        const point_string = exporter.toGeoJSON()
        expect(typeof point_string === 'string').toBeTruthy()
        // @ts-ignore
        const point = JSON.parse(point_string)
        expect(point.type).toMatch("Feature")
        expect(point.geometry.type).toMatch("Point")
        expect(Object.keys(point.properties).length).toEqual(0)
        expect(point.geometry.coordinates.length).toEqual(3)
        expect(point.geometry.coordinates[0]).toEqual(-121.4438241)
        expect(point.geometry.coordinates[1]).toEqual(48.8317425)
        expect(point.geometry.coordinates[2]).toEqual(36.900001525878906)
    })
})
