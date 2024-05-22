# expo-location-export

    In the spirit of, "it should just work," 

        this package lets you convert raw expo-location returns
        to the most popular geospatial formats: geojson, gpx, and kml

            in a very opinionated manner.

v2.0.0

- Rewritten in Typescript.
- Broke out each format into separate modules.
    - Decoupled GPX and KML from GEOJSON.
- Removed polygon functionality--it was unnecessary.
- Switched XML rendering to fast-xml-parser.
- Format Specific Details:
    - GEOJSON
        - Output geometries: Point, MultiPoint, or LineString.
        - Wrappers: GeometryCollection, FeatureCollection, Feature, or none.
    - GPX
        - Output types: WayPoint, Route, or Track.
        - Metadata is stored in the "global" property.
            - Metadata extensions are not supported.
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

### Example Uses

<details>
<summary>
GeoJSON:
</summary>

- point feature

```javascript
const point = new Exporter({gps: expoObject})
point.toGeoJSON()
```

- multi-point feature

```javascript
const mp = new Exporter({gps: [expoObj1, expoObj2]})
mp.toGeoJSON()
// please, sir, can i have another?
mp.add({gps: newObj})
mp.toGeoJSON()
// but this time with props
mp.add({gps: newObj, props: {id: 1, name: "fooBar"}})
mp.toGeoJSON()
```

- feature collection of points

```javascript
const props = [{id: 1, name: "foo"},
    {id: 2, name: "bar"}]
const points = new Exporter({
    gps: [expoObj1, expoOb2],
    props: props
})
points.toGeoJSON()
```

- feature collection need an id?

```javascript
const points = new Exporter({
    gps: [expoObj1, expoOb2],
    props,
    options: {id: 57}
})
```

- linestring feature

```javascript
const ls = new Exporter({gps: [expoObj1, expoObj2]})
ls.toGeoJSON({type: "linestring"})
```

- polygon feature

```javascript
const poly = new Exporter({gps: [expoObj1, expoObj2, expoObj3, expoObg4]})
poly.toGeoJSON("polygon")
```

- want the object instead of a string?

```javascript
const point = new Exporter({gps: expoObj})
point.toGeoJSON("point", true)
```

</details>

<br />

<details>
<summary>
GPX:
</summary>

- waypoint

```javascript
const waypoint = new Exporter({
    gps: expoObj,
    props: {
        name: "foo",
        desc: "good scheisse"
    }
})
waypoint.toGPX()
// Set of points? But only the first has any props.
waypoint.add({gps: newObj})
waypoint.toGPX()
```

- track

```javascript
const track = new Exporter({gps: [expoObj, expoObj]})
track.toGPX("track")
```

- change the info in the gpx header

```javascript
const pt = new Exporter({
    gps: expoObj,
    options: {
        app: {
            name: "my app",
            url: "https://myappsite.com"
        }
    }
})
```

- un-end()'d xmlbuilder2 object instead of a string

```javascript
const pt = new Exporter({gps: expoObj})
pt.toGPX("waypoint", true)
```

</details>
<br />

<details>
<summary>
KML:
</summary>

- point

```javascript
const point = new Exporter({
    gps: expoObj,
    props: {
        name: "foo",
        desc: "good scheisse"
    }
})
point.toKML()
// mass, por favor
point.add({gps: newObj, props: newProps})
point.toKML()
```

- lineString

```javascript
const linestring = new Exporter({
    gps: expoObjArr,
    props: {
        name: "fooBar"
    }
})
linestring.toKML("linestring")
```

- export as raw xmlbuilder2 object rather than string

```javascript
linestring.toKML("point", true)
```

</details>
<br />

<details>
<summary>
Dump/Load:
</summary>

```javascript
const fooBar = new Exporter({gps, props, options})
const jsonDump = JSON.stringify(fooBar.dump())
localStorage.setItem('fooBar', jsonDump)
...
const newFoo = new Exporter(JSON.parse(localStorage.getItem('fooBar')))
```

</details>

#### Built with

- [Turf](https://github.com/Turfjs/turf)
- [fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser)