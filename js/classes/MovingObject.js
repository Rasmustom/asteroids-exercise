import Canvas from 'utility/Canvas.js';
import Vec2 from './VEc2';

export default class MovingObject {
    constructor(pos = new Vec2({ x: 0, y: 0 }), vel = new Vec2({ x: 1, y: 1 })) {
        this.pos = pos;
        this.vel = vel;
    }

    move() {
        this.pos = this.pos.add(this.vel);
        // this.pos.x = this.pos.x + this.vel.x;
        // this.pos.y = this.pos.y + this.vel.y;
        // console.log(this.pos);
    }

    draw() {
        Canvas.drawCircle({ x: this.pos.x, y: this.pos.y, radius: 20 });
    }

    isOutOfBounds() {
        return this.pos.x < 0 || this.pos.x > 500 || this.pos.y < 0 || this.pos.y > 500;
    }
}
