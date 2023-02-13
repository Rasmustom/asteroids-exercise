import Canvas from 'utility/Canvas.js';
import MovingObject from 'classes/MovingObject.js';
import key from 'keymaster';
import Vec2 from './Vec2.js';
import Bullet from './Bullet.js';

const MAX_VELOCITY = 5;
const TURNING_SPEED = 0.2;
const INVULNERABLE_COLOR = '#6495ED';

export default class Ship extends MovingObject {
    constructor({
        pos = new Vec2({ x: 250, y: 250 }),
        vel = new Vec2({ x: 0, y: 0 }),
        radius = 20,
        color = 'blue',
        direction = 0,
        invulnerable = false,
    }) {
        super(pos, vel, radius, color);
        this.direction = direction;
        this.invulnerable = invulnerable;
        if (invulnerable) {
            this.color = INVULNERABLE_COLOR;
            setTimeout(() => {
                this.color = color;
                this.invulnerable = false;
            }, 4000);
        }
        this.canShoot = true;
    }

    draw() {
        // this.radius = circleRadius;
        Canvas.drawCircle({ x: this.pos.x, y: this.pos.y, radius: this.radius, color: this.color });
        Canvas.drawCircle({
            x: this.pos.x + Math.cos(this.direction) * this.radius,
            y: this.pos.y + Math.sin(this.direction) * this.radius,
            radius: this.radius / 2,
            color: this.color,
        });
    }

    move() {
        this.pos = this.pos.add(this.vel);

        if (key.isPressed('left')) {
            this.direction = (this.direction + 2 * Math.PI - 0.1) % (2 * Math.PI);
        }
        if (key.isPressed('right')) {
            this.direction = (this.direction + 2 * Math.PI + 0.1) % (2 * Math.PI);
        }

        const acc = this.getAcceleration();
        let addedAcc = { x: 0, y: 0 };
        if (Math.abs(this.vel.x + acc.x) < MAX_VELOCITY) addedAcc.x = acc.x;
        if (Math.abs(this.vel.y + acc.y) < MAX_VELOCITY) addedAcc.y = acc.y;

        this.vel = this.vel.add(addedAcc);

        this.wrap();
    }

    getAcceleration() {
        if (key.isPressed('up')) {
            return {
                x: Math.cos(this.direction) * TURNING_SPEED,
                y: Math.sin(this.direction) * TURNING_SPEED,
            };
        } else {
            return { x: 0, y: 0 };
        }
    }

    bulletFactory() {
        const bulletPosition = new Vec2({
            x: this.pos.x + Math.cos(this.direction) * 20,
            y: this.pos.y + Math.sin(this.direction) * 20,
        });
        const bulletVelocity = new Vec2({
            x: Math.cos(this.direction) * TURNING_SPEED * 25,
            y: Math.sin(this.direction) * TURNING_SPEED * 25,
        });
        const bullet = new Bullet(bulletPosition, bulletVelocity, 5, 'red');
        return bullet;
    }

    shoot() {
        if (key.isPressed('space')) {
            if (this.canShoot) {
                // this.bullets = [...this.bullets, this.ship.shoot()];
                this.canShoot = false;
                setTimeout(() => {
                    this.canShoot = true;
                }, 100);
                return this.bulletFactory();
            }
        }
    }
}
