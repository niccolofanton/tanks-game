import { Point, getPolygonCentroid, rotatePoint } from '../functions/utils';

export class Entity {
    // vertices needs to be calculated by angle
    public vertices: Point[] = [];
    public rotate: number = 0;
    protected rotation: number = 0;
    public readonly identifier: string = 'DEFAULT_IDENTIFIER';
    public readonly texture: HTMLImageElement | null;

    constructor(
        identifier: string = '',
        vertices: Point[],
        texture: HTMLImageElement | null = null,
        rotation: number,
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
        this.rotation = rotation;
        this.rotate = rotation;
    }

    /**
     * Gets vertices
     * @returns vertices 
     */
    public updateVertices(time: number): Point[] {

        if (this.rotate === 0) {
            return this.vertices;
        }

        // get the center
        const center = getPolygonCentroid(this.vertices);
        // rotate vertices around the center
        this.vertices.forEach(vertex => {
            const point = rotatePoint(vertex, center, this.rotate);
            vertex.x = point.x;
            vertex.y = point.y;
        });

        // the vertices are rotated now the angle is 0
        this.rotate = 0;

        return this.vertices;
    }

}