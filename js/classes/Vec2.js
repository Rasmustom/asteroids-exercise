export default class Vec2 {
    constructor({ x = 0, y = 0 }) {
        this.x = x;
        this.y = y;
    }

    add(vector) {
        return new Vec2({
            x: this.x + vector.x,
            y: this.y + vector.y,
        });
    }

    static distance(vecA, vecB) {
        const d1 = Math.pow(vecA.x - vecB.x, 2);
        const d2 = Math.pow(vecA.y - vecB.y, 2);
        return Math.sqrt(d1 + d2);
    }
}
