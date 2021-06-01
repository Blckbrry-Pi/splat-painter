import p5 from "p5";

import Rect from "./rect.js";

export default class Level {
    paintballs: PaintBall[] = [];
    painting: Painting;

    constructor(json: string) {
        console.log(json);
        let parsed_json: {paintballs: {size: number, color: {r: number, g: number, b: number}}[], painting: {r: number, g: number, b: number}[][]} = JSON.parse(json);

        this.painting = this.getPainting(parsed_json.painting);

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

    private initPaintballs(paintballs_json: {size: number, color: {r: number, g: number, b: number}}[]): void {
        this.paintballs = paintballs_json.map(
            (paintball_json) => new PaintBall(
                paintball_json.size,
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
        let recipSize: number = max(this.width, this.height);

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
        let blankColor: p5.Color = color(255); 
        return new Painting(
            this.colorDataArray.map(
                (rowArr) => rowArr.map(
                    () => blankColor
                ) 
            )
        );
    }

    get width(): number {
        return this.colorDataArray[0].length;
    }

    get height(): number {
        return this.colorDataArray.length;
    }
}



export class PaintBall {
    size: number;
    color: p5.Color;

    constructor(size: number, color: p5.Color) {
        this.size = size;
        this.color = color;
    }

    draw(bounds: Rect, index: number): void {
        fill(this.color);
        stroke(lerpColor(this.color, color(255), 0.4));
        strokeWeight(bounds.getScaledNumber(0.01));
        

        ellipseMode(CENTER);
        let ellipsePos:  p5.Vector = bounds.getScaledPoint(createVector(0.9, 0.9 - 0.2 * index));
        let ellipseSize: p5.Vector = bounds.getScaledSize(createVector(0.08, 0.08).mult(sqrt(this.size)));
        ellipse(ellipsePos.x, ellipsePos.y, ellipseSize.x, ellipseSize.y);


        fill(0);
        noStroke();
        textAlign(CENTER);
        textSize(bounds.getScaledNumber(0.03))
        text(this.size.toFixed(1), ellipsePos.x, ellipsePos.y);
    }
}