import { Tank } from './tank';
import { Raycaster } from './raycasting';
import { DynamicEntity } from './classes/dynamic-entity.class';
import { StaticEntity } from './classes/static-entity.class';


// const world = new World();

export class World {

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  filed_width = window.innerWidth;
  field_heigth = window.innerHeight;

  staticEntities: Array<StaticEntity> = [];
  dynamicEntities: Array<DynamicEntity> = [];

  private refreshRate: number = 16.6;


  segments = [{
    a: {
      x: 0,
      y: 0,
      angle: 0
    },
    b: {
      x: window.innerWidth,
      y: 0,
      angle: 0
    }
  },
  {
    a: {
      x: window.innerWidth,
      y: 0,
      angle: 0
    },
    b: {
      x: window.innerWidth,
      y: window.innerHeight,
      angle: 0
    }
  },
  {
    a: {
      x: window.innerWidth,
      y: window.innerHeight,
      angle: 0
    },
    b: {
      x: 0,
      y: window.innerHeight,
      angle: 0
    }
  },
  {
    a: {
      x: 0,
      y: window.innerHeight,
      angle: 0
    },
    b: {
      x: 0,
      y: 0,
      angle: 0
    }
  }
  ];
  // DRAW LOOP

  constructor(refreshRate: number = 16.6) {
    this.refreshRate = refreshRate;
    // set up world
    this.canvas = document.createElement("canvas");
    // bind context
    const context = this.canvas.getContext("2d");
    if (context !== undefined && context !== null) {
      this.ctx = context;
    } else {
      this.ctx = new CanvasRenderingContext2D();
      console.error('Context not found!')
    }
    this.canvas.width = this.filed_width;
    this.canvas.height = this.field_heigth;
    document.body.appendChild(this.canvas);
  }

  addStaticEntity(e: StaticEntity) {
    this.staticEntities.push(e);
  }

  addDynamicEntity(e: DynamicEntity) {
    this.dynamicEntities.push(e);
  }

  drawTest() {
    setInterval(() => this.drawWorld(), this.refreshRate);
  }

  /**
   * Draws world
   */
  private drawWorld() {
    // draw black background
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);


    this.dynamicEntities.forEach(e => this.collisionDetection(e));



