import Rect from "./rect.js";
export default class Level {
    constructor(json) {
        this.paintballs = [];
        console.log(json);
        let parsed_json = JSON.parse(json);
        this.painting = this.getPainting(parsed_json.painting);
        this.stars = parsed_json.stars;
        this.initPaintballs(parsed_json.paintballs);
    }
    getPainting(painting_json) {
        let colorArray = [];
        for (let i = 0; i < painting_json.length; i++) {
            colorArray.push([]);
            for (let j = 0; j < painting_json[i].length; j++)
                colorArray[i].push(color(painting_json[i][j].r, painting_json[i][j].g, painting_json[i][j].b));
        }
        return new Painting(colorArray);
    }
    initPaintballs(paintballs_json) {
        this.paintballs = paintballs_json.map((paintball_json) => new PaintBall(paintball_json.size, color(paintball_json.color.r, paintball_json.color.g, paintball_json.color.b)));
    }
    clone() {
        let clonedLevel = Object.create(this);
        clonedLevel.paintballs = [...this.paintballs];
        return clonedLevel;
    }
    draw(bounds) {
        bounds.draw(color(255));
        let paintingBounds = bounds.getScaledRect(new Rect(createVector(0.0, 0.0), createVector(0.8, 0.8)));
        this.painting.draw(paintingBounds);
        fill(0);
        noStroke();
        textSize(bounds.getScaledNumber(0.05));
        textAlign(RIGHT, CENTER);
        let textPos = bounds.getScaledPoint(createVector(0.8, 0.9));
        text("Current ->", textPos.x, textPos.y);
        this.paintballs.slice(0, 5).forEach((paintball, idx) => paintball.draw(bounds, idx));
    }
}
export class Painting {
    constructor(colorArray) {
        this.colorDataArray = colorArray;
        this.squareBounds = this.calculateRects();
    }
    calculateRects() {
        let recipSize = this.size;
        return this.colorDataArray.map((rowArr, indY) => rowArr.map((_unused, indX) => new Rect(createVector(0.5 - this.width / recipSize / 2 + indX / recipSize, 0.5 - this.height / recipSize / 2 + indY / recipSize), createVector(0.5 - this.width / recipSize / 2 + (indX + 1) / recipSize, 0.5 - this.height / recipSize / 2 + (indY + 1) / recipSize))));
    }
    draw(bounds) {
        this.squareBounds.forEach((rectRow, indY) => rectRow.forEach((rect, indX) => bounds.getScaledRect(rect).draw(this.colorDataArray[indY][indX], color(0))));
    }
    getBlank() {
        let blankColor = color(255, 0);
        return new Painting(this.colorDataArray.map((rowArr) => rowArr.map(() => blankColor)));
    }
    setToSplatters(bounds, paintSplatters, opacity = 1) {
        this.squareBounds.forEach((rectRow, indY) => rectRow.forEach((rect, indX) => {
            let totalArea = 1;
            let currentColor = color(255);
            for (const splatter of paintSplatters)
                currentColor = lerpColor(splatter.color, currentColor, totalArea / (totalArea + splatter.intersectingArea(bounds, bounds.getScaledRect(rect))));
            let transpColor = Object.create(currentColor);
            transpColor.setAlpha(0);
            this.colorDataArray[indY][indX] = lerpColor(transpColor, currentColor, opacity);
        }));
    }
    get width() {
        return this.colorDataArray[0].length;
    }
    get height() {
        return this.colorDataArray.length;
    }
    get size() {
        return max(this.width, this.height);
    }
}
export class PaintBall {
    constructor(size, color) {
        this.size = size;
        this.color = color;
    }
    draw(bounds, index) {
        fill(this.color);
        stroke(lerpColor(this.color, color(255), 0.4));
        strokeWeight(bounds.getScaledNumber(0.01));
        ellipseMode(CENTER);
        let ellipsePos = bounds.getScaledPoint(createVector(0.9, 0.9 - 0.2 * index));
        let ellipseSize = bounds.getScaledSize(createVector(0.08, 0.08).mult(sqrt(this.size)));
        ellipse(ellipsePos.x, ellipsePos.y, ellipseSize.x, ellipseSize.y);
        fill(0);
        noStroke();
        textAlign(CENTER);
        textSize(bounds.getScaledNumber(0.03));
        text(this.size.toFixed(1), ellipsePos.x, ellipsePos.y);
    }
}
