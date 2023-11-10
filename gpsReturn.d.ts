export default interface GPSReturn {
    coords: {
        accuracy: number,
        altitude: number,
        altitudeAccuracy: number,
        heading: number,
        latitude: number,
        longitude: number,
        speed: number
    },
    mocked: boolean,
    timestamp: number
}