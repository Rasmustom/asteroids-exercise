import Canvas from '../utility/Canvas.js';

export default class MovingObject {
    constructor(pos = { x: 0, y: 0 }, vel = { x: 1, y: 1 }) {
        this.pos = pos;
        this.vel = vel;
    }

    move() {
        this.pos.x = this.pos.x + this.vel.x;
        this.pos.y = this.pos.y + this.vel.y;
    }

    draw() {
        Canvas.drawCircle({ x: this.pos.x, y: this.pos.y, radius: 20 });
    }
}
