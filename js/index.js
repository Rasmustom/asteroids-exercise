import MovingObject from './classes/MovingObject.js';
import Canvas from './utility/Canvas.js';

const { requestAnimationFrame } = window;

const movingObject = new MovingObject();

function tick() {
    Canvas.clear();
    movingObject.move();
    movingObject.draw();
    requestAnimationFrame(tick);
}

tick();
