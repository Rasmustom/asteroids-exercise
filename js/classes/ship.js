import Canvas from 'utility/Canvas.js';
import MovingObject from 'classes/MovingObject.js';
import key from 'keymaster';

export default class Ship extends MovingObject {
    constructor(pos = { x: 0, y: 0 }, vel = { x: 1, y: 1 }, direction) {
        super(pos, vel);
        this.direction = 0;
        this.color = 'blue';
    }

    draw() {
        Canvas.drawCircle({ x: this.pos.x, y: this.pos.y, radius: 20, color: this.color });
        Canvas.drawCircle({ x: this.pos.x + 20, y: this.pos.y, radius: 10, color: this.color });
    }

    move() {
        this.pos.x = this.pos.x + this.vel.x;
        this.pos.y = this.pos.y + this.vel.y;
        // console.log(this.pos);
        if (key.isPressed('left')) {
            this.direction = (this.direction + 2 * Math.PI - 0.1) % (2 * Math.PI);
        } else if (key.isPressed('right')) {
            this.direction = (this.direction + 2 * Math.PI + 0.1) % (2 * Math.PI);
        }

        console.log(this.direction);

        this.getAcceleration();

        // console.log(key.getPressedKeyCodes());
    }

    getAcceleration() {
        if (key.isPressed('up')) {
            this.vel.x = this.vel.x + Math.cos(this.direction) * 0.1;
            this.vel.y = this.vel.y + Math.sin(this.direction) * 0.1;
            // console.log(this.vel);
        } else {
            return { x: 0, y: 0 };
        }
    }
}
