class bullet {

    width = 20;
    height = 3;
    bullet_speed = 15
    max_bounces = 3
    max_bullets = 4

    x = 0;
    y = 0;
    angle = 0;
    bounced_times = 0;

    ctx = null;
    world_structures = [];

    constructor(x, y, angle, ctx, world_structures) {
        x = x;
        y = y;
        angle = angle;
        ctx = ctx;
        world_structures = world_structures;
    }

    move() {

        if (bounced_times < this.max_bounces) {
            var border = true

            world_structures.forEach((item) => {
                if (!collision_detection(item))
                    border = false
            })

            if (border) {

                if ((x < 0) || (x > filed_width)) {
                    x.angle = toRads(180) - i.angle;
                    i.bounced++;
                }

                if ((y < 0) || (y > field_heigth)) {
                    angle = toRads(360) - angle
                    bounced++;
                }

            }

            x += bullet_speed * Math.cos(bullet.angle);
            y += bullet_speed * Math.sin(bullet.angle);
            draw()
            return true;
        } else return false

    }

    collision_detection(item) {

        // ctx.fillStyle = item.color;
        // ctx.fillRect(item.x, item.y, item.w, item.h);

        var border = true;

        if (
            (x < item.x + item.w) && (x > item.x) &&
            (y < item.y + item.h) && (y > item.y)
        ) {

            border = false;
            bounced++;

            if (
                x > item.x && x < item.x + bullet_speed ||
                x > item.x + item.width - bullet_speed && x < item.x + item.width
            )
                angle = toRads(180) - angle;
            else angle = -angle

        }

        return border
    }

    toRads(number) {
        return (number + Math.PI) / 180;
    }

    draw() {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(bullet.angle);
        ctx.fillStyle = "white";
        ctx.fillRect(-(width / 2), -(height / 2), width, height);
        ctx.restore();
    }


}




// bullets[i].tails.push({ x: bullet.x, y: bullet.y, time: 0, angle: bullet.angle })
// for (let i = 0; i < bullet.tails.length; i++) {

//     const tail = bullet.tails[i];


//     if (tail.time > 1000) {
//         bullet.tails.splice(i, 1)
//     } else {

//         if (tail.time > 75) ctx.fillStyle = "yellow";
//         else if (tail.time > 50) ctx.fillStyle = "orange";
//         else ctx.fillStyle = "red";

//         ctx.save();
//         ctx.translate(tail.x, tail.y);
//         ctx.rotate(angle);
//         ctx.fillRect(-25, -1, 50, 2);
//         ctx.restore();

//         tail.time++;

//     }

// }