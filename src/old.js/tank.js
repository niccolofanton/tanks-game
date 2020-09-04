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
    max_bullets = 1

    world_structures = []
    ctx = null;
    field_heigth = 0
    filed_width = 0
    enemy = false;

    constructor(world_structures, ctx, field_heigth, filed_width, x, y, enemy) {
        this.world_structures = world_structures;
        this.ctx = ctx;
        let _img = new Image();
        this.enemy = enemy;
        if (enemy) _img.src = 'red_tank.png';
        else _img.src = 'white_tank.png';

        this.img = _img
        this.field_heigth = field_heigth;
        this.filed_width = filed_width;

        this.x = x;
        this.y = y;

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

        if (this.angle > this.toRads(360)) this.angle = 0
        if (this.angle < 0) this.angle = this.toRads(360) + this.angle;

        this.angle += this.angular_acceleration;
        this.x += this.acceleration * Math.cos(this.angle);
        this.y += this.acceleration * Math.sin(this.angle);

        // TODO: remove GOD mode
        if (!this.destroyed)

            this.draw()
    }

    getPerimeterPoints() {

        let tempX_1 = (this.x - (this.tank_width / 2)) - this.x;
        let tempX_2 = (this.x + ((this.tank_width - 40) / 2)) - this.x;
        let tempY_1 = (this.y - (this.tank_height / 2)) - this.y;
        let tempY_2 = (this.y + (this.tank_height / 2)) - this.y;
        let sin = Math.sin(this.angle)
        let cos = Math.cos(this.angle)
        let xc1 = tempX_1 * cos
        let xc2 = tempX_2 * cos
        let ys1 = tempY_1 * sin
        let ys2 = tempY_2 * sin
        let xs1 = tempX_1 * sin
        let xs2 = tempX_2 * sin
        let yc1 = tempY_1 * cos
        let yc2 = tempY_2 * cos


        let points = [{
                x: xc1 - ys1 + this.x,
                y: xs1 + yc1 + this.y
            },
            {
                x: xc2 - ys1 + this.x,
                y: xs2 + yc1 + this.y
            },
            {
                x: xc2 - ys2 + this.x,
                y: xs2 + yc2 + this.y
            },
            {
                x: xc1 - ys2 + this.x,
                y: xs1 + yc2 + this.y
            }
        ]

        let perimeter = [];

        for (let i = 0; i < points.length; i++) {
            let point_a = points[i];
            let point_b = points[i == points.length - 1 ? 0 : i + 1]
            perimeter = perimeter.concat(this.getPointsBetween(point_a, point_b))
        }


        return perimeter

    }

    getPointsBetween(pointA, pointB) {

        let points = []
        let xd = pointB.x - pointA.x;
        let yd = pointB.y - pointA.y;
        let dist = Math.sqrt(xd * xd + yd * yd);

        for (let i = 0; i < dist; i = i + 2.5) {
            const fractionOfTotal = i / dist;

            // this.ctx.fillStyle = "red";
            // this.ctx.fillRect(pointA[0] + xd * fractionOfTotal, pointA[1] + yd * fractionOfTotal, 2, 2);

            points.push({
                x: pointA.x + xd * fractionOfTotal,
                y: pointA.y + yd * fractionOfTotal
            })
        }

        return points;

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
        }
    }


    shot() {

        if (this.bullets.length < this.max_bullets) {
            let tempX_2 = (this.x + ((this.tank_width) / 2)) - this.x;
            let tempX_3 = (this.x + ((this.tank_width) / 2)) - this.x;
            let tempY_2 = (this.y + (this.tank_height / 2)) - this.y;
            let tempY_3 = (this.y - (this.tank_height / 2)) - this.y;
            let rotatedX_2 = tempX_2 * Math.cos(this.angle) - tempY_2 * Math.sin(this.angle);
            let rotatedX_3 = tempX_3 * Math.cos(this.angle) - tempY_3 * Math.sin(this.angle);
            let rotatedY_2 = tempX_2 * Math.sin(this.angle) + tempY_2 * Math.cos(this.angle);
            let rotatedY_3 = tempX_3 * Math.sin(this.angle) + tempY_3 * Math.cos(this.angle);

            let bullet = new Bullet(this.x + ((rotatedX_2 + rotatedX_3) / 2) + this.acceleration * 2 * Math.cos(this.angle),
                this.y + ((rotatedY_2 + rotatedY_3) / 2) + this.acceleration * 2 * Math.sin(this.angle),
                this.angle, this.ctx, this.world_structures, this.field_heigth, this.filed_width);

            this.bullets.push(bullet)
        }

    }

    toRads(number) {
        return (number * Math.PI) / 180;
    }

}