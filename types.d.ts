export interface GPSReturn {
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

// export interface DataDump {
//     gps: Array<GPSReturn>;
//     props;
//     options: Partial<Options>;
// }

export interface ID {
    id: string | number
}

export interface Options {
    app: {
        name: string,
        url: string,
    },
    id: ID,
    name: string
}

export type ConstructorParams = {
    gps: GPSReturn | Array<GPSReturn>,
    props?: any,
    options?: Partial<Options>,
}

export interface AddParams {
    gps: GPSReturn,
    props: any
}

export interface LoadParams {
    gps: Array<GPSReturn>,
    props: any[],
    options: Options
}

export type CoordinatesArray = Array<[number, number, number]>

export type CoordinatesStringArray = Array<string>