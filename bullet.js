class Bullet {

    field_heigth = 0
    filed_width = 0
    width = 20;
    height = 3;
    bullet_speed = 15
    max_bounces = 10
    x = 0;
    y = 0;
    angle = 0;
    bounced_times = 0;
    ctx = null;
    world_structures;

    constructor(x, y, angle, ctx, world_structures, field_heigth, filed_width) {
        this.world_structures = world_structures;
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.ctx = ctx;
        this.field_heigth = field_heigth;
        this.filed_width = filed_width;
    }

    move() {

        var already_collided = false;

        this.world_structures.forEach((item) => {
            if (this.collision_detection(item)) {
                this.bounced_times++;
                already_collided = true
            }
        })

        if (!already_collided) {

            if ((this.x <= 0) || (this.x >= this.filed_width)) {
                this.x =  this.x < 0 ? 1 : this.filed_width -1;
                this.angle = this.toRads(180) - this.angle;
                this.bounced_times++;
            }

            if ((this.y <= 0) || (this.y >= this.field_heigth)) {
                this.y =  this.y <= 0 ? 1 : this.field_heigth -1;
                this.angle = -this.angle
                this.bounced_times++;
            }

        }

        this.x += this.bullet_speed * Math.cos(this.angle);
        this.y += this.bullet_speed * Math.sin(this.angle);

        if (this.bounced_times < this.max_bounces) {
            this.draw()
            return true;
        } else return false

    }

    collision_detection(item) {

        var collision = false;
        if (
            (this.x >= item.x) && (this.x <= item.x + item.w) &&
            (this.y >= item.y) && (this.y <= item.y + item.h)
        ) {

            collision = true;

            if (this.x >= item.x && this.x <= item.x + Math.abs(this.bullet_speed * Math.cos(this.angle))) {
                this.x = item.x - 1
                this.angle = this.toRads(180) - this.angle;
            }

            if (this.x >= item.x - Math.abs(this.bullet_speed * Math.cos(this.angle)) + item.w && this.x <= item.x + item.w) {
                this.x = item.x + item.w + 1
                this.angle = this.toRads(180) - this.angle;
            }


            if (this.y >= item.y && this.y <= item.y + Math.abs(this.bullet_speed * Math.sin(this.angle))) {
                this.y = item.y - 1
                this.angle = -this.angle
            }

            if (this.y >= item.y - Math.abs(this.bullet_speed * Math.sin(this.angle)) + item.h && this.y <= item.y + item.h) {
                this.y = item.y + item.h + 1
                this.angle = -this.angle
            }

            // if (
            //     this.x >= item.x + Math.abs(this.bullet_speed * Math.cos(this.angle)) ||
            //     this.x <= item.x + item.w - Math.abs(this.bullet_speed * Math.cos(this.angle))
            // )
            //     this.angle = this.toRads(180) - this.angle;
            // else this.angle = -this.angle

        }

        return collision
    }

    toRads(number) {
        return (number * Math.PI) / 180;
    }

    draw() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(this.angle);
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(-this.width, -(this.height / 2), this.width, this.height);
        this.ctx.restore();
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