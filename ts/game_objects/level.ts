import p5 from "p5";

import Rect from "./rect.js";
import PaintSplatter from "./paintSplatter.js";

import * as RGBLAB from "../libs/rgbLabConversions.js";

export default class Level {
    paintballs: PaintBall[] = [];
    painting: Painting;
    stars: [number, number, number];
    offset: number;

    constructor(json: string) {
        console.log(json);
        let parsed_json: {paintballs: {size: number, density: number, color: {r: number, g: number, b: number}}[], painting: {r: number, g: number, b: number}[][], offset: number, stars: [number, number, number]} = JSON.parse(json);

        this.painting = this.getPainting(parsed_json.painting);
        this.stars = parsed_json.stars;
        this.offset = parsed_json.offset;

        this.initPaintballs(parsed_json.paintballs);
    }

    private getPainting(painting_json: {r: number, g: number, b: number}[][]): Painting {
        let colorArray: p5.Color[][] = [];

        for (let i = 0; i < painting_json.length; i++) {
            colorArray.push([]);

            for (let j = 0; j < painting_json[i].length; j++)
                colorArray[i].push(color(painting_json[i][j].r, painting_json[i][j].g, painting_json[i][j].b));
        }

        return new Painting(colorArray);
    }

    private initPaintballs(paintballs_json: {size: number, density: number, color: {r: number, g: number, b: number}}[]): void {
        this.paintballs = paintballs_json.map(
            (paintball_json) => new PaintBall(
                paintball_json.size,
                paintball_json.density,
                color(paintball_json.color.r, paintball_json.color.g, paintball_json.color.b)
            )
        );
    }

    clone(): Level {
        let clonedLevel: Level = Object.create(this);
        clonedLevel.paintballs = [...this.paintballs];
        return clonedLevel
    }

    draw(bounds: Rect): void {
        bounds.draw(color(215));

        let paintingBounds: Rect = bounds.getScaledRect(new Rect(
            createVector(0.0, 0.0),
            createVector(0.8, 0.8),
        ));
        this.painting.draw(paintingBounds);


        fill(0);
        noStroke();
        textSize(bounds.getScaledNumber(0.05));
        textAlign(RIGHT, CENTER);
        let textPos: p5.Vector = bounds.getScaledPoint(createVector(0.8, 0.9));
        text("Current ->", textPos.x, textPos.y);

        this.paintballs.slice(0, 5).forEach((paintball, idx) => paintball.draw(bounds, idx));
    }
}


export class Painting {
    colorDataArray: p5.Color[][];
    private squareBounds: Rect[][];

    constructor(colorArray: p5.Color[][]) {
        this.colorDataArray = colorArray;

        this.squareBounds = this.calculateRects(); 
    }

    private calculateRects(): Rect[][] {
        let recipSize: number = this.size;

        return this.colorDataArray.map(
            (rowArr, indY) => rowArr.map(
                (_unused, indX) => new Rect(
                    createVector(0.5 - this.width / recipSize / 2 +  indX      / recipSize, 0.5 - this.height / recipSize / 2 +  indY      / recipSize),
                    createVector(0.5 - this.width / recipSize / 2 + (indX + 1) / recipSize, 0.5 - this.height / recipSize / 2 + (indY + 1) / recipSize),
                )
            )
        );
    }

    draw(bounds: Rect): void {
        this.squareBounds.forEach(
            (rectRow, indY) => rectRow.forEach(
                (rect, indX) => bounds.getScaledRect(rect).draw(this.colorDataArray[indY][indX], color(0))
            )
        );
    }

    getBlank() {
        let blankColor: p5.Color = color(255, 0); 
        return new Painting(
            this.colorDataArray.map(
                (rowArr) => rowArr.map(
                    () => blankColor
                ) 
            )
        );
    }

    setToSplatters(bounds: Rect, paintSplatters: PaintSplatter[], opacity: number = 1) {
        this.squareBounds.forEach(
            (rectRow, indY) => rectRow.forEach(
                (rect, indX) => {
                    let totalArea: number = 1;
                    let currentColor: p5.Color = color(255);
                    for (const splatter of paintSplatters)  {
                        let currentSplatterArea = splatter.intersectingArea(bounds, bounds.getScaledRect(rect))
                        currentColor = lerpColor(splatter.color, currentColor, totalArea / (totalArea + currentSplatterArea));
                        totalArea += currentSplatterArea;
                    }
                    
                    let transpColor: p5.Color = Object.create(currentColor);
                    transpColor.setAlpha(0);

                    this.colorDataArray[indY][indX] = lerpColor(transpColor, currentColor, opacity);
                }
            )
        );
    }

    comparePainting(other: Painting): number {
        if (this.width !== other.width || this.height !== other.height) return 0;

        let totalPoints: number = 0;

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                const thisRGBA: [number, number, number, number] = this.colorDataArray[y][x].levels;
                const thisRGB: [number, number, number] = [thisRGBA[0], thisRGBA[1], thisRGBA[2]];
                const thisLAB: [number, number, number] = RGBLAB.rgb2lab(thisRGB);

                const otherRGBA: [number, number, number, number] = other.colorDataArray[y][x].levels;
                const otherRGB: [number, number, number] = [otherRGBA[0], otherRGBA[1], otherRGBA[2]];
                const otherLAB: [number, number, number] = RGBLAB.rgb2lab(otherRGB);

                totalPoints += 100 - RGBLAB.deltaE(thisLAB, otherLAB);
            }
        }

        return totalPoints;
    }

    get width(): number {
        return this.colorDataArray[0].length;
    }

    get height(): number {
        return this.colorDataArray.length;
    }

    get size(): number {
        return max(this.width, this.height);
    }
}



export class PaintBall {
    size: number;
    density: number;
    color: p5.Color;

    constructor(size: number, density: number, color: p5.Color) {
        this.size = size;
        this.density = density;
        this.color = color;
    }

    draw(bounds: Rect, index: number): void {
        fill(this.color);
        stroke(lerpColor(this.color, color(255), 0.4));
        strokeWeight(bounds.getScaledNumber(0.01));
        

        ellipseMode(CENTER);
        let ellipsePos:  p5.Vector = bounds.getScaledPoint(createVector(0.9, 0.9 - 0.2 * index));
        let ellipseSize: p5.Vector = bounds.getScaledSize(createVector(0.08, 0.08).mult(Math.cbrt(this.size)));
        ellipse(ellipsePos.x, ellipsePos.y, ellipseSize.x, ellipseSize.y);


        fill(0);
        noStroke();
        textAlign(CENTER);
        textSize(bounds.getScaledNumber(0.03))
        text(this.size.toFixed(1), ellipsePos.x, ellipsePos.y);
    }
}