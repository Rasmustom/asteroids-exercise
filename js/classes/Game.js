import Canvas from '../utility/Canvas.js';
import MovingObject from './MovingObject.js';
import Ship from './ship.js';

const MIN_ASTEROIDS = 10;
const CANVAS_SIZE = 500;

export default class Game {
    constructor() {
        this.asteroids = [];

        this.ship = new Ship({ x: 250, y: 250 }, { x: 0, y: 0 }, 1);
    }

    move() {
        this.asteroids.forEach((asteroid) => asteroid.move());
        this.ship.move();
    }

    draw() {
        this.asteroids.forEach((asteroid) => asteroid.draw());
        this.ship.draw();
    }

    tick = () => {
        Canvas.clear();
        // console.log(this);
        if (this.asteroids.length > 0) {
            console.log(this.asteroids.length);
        }
        this.move();
        this.draw();
        this.removeOutOfBounds();
        this.repopulateAsteroids();
        requestAnimationFrame(this.tick);
    };

    start() {}

    removeOutOfBounds() {
        this.asteroids = this.asteroids.filter((asteroid) => !asteroid.isOutOfBounds());
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
        const randFullCoords = this.getRandCoordinates();
        const randVel = this.getRandVelocity(randFullCoords);

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
        // Need to change in the future, does not work correctly with 0,0, 500,500, 0,500 or 500,0 coords

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
}
