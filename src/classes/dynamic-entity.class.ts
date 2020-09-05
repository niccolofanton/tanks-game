import { Entity } from './entity.class';
import { Point, getPolygonCentroid, rotatePoint, degreesToRadians } from '../functions/utils';

declare interface Controls {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
}

export class DynamicEntity extends Entity {


    acceleration: number = 1;
    accelerationFrame = 1;
    maxSpeed: number = 6;
    
    
    
    maxAngularSpeed: number = 10;
    angularAcceleration: number = 0;
    angularAccelerationFrame = 2;
    angularDecelerationFrame = 1.2;


    private lastTime: number = 0;
    private controls: Controls = {
        forward: false,
        backward: false,
        left: false,
        right: false,
    }

    constructor(
        identifier: string = '',
        vertices: Point[],
        texture: HTMLImageElement | null = null,
        rotation: number,
        acceleration: number | null = null,
        angularAcceleration: number | null = null,
        maxSpeed: number | null = null,
        maxAngularSpeed: number | null = null,
    ) {
        super(identifier, vertices, texture, rotation);

        if (acceleration !== null) {
            this.acceleration = acceleration;
        }

        if (angularAcceleration !== null) {
            this.angularAcceleration = angularAcceleration;
        }

        if (maxSpeed !== null) {
            this.maxSpeed = maxSpeed;
        }

        if (maxAngularSpeed !== null) {
            this.maxAngularSpeed = maxAngularSpeed;
        }

        window.addEventListener("keydown", (event) => this.keyDownControls(event), true);
        window.addEventListener("keyup", (event) => this.keyUpControls(event), true);
    }

    public updateVertices(time: number): Point[] {

        // update the position by time span
        this.lastTime = time;
        const timeSpan = performance.now() - time;

        this.updatePosition(timeSpan);


        if (this.angularAcceleration !== 0) {

            this.rotation += this.angularAcceleration;

            // get the center
            const center = getPolygonCentroid(this.vertices);
            // rotate vertices around the center
            this.vertices.forEach(vertex => {
                const point = rotatePoint(vertex, center, this.angularAcceleration);
                vertex.x = point.x;
                vertex.y = point.y;
            });
        }

        if(this.acceleration !== 0){
            const rads = degreesToRadians(this.rotation)
            this.vertices.forEach(vertex => {
                vertex.x += this.acceleration * Math.sin(rads); 
                vertex.y -= this.acceleration * Math.cos(rads);
            });
        }

        return this.vertices;
    }


    updatePosition(time: number) {
        // accelerate
        if (this.controls.forward && this.acceleration < this.maxSpeed) {
            this.acceleration += this.accelerationFrame * (time / 1000);
        }
        // decelerate
        if (this.controls.backward && this.acceleration > -this.maxSpeed) {
            this.acceleration -= this.accelerationFrame * (time / 1000);
        }
        // rotate right
        if (this.controls.right && this.angularAcceleration < this.maxAngularSpeed) {
            this.angularAcceleration += this.angularAccelerationFrame * (time / 1000);
        }
        // rotate left
        if (this.controls.left && this.angularAcceleration > -this.maxAngularSpeed) {
            this.angularAcceleration -= this.angularAccelerationFrame * (time / 1000);
        }

        // idle acceleration 
        if (Math.abs(this.acceleration) <= 0.1) { this.acceleration = 0 }
        else if (this.acceleration < 0) { this.acceleration += 0.1 * (time / 1000); }
        else if (this.acceleration > 0) { this.acceleration -= 0.1 * (time / 1000); }



        if (this.controls.right === false && this.controls.left === false) {
            // idle angular acceleration
            if (Math.abs(this.angularAcceleration) <= this.angularDecelerationFrame) { this.angularAcceleration = 0 }
            else if (this.angularAcceleration < 0) { this.angularAcceleration += this.angularDecelerationFrame * (time / 1000); }
            else if (this.angularAcceleration > 0) { this.angularAcceleration -= this.angularDecelerationFrame * (time / 1000); }
        }


    }

    private keyDownControls(event: KeyboardEvent) {
        switch (event.keyCode) {
            case 65:
                this.controls.left = true;
                this.controls.right = false;
                break;
            case 68:
                this.controls.left = false;
                this.controls.right = true;
                break;
            case 87:
                this.controls.forward = true;
                this.controls.backward = false;
                break;
            case 83:
                this.controls.forward = false;
                this.controls.backward = true;
                break;

        }
    }

    private keyUpControls(event: KeyboardEvent) {
        console.log(event.keyCode);

        switch (event.keyCode) {
            case 65:
                this.controls.left = false;
                break;
            case 68:
                this.controls.right = false;
                break;
            case 87:
                this.controls.forward = false;
                break;
            case 83:
                this.controls.backward = false;
                break;
        }
    }

}