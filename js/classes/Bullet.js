import MovingObject from 'classes/MovingObject.js';

export default class Bullet extends MovingObject {
    constructor({ pos, vel, radius, color }) {
        super(...arguments);
    }

    move() {
        this.pos = this.pos.add(this.vel);
        if (!this.hasWrapped) {
            this.wrap();
        }
    }
}
