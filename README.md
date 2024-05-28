# expo-location-export

    In the spirit of, "it should just work," 

        this package lets you convert raw expo-location returns
        to the most popular geospatial formats: geojson, gpx, and kml

            in a very opinionated manner.

v2.0.0

- Rewritten in Typescript.
- Broke out each format into separate modules.
    - Decoupled GPX and KML from GEOJSON.
- Removed a bunch of unnecessary formats (Polygon, Route, etc).
- Switched XML rendering to fast-xml-parser.
- Links don't provide or validate mime types for the sake of sanity.
- Format Specific Details:
    - GEOJSON
        - Output geometries: Point, MultiPoint, or LineString.
        - Wrappers: GeometryCollection, FeatureCollection, Feature, or none.
    - GPX
        - Output types: WayPoint or Track.
        - Metadata is stored in the "global" property.
    - KML

<details>
<summary>Past Versions</summary>

v1.1.0

- Removed 'load' method -> the constructor can take the dump as the param

v1.0.1

- Switched to the AirBNB Styleguide.
- Changed the switch 'type' parameter to lowercase.
- Corrected license year (2022 not 2021)

</details>

Read more about [expo-location](https://github.com/expo/expo-location).
<details>
<summary>
Example expo-location return
</summary>

```json
{
  "coords": {
    "accuracy": 11.553999900817871,
    "altitude": 36.900001525878906,
    "altitudeAccuracy": 2.5298962593078613,
    "heading": 0,
    "latitude": 48.8317425,
    "longitude": -121.4438241,
    "speed": 0
  },
  "mocked": false,
  "timestamp": 1674709638052
}
```

</details>

## EVERYTHING BELOW THIS IS OUT OF DATE

### Example Uses

```javascript 
const exporter = new Exporter()
exporter.add(expoObject)
exporter.add(nextExpoObject)

// Dump the data
const exporterDump = exporter.dump()

// Load the dump
const loaded = Exporter.load(exporterDump)

// GPX metadata is added to the constructor
const withMetaData = new Exporter({
    id: 'a day out',
    metadata: {
        author: 'John Smith'
    }
})

// Exporting
exporter.toPoint("geojson")
exporter.toPoint("gpx")
exporter.toPoint("kml")
exporter.toLine("geojson")
exporter.toLine("gpx")
exporter.toLine("kml")
```

#### Built with

- [Typescript](https://github.com/microsoft/TypeScript)
- [Turf.js](https://github.com/Turfjs/turf)
- [fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser)
- [Lodash](https://github.com/lodash/lodash)'s cloneDeep