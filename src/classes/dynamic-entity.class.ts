import { Entity } from './entity.class';
import { Point, getPolygonCentroid, rotatePoint, degreesToRadians } from '../functions/utils';

declare interface Controls {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
}

export declare const RUNNING_STATUS = 1;

export class DynamicEntity extends Entity {
    // movement variables
    speed: number = 0;
    acceleration = 2;
    deceleration = 0.8;
    maxSpeed: number = 10;

    // rotation variables
    angularSpeed: number = 0;
    angularAcceleration = 0.1;
    angularDeceleration =0.4;
    maxAngularSpeed: number = 3;

    // controls
    private controls: Controls = {
        forward: false,
        backward: false,
        left: false,
        right: false,
    }
    // internal status
    private status: number = RUNNING_STATUS;

    constructor(
        identifier: string = '',
        vertices: Point[],
        texture: HTMLImageElement | null = null,
        rotation: number = 0,
        acceleration: number | null = null,
        deceleration: number | null = null,
        angularDeceleration: number | null = null,
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

        if (deceleration !== null) {
            this.deceleration = deceleration;
        }

        if (angularDeceleration !== null) {
            this.angularDeceleration = angularDeceleration;
        }

        window.addEventListener("keydown", (event) => this.handleKeyDownControls(event), true);
        window.addEventListener("keyup", (event) => this.handleKeyUpControls(event), true);


    }

    public getVertices(): Point[] {
        return this.vertices;
    }


    public updateVertices(): Point[] {
        // used to prevent updated when entity is stopped
        if (this.status !== RUNNING_STATUS) {
            return this.vertices;
        }

        // read commands and update movement variables
        this.updateMovement();
        // update vertices array
        this.vertices = this.calcVertices(this.vertices);
        this.edges = this.buildEdges(this.vertices);
        return this.vertices;
    }

    public collisionResolution(e: Entity) {
        // reverse
        this.angularSpeed = -(this.angularSpeed / 2);
        this.rotation += this.angularSpeed;
        this.speed = -(this.speed/2);
        this.updateVertices();

        // this.angularAcceleration = -this.angularAcceleration;
        // this.acceleration = -this.acceleration;

        // console.log('aaaa');

        
        // const predictedVertices = this.calcVertices(this.copyVertices(this.vertices));
        // console.log(predictedVertices);


        // if (!this.collideWith(e, this.buildEdges(predictedVertices))) {
        // }
    }
    
    getPredictedEdges(){
        const predictedVertices = this.calcVertices(this.copyVertices(this.vertices));
        return this.buildEdges(predictedVertices);
    }

    private copyVertices(vertices: Point[]): Point[] {
        const copiedVertices: Point[] = [];
        for (let index = 0; index < vertices.length; index++) {
            const element = vertices[index];
            copiedVertices.push({ x: element.x, y: element.y });
        }
        return copiedVertices;
    }

    /**
     * Calcs vertices by rotation e movement
     */
    private calcVertices(vertices: Point[]): Point[] {
        vertices = this.calcRotatedVertices(vertices);
        vertices = this.calcTranslatedVertices(vertices);
        return vertices;
    }

    /**
     * Calcs rotated vertices
     */
    private calcRotatedVertices(vertices: Point[]): Point[] {
        // get the center
        const center = getPolygonCentroid(vertices);
        // rotate vertices around the center
        return vertices.map(vertex => {
            const point = rotatePoint(vertex, center, this.angularSpeed);
            vertex.x = point.x;
            vertex.y = point.y;
            return vertex;
        });
    }

    /**
     * Calcs translated vertices
     */
    private calcTranslatedVertices(vertices: Point[]): Point[] {
        const rads = degreesToRadians(this.rotation)
        return vertices.map(vertex => {
            vertex.x += this.speed * Math.sin(rads);
            vertex.y -= this.speed * Math.cos(rads);
            return vertex;
        });
    }

    /**
     * Updates movement
     */
    private updateMovement() {
        this.updateAcceleration();
        this.updateRotation();
    }

    /**
     * Updates acceleration
     */
    private updateAcceleration() {
        // accelerate
        if (this.controls.forward && this.speed < this.maxSpeed) {
            this.speed += this.acceleration;
        }
        // decelerate
        if (this.controls.backward && this.speed > -this.maxSpeed) {
            this.speed -= this.acceleration;
        }

        // idle acceleration 
        if (this.controls.forward === false && this.controls.backward === false) {
            if (Math.abs(this.speed) <= this.deceleration) { this.speed = 0 }
            else if (this.speed < 0) { this.speed += this.deceleration }
            else if (this.speed > 0) { this.speed -= this.deceleration }
        }
    }

    /**
     * Updates rotation
     * @param  
     */
    private updateRotation() {

        // console.log(this.controls.right , this.angularAcceleration < this.maxAngularSpeed);

        // rotate right
        if (this.controls.right && this.angularSpeed < this.maxAngularSpeed) {
            this.angularSpeed += this.angularAcceleration;
        }
        // rotate left
        if (this.controls.left && this.angularSpeed > -this.maxAngularSpeed) {
            this.angularSpeed -= this.angularAcceleration;

        }


        // TODO: ICE EFFECT
        // if (this.controls.left || this.controls.right) {
        //     // save total rotation
        //     this.rotation += this.angularSpeed;
        // }



        // if (this.rotation > 360) {
        //     this.rotation = 0;
        // }

        // if (this.rotation < 0) {
        //     this.rotation = 360;
        // }

        // idle angular acceleration
        if (this.controls.right === false && this.controls.left === false) {
            if (Math.abs(this.angularSpeed) <= this.angularDeceleration) { this.angularSpeed = 0 }
            if (this.angularSpeed < 0) { this.angularSpeed += this.angularDeceleration; }
            else if (this.angularSpeed > 0) { this.angularSpeed -= this.angularDeceleration; }
        }

        // save total rotation
        this.rotation += this.angularSpeed;

    }


    private handleKeyDownControls(event: KeyboardEvent) {
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

    private handleKeyUpControls(event: KeyboardEvent) {
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