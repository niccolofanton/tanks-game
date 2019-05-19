class World {

    canvas = null;
    ctx = null;
    filed_width = 0;
    field_heigth = 0;
    forward = false;
    backward = false;
    left = false;
    right = false;
    shot = false;

    constructor() {

        // set up world
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.filed_width = window.innerWidth;
        this.field_heigth = window.innerHeight;
        this.canvas.width = this.filed_width;
        this.canvas.height = this.field_heigth;
        document.body.appendChild(this.canvas);

        // generate new random stractures
        let structures = this.create(10, this.filed_width, this.field_heigth);

        // create new tank
        let tank = new Tank(structures, this.ctx, this.field_heigth, this.filed_width);

        // Bind commands
        window.addEventListener("keydown", (event) => {
            switch (event.keyCode) {
                case 65:
                    this.left = true;
                    this.right = false;
                    break;
                case 68:
                    this.left = false;
                    this.right = true;
                    break;
                case 87:
                    this.forward = true;
                    this.backward = false;
                    break;
                case 83:
                    this.forward = false;
                    this.backward = true;
                    break;
                case 32:
                    this.shot = true;
                    break;
            }
        }, true);

        window.addEventListener("keyup", (event) => {
            switch (event.keyCode) {
                case 87:
                    this.forward = false;
                    break;
                case 83:
                    this.backward = false;
                    break;
                case 65:
                    this.left = false;
                    break;
                case 68:
                    this.right = false;
                    break;
            }
        }, true);


        // main draw function
        setInterval(() => this.draw(this.ctx, tank, structures, this.filed_width, this.field_heigth), 16)

    }


    draw(ctx, tank, structures, width, heigth) {

        // draw black background
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, width, heigth);

        structures.forEach((structure) => {
            ctx.fillStyle = structure.color;
            ctx.fillRect(structure.x, structure.y, structure.w, structure.h);
        })

        let nearestStructuresToTank = this.getNearestStructuresTo(tank.x, tank.y, tank.tank_width, structures);
        if (nearestStructuresToTank.length > 0) {


            // get tank perimeters points
            let tankPerimeterPoints = tank.getPerimeterPoints(tank.x, tank.y, tank.angle);

            nearestStructuresToTank.forEach(structure => {

                let tankCollisionsData = [];
                let structureCenter = {
                    x: structure.x + (structure.w / 2),
                    y: structure.y + (structure.h / 2)
                };

                for (let i = 0; i < tankPerimeterPoints.length; i++) {
                    const point = tankPerimeterPoints[i];

                    if (this.checkCollisionWithStructure(point, structure)) {

                        let a = structureCenter.x - point.x;
                        let b = structureCenter.y - point.y;

                        tankCollisionsData.push({
                            center: {
                                x: tank.x,
                                y: tank.y
                            },
                            impactPoint: point,
                            collidedStructure: structure,
                            distance: Math.sqrt(a * a + b * b)
                        })
                    }
                }

                if (tankCollisionsData.length > 0) {

                    let distances = []
                    tankCollisionsData.forEach(collisionData => {
                        distances.push(collisionData.distance);
                    });


                    let maxPointToResolve = tankCollisionsData[distances.indexOf(Math.min(...distances))]

                    if (maxPointToResolve != -1) {
                        const newCenter = this.tankCollisionResolution(maxPointToResolve.center,
                            maxPointToResolve.impactPoint,
                            maxPointToResolve.collidedStructure);

                        tank.x = newCenter[0];
                        tank.y = newCenter[1];
                        tank.acceleration = -(tank.acceleration / 3);
                        tank.angular_acceleration = 0;
                    }

                }

            })

        }


        tank.bullets.forEach(bullet => {
            this.getNearestStructuresTo(bullet.x, bullet.y, 1, structures).forEach(structure => {
                if (this.checkCollisionWithStructure(bullet, structure)) {
                    this.bulletCollisionResolution(bullet, structure)
                }
            });
        })


        if (tank.x >= this.filed_width || tank.x <= 0 || tank.y >= this.field_heigth || tank.y <= 0) {
            if (tank.x >= this.filed_width) tank.x = this.filed_width - 1;
            if (tank.x <= 0) tank.x = 1;
            if (tank.y >= this.filed_width) tank.x = this.field_heigth - 1;
            if (tank.y <= 0) tank.y = 1;
            tank.acceleration = -(tank.acceleration / 3);
            tank.angular_acceleration = 0;
        }


        for (let i = 0; i < tank.bullets.length; i++) {
            const bullet = tank.bullets[i];
            if (this.checkCollisionWithBullet(bullet.x, bullet.y, tank.x, tank.y, tank.angle, tank.tank_width, tank.tank_height)) {
                tank.destroyed = true;
            }
        }


        if (this.forward) tank.accelerate()

        if (this.backward) tank.decelerate()

        if (this.right) tank.turnRight()

        if (this.left) tank.turnLeft()

        if (!this.left && !this.right) tank.idleRotation()

        if (!this.forward && !this.backward) tank.idleAcceleration()

        if (this.shot) {

            // for (let i = 0; i < 50000; i++) {
            //     tank.x = Math.random() * this.filed_width;
            //     tank.y = Math.random() * this.field_heigth;
            //     tank.angle = this.toRads(Math.random() * 360);

            // }
            tank.shot();
            this.shot = false;
        }

        tank.move()
        this.rayCasting(tank, structures)
    }

    // ---- RAYCATING STUFF

    rayCasting(tank, structures) {

        this.ctx.fillStyle = "white";
        this.ctx.globalAlpha = 0.4;

        for (let i = 0; i < 360; i++) {

            let length = 0
            let stop = false;
            let angle = this.toRads(i);

            let _point = {
                x: tank.x,
                y: tank.y
            }

            while (!stop) {

                let _structure = this.getNearestStructureTo(_point.x, _point.y, structures)
                // console.log(_structure);

                if (this.checkCollisionWithStructure(_point, _structure))
                    stop = true;
                else {

                    length += _structure.distance;
                    _point.x += Math.cos(angle) * _structure.distance;
                    _point.y += Math.sin(angle) * _structure.distance;

                    if (
                        _point.x < 0 || _point.x > this.filed_width ||
                        _point.y < 0 || _point.y > this.field_heigth
                    ) stop = true;
                }


            }

            this.ctx.save()
            this.ctx.translate(tank.x + Math.cos(angle) * 60, tank.y + Math.sin(angle) * 60);
            this.ctx.rotate(angle);
            this.ctx.fillRect(0, 0, length-60, 1);
            this.ctx.restore()

        }

        this.ctx.globalAlpha = 1;

    }

    tankCollisionResolution(objectCenter, impactPoint, collidedItem) {

        const arr = [
            Math.abs(impactPoint.x - collidedItem.x),
            Math.abs(impactPoint.x - (collidedItem.x + collidedItem.w)),
            Math.abs(impactPoint.y - collidedItem.y),
            Math.abs(impactPoint.y - (collidedItem.y + collidedItem.h))
        ]

        let lato = arr.indexOf(Math.min(...arr))

        let newCenter = [objectCenter.x, objectCenter.y]

        if (lato == 0) newCenter[0] = collidedItem.x - Math.abs(impactPoint.x - objectCenter.x) - 2;
        if (lato == 1) newCenter[0] = Math.abs(impactPoint.x - objectCenter.x) + collidedItem.x + collidedItem.w + 2;
        if (lato == 2) newCenter[1] = collidedItem.y - Math.abs(impactPoint.y - objectCenter.y) - 2
        if (lato == 3) newCenter[1] = collidedItem.y + collidedItem.h + Math.abs(impactPoint.y - objectCenter.y) + 2;

        return newCenter;
    }

    getNearestStructureTo(x, y, _structures) {
        let structures = []
        _structures.forEach(element => structures.push(element));
        let distances = []

        structures.forEach(structure => {
            let xd = (structure.x + (structure.w / 2)) - x;
            let yd = (structure.y + (structure.h / 2)) - y;
            structure.distance = Math.sqrt(xd * xd + yd * yd);
            distances.push(Math.sqrt(xd * xd + yd * yd))
        })


        let index = distances.indexOf(Math.min(...distances))
        return structures[index]


    }

    getNearestStructuresTo(x, y, objectRay, _structures) {
        let structures = []
        _structures.forEach(element => structures.push(element));


        let _nearest2Structures = []
        let distances = []

        structures.forEach(structure => {
            let xd = (structure.x + (structure.w / 2)) - x;
            let yd = (structure.y + (structure.h / 2)) - y;
            structure.distance = Math.sqrt(xd * xd + yd * yd);
            distances.push(Math.sqrt(xd * xd + yd * yd))
        })


        let index = distances.indexOf(Math.min(...distances))
        _nearest2Structures.push(structures[index])
        structures.splice(index, 1)
        distances.splice(index, 1)
        _nearest2Structures.push(structures[distances.indexOf(Math.min(...distances))])
        let tankAreaLenght = objectRay / 2


        let response = []
        _nearest2Structures.forEach(structure => {

            let structureXD = structure.x - structure.x + (structure.w / 2)
            let structureYD = structure.y - structure.y + (structure.h / 2)
            let structureAreaLenght = Math.sqrt(structureXD * structureXD + structureYD * structureYD);

            if (tankAreaLenght + structureAreaLenght > structure.distance)
                response.push(structure)

        });

        return response

    }

    bulletCollisionResolution(bullet, structure) {

        let arr = [
            Math.abs(bullet.x - structure.x),
            Math.abs(bullet.x - (structure.x + structure.w)),
            Math.abs(bullet.y - structure.y),
            Math.abs(bullet.y - (structure.y + structure.h))
        ]

        let lato = arr.indexOf(Math.min(...arr))

        let angle = null;
        if (lato <= 1) {
            angle = this.toRads(180) - bullet.angle;
            if (lato == 0) bullet.x = structure.x - 1;
            if (lato == 1) bullet.x = structure.x + structure.w + 1;

        } else {
            angle = -bullet.angle;
            if (lato == 2) bullet.y = structure.y - 1;
            if (lato == 3) bullet.y = structure.y + structure.h + 1;
        }

        bullet.bounced_times++;
        bullet.angle = angle;
    }

    checkCollisionWithStructure(point, structure) {
        if (
            point.x >= structure.x && point.x <= structure.x + structure.w &&
            point.y >= structure.y && point.y <= structure.y + structure.h
        ) return true
        else return false;
    }

    checkCollisionWithBullet(collision_x, collision_y, x, y, r, w, h) {

        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(r);
        let objectInversMatrix = this.ctx.getTransform().invertSelf();
        this.ctx.restore()

        let collision_point = new DOMPoint(collision_x, collision_y);
        let relative_collision_point = objectInversMatrix.transformPoint(collision_point)

        if (relative_collision_point.x > -(w / 2) &&
            relative_collision_point.x < ((w - 50) / 2) &&
            relative_collision_point.y > -(h / 2) &&
            relative_collision_point.y < (h / 2)) {
            return true
        } else return false

    }

    create(number, filed_width, field_heigth) {

        let rects = []

        while (rects.length < number) {

            // let color = '#' + Math.round(0xffffff * Math.random()).toString(16);
            let color = 'white';
            let coordx = Math.random() * filed_width + 150;
            let coordy = Math.random() * field_heigth + 100;
            let width = Math.random() * 80 + 20;
            let height = Math.random() * 80 + 20;
            let rect = {
                color: color,
                x: coordx,
                y: coordy,
                w: width,
                h: height
            }
            let ok = true;
            rects.forEach((item) => {
                if (this.isCollide(rect, item)) ok = false
            })

            if (ok) rects.push(rect);

        }

        return rects;

    }

    isCollide(a, b) {
        return !(
            ((a.y + a.h) < (b.y)) ||
            (a.y > (b.y + b.h)) ||
            ((a.x + a.w) < b.x) ||
            (a.x > (b.x + b.w))
        );
    }

    toRads(number) {
        return (number * Math.PI) / 180;
    }

}