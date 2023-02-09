import Canvas from 'utility/Canvas.js';
import Game, { CANVAS_SIZE } from './Game.js';
import Vec2 from './Vec2.js';

export default class MovingObject {
    constructor(
        pos = new Vec2({ x: 0, y: 0 }),
        vel = new Vec2({ x: 1, y: 1 }),
        radius = 20,
        color = 'white'
    ) {
        this.pos = pos;
        this.vel = vel;
        this.collision = false;
        this.radius = radius;
        this.color = color;
    }

    move() {
        this.pos = this.pos.add(this.vel);
    }

    draw() {
        // this.radius = circleRadius;
        Canvas.drawCircle({ x: this.pos.x, y: this.pos.y, color: this.color, radius: this.radius });
    }

    isOutOfBounds() {
        return this.pos.x < 0 || this.pos.x > 500 || this.pos.y < 0 || this.pos.y > 500;
    }

    outOfBoundsDirection() {
        console.log(CANVAS_SIZE);
        if (this.pos.x < 0) {
            return 'W';
        } else if (this.pos.x > CANVAS_SIZE) {
            return 'E';
        } else if (this.pos.y < 0) {
            return 'N';
        } else if (this.pos.y > CANVAS_SIZE) {
            return 'S';
        }
    }

    wrap() {
        // console.log('gets here');
        const oob = this.outOfBoundsDirection();
        console.log(oob);
        switch (oob) {
            case 'W':
                this.pos.x = CANVAS_SIZE;
                break;
            case 'E':
                this.pos.x = 0;
                break;
            case 'N':
                this.pos.y = CANVAS_SIZE;
                break;
            case 'S':
                this.pos.y = 0;
                break;
            default:
                break;
        }
    }

    isCollidedWith(otherMovingObject) {
        const distanceBetweenObjects = Vec2.distance(this.pos, otherMovingObject.pos);
        return distanceBetweenObjects < this.radius + otherMovingObject.radius;
    }

    setCollision(collision) {
        this.collision = collision;
    }

    getCollision() {
        return this.collision;
    }

    handleCollision() {
        if (this.collision) return this;
        return undefined;
    }
}
