import Canvas from 'utility/Canvas.js';
import MovingObject from 'classes/MovingObject.js';
import Ship from 'classes/ship.js';
import Vec2 from './Vec2.js';
import key from 'keymaster';
import Asteroid from './Asteroid.js';
import _ from 'lodash';

const MIN_ASTEROIDS = 5;
export const CANVAS_SIZE = document.querySelector('#canvas-stage').width;
export const MAX_ASTEROID_SPEED = 1;

export default class Game {
    constructor() {
        const self = this;
        this.startButton = document.querySelector('#start-button');
        this.startButton.addEventListener('click', function (e) {
            self.start();
        });
        document.addEventListener('keydown', function (e) {
            if (!self.running) {
                e.preventDefault();
                if (e.code === 'Enter') {
                    self.start();
                }
            }
        });
    }

    move() {
        this.asteroids.forEach((asteroid) => asteroid.move());
        this.ship.move();
        this.bullets.forEach((bullet) => bullet.move());
    }

    draw() {
        this.asteroids.forEach((asteroid) => asteroid.draw());
        this.ship.draw();
        this.bullets.forEach((bullet) => bullet.draw());
    }

    tick = () => {
        if (!this.running) return;
        Canvas.clear();
        Canvas.drawScore(this.score);
        Canvas.drawLivesLeft(this.lives);

        this.move();
        this.draw();
        this.removeOutOfBounds();
        this.repopulateAsteroids();
        this.handleBullets();

        this.checkCollisions();
        this.handleCollisions();
        requestAnimationFrame(this.tick);
    };

    removeOutOfBounds() {
        this.asteroids = this.asteroids.filter((asteroid) => !asteroid.isOutOfBounds());
        this.bullets = this.bullets.filter((bullet) => !bullet.isOutOfBounds());
    }

    repopulateAsteroids() {
        const newAsteroids = Array.from({ length: MIN_ASTEROIDS - this.asteroids.length }, () =>
            Asteroid.addRandomAsteroid()
        );
        this.asteroids = [...this.asteroids, ...newAsteroids];
    }

    handleBullets() {
        const shoot = this.ship.shoot();
        if (shoot) this.bullets.push(shoot);
    }

    checkCollisions() {
        if (!this.ship.invulnerable) {
            for (const asteroid of this.asteroids) {
                if (asteroid.isCollidedWith(this.ship)) {
                    this.ship.setCollision(true);
                    return;
                }
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
            this.lives -= 1;
            if (this.lives === 0) {
                this.stop();
            } else {
                this.spawnShip(true);
            }
        }
        this.bullets = this.bullets.filter((bullet) => !bullet.handleCollision());
        // this.asteroids = this.asteroids.filter((asteroid) => !asteroid.getCollision());

        const notFlatAsteroids = this.asteroids.map(function (asteroid) {
            const asteroidCollision = asteroid.handleCollision();
            return asteroidCollision ? asteroidCollision : asteroid;
        });
        this.handleScore(notFlatAsteroids);
        this.asteroids = _.flatten(notFlatAsteroids);
        // this.asteroids = notFlatAsteroids.flatMap((asteroid) => asteroid);
    }

    handleScore(asteroids) {
        //array length is almost always 0 or 1. Can be higher if two asteroids get hit in the same tick
        const destroyedAsteroids = asteroids.filter((asteroid) => Array.isArray(asteroid));
        destroyedAsteroids.forEach((asteroid) => {
            if (asteroid.length === 0) {
                this.score += 100;
            } else if (asteroid[0].generation === 2) {
                this.score += 50;
            } else {
                this.score += 20;
            }
        });
    }

    spawnShip(isInvulnerable) {
        this.ship = new Ship({
            pos: new Vec2({ x: 250, y: 250 }),
            vel: new Vec2({ x: 0, y: 0 }),
            radius: 20,
            color: 'blue',
            direction: 0,
            invulnerable: isInvulnerable,
        });
    }

    start() {
        this.startButton.style.display = 'none';
        this.running = true;
        this.score = 0;
        this.asteroids = [];
        this.bullets = [];
        this.spawnShip(false);
        this.lives = 3;

        this.tick();
    }

    stop() {
        this.startButton.innerText = 'Try again';
        this.startButton.style.display = '';
        this.running = false;
    }
}
