import Rect from "./rect.js";
export default class PaintSplatter {
    constructor(optPos, size, optColor) {
        switch (optPos) {
            case undefined:
                this.pos = createVector(random(), random());
                break;
            default:
                this.pos = optPos;
        }
        switch (size) {
            case undefined:
                this.size = random(1, 3);
                break;
            default:
                this.size = size;
        }
        switch (optColor) {
            case undefined:
                this.color = color(random(255), random(255), random(255));
                break;
            default:
                this.color = optColor;
        }
        this.squares = [];
        this.generateSquares(20);
    }
    generateSquares(squareCount) {
        for (let i = 0; i < squareCount; i++)
            this.squares.push(this.generateSquare());
    }
    generateSquare() {
        let pos1 = createVector(randomGaussian(0.5, 0.3), randomGaussian(0.5, 0.3));
        let avgDist = pos1.dist(createVector(0.5, 0.5)) / 2;
        let sqSize = randomGaussian(0.5 - avgDist, 0.1);
        let pos2 = window.p5.Vector.add(pos1, createVector(sqSize, sqSize));
        return new Rect(pos1, pos2);
    }
    intersectingArea(bounds, targetRect) {
        return this.getScaledSquares(bounds).reduce((currentArea, square) => currentArea + square.areaOfIntersection(targetRect), 0);
    }
    draw(bounds, opacity = 1) {
        let transpColor = Object.create(this.color);
        transpColor.setAlpha(0);
        const newColor = lerpColor(transpColor, this.color, opacity);
        this.getScaledSquares(bounds).forEach((square) => square.draw(newColor));
    }
    getScaledSquares(bounds) {
        const sizeVec = createVector(this.size / 20, this.size / 20);
        let boundingRect = new Rect(bounds.getScaledPoint(window.p5.Vector.sub(this.pos, sizeVec)), bounds.getScaledPoint(window.p5.Vector.add(this.pos, sizeVec)));
        return this.squares.map((square) => boundingRect.getScaledRect(square));
    }
}
