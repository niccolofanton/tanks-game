import { Entity } from './entity.class';
import { Point } from '../functions/utils';

export class StaticEntity extends Entity {

    constructor(
        identifier: string = '',
        vertices: Point[],
        texture: HTMLImageElement | null = null,
        rotation: number = 0,
    ) {
        super(identifier, vertices, texture, rotation);

    }

    getVertices(): Point[] {
        return this.vertices;
    }
}