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

        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.filed_width = window.innerWidth;
        this.field_heigth = window.innerHeight;
        this.canvas.width = this.filed_width;
        this.canvas.height = this.field_heigth;
        document.body.appendChild(this.canvas);

        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.width, this.heigth);

        // calc new stractures
        var structures = this.create(10, this.filed_width, this.field_heigth);

        // create new tank
        var tank = new Tank(structures, this.ctx, this.field_heigth, this.filed_width);

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


        // draw function
        setInterval(() => this.draw(this.ctx, tank, structures, this.filed_width, this.field_heigth), 16)

    }


    draw(ctx, tank, structures, width, heigth) {

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, width, heigth);

        structures.forEach((structure) => {
            ctx.fillStyle = structure.color;
            ctx.fillRect(structure.x, structure.y, structure.w, structure.h);
        })

        if (this.forward) tank.accelerate()

        if (this.backward) tank.decelerate()

        if (this.right) tank.turnRight()

        if (this.left) tank.turnLeft()

        if (!this.left && !this.right) tank.idleRotation()

        if (!this.forward && !this.backward) tank.idleAcceleration()

        if (this.shot) {
            tank.shot();
            this.shot = false;
        }

        tank.move()
    }

    create(number, filed_width, field_heigth) {

        var rects = []

        while (rects.length < number) {

            var color = '#' + Math.round(0xffffff * Math.random()).toString(16);
            var coordx = Math.random() * filed_width + 150;
            var coordy = Math.random() * field_heigth + 100;
            var width = Math.random() * 80 + 20;
            var height = Math.random() * 80 + 20;
            var rect = {
                color: color,
                x: coordx,
                y: coordy,
                w: width,
                h: height
            }
            var ok = true;
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

}


// setInterval(() => {

//     database.ref('tank_1/').update({
//         x: Math.round(posX),
//         y: Math.round(posY),
//         rotation: Math.round(angle)
//     });

// }, 100)

// function shot() {

//     tempX_2 = (posX + ((tank_width) / 2)) - posX;
//     tempX_3 = (posX + ((tank_width) / 2)) - posX;
//     tempY_2 = (posY + (tank_height / 2)) - posY;
//     tempY_3 = (posY - (tank_height / 2)) - posY;
//     rotatedX_2 = tempX_2 * Math.cos(angle) - tempY_2 * Math.sin(angle);
//     rotatedX_3 = tempX_3 * Math.cos(angle) - tempY_3 * Math.sin(angle);
//     rotatedY_2 = tempX_2 * Math.sin(angle) + tempY_2 * Math.cos(angle);
//     rotatedY_3 = tempX_3 * Math.sin(angle) + tempY_3 * Math.cos(angle);

//     bullets.push({
//         angle: angle,
//         tails: [],
//         x: posX + ((rotatedX_2 + rotatedX_3) / 2) + acceleration * 2 * Math.cos(angle),
//         y: posY + ((rotatedY_2 + rotatedY_3) / 2) + acceleration * 2 * Math.sin(angle),
//         bounced: 0
//     })

// }

// function collision(bx, by, angle_r, x, y) {

//     ctx.save();
//     ctx.translate(x, y);
//     ctx.rotate(angle_r);
//     var tankInvMatrix = ctx.getTransform().invertSelf();
//     ctx.restore()

//     var bullet = new DOMPoint(bx, by);
//     var relBullet = tankInvMatrix.transformPoint(bullet)

//     if (relBullet.x > - (tank_width / 2)
//         && relBullet.x < ((tank_width - 50) / 2)
//         && relBullet.y > -(tank_height / 2)
//         && relBullet.y < (tank_height / 2)) {
//         return true
//     } else return false

// }


// if collision is happening

// function check_collision(collision_x, collision_y, x, y, r, w, h, tank_hack) {

//     ctx.save();
//     ctx.translate(x, y);
//     ctx.rotate(r);
//     var objectInversMatrix = ctx.getTransform().invertSelf();
//     ctx.restore()

//     var collision_point = new DOMPoint(collision_x, collision_y);
//     var relative_collision_point = objectInversMatrix.transformPoint(collision_point)

//     if (tank_hack) {
//         if (relative_collision_point.x > - (w / 2)
//             && relative_collision_point.x < ((w - 50) / 2)
//             && relative_collision_point.y > -(h / 2)
//             && relative_collision_point.y < (h / 2)) {
//             return true
//         } else return false
//     } else {
//         if (relative_collision_point.x > - (w / 2)
//             && relative_collision_point.x < ((w) / 2)
//             && relative_collision_point.y > -(h / 2)
//             && relative_collision_point.y < (h / 2)) {
//             return true
//         } else return false
//     }


// }


// function get_tank_vertex(x, y, angle) {
//     // tempX_4 = (posX - (tank_width / 2)) - posX;
//     // tempX_3 = (posX + ((tank_width - 50) / 2)) - posX;
//     // tempY_3 = (posY - (tank_height / 2)) - posY;
//     // tempY_4 = (posY + (tank_height / 2)) - posY;
//     // rotatedX_1 = xc1 - ys1;
//     // rotatedX_2 = xc2 - ys2;
//     // rotatedX_3 = xc2 - ys1;
//     // rotatedX_4 = xc1 - ys2;
//     // rotatedY_1 = xs1 + yc1;
//     // rotatedY_2 = xs2 + yc2;
//     // rotatedY_3 = xs2 + yc1;
//     // rotatedY_4 = xs1 + yc2;

//     var
//         tempX_1 = (x - (tank_width / 2)) - x;
//     tempX_2 = (x + ((tank_width - 50) / 2)) - x;
//     tempY_1 = (y - (tank_height / 2)) - y;
//     tempY_2 = (y + (tank_height / 2)) - y;
//     sin = Math.sin(angle)
//     cos = Math.cos(angle)

//     xc1 = tempX_1 * cos
//     xc2 = tempX_2 * cos
//     ys1 = tempY_1 * sin
//     ys2 = tempY_2 * sin
//     xs1 = tempX_1 * sin
//     xs2 = tempX_2 * sin
//     yc1 = tempY_1 * cos
//     yc2 = tempY_2 * cos


//     var points = [
//         [xc1 - ys1 + x, xs1 + yc1 + y],
//         [xc2 - ys1 + x, xs2 + yc1 + y],
//         [xc2 - ys2 + x, xs2 + yc2 + y],
//         [xc1 - ys2 + x, xs1 + yc2 + y]
//     ]

//     var perimeter = [];

//     for (let i = 0; i < points.length; i++) {
//         var point_a = points[i];
//         var point_b = points[i == points.length - 1 ? 0 : i + 1]

//         if (point_a[0] > point_b[0]) {
//             var memory = point_a;
//             point_a = point_b
//             point_b = memory
//         }

//         var coordinates = [];
//         var xd = point_b[0] - point_a[0];
//         var yd = point_b[1] - point_a[1];
//         var dist = Math.sqrt(xd * xd + yd * yd);

//         for (let i = 0; i < dist; i = i + 2.5) {
//             perimeter.push(Get_coordinates_between_two_points(point_a, xd, yd, dist, i))
//         }

//     }

//     return perimeter

// }


// function Get_coordinates_between_two_points(p, xd, yd, d, i) {
//     const fractionOfTotal = i / d;

//     ctx.fillStyle = "yellow";
//     ctx.fillRect(p[0] + xd * fractionOfTotal, p[1] + yd * fractionOfTotal, 1, 1);

//     return [p[0] + xd * fractionOfTotal, p[1] + yd * fractionOfTotal]

// }




// function test(x, y, item_x, item_y, w, h) {
//     if (
//         x >= item_x && x <= item_x + w &&
//         y >= item_y && y <= item_y + h
//     ) return true
// }



// function calcHitbox(angle, x, y, draw) {

//     var tempX_1 = (posX - (tank_width / 2)) - posX;
//     tempX_2 = (posX + ((tank_width - 50) / 2)) - posX;
//     tempX_3 = (posX + ((tank_width - 50) / 2)) - posX;
//     tempX_4 = (posX - (tank_width / 2)) - posX;
//     tempY_1 = (posY - (tank_height / 2)) - posY;
//     tempY_2 = (posY + (tank_height / 2)) - posY;
//     tempY_3 = (posY - (tank_height / 2)) - posY;
//     tempY_4 = (posY + (tank_height / 2)) - posY;

//     rotatedX_1 = tempX_1 * Math.cos(angle) - tempY_1 * Math.sin(angle);
//     rotatedX_2 = tempX_2 * Math.cos(angle) - tempY_2 * Math.sin(angle);
//     rotatedX_3 = tempX_3 * Math.cos(angle) - tempY_3 * Math.sin(angle);
//     rotatedX_4 = tempX_4 * Math.cos(angle) - tempY_4 * Math.sin(angle);

//     rotatedY_1 = tempX_1 * Math.sin(angle) + tempY_1 * Math.cos(angle);
//     rotatedY_2 = tempX_2 * Math.sin(angle) + tempY_2 * Math.cos(angle);
//     rotatedY_3 = tempX_3 * Math.sin(angle) + tempY_3 * Math.cos(angle);
//     rotatedY_4 = tempX_4 * Math.sin(angle) + tempY_4 * Math.cos(angle);

//     if (draw) {
//         ctx.fillStyle = "green";
//         ctx.fillRect(rotatedX_1 + posX, rotatedY_1 + posY, 2, 2);

//         ctx.fillStyle = "yellow";
//         ctx.fillRect(rotatedX_3 + posX, rotatedY_3 + posY, 2, 2);

//         ctx.fillStyle = "red";
//         ctx.fillRect(rotatedX_2 + posX, rotatedY_2 + posY, 2, 2);

//         ctx.fillStyle = "orange";
//         ctx.fillRect(rotatedX_4 + posX, rotatedY_4 + posY, 2, 2);
//     }

//     return [
//         [rotatedX_1 + x, rotatedY_1 + y],
//         [rotatedX_2 + x, rotatedY_2 + y],
//         [rotatedX_3 + x, rotatedY_3 + y],
//         [rotatedX_4 + x, rotatedY_4 + y],
//     ]

// }