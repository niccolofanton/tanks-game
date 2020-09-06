import { Entity } from './classes/entity.class';
import { World } from './world';
import { Point } from './functions/utils';
import { DynamicEntity } from './classes/dynamic-entity.class';
import { StaticEntity } from './classes/static-entity.class';

const vertices: Point[] = [
    { x: 50, y: 50 },
    { x: 72, y: 50 },
    { x: 75, y: 0 },
    { x: 78, y: 50 },    
    { x: 100, y: 50 },
    { x: 100, y: 100 },
    { x: 50, y: 100 }
];

const vertices2: Point[] = [
    { x: 200, y: 200 },
    { x: 300, y: 200 },
    { x: 300, y: 300 },
    { x: 200, y: 300 },
];

const world = new World(16);

const dEntity = new DynamicEntity('1', vertices, null, 135);
const sEntity = new StaticEntity('2', vertices2, null);

world.addDynamicEntity(dEntity);
world.addStaticEntity(sEntity);

world.drawTest();