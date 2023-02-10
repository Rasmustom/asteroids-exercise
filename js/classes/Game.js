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

        // this.start();
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
        const newAsteroids = Array.from({ length: MIN_ASTEROIDS - this.asteroids.length }, () =>
            this.asteroidFactory()
        );
        this.asteroids = [...this.asteroids, ...newAsteroids];
    }

    asteroidFactory() {
        const randFullCoords = new Vec2(this.getRandCoordinates());
        const randVel = new Vec2(this.getRandVelocity(randFullCoords));

        return new Asteroid({ pos: randFullCoords, vel: randVel, radius: 20, color: 'white' });
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
                x: Game.getRandFloat(0, MAX_ASTEROID_SPEED),
                y: Game.getRandFloat(-MAX_ASTEROID_SPEED, MAX_ASTEROID_SPEED),
            };
        } else if (coords.x === CANVAS_SIZE) {
            randVel = {
                x: Game.getRandFloat(-MAX_ASTEROID_SPEED, 0),
                y: Game.getRandFloat(-MAX_ASTEROID_SPEED, MAX_ASTEROID_SPEED),
            };
        } else if (coords.y === 0) {
            randVel = {
                x: Game.getRandFloat(-MAX_ASTEROID_SPEED, MAX_ASTEROID_SPEED),
                y: Game.getRandFloat(0, MAX_ASTEROID_SPEED),
            };
        } else {
            randVel = {
                x: Game.getRandFloat(-MAX_ASTEROID_SPEED, MAX_ASTEROID_SPEED),
                y: Game.getRandFloat(-MAX_ASTEROID_SPEED, 0),
            };
        }

        return randVel;
    }

    static getRandInt(min, max, excludeVal = undefined) {
        const randInt = Math.floor(Math.random() * (max - min + 1) + min);
        return randInt === excludeVal ? Game.getRandInt(min, max, excludeVal) : randInt;
    }

    static getRandFloat(min, max) {
        return Math.random() * (max - min + 1) + min;
    }

    bindHandlers() {
        if (key.isPressed('space')) {
            if (this.canShoot) {
                this.bullets = [...this.bullets, this.ship.shoot()];
                this.canShoot = false;
                setTimeout(() => {
                    this.canShoot = true;
                }, 100);
            }
        } else {
            return { x: 0, y: 0 };
        }
    }

    checkCollisions() {
        // console.log(this.ship.pos);
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
                this.respawn(true);
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
        //array lenght is almost always 0 or 1. Can be higher if two asteroids get hit in the same tick
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

    respawn(isInvulnerable) {
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
        this.respawn(false);
        this.canShoot = true;
        this.lives = 3;

        this.tick();
    }

    stop() {
        this.startButton.innerText = 'Try again';
        this.startButton.style.display = '';
        this.running = false;
    }
}
