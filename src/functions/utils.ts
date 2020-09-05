export interface Point {
    x: number;
    y: number;
}

/**
 * Degrees to radians
 * @param degrees
 * @returns radians 
 */
export function degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

/**
 * Radians to degrees
 * @param radians
 * @returns degrees
 */
export function radiansToDegrees(radians: number): number {
    return radians * (180 / Math.PI)
}

/**
 * Gets polygon centroid
 * @param vertices 
 * @returns polygon centroid 
 */
export function getPolygonCentroid(vertices: Point[]): Point {
    const pts = vertices.slice();
    var first = pts[0], last = pts[pts.length - 1];
    if (first.x != last.x || first.y != last.y) pts.push(first);
    var twicearea = 0,
        x = 0, y = 0,
        npts = pts.length,
        p1, p2, f;
    for (var i = 0, j = npts - 1; i < npts; j = i++) {
        p1 = pts[i]; p2 = pts[j];
        f = (p1.y - first.y) * (p2.x - first.x) - (p2.y - first.y) * (p1.x - first.x);
        twicearea += f;
        x += (p1.x + p2.x - 2 * first.x) * f;
        y += (p1.y + p2.y - 2 * first.y) * f;
    }
    f = twicearea * 3;
    return { x: x / f + first.x, y: y / f + first.y };
}

/**
 * Rotates point
 * @param x 
 * @param y 
 * @param centerx 
 * @param centery 
 * @param degrees 
 * @returns point 
 */
export function rotatePoint(point: Point, center: Point, degrees: number): Point {
    const rads = degreesToRadians(degrees);
    var x = Math.cos(rads) * (point.x - center.x) - Math.sin(rads) * (point.y - center.y) + center.x;
    var y = Math.sin(rads) * (point.x - center.x) + Math.cos(rads) * (point.y - center.y) + center.y;
    return { x, y };
}