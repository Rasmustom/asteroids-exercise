import Canvas from '../utility/Canvas.js';
import MovingObject from './MovingObject.js';

export default class Game {
    constructor() {
        this.asteroids = [
            MovingObject.createRandom(),
            MovingObject.createRandom(),
            MovingObject.createRandom(),
            MovingObject.createRandom(),
        ];
    }

    move() {
        this.asteroids.forEach((asteroid) => asteroid.move());
    }

    draw() {
        this.asteroids.forEach((asteroid) => asteroid.draw());
    }

    tick = () => {
        Canvas.clear();
        console.log(this);
        this.move();
        this.draw();
        requestAnimationFrame(this.tick);
    };

    start() {}
}
