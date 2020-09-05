import { Point, getPolygonCentroid, rotatePoint } from '../functions/utils';

export abstract class Entity {
    // vertices needs to be calculated by angle
    protected vertices: Point[] = [];
    protected rotation: number = 0;
    public readonly identifier: string = 'DEFAULT_IDENTIFIER';
    public readonly texture: HTMLImageElement | null;

    constructor(
        identifier: string = '',
        vertices: Point[],
        texture: HTMLImageElement | null = null,
        rotation: number = 0,
    ) {
        // required
        if (identifier === null) {
            console.error('Missing identifier');
        } else {
            this.identifier = identifier;
        }

        // at least 3 are required
        if (vertices && vertices.length < 3) {
            console.error('Entity needs at least 3 vertices');
        } else {
            this.vertices = vertices;
        }

        // optional texture
        if (texture === null) {
            console.warn('Missing texture');
        }

        this.texture = texture;

        // rotate vertices
        if (rotation !== 0) {
            this.rotation = rotation;
            // get the center
            const center = getPolygonCentroid(this.vertices);
            // rotate vertices around the center
            this.vertices.forEach(vertex => {
                const point = rotatePoint(vertex, center, rotation);
                vertex.x = point.x;
                vertex.y = point.y;
            });
        }
    }
}