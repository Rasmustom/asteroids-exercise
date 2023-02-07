import Canvas from 'utility/Canvas.js';
import MovingObject from 'classes/MovingObject.js';
import key from 'keymaster';
import Game from './Game';
import Vec2 from './VEc2';

const MAX_VELOCITY = 7;
const TURNING_SPEED = 0.2;
const CANVAS_SIZE = 500;

export default class Ship extends MovingObject {
    constructor(pos = new Vec2({ x: 0, y: 0 }), vel = new Vec2({ x: 1, y: 1 }), direction) {
        super(pos, vel);
        this.direction = 0;
        this.color = 'blue';
    }

    draw() {
        Canvas.drawCircle({ x: this.pos.x, y: this.pos.y, radius: 20, color: this.color });
        Canvas.drawCircle({
            x: this.pos.x + Math.cos(this.direction) * 20,
            y: this.pos.y + Math.sin(this.direction) * 20,
            radius: 10,
            color: this.color,
        });
    }

    move() {
        // this.pos.x = this.pos.x + this.vel.x;
        // this.pos.y = this.pos.y + this.vel.y;
        this.pos = this.pos.add(this.vel);

        // console.log(this.pos);
        if (key.isPressed('left')) {
            this.direction = (this.direction + 2 * Math.PI - 0.1) % (2 * Math.PI);
        } else if (key.isPressed('right')) {
            this.direction = (this.direction + 2 * Math.PI + 0.1) % (2 * Math.PI);
        }

        const acc = this.getAcceleration();
        let addedAcc = { x: 0, y: 0 };
        // if (Math.abs(this.vel.x + acc.x) < MAX_VELOCITY) this.vel.x = this.vel.x + acc.x;
        // if (Math.abs(this.vel.y + acc.y) < MAX_VELOCITY) this.vel.y = this.vel.y + acc.y;
        if (Math.abs(this.vel.x + acc.x) < MAX_VELOCITY) addedAcc.x = acc.x;
        if (Math.abs(this.vel.y + acc.y) < MAX_VELOCITY) addedAcc.y = acc.y;

        this.vel = this.vel.add(addedAcc);

        this.wrap();
        // console.log(this.vel);
    }

    getAcceleration() {
        if (key.isPressed('up')) {
            return {
                x: Math.cos(this.direction) * TURNING_SPEED,
                y: Math.sin(this.direction) * TURNING_SPEED,
            };
        } else {
            return { x: 0, y: 0 };
        }
    }

    outOfBoundsDirection() {
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
        const oob = this.outOfBoundsDirection();
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
}
