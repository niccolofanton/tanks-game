class tank {

    angle = 0;
    acceleration = 0;
    angular_acceleration = 0;
    tank_width = 100;
    tank_height = 50;

    acceleration_frame = 0.1;
    angular_acceleration_frame = 0.005;
    max_speed = 6;
    max_angular_speed = 0.05;

    x = 200;
    y = 200;
    img = null;
    destroyed = false;

    bullets = []
    world_structures = []
    ctx = null;

    constructor(world_structures, ctx) {
        world_structures = world_structures
        ctx = ctx
        img = new Image();
        img.src = 'tank.png';

        draw();
    }

    accelerate() {
        if (acceleration < max_speed)
            acceleration += acceleration_frame;
    }

    decelerate() {
        if (acceleration > -max_speed)
            acceleration -= acceleration_frame;
    }

    idleAcceleration() {
        if (acceleration <= 0.6 && acceleration >= -0.6) acceleration = 0
        else if (acceleration < 0) acceleration += 0.5;
        else if (acceleration > 0) acceleration -= 0.5;
    }

    turnRight() {
        if (angular_acceleration < max_angular_speed)
            angular_acceleration += angular_acceleration_frame
    }

    turnLeft() {
        if (angular_acceleration > -max_angular_speed)
            angular_acceleration -= angular_acceleration_frame
    }

    idleRotation() {
        if (angular_acceleration <= 0.06 && angular_acceleration >= -0.06) angular_acceleration = 0
        else if (angular_acceleration < 0) angular_acceleration += 0.02;
        else if (angular_acceleration > 0) angular_acceleration -= 0.02;
    }

    move() {
        angle += angular_acceleration;
        posX += acceleration * Math.cos(angle);
        posY += acceleration * Math.sin(angle);
    }

    draw() {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.drawImage(img, -(tank_width / 2), -(tank_height / 2), tank_width, tank_height);
        ctx.restore();


        for (let i = 0; i < bullets.length; i++) {
            const bullet = bullets[i];
            if (!bullet.move()) bullets.splice(i, 1)
            else if(checkCollisionWithBullet(bullet.x, bullet.y, x, y, angle, tank_width, tank_height, true)){
                destroyed = true;
            }
        }


    }

    checkCollisionWithBullet(collision_x, collision_y, x, y, r, w, h, tank_hack) {

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(r);
        var objectInversMatrix = ctx.getTransform().invertSelf();
        ctx.restore()

        var collision_point = new DOMPoint(collision_x, collision_y);
        var relative_collision_point = objectInversMatrix.transformPoint(collision_point)

        if (tank_hack) {
            if (relative_collision_point.x > - (w / 2)
                && relative_collision_point.x < ((w - 50) / 2)
                && relative_collision_point.y > -(h / 2)
                && relative_collision_point.y < (h / 2)) {
                return true
            } else return false
        } else {
            if (relative_collision_point.x > - (w / 2)
                && relative_collision_point.x < ((w) / 2)
                && relative_collision_point.y > -(h / 2)
                && relative_collision_point.y < (h / 2)) {
                return true
            } else return false
        }


    }



    shot() {

        tempX_2 = (x + ((tank_width) / 2)) - x;
        tempX_3 = (x + ((tank_width) / 2)) - x;
        tempY_2 = (y + (tank_height / 2)) - y;
        tempY_3 = (y - (tank_height / 2)) - y;
        rotatedX_2 = tempX_2 * Math.cos(angle) - tempY_2 * Math.sin(angle);
        rotatedX_3 = tempX_3 * Math.cos(angle) - tempY_3 * Math.sin(angle);
        rotatedY_2 = tempX_2 * Math.sin(angle) + tempY_2 * Math.cos(angle);
        rotatedY_3 = tempX_3 * Math.sin(angle) + tempY_3 * Math.cos(angle);

        var bullet = new Bullet(x + ((rotatedX_2 + rotatedX_3) / 2) + acceleration * 2 * Math.cos(angle),
            y + ((rotatedY_2 + rotatedY_3) / 2) + acceleration * 2 * Math.sin(angle),
            angle, ctx, world_structures);

        bullets.push(bullet)

    }

    toRads(number) {
        return (number + Math.PI) / 180;
    }

}