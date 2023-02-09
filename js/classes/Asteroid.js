import Game, { MAX_ASTEROID_SPEED } from './Game.js';
import MovingObject from './MovingObject.js';

export default class Asteroid extends MovingObject {
    constructor({ pos, vel, radius, color, generation = 1 }) {
        super(pos, vel, radius, color);

        this.generation = generation;
    }

    move() {
        this.pos = this.pos.add(this.vel);

        this.wrap();
    }

    handleCollision() {
        if (this.collision) {
            const subAsteroids = [];
            if (this.generation < 3) {
                for (let i = 0; i < 3; i++) {
                    const randVel = {
                        x: Game.getRandInt(-MAX_ASTEROID_SPEED, MAX_ASTEROID_SPEED, 0),
                        y: Game.getRandInt(-MAX_ASTEROID_SPEED, MAX_ASTEROID_SPEED, 0),
                    };
                    subAsteroids.push(
                        new Asteroid({
                            pos: this.pos,
                            vel: randVel,
                            radius: this.radius / 2,
                            color: this.color,
                            generation: this.generation + 1,
                        })
                    );
                }
            }
            return subAsteroids;
        }
        return undefined;
    }
}
