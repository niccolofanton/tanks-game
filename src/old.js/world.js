class World {

    canvas = null;
    ctx = null;
    filed_width = 0;
    field_heigth = 0;
    tanks = [];
    controls = [];
    updateCanvas = true;
    structures = []

    segments = [{
            a: {
                x: 0,
                y: 0
            },
            b: {
                x: window.innerWidth,
                y: 0
            }
        },
        {
            a: {
                x: window.innerWidth,
                y: 0
            },
            b: {
                x: window.innerWidth,
                y: window.innerHeight
            }
        },
        {
            a: {
                x: window.innerWidth,
                y: window.innerHeight
            },
            b: {
                x: 0,
                y: window.innerHeight
            }
        },
        {
            a: {
                x: 0,
                y: window.innerHeight
            },
            b: {
                x: 0,
                y: 0
            }
        }
    ];
    // DRAW LOOP

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
        this.structures = this.create(10, this.filed_width, this.field_heigth);
        this.structures.forEach(structure => {

            let segement_1 = {
                a: {
                    x: structure.x,
                    y: structure.y
                },
                b: {
                    x: structure.x + structure.w,
                    y: structure.y
                }
            };

            let segement_2 = {
                a: {
                    x: structure.x + structure.w,
                    y: structure.y
                },
                b: {
                    x: structure.x + structure.w,
                    y: structure.y + structure.h
                }
            };
            let segement_3 = {
                a: {
                    x: structure.x + structure.w,
                    y: structure.y + structure.h
                },
                b: {
                    x: structure.x,
                    y: structure.y + structure.h
                }
            };
            let segement_4 = {
                a: {
                    x: structure.x,
                    y: structure.y + structure.h
                },
                b: {
                    x: structure.x,
                    y: structure.y
                }
            };

            this.segments.push(segement_1)
            this.segments.push(segement_2)
            this.segments.push(segement_3)
            this.segments.push(segement_4)
        })
        // create new tanks
        this.tanks.push(new Tank(this.structures, this.ctx, this.field_heigth, this.filed_width, Math.random() * this.filed_width, Math.random() * this.field_heigth, false))

        // create new tanks
        this.tanks.push(new Tank(this.structures, this.ctx, this.field_heigth, this.filed_width, Math.random() * this.filed_width, Math.random() * this.field_heigth, true));

        for (let i = 0; i < this.tanks.length; i++) {
            this.controls.push({
                forward: false,
                backward: false,
                left: false,
                right: false,
                shot: false
            })
        }


        // Bind commands
        window.addEventListener("keydown", (event) => this.keyDownControls(event), true);
        window.addEventListener("keyup", (event) => this.keyUpControls(event), true);

        setInterval(() => this.draw(this.ctx, this.tanks, this.filed_width, this.field_heigth), 16.6)

    }

    draw(ctx, tanks, width, heigth) {

        // draw black background
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, width, heigth);

        this.structures.forEach((structure) => {
            ctx.fillStyle = structure.color;
            ctx.fillRect(structure.x, structure.y, structure.w, structure.h);
        })

        let localBullets = [];

        tanks.forEach((tank, i) => {


            let nearestStructuresToTank = this.getNearestStructuresTo(tank.x, tank.y, tank.tank_width, this.structures);
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

            localBullets = localBullets.concat(tank.bullets)

            tank.bullets.forEach(bullet => {
                this.getNearestStructuresTo(bullet.x, bullet.y, 1, this.structures).forEach(structure => {
                    if (this.checkCollisionWithStructure(bullet, structure))
                        this.bulletCollisionResolution(bullet, structure)
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

            if (this.controls[i].forward) tank.accelerate()
            if (this.controls[i].backward) tank.decelerate()
            if (this.controls[i].right) tank.turnRight()
            if (this.controls[i].left) tank.turnLeft()
            if (!this.controls[i].left && !this.controls[i].right) tank.idleRotation()
            if (!this.controls[i].forward && !this.controls[i].backward) tank.idleAcceleration()

            if (this.controls[i].shot) {
                tank.shot();
                this.controls[i].shot = false;
            }

        })

        if (this.tanks.length > 1) {
            this.tanks.forEach((tank, i) => {
                localBullets.forEach((bullet) => {
                    if (this.checkCollisionWithBullet(bullet.x, bullet.y, tank.x, tank.y, tank.angle, tank.tank_width, tank.tank_height)) {
                        tank.destroyed = true;
                        tanks.splice(i, 1);
                    }
                })

                if (!tank.destroyed)
                    tank.move()

            })

            this.rayCasting(this.tanks[0].x, this.tanks[0].y)
        } else {
            let player = this.tanks[0].enemy == true ? 2 : 1;
            this.ctx.font = "60px Arial";
            this.ctx.fillText(` PLAYER ${player} WINS`, 0, 60);
        }


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

        // TODO: fix this, do only one job not the collision detection

        let structures = []
        _structures.forEach(element => structures.push(element));
        let distances = []

        structures.forEach(structure => {
            let xd = (structure.x + (structure.w / 2)) - x;
            let yd = (structure.y + (structure.h / 2)) - y;
            structure.distance = Math.sqrt(xd * xd + yd * yd);
            distances.push(Math.sqrt(xd * xd + yd * yd))
        })

        let tankAreaLenght = objectRay / 2
        let response = []
        structures.forEach(structure => {

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

    keyDownControls(event) {
        this.updateCanvas = true;

        switch (event.keyCode) {
            case 65:
                this.controls[0].left = true;
                this.controls[0].right = false;
                break;
            case 68:
                this.controls[0].left = false;
                this.controls[0].right = true;
                break;
            case 87:
                this.controls[0].forward = true;
                this.controls[0].backward = false;
                break;
            case 83:
                this.controls[0].forward = false;
                this.controls[0].backward = true;
                break;
            case 32:
                this.controls[0].shot = true;
                break;

            case 37:
                this.controls[1].left = true;
                this.controls[1].right = false;
                break;
            case 39:
                this.controls[1].left = false;
                this.controls[1].right = true;
                break;
            case 38:
                this.controls[1].forward = true;
                this.controls[1].backward = false;
                break;
            case 40:
                this.controls[1].forward = false;
                this.controls[1].backward = true;
                break;
            case 13:
                this.controls[1].shot = true;
                break;
        }
    }

    keyUpControls(event) {
        this.updateCanvas = true;
        switch (event.keyCode) {
            case 87:
                this.controls[0].forward = false;
                break;
            case 83:
                this.controls[0].backward = false;
                break;
            case 65:
                this.controls[0].left = false;
                break;
            case 68:
                this.controls[0].right = false;
                break;

            case 37:
                this.controls[1].left = false;
                break;
            case 38:
                this.controls[1].forward = false;
                break;
            case 39:
                this.controls[1].right = false;
                break;
            case 40:
                this.controls[1].backward = false;
                break;
        }
    }



    // ------------------------------------------------------------- #
    // IMPLEMENTATION OF: https://github.com/ncase/sight-and-light   #
    //-------------------------------------------------------------- #

    rayCasting(x, y) {
        this.ctx.globalAlpha = 0.2;
        var fuzzyRadius = 20;
        var polygons = [this.getSightPolygon(x, y)];
        for (var angle = 0; angle < Math.PI * 2; angle += (Math.PI * 2) / 10) {
            var dx = Math.cos(angle) * fuzzyRadius;
            var dy = Math.sin(angle) * fuzzyRadius;
            polygons.push(this.getSightPolygon(x + dx, y + dy));
        };
        // DRAW AS A GIANT POLYGON
        for (var i = 1; i < polygons.length; i++) {
            this.drawPolygon(polygons[i], this.ctx, "rgba(255,255,255,0.2)");
        }
        this.drawPolygon(polygons[0], this.ctx, "");
        this.ctx.globalAlpha = 1;
    }
    drawPolygon(polygon, ctx, fillStyle) {
        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        ctx.moveTo(polygon[0].x, polygon[0].y);
        for (var i = 1; i < polygon.length; i++) {
            var intersect = polygon[i];
            ctx.lineTo(intersect.x, intersect.y);
        }
        ctx.fill();
    }

    // Find intersection of RAY & SEGMENT
    getIntersection(ray, segment) {
        // RAY in parametric: Point + Delta*T1
        var r_px = ray.a.x;
        var r_py = ray.a.y;
        var r_dx = ray.b.x - ray.a.x;
        var r_dy = ray.b.y - ray.a.y;
        // SEGMENT in parametric: Point + Delta*T2
        var s_px = segment.a.x;
        var s_py = segment.a.y;
        var s_dx = segment.b.x - segment.a.x;
        var s_dy = segment.b.y - segment.a.y;
        // Are they parallel? If so, no intersect
        var r_mag = Math.sqrt(r_dx * r_dx + r_dy * r_dy);
        var s_mag = Math.sqrt(s_dx * s_dx + s_dy * s_dy);
        if (r_dx / r_mag == s_dx / s_mag && r_dy / r_mag == s_dy / s_mag) {
            // Unit vectors are the same.
            return null;
        }
        // SOLVE FOR T1 & T2
        var T2 = (r_dx * (s_py - r_py) + r_dy * (r_px - s_px)) / (s_dx * r_dy - s_dy * r_dx);
        var T1 = (s_px + s_dx * T2 - r_px) / r_dx;
        // Must be within parametic whatevers for RAY/SEGMENT
        if (T1 < 0) return null;
        if (T2 < 0 || T2 > 1) return null;
        // Return the POINT OF INTERSECTION
        return {
            x: r_px + r_dx * T1,
            y: r_py + r_dy * T1,
            param: T1
        };
    }

    // create polygon from segment in sight
    getSightPolygon(sightX, sightY) {

        // get all the points 
        var points = ((segments) => {
            var a = [];
            segments.forEach((seg) => {
                a.push(seg.a, seg.b);
            });
            return a;
        })(this.segments);

        // keep only 1 copy
        var uniquePoints = ((points) => {
            var set = {};
            return points.filter((p) => {
                var key = p.x + "," + p.y;
                if (key in set) {
                    return false;
                } else {
                    set[key] = true;
                    return true;
                }
            });
        })(points);

        // Get all angles
        var uniqueAngles = [];
        for (var j = 0; j < uniquePoints.length; j++) {
            var uniquePoint = uniquePoints[j];
            var angle = Math.atan2(uniquePoint.y - sightY, uniquePoint.x - sightX);
            uniquePoint.angle = angle;
            uniqueAngles.push(angle - 0.00001, angle, angle + 0.00001);
        }


        // RAYS IN ALL DIRECTIONS
        var intersects = [];
        for (var j = 0; j < uniqueAngles.length; j++) {
            var angle = uniqueAngles[j];
            // Calculate dx & dy from angle
            var dx = Math.cos(angle);
            var dy = Math.sin(angle);
            // Ray from center of screen to mouse
            var ray = {
                a: {
                    x: sightX,
                    y: sightY
                },
                b: {
                    x: sightX + dx,
                    y: sightY + dy
                }
            };
            // Find CLOSEST intersection
            var closestIntersect = null;
            for (var i = 0; i < this.segments.length; i++) {
                var intersect = this.getIntersection(ray, this.segments[i]);
                if (!intersect) continue;
                if (!closestIntersect || intersect.param < closestIntersect.param) {
                    closestIntersect = intersect;
                }
            }
            // Intersect angle
            if (!closestIntersect) continue;
            closestIntersect.angle = angle;
            // Add to list of intersects
            intersects.push(closestIntersect);
        }
        // Sort intersects by angle
        intersects = intersects.sort(function (a, b) {
            return a.angle - b.angle;
        });
        // Polygon is intersects, in order of angle
        return intersects;
    }


}