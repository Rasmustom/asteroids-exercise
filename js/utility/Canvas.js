const canvas = document.getElementById('canvas-stage');
const context = canvas.getContext('2d');

const { PI } = Math;

export default {
    drawCircle({ x, y, radius, color = 'white', lineWidth = 2 }) {
        context.beginPath();

        context.lineWidth = lineWidth;
        context.strokeStyle = color;
        context.arc(x, y, radius, 0, 2 * PI);

        context.closePath();
        context.stroke();
    },

    drawScore(score) {
        context.font = '30px Arial';
        context.fillStyle = 'white';
        context.fillText(`Score: ${score}`, 30, 40);
    },

    clear() {
        context.clearRect(0, 0, 1e9, 1e9);
    },
};
