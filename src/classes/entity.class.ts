import { Point, getPolygonCentroid, rotatePoint } from '../functions/utils';

export abstract class Entity {
    // vertices needs to be calculated by angle
    protected vertices: Point[] = [];
    protected rotation: number = 0;
    protected edges: Point[] = [];

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

        this.edges = this.buildEdges(this.vertices);
    }

    protected buildEdges(vertices: Point[]): Point[] {
        const edges: Point[] = [];
        if (vertices.length < 3) {
            console.error("Only polygons supported.");
            return edges;
        }
        for (let i = 0; i < vertices.length; i++) {
            const a = vertices[i];
            let b = vertices[0];
            if (i + 1 < vertices.length) {
                b = vertices[i + 1];
            }
            edges.push({
                x: (b.x - a.x),
                y: (b.y - a.y),
            });
        }
        return edges;
    }

    private intervalDistance(minA: number, maxA: number, minB: number, maxB: number): number {
        if (minA < minB) {
            return (minB - maxA);
        }
        return (minA - maxB);
    }


    private offset(dx: number, dy: number): void {
        for (let i = 0; i < this.vertices.length; i++) {
            this.vertices[i] = {
                x: this.vertices[i].x + dx,
                y: this.vertices[i].y + dy,
            };
        }
    };


    private projectInAxis(x: number, y: number): {
        min: number;
        max: number;
    } {
        let min = 10000000000;
        let max = -10000000000;
        for (let i = 0; i < this.vertices.length; i++) {
            let px = this.vertices[i].x;
            let py = this.vertices[i].y;
            var projection = (px * x + py * y) / (Math.sqrt(x * x + y * y));
            if (projection > max) {
                max = projection;
            }
            if (projection < min) {
                min = projection;
            }
        }
        return { min, max };
    };

    public collideWith(otherPolygon: Entity, testEdges: Point[] = []): boolean {

        let tEdges: Point[] = [];
        if (testEdges.length === 0) {
            tEdges = this.edges;
        } else {
            tEdges = testEdges;
        }

        // get all edges
        const edges = [];
        for (let i = 0; i < tEdges.length; i++) {
            edges.push(tEdges[i]);
        }
        for (let i = 0; i < otherPolygon.edges.length; i++) {
            edges.push(otherPolygon.edges[i]);
        }
        // build all axis and project
        for (let i = 0; i < edges.length; i++) {
            // get axis
            const length = Math.sqrt(edges[i].y * edges[i].y + edges[i].x * edges[i].x);
            const axis = {
                x: -edges[i].y / length,
                y: edges[i].x / length,
            };
            // project polygon under axis
            const { min: minA, max: maxA } = this.projectInAxis(axis.x, axis.y);
            const { min: minB, max: maxB } = otherPolygon.projectInAxis(axis.x, axis.y);
            if (this.intervalDistance(minA, maxA, minB, maxB) > 0) {
                return false;
            }
        }

        return true;
    };
}