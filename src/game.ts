import { Entity } from './classes/entity.class';
import { World } from './world';
import { Point } from './functions/utils';
import { DynamicEntity } from './classes/dynamic-entity.class';

const vertices: Point[] = [
    { x: 50, y: 50 },
    { x:100, y: 35 },
    { x: 50, y: 100 }
]
const entity = new Entity('1', vertices, null, 10);
const world = new World();

const dEntity = new DynamicEntity('2', vertices, null, 0);

world.addEntity(entity);
world.addEntity(dEntity);

world.drawTest();