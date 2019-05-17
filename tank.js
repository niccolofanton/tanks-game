class Tank {

    angle = 0;
    acceleration = 0;
    angular_acceleration = 0;
    tank_width = 100;
    tank_height = 50;

    acceleration_frame = 0.1;
    angular_acceleration_frame = 0.005;
    max_speed = 6;
    max_angular_speed = 0.05;

    x = 50;
    y = 25;
    img = null;
    destroyed = false;

    bullets = []
    max_bullets = 4

    world_structures = []
    ctx = null;
    field_heigth = 0
    filed_width = 0

    constructor(world_structures, ctx, field_heigth, filed_width) {
        this.world_structures = world_structures;
        this.ctx = ctx;
        var _img = new Image();
        _img.src = 'tank.png';
        this.img = _img
        this.field_heigth = field_heigth;
        this.filed_width = filed_width;

        this.draw();
    }

    accelerate() {
        if (this.acceleration < this.max_speed)
            this.acceleration += this.acceleration_frame;
    }

    decelerate() {
        if (this.acceleration > -this.max_speed)
            this.acceleration -= this.acceleration_frame;
    }

    idleAcceleration() {        
        if (Math.abs(this.acceleration) <= 0.1) this.acceleration = 0
        else if (this.acceleration < 0) this.acceleration += 0.1;
        else if (this.acceleration > 0) this.acceleration -= 0.1;
    }

    turnRight() {
        if (this.angular_acceleration < this.max_angular_speed)
            this.angular_acceleration += this.angular_acceleration_frame
    }

    turnLeft() {
        if (this.angular_acceleration > -this.max_angular_speed)
            this.angular_acceleration -= this.angular_acceleration_frame
    }

    idleRotation() {        
        if (Math.abs(this.angular_acceleration) <= 0.005) this.angular_acceleration = 0
        else if (this.angular_acceleration < 0) this.angular_acceleration += 0.005;
        else if (this.angular_acceleration > 0) this.angular_acceleration -= 0.005;
    }

    move() {

        var crashed = false;
        var vertex = this.get_tank_vertex(this.x, this.y, this.angle);

        this.world_structures.forEach((item) => {
            vertex.forEach(point => {
                if (this.checkCollisionWithStructure(point[0], point[1], item.x, item.y, item.w, item.h))
                    crashed = true;
            })
        })

        if (this.x >= this.filed_width) {
            this.x = this.filed_width - 1;
            this.crashed = true;
        }
        if (this.x <= 0) {
            this.x = 1;
            this.crashed = true;
        }
        if (this.y >= this.field_heigth) {
            this.y = this.field_heigth - 1;
            this.crashed = true;
        }
        if (this.y <= 0) {
            this.y = 1;
            this.crashed = true;
        }

        if (crashed) {
            this.acceleration = 0;
            this.angular_acceleration = 0;

            // this.acceleration = -(this.acceleration / 3);
            // this.angular_acceleration = -(this.angular_acceleration / 3);
        }

        // if (this.angle > toRads(360)) this.angle = 0
        // if (this.angle < 0) this.angle = toRads(360) + this.angle;

        this.angle += this.angular_acceleration;
        this.x += this.acceleration * Math.cos(this.angle);
        this.y += this.acceleration * Math.sin(this.angle);

        // TODO: remove GOD mode
        // if (!this.destroyed) 
        this.draw()

    }

    checkCollisionWithStructure(x, y, item_x, item_y, w, h) {
        if (
            x >= item_x && x <= item_x + w &&
            y >= item_y && y <= item_y + h
        ) {

            // this.ctx.fillStyle = "yellow";
            // this.ctx.fillRect(this.x, y, Math.abs(x - this.x), 80);

            var dif_a = Math.abs(x - item_x)
            var dif_b = Math.abs(x - (item_x + w))
            var dif_c = Math.abs(y - item_y)
            var dif_d = Math.abs(y - (item_y + h))

            const arr = [Math.abs(x - item_x), Math.abs(x - (item_x + w)), Math.abs(y - item_y), Math.abs(y - (item_y + h))]
            var lato = arr.indexOf(Math.min(...arr))


            // console.log(lato);

            if (lato == 0) this.x = item_x - Math.abs(x - this.x) - 2;
            if (lato == 1) this.x = Math.abs(x - this.x) + item_x + w + 2;
            if (lato == 2) {
                // console.log(Math.abs(y - this.y));

                console.table({
                    impact: Math.round(y),
                    center: Math.round(this.y)
                });


                this.y = item_y - Math.abs(y - this.y) - 2
            }
            if (lato == 3) this.y = item_y + h + Math.abs(y - this.y) + 2;


            // if (y >= item_y && y <= item_y + Math.sin(this.angle) || y >= item_y + h - Math.sin(this.angle) && y <= item_y) {

            //     if (y >= item_y && y <= item_y + Math.sin(this.angle))
            //         this.y = item_y - Math.abs(y - this.y) - 2;
            //     else
            //         this.y = Math.abs(y - this.y) + item_y + h + 2;


            // } else {


            //     if (x >= item_x && x <= item_x + Math.cos(this.angle))
            //         this.x = item_x - Math.abs(x - this.x) - 2;
            //     else
            //         this.x = Math.abs(x - this.x) + item_x + w + 2;


            // }






            // if (Math.abs(x - item_x) < Math.abs(x - item_x + w))
            //     this.x = item_x - 1 - (this.tank_width/2);
            // else this.x = item_x + w + 1 + (this.tank_width/2);;

            // if (Math.abs(y - item_y) < Math.abs(y - item_y + h))
            //     this.y = item_y - 1 - (this.tank_height/2);
            // else this.y = item_y + h + 1 + (this.tank_height/2);

            return true
        }
    }

    get_tank_vertex() {

        var tempX_1 = (this.x - (this.tank_width / 2)) - this.x;
        var tempX_2 = (this.x + ((this.tank_width - 50) / 2)) - this.x;
        var tempY_1 = (this.y - (this.tank_height / 2)) - this.y;
        var tempY_2 = (this.y + (this.tank_height / 2)) - this.y;
        var sin = Math.sin(this.angle)
        var cos = Math.cos(this.angle)
        var xc1 = tempX_1 * cos
        var xc2 = tempX_2 * cos
        var ys1 = tempY_1 * sin
        var ys2 = tempY_2 * sin
        var xs1 = tempX_1 * sin
        var xs2 = tempX_2 * sin
        var yc1 = tempY_1 * cos
        var yc2 = tempY_2 * cos


        var points = [
            [xc1 - ys1 + this.x, xs1 + yc1 + this.y],
            [xc2 - ys1 + this.x, xs2 + yc1 + this.y],
            [xc2 - ys2 + this.x, xs2 + yc2 + this.y],
            [xc1 - ys2 + this.x, xs1 + yc2 + this.y]
        ]

        var perimeter = [];

        for (let i = 0; i < points.length; i++) {
            var point_a = points[i];
            var point_b = points[i == points.length - 1 ? 0 : i + 1]

            if (point_a[0] > point_b[0]) {
                var memory = point_a;
                point_a = point_b
                point_b = memory
            }

            var xd = point_b[0] - point_a[0];
            var yd = point_b[1] - point_a[1];
            var dist = Math.sqrt(xd * xd + yd * yd);

            for (let i = 0; i < dist; i = i + 2.5) {
                perimeter.push(this.Get_coordinates_between_two_points(point_a, xd, yd, dist, i))
            }

        }

        return perimeter

    }

    Get_coordinates_between_two_points(p, xd, yd, d, i) {
        const fractionOfTotal = i / d;

        // this.ctx.fillStyle = "yellow";
        // this.ctx.fillRect(p[0] + xd * fractionOfTotal, p[1] + yd * fractionOfTotal, 1, 1);

        return [p[0] + xd * fractionOfTotal, p[1] + yd * fractionOfTotal]

    }


    draw() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(this.angle);
        this.ctx.drawImage(this.img, -(this.tank_width / 2), -(this.tank_height / 2), this.tank_width, this.tank_height);
        this.ctx.restore();


        for (let i = 0; i < this.bullets.length; i++) {
            const bullet = this.bullets[i];
            if (!bullet.move()) this.bullets.splice(i, 1)
            else if (this.checkCollisionWithBullet(bullet.x, bullet.y, this.x, this.y, this.angle, this.tank_width, this.tank_height, true)) {
                this.destroyed = true;
            }
        }


    }

    checkCollisionWithBullet(collision_x, collision_y, x, y, r, w, h, tank_hack) {

        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(r);
        var objectInversMatrix = this.ctx.getTransform().invertSelf();
        this.ctx.restore()

        var collision_point = new DOMPoint(collision_x, collision_y);
        var relative_collision_point = objectInversMatrix.transformPoint(collision_point)

        if (tank_hack) {
            if (relative_collision_point.x > -(w / 2) &&
                relative_collision_point.x < ((w - 50) / 2) &&
                relative_collision_point.y > -(h / 2) &&
                relative_collision_point.y < (h / 2)) {
                return true
            } else return false
        } else {
            if (relative_collision_point.x > -(w / 2) &&
                relative_collision_point.x < ((w) / 2) &&
                relative_collision_point.y > -(h / 2) &&
                relative_collision_point.y < (h / 2)) {
                return true
            } else return false
        }


    }



    shot() {

        if (this.bullets.length < this.max_bullets) {
            var tempX_2 = (this.x + ((this.tank_width) / 2)) - this.x;
            var tempX_3 = (this.x + ((this.tank_width) / 2)) - this.x;
            var tempY_2 = (this.y + (this.tank_height / 2)) - this.y;
            var tempY_3 = (this.y - (this.tank_height / 2)) - this.y;
            var rotatedX_2 = tempX_2 * Math.cos(this.angle) - tempY_2 * Math.sin(this.angle);
            var rotatedX_3 = tempX_3 * Math.cos(this.angle) - tempY_3 * Math.sin(this.angle);
            var rotatedY_2 = tempX_2 * Math.sin(this.angle) + tempY_2 * Math.cos(this.angle);
            var rotatedY_3 = tempX_3 * Math.sin(this.angle) + tempY_3 * Math.cos(this.angle);

            var bullet = new Bullet(this.x + ((rotatedX_2 + rotatedX_3) / 2) + this.acceleration * 2 * Math.cos(this.angle),
                this.y + ((rotatedY_2 + rotatedY_3) / 2) + this.acceleration * 2 * Math.sin(this.angle),
                this.angle, this.ctx, this.world_structures, this.field_heigth, this.filed_width);

            this.bullets.push(bullet)
        }

    }

    toRads(number) {
        return (number * Math.PI) / 180;
    }

}