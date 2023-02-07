import Canvas from 'utility/Canvas.js';
import MovingObject from 'classes/MovingObject.js';
import Ship from 'classes/ship.js';
import Vec2 from './VEc2';
import key from 'keymaster';

const MIN_ASTEROIDS = 10;
const CANVAS_SIZE = 500;

export default class Game {
    constructor() {
        this.asteroids = [];
        this.bullets = [];

        this.ship = new Ship(new Vec2({ x: 250, y: 250 }), new Vec2({ x: 0, y: 0 }), 1);
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
        this.bullets.forEach((bullet) => bullet.draw({ circleRadius: 5, circleColor: 'red' }));
    }

    tick = () => {
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

    start() {}

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

        return new MovingObject(randFullCoords, randVel);
    }

    getRandCoordinates() {
        const randFirstCoord = this.getRandInt(0, CANVAS_SIZE);
        let randFullCoords = { x: 0, y: 0 };
        const randVariant = this.getRandInt(1, 4);
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
            randVel = { x: this.getRandInt(1, 5), y: this.getRandInt(-5, 5, 0) };
        } else if (coords.x === CANVAS_SIZE) {
            randVel = { x: this.getRandInt(-5, -1), y: this.getRandInt(-5, 5, 0) };
        } else if (coords.y === 0) {
            randVel = { x: this.getRandInt(-5, 5, 0), y: this.getRandInt(1, 5) };
        } else {
            randVel = { x: this.getRandInt(-5, 5, 0), y: this.getRandInt(-5, -1) };
        }

        return randVel;
    }

    getRandInt(min, max, excludeVal = undefined) {
        const randInt = Math.floor(Math.random() * (max - min + 1) + min);
        return randInt === excludeVal ? this.getRandInt(min, max, excludeVal) : randInt;
    }

    bindHandlers() {
        if (key.isPressed('space')) {
            this.bullets = [...this.bullets, this.ship.shoot()];
        } else {
            return { x: 0, y: 0 };
        }
    }

    checkCollisions() {
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
        this.bullets = this.bullets.filter((bullet) => !bullet.getCollision());
        this.asteroids = this.asteroids.filter((asteroid) => !asteroid.getCollision());
    }
}