    [...this.staticEntities, ...this.dynamicEntities].forEach(e => this.drawEntity(e));
  }

  /**
   * Draws entity
   * @param entity 
   */
  private drawEntity(entity: DynamicEntity | StaticEntity): void {
    const points = entity.getVertices();

    if (points.length === 0) {
      console.error(`${entity.identifier} has no vertices`);
      return;
    }

    this.ctx.fillStyle = '#FF0000';
    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }

    this.ctx.closePath();
    this.ctx.fill();
  }

  /**
   * Updates entity
   * @param entity
   */
  private updateEntity(entity: DynamicEntity): void {
    entity.updateVertices();
  }


  private collisionDetection(entity: DynamicEntity): void {

      [...this.staticEntities, ...this.dynamicEntities]
        .filter(e => e.identifier !== entity.identifier)
        .forEach(e => {
          if (entity.collideWith(e, entity.getPredictedEdges())) {
            entity.collisionResolution(e);
          }else {
            entity.updateVertices();
          }
        });

  }

































































  // startGame() {

  //   // generate new random stractures
  //   this.structures = this.create(10, this.filed_width, this.field_heigth);
  //   this.structures.forEach(structure => {

  //     let segement_1 = {
  //       a: {
  //         x: structure.x,
  //         y: structure.y,
  //         angle: 0
  //       },
  //       b: {
  //         x: structure.x + structure.w,
  //         y: structure.y,
  //         angle: 0
  //       },
  //     };

  //     let segement_2 = {
  //       a: {
  //         x: structure.x + structure.w,
  //         y: structure.y,
  //         angle: 0
  //       },
  //       b: {
  //         x: structure.x + structure.w,
  //         y: structure.y + structure.h,
  //         angle: 0
  //       }
  //     };
  //     let segement_3 = {
  //       a: {
  //         x: structure.x + structure.w,
  //         y: structure.y + structure.h,
  //         angle: 0
  //       },
  //       b: {
  //         x: structure.x,
  //         y: structure.y + structure.h,
  //         angle: 0
  //       },
  //     };
  //     let segement_4 = {
  //       a: {
  //         x: structure.x,
  //         y: structure.y + structure.h,
  //         angle: 0
  //       },
  //       b: {
  //         x: structure.x,
  //         y: structure.y,
  //         angle: 0
  //       }
  //     };

  //     this.segments.push(segement_1)
  //     this.segments.push(segement_2)
  //     this.segments.push(segement_3)
  //     this.segments.push(segement_4)
  //   })



  //   const tank1 = new Tank(this.structures, this.ctx, this.field_heigth, this.filed_width, Math.random() * this.filed_width, Math.random() * this.field_heigth, false);
  //   const tank2 = new Tank(this.structures, this.ctx, this.field_heigth, this.filed_width, Math.random() * this.filed_width, Math.random() * this.field_heigth, true);

  //   // create new tanks
  //   this.tanks.push(tank1)

  //   // create new tanks
  //   this.tanks.push(tank2);

  //   for (let i = 0; i < this.tanks.length; i++) {
  //     this.controls.push({
  //       forward: false,
  //       backward: false,
  //       left: false,
  //       right: false,
  //       shot: false
  //     })
  //   }

  //   // Bind commands
  //   window.addEventListener("keydown", (event) => this.keyDownControls(event), true);
  //   window.addEventListener("keyup", (event) => this.keyUpControls(event), true);

  //   setInterval(() => this.draw(this.ctx, this.tanks, this.filed_width, this.field_heigth), 16.6)
  // }


  // draw(ctx: CanvasRenderingContext2D, tanks: any[], width: number, heigth: number) {

  //   // draw black background
  //   ctx.fillStyle = "black";
  //   ctx.fillRect(0, 0, width, heigth);

  //   this.structures.forEach((structure) => {
  //     ctx.fillStyle = structure.color;
  //     ctx.fillRect(structure.x, structure.y, structure.w, structure.h);
  //   })

  //   let localBullets: any[] = [];

  //   tanks.forEach((tank, i) => {


  //     let nearestStructuresToTank = this.getNearestStructuresTo(tank.x, tank.y, tank.tank_width, this.structures);
  //     if (nearestStructuresToTank.length > 0) {


  //       // get tank perimeters points
  //       let tankPerimeterPoints = tank.getPerimeterPoints(tank.x, tank.y, tank.angle);

  //       nearestStructuresToTank.forEach(structure => {

  //         let tankCollisionsData = [];
  //         let structureCenter = {
  //           x: structure.x + (structure.w / 2),
  //           y: structure.y + (structure.h / 2)
  //         };

  //         for (let i = 0; i < tankPerimeterPoints.length; i++) {
  //           const point = tankPerimeterPoints[i];

  //           if (this.checkCollisionWithStructure(point, structure)) {

  //             let a = structureCenter.x - point.x;
  //             let b = structureCenter.y - point.y;

  //             tankCollisionsData.push({
  //               center: {
  //                 x: tank.x,
  //                 y: tank.y
  //               },
  //               impactPoint: point,
  //               collidedStructure: structure,
  //               distance: Math.sqrt(a * a + b * b)
  //             })
  //           }
  //         }

  //         if (tankCollisionsData.length > 0) {

  //           let distances: any = []
  //           tankCollisionsData.forEach(collisionData => {
  //             distances.push(collisionData.distance);
  //           });


  //           let maxPointToResolve = tankCollisionsData[distances.indexOf(Math.min(...distances))]

  //           if (maxPointToResolve !== undefined) {
  //             const newCenter = this.tankCollisionResolution(maxPointToResolve.center,
  //               maxPointToResolve.impactPoint,
  //               maxPointToResolve.collidedStructure);

  //             tank.x = newCenter[0];
  //             tank.y = newCenter[1];
  //             tank.acceleration = -(tank.acceleration / 3);
  //             tank.angular_acceleration = 0;
  //           }

  //         }

  //       })

  //     }

  //     localBullets = localBullets.concat(tank.bullets)

  //     tank.bullets.forEach((bullet: any) => {
  //       this.getNearestStructuresTo(bullet.x, bullet.y, 1, this.structures).forEach(structure => {
  //         if (this.checkCollisionWithStructure(bullet, structure))
  //           this.bulletCollisionResolution(bullet, structure)
  //       });
  //     })

  //     if (tank.x >= this.filed_width || tank.x <= 0 || tank.y >= this.field_heigth || tank.y <= 0) {
  //       if (tank.x >= this.filed_width) tank.x = this.filed_width - 1;
  //       if (tank.x <= 0) tank.x = 1;
  //       if (tank.y >= this.filed_width) tank.x = this.field_heigth - 1;
  //       if (tank.y <= 0) tank.y = 1;
  //       tank.acceleration = -(tank.acceleration / 3);
  //       tank.angular_acceleration = 0;
  //     }

  //     if (this.controls[i].forward) tank.accelerate()
  //     if (this.controls[i].backward) tank.decelerate()
  //     if (this.controls[i].right) tank.turnRight()
  //     if (this.controls[i].left) tank.turnLeft()
  //     if (!this.controls[i].left && !this.controls[i].right) tank.idleRotation()
  //     if (!this.controls[i].forward && !this.controls[i].backward) tank.idleAcceleration()

  //     if (this.controls[i].shot) {
  //       tank.shot();
  //       this.controls[i].shot = false;
  //     }

  //   })

  //   if (this.tanks.length > 1) {
  //     this.tanks.forEach((tank, i) => {
  //       localBullets.forEach((bullet) => {
  //         if (this.checkCollisionWithBullet(bullet.x, bullet.y, tank.x, tank.y, tank.angle, tank.tank_width, tank.tank_height)) {
  //           tank.destroyed = true;
  //           tanks.splice(i, 1);
  //         }
  //       })

  //       if (!tank.destroyed)
  //         tank.move()

  //     })


  //     // const rayCaster = new Raycaster(this.ctx, this.segments);
  //     // rayCaster.rayCasting(this.tanks[0].x, this.tanks[0].y);


  //   } else {
  //     let player = this.tanks[0].enemy == true ? 2 : 1;
  //     this.ctx.font = "60px Arial";
  //     this.ctx.fillText(` PLAYER ${player} WINS`, 0, 60);
  //   }


  // }

  // tankCollisionResolution(objectCenter: { x: any; y: any; }, impactPoint: { x: number; y: number; }, collidedItem: { x: number; w: any; y: number; h: any; }) {

  //   const arr = [
  //     Math.abs(impactPoint.x - collidedItem.x),
  //     Math.abs(impactPoint.x - (collidedItem.x + collidedItem.w)),
  //     Math.abs(impactPoint.y - collidedItem.y),
  //     Math.abs(impactPoint.y - (collidedItem.y + collidedItem.h))
  //   ]

  //   let lato = arr.indexOf(Math.min(...arr))

  //   let newCenter = [objectCenter.x, objectCenter.y]

  //   if (lato == 0) newCenter[0] = collidedItem.x - Math.abs(impactPoint.x - objectCenter.x) - 2;
  //   if (lato == 1) newCenter[0] = Math.abs(impactPoint.x - objectCenter.x) + collidedItem.x + collidedItem.w + 2;
  //   if (lato == 2) newCenter[1] = collidedItem.y - Math.abs(impactPoint.y - objectCenter.y) - 2
  //   if (lato == 3) newCenter[1] = collidedItem.y + collidedItem.h + Math.abs(impactPoint.y - objectCenter.y) + 2;

  //   return newCenter;
  // }

  // getNearestStructureTo(x: number, y: number, _structures: any[]) {
  //   let structures: any[] = []
  //   _structures.forEach(element => structures.push(element));
  //   let distances: any[] = []

  //   structures.forEach(structure => {
  //     let xd = (structure.x + (structure.w / 2)) - x;
  //     let yd = (structure.y + (structure.h / 2)) - y;
  //     structure.distance = Math.sqrt(xd * xd + yd * yd);
  //     distances.push(Math.sqrt(xd * xd + yd * yd))
  //   })


  //   let index = distances.indexOf(Math.min(...distances))
  //   return structures[index]


  // }

  // getNearestStructuresTo(x: number, y: number, objectRay: number, _structures: any[]) {

  //   // TODO: fix this, do only one job not the collision detection

  //   let structures: any[] = []
  //   _structures.forEach(element => structures.push(element));
  //   let distances = []

  //   structures.forEach(structure => {
  //     let xd = (structure.x + (structure.w / 2)) - x;
  //     let yd = (structure.y + (structure.h / 2)) - y;
  //     structure.distance = Math.sqrt(xd * xd + yd * yd);
  //     distances.push(Math.sqrt(xd * xd + yd * yd))
  //   })

  //   let tankAreaLenght = objectRay / 2
  //   let response: any[] = []
  //   structures.forEach(structure => {

  //     let structureXD = structure.x - structure.x + (structure.w / 2)
  //     let structureYD = structure.y - structure.y + (structure.h / 2)
  //     let structureAreaLenght = Math.sqrt(structureXD * structureXD + structureYD * structureYD);

  //     if (tankAreaLenght + structureAreaLenght > structure.distance)
  //       response.push(structure)

  //   });

  //   return response

  // }

  // bulletCollisionResolution(bullet: { x: number; y: number; angle: number; bounced_times: number; }, structure: { x: number; w: any; y: number; h: any; }) {

  //   let arr = [
  //     Math.abs(bullet.x - structure.x),
  //     Math.abs(bullet.x - (structure.x + structure.w)),
  //     Math.abs(bullet.y - structure.y),
  //     Math.abs(bullet.y - (structure.y + structure.h))
  //   ]

  //   let lato = arr.indexOf(Math.min(...arr))

  //   let angle = null;
  //   if (lato <= 1) {
  //     angle = this.toRads(180) - bullet.angle;
  //     if (lato == 0) bullet.x = structure.x - 1;
  //     if (lato == 1) bullet.x = structure.x + structure.w + 1;

  //   } else {
  //     angle = -bullet.angle;
  //     if (lato == 2) bullet.y = structure.y - 1;
  //     if (lato == 3) bullet.y = structure.y + structure.h + 1;
  //   }

  //   bullet.bounced_times++;
  //   bullet.angle = angle;
  // }

  // checkCollisionWithStructure(point: { x: number; y: number; }, structure: { x: number; w: any; y: number; h: any; }) {
  //   if (
  //     point.x >= structure.x && point.x <= structure.x + structure.w &&
  //     point.y >= structure.y && point.y <= structure.y + structure.h
  //   ) return true
  //   else return false;
  // }

  // checkCollisionWithBullet(collision_x: number | undefined, collision_y: number | undefined, x: any, y: any, r: any, w: number, h: number) {

  //   this.ctx.save();
  //   this.ctx.translate(x, y);
  //   this.ctx.rotate(r);
  //   let objectInversMatrix = this.ctx.getTransform().invertSelf();
  //   this.ctx.restore()

  //   let collision_point = new DOMPoint(collision_x, collision_y);
  //   let relative_collision_point = objectInversMatrix.transformPoint(collision_point)

  //   if (relative_collision_point.x > -(w / 2) &&
  //     relative_collision_point.x < ((w - 50) / 2) &&
  //     relative_collision_point.y > -(h / 2) &&
  //     relative_collision_point.y < (h / 2)) {
  //     return true
  //   } else return false

  // }

  // create(number: number, filed_width: number, field_heigth: number) {

  //   let rects = []

  //   while (rects.length < number) {

  //     // let color = '#' + Math.round(0xffffff * Math.random()).toString(16);
  //     let color = 'white';
  //     let coordx = Math.random() * filed_width + 150;
  //     let coordy = Math.random() * field_heigth + 100;
  //     let width = Math.random() * 80 + 20;
  //     let height = Math.random() * 80 + 20;
  //     let rect = {
  //       color: color,
  //       x: coordx,
  //       y: coordy,
  //       w: width,
  //       h: height
  //     }
  //     let ok = true;
  //     rects.forEach((item) => {
  //       if (this.isCollide(rect, item)) ok = false
  //     })

  //     if (ok) rects.push(rect);

  //   }

  //   return rects;

  // }

  // isCollide(a: { color?: string; x: any; y: any; w: any; h: any; }, b: { color?: string; x: any; y: any; w: any; h: any; }) {
  //   return !(
  //     ((a.y + a.h) < (b.y)) ||
  //     (a.y > (b.y + b.h)) ||
  //     ((a.x + a.w) < b.x) ||
  //     (a.x > (b.x + b.w))
  //   );
  // }

  // toRads(number: number) {
  //   return (number * Math.PI) / 180;
  // }

  // keyDownControls(event: KeyboardEvent) {
  //   this.updateCanvas = true;

  //   switch (event.keyCode) {
  //     case 65:
  //       this.controls[0].left = true;
  //       this.controls[0].right = false;
  //       break;
  //     case 68:
  //       this.controls[0].left = false;
  //       this.controls[0].right = true;
  //       break;
  //     case 87:
  //       this.controls[0].forward = true;
  //       this.controls[0].backward = false;
  //       break;
  //     case 83:
  //       this.controls[0].forward = false;
  //       this.controls[0].backward = true;
  //       break;
  //     case 32:
  //       this.controls[0].shot = true;
  //       break;

  //     case 37:
  //       this.controls[1].left = true;
  //       this.controls[1].right = false;
  //       break;
  //     case 39:
  //       this.controls[1].left = false;
  //       this.controls[1].right = true;
  //       break;
  //     case 38:
  //       this.controls[1].forward = true;
  //       this.controls[1].backward = false;
  //       break;
  //     case 40:
  //       this.controls[1].forward = false;
  //       this.controls[1].backward = true;
  //       break;
  //     case 13:
  //       this.controls[1].shot = true;
  //       break;
  //   }
  // }

  // keyUpControls(event: KeyboardEvent) {
  //   this.updateCanvas = true;
  //   switch (event.keyCode) {
  //     case 87:
  //       this.controls[0].forward = false;
  //       break;
  //     case 83:
  //       this.controls[0].backward = false;
  //       break;
  //     case 65:
  //       this.controls[0].left = false;
  //       break;
  //     case 68:
  //       this.controls[0].right = false;
  //       break;

  //     case 37:
  //       this.controls[1].left = false;
  //       break;
  //     case 38:
  //       this.controls[1].forward = false;
  //       break;
  //     case 39:
  //       this.controls[1].right = false;
  //       break;
  //     case 40:
  //       this.controls[1].backward = false;
  //       break;
  //   }
  // }



}