const canvas = document.querySelector('#canvas-stage');
const context = canvas.getContext('2d');
const canvas2 = document.querySelector('#canvas-score');
const context2 = canvas2.getContext('2d');

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
        context2.font = '30px Arial';
        context2.fillStyle = 'white';
        context2.textAlign = 'start';
        context2.fillText(`Score: ${score}`, 30, 30);
    },

    drawLivesLeft(livesLeft) {
        context2.font = '30px Arial';
        context2.fillStyle = 'white';
        context2.textAlign = 'end';
        context2.fillText(`Lives left: ${livesLeft}`, 470, 30);
    },

    clear() {
        context.clearRect(0, 0, 1e9, 1e9);
        context2.clearRect(0, 0, 1e9, 1e9);
    },
};
