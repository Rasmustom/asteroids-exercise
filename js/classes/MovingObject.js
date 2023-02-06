import Canvas from '../utility/Canvas.js';

export default class MovingObject {
    constructor(pos = { x: 0, y: 0 }, vel = { x: 1, y: 1 }) {
        this.pos = pos;
        this.vel = vel;
    }

    move() {
        this.pos.x = this.pos.x + this.vel.x;
        this.pos.y = this.pos.y + this.vel.y;
        // console.log(this.pos);
    }

    draw() {
        Canvas.drawCircle({ x: this.pos.x, y: this.pos.y, radius: 20 });
    }

    isOutOfBounds() {
        return this.pos.x < 0 || this.pos.x > 500 || this.pos.y < 0 || this.pos.y > 500;
    }
}
