import Canvas from 'utility/Canvas.js';
import MovingObject from 'classes/MovingObject.js';
import Ship from 'classes/ship.js';
import Vec2 from './Vec2.js';
import key from 'keymaster';
import Asteroid from './Asteroid.js';
import _ from 'lodash';

const MIN_ASTEROIDS = 5;
const CANVAS_SIZE = 500;
export const MAX_ASTEROID_SPEED = 2;

export default class Game {
    constructor() {
        this.asteroids = [];
        this.bullets = [];

        this.ship = new Ship({
            pos: new Vec2({ x: 250, y: 250 }),
            vel: new Vec2({ x: 0, y: 0 }),
            radius: 20,
            color: 'blue',
            direction: 0,
        });
        this.start();
    }

    move() {
        this.asteroids.forEach((asteroid) => asteroid.move());
        this.ship.move();
        this.bullets.forEach((bullet) => bullet.move());
    }

    draw() {
        this.asteroids.forEach((asteroid) => asteroid.draw());
        // this.asteroids.forEach((asteroid) => console.log(asteroid.getCollision()));
        this.ship.draw();
        this.bullets.forEach((bullet) => bullet.draw());
    }

    tick = () => {
        if (!this.running) return;
        Canvas.clear();
        this.move();
        this.draw();
        this.removeOutOfBounds();
        this.repopulateAsteroids();
        this.bindHandlers();

        this.checkCollisions();
        this.handleCollisions();
        requestAnimationFrame(this.tick);
    };

    removeOutOfBounds() {
        this.asteroids = this.asteroids.filter((asteroid) => !asteroid.isOutOfBounds());
        this.bullets = this.bullets.filter((bullet) => !bullet.isOutOfBounds());
    }

    repopulateAsteroids() {
        // if (this.asteroids.length < MIN_ASTEROIDS) {
        const newAsteroids = Array.from({ length: MIN_ASTEROIDS - this.asteroids.length }, () =>
            this.asteroidFactory()
        );
        this.asteroids = [...this.asteroids, ...newAsteroids];
        // }
    }

    asteroidFactory() {
        const randFullCoords = new Vec2(this.getRandCoordinates());
        const randVel = new Vec2(this.getRandVelocity(randFullCoords));

        return new Asteroid({ pos: randFullCoords, vel: randVel, radius: 20, color: 'white' });
        // return new MovingObject(randFullCoords, randVel);
    }

    getRandCoordinates() {
        const randFirstCoord = Game.getRandInt(0, CANVAS_SIZE);
        let randFullCoords = { x: 0, y: 0 };
        const randVariant = Game.getRandInt(1, 4);
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

    getRandVelocity(coords) {
        // Possibly need to change in the future, does not work correctly in very rare cases with 0,0, 500,500, 0,500 or 500,0 coords

        let randVel = { x: 0, y: 0 };
        if (coords.x === 0) {
            randVel = {
                x: Game.getRandInt(1, MAX_ASTEROID_SPEED),
                y: Game.getRandInt(-MAX_ASTEROID_SPEED, MAX_ASTEROID_SPEED, 0),
            };
        } else if (coords.x === CANVAS_SIZE) {
            randVel = {
                x: Game.getRandInt(-MAX_ASTEROID_SPEED, -1),
                y: Game.getRandInt(-MAX_ASTEROID_SPEED, MAX_ASTEROID_SPEED, 0),
            };
        } else if (coords.y === 0) {
            randVel = {
                x: Game.getRandInt(-MAX_ASTEROID_SPEED, MAX_ASTEROID_SPEED, 0),
                y: Game.getRandInt(1, MAX_ASTEROID_SPEED),
            };
        } else {
            randVel = {
                x: Game.getRandInt(-MAX_ASTEROID_SPEED, MAX_ASTEROID_SPEED, 0),
                y: Game.getRandInt(-MAX_ASTEROID_SPEED, -1),
            };
        }

        return randVel;
    }

    static getRandInt(min, max, excludeVal = undefined) {
        const randInt = Math.floor(Math.random() * (max - min + 1) + min);
        return randInt === excludeVal ? Game.getRandInt(min, max, excludeVal) : randInt;
    }

    bindHandlers() {
        if (key.isPressed('space')) {
            this.bullets = [...this.bullets, this.ship.shoot()];
        } else {
            return { x: 0, y: 0 };
        }
    }

    checkCollisions() {
        // console.log(this.ship.pos);
        for (const asteroid of this.asteroids) {
            if (asteroid.isCollidedWith(this.ship)) {
                this.ship.setCollision(true);
                return;
            }
        }

        for (const bullet of this.bullets) {
            for (const asteroid of this.asteroids) {
                if (bullet.isCollidedWith(asteroid)) {
                    bullet.setCollision(true);
                    asteroid.setCollision(true);
                    break;
                }
            }
        }
    }

    handleCollisions() {
        if (this.ship.getCollision()) {
            this.stop();
        }
        this.bullets = this.bullets.filter((bullet) => !bullet.handleCollision());
        // this.asteroids = this.asteroids.filter((asteroid) => !asteroid.getCollision());

        const notFlatAsteroids = this.asteroids.map(function (asteroid) {
            const asteroidCollision = asteroid.handleCollision();
            return asteroidCollision ? asteroidCollision : asteroid;
        });
        this.asteroids = _.flatten(notFlatAsteroids);
        // this.asteroids = notFlatAsteroids.flatMap((asteroid) => asteroid);
    }

    start() {
        this.running = true;
        this.tick();
    }

    stop() {
        this.running = false;
    }
}
