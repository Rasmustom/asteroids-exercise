import Game, { MAX_ASTEROID_SPEED, CANVAS_SIZE } from './Game.js';
import MovingObject from './MovingObject.js';
import Vec2 from './Vec2.js';
import { getRandFloat, getRandInt } from './helpers.js';

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
        if (!this.collision) {
            return undefined;
        }

        if (this.generation >= 3) {
            return [];
        }

        const subAsteroids = [];
        for (let i = 0; i < 3; i++) {
            const randVel = {
                x: getRandFloat(-MAX_ASTEROID_SPEED, MAX_ASTEROID_SPEED),
                y: getRandFloat(-MAX_ASTEROID_SPEED, MAX_ASTEROID_SPEED),
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
        return subAsteroids;
    }

    static addRandomAsteroid() {
        const randFullCoords = new Vec2(Asteroid.getRandCoordinates());
        const randVel = new Vec2(Asteroid.getRandVelocity(randFullCoords));

        return new Asteroid({ pos: randFullCoords, vel: randVel, radius: 20, color: 'white' });
    }

    static getRandCoordinates() {
        const randFirstCoord = getRandInt(0, CANVAS_SIZE);
        let randFullCoords = { x: 0, y: 0 };
        const randVariant = getRandInt(1, 4);
        switch (randVariant) {
            case 1:
                randFullCoords = { x: 0, y: randFirstCoord };
                break;
            case 2:
                randFullCoords = { x: CANVAS_SIZE, y: randFirstCoord };
                break;
            case 3:
                randFullCoords = { x: randFirstCoord, y: 0 };
                break;
            default:
                randFullCoords = { x: randFirstCoord, y: CANVAS_SIZE };
                break;
        }
        return randFullCoords;
    }

    static getRandVelocity(coords) {
        let randVel = { x: 0, y: 0 };
        if (coords.x === 0) {
            randVel = {
                x: getRandFloat(0, MAX_ASTEROID_SPEED),
                y: getRandFloat(-MAX_ASTEROID_SPEED, MAX_ASTEROID_SPEED),
            };
        } else if (coords.x === CANVAS_SIZE) {
            randVel = {
                x: getRandFloat(-MAX_ASTEROID_SPEED, 0),
                y: getRandFloat(-MAX_ASTEROID_SPEED, MAX_ASTEROID_SPEED),
            };
        } else if (coords.y === 0) {
            randVel = {
                x: getRandFloat(-MAX_ASTEROID_SPEED, MAX_ASTEROID_SPEED),
                y: getRandFloat(0, MAX_ASTEROID_SPEED),
            };
        } else {
            randVel = {
                x: getRandFloat(-MAX_ASTEROID_SPEED, MAX_ASTEROID_SPEED),
                y: getRandFloat(-MAX_ASTEROID_SPEED, 0),
            };
        }

        return randVel;
    }
}
