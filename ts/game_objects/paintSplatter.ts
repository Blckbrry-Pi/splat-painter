import * as p5 from "p5";
import * as p5Sound from "p5/lib/addons/p5.sound";
import * as p5Global from "p5/global";
import Rect from "./rect.js";

export default class PaintSplatter {
    pos: p5.Vector;
    size: number;
    color: p5.Color;
    squares: Rect[];

    constructor(optPos?: p5.Vector, size?: number, optColor?: p5.Color) {
        switch (optPos) {
            case undefined:
                this.pos = createVector(random(), random());
                break;
            
            default:
                this.pos = optPos;
        }


        switch (size) {
            case undefined:
                this.size = random(1,3);
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

    private generateSquares(squareCount: number): void {
        for (let i = 0; i < squareCount; i++) this.squares.push(this.generateSquare());
    }
    private generateSquare(): Rect {
        let pos1 = createVector(randomGaussian(0.5, 0.3), randomGaussian(0.5, 0.3));
        let avgDist = pos1.dist(createVector(0.5, 0.5)) / 2;
        let sqSize = randomGaussian(0.5 - avgDist, 0.1);
        let pos2 = window.p5.Vector.add(pos1, createVector(sqSize, sqSize));
        
        return new Rect(pos1, pos2);
    }

    intersectingArea(bounds: Rect, targetRect: Rect) {
        return this.getScaledSquares(bounds).reduce((currentArea, square) => currentArea + square.areaOfIntersection(targetRect), 0);
    }

    draw(bounds: Rect, opacity: number = 1): void {
        let transpColor: p5.Color = Object.create(this.color);
        transpColor.setAlpha(0);
        const newColor = lerpColor(transpColor, this.color, opacity);

        this.getScaledSquares(bounds).forEach((square) => square.draw(newColor));
    }

    private getScaledSquares(bounds: Rect): Rect[] {
        const sizeVec = createVector(this.size / 20, this.size / 20);
        let boundingRect = new Rect(bounds.getScaledPoint(window.p5.Vector.sub(this.pos, sizeVec)), bounds.getScaledPoint(window.p5.Vector.add(this.pos, sizeVec)));
        return this.squares.map((square) => boundingRect.getScaledRect(square));
    }
}