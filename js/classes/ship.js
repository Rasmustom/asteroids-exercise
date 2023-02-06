import Canvas from '../utility/Canvas.js';
import MovingObject from './MovingObject.js';

export default class Ship extends MovingObject {
    constructor(pos = { x: 0, y: 0 }, vel = { x: 1, y: 1 }, direction) {
        super(pos, vel);
        this.direction = direction;
        this.color = 'blue';
    }

    draw() {
        Canvas.drawCircle({ x: this.pos.x, y: this.pos.y, radius: 20, color: this.color });
        Canvas.drawCircle({ x: this.pos.x + 20, y: this.pos.y, radius: 10, color: this.color });
    }
}
