import Canvas from '../utility/Canvas.js';

export default class MovingObject {
    constructor(pos = { x: 0, y: 0 }, vel = { x: 1, y: 1 }) {
        this.pos = pos;
        this.vel = vel;
    }

    move() {
        this.pos.x = this.pos.x + this.vel.x;
        this.pos.y = this.pos.y + this.vel.y;
        console.log(this.pos);
    }

    draw() {
        Canvas.drawCircle({ x: this.pos.x, y: this.pos.y, radius: 20 });
    }

    static createRandom() {
        const asd = new MovingObject(
            { x: this.getRandInt(0, 500), y: this.getRandInt(0, 500) },
            { x: this.getRandInt(-5, 5), y: this.getRandInt(-5, 5) }
        );
        console.log(asd.pos, asd.vel);
        return asd;
    }

    static getRandInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
