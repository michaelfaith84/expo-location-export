// https://www.topografix.com/gpx.asp

const xsi = "https://www.w3.org/2001/XMLSchema-instance";
const gpxNS = "https://www.topografix.com/GPX/1/1";
const gpxNSXSD = "https://www.topografix.com/GPX/11.xsd";

export default class GPX {
  /**
   * Collection of points
   */
  static toWayPoint() {}

  /**
   * A line
   */
  static toRoute() {}

  /**
   * A line with timestamps
   */
  static toTrack() {}
}
