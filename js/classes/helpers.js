export function getRandInt(min, max, excludeVal = undefined) {
    const randInt = Math.floor(Math.random() * (max - min + 1) + min);
    return randInt === excludeVal ? Game.getRandInt(min, max, excludeVal) : randInt;
}

export function getRandFloat(min, max) {
    return Math.random() * (max - min + 1) + min;
}
