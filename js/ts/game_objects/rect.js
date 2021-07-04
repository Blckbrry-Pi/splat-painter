export default class Rect {
    constructor(pos1, pos2) {
        this.pos1 = pos1;
        this.pos2 = pos2;
        this.correct();
    }
    correct() {
        let pos1 = createVector(Math.min(this.pos1.x, this.pos2.x), Math.min(this.pos1.y, this.pos2.y));
        let pos2 = createVector(Math.max(this.pos1.x, this.pos2.x), Math.max(this.pos1.y, this.pos2.y));
        this.pos1 = pos1;
        this.pos2 = pos2;
    }
    areaOfIntersection(intersectRect) {
        let interWidth = Math.min(this.pos2.x, intersectRect.pos2.x) - Math.max(this.pos1.x, intersectRect.pos1.x);
        let interHeight = Math.min(this.pos2.y, intersectRect.pos2.y) - Math.max(this.pos1.y, intersectRect.pos1.y);
        if (interWidth <= 0 || interHeight <= 0)
            return 0;
        else
            return interWidth * interHeight;
    }
    getSize() {
        return createVector(this.pos2.x - this.pos1.x, this.pos2.x - this.pos1.x);
    }
    getScaledNumber(sizeIn) {
        let sizeVec = this.getSize();
        sizeVec.mult(sizeIn);
        return sqrt(sizeVec.magSq() / 2);
    }
    getScaledSize(sizeIn) {
        let sizeVec = this.getSize();
        sizeVec.x *= sizeIn.x;
        sizeVec.y *= sizeIn.y;
        return sizeVec;
    }
    getScaledPoint(pointOnBounds) {
        return createVector(lerp(this.pos1.x, this.pos2.x, pointOnBounds.x), lerp(this.pos1.y, this.pos2.y, pointOnBounds.y));
    }
    getScaledRect(rectOnBounds) {
        return new Rect(this.getScaledPoint(rectOnBounds.pos1), this.getScaledPoint(rectOnBounds.pos2));
    }
    getUnscaledSize(sizeIn) {
        let sizeVec = this.getSize();
        sizeVec.x /= sizeIn.x;
        sizeVec.y /= sizeIn.y;
        return sizeVec;
    }
    getUnscaledPoint(pointOnBounds) {
        return createVector(map(pointOnBounds.x, this.pos1.x, this.pos2.x, 0, 1), map(pointOnBounds.y, this.pos1.y, this.pos2.y, 0, 1));
    }
    getUnscaledRect(rectOnBounds) {
        return new Rect(this.getUnscaledPoint(rectOnBounds.pos1), this.getUnscaledPoint(rectOnBounds.pos2));
    }
    pointInBounds(point) {
        let relativePoint = this.getUnscaledPoint(point);
        return 0 <= relativePoint.x && relativePoint.x <= 1 && 0 <= relativePoint.y && relativePoint.y <= 1;
    }
    draw(color, strokeColor) {
        fill(color);
        strokeWeight(sqrt(this.getSize().magSq() / 2) / 50);
        if (strokeColor === undefined)
            noStroke();
        else
            stroke(0);
        rectMode(CORNERS);
        rect(this.pos1.x, this.pos1.y, this.pos2.x, this.pos2.y);
    }
}
