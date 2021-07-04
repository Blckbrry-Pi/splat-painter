import p5 from "p5";

export default class Rect {
    constructor(
        public pos1: p5.Vector,
        public pos2: p5.Vector
    ) {
        this.correct()
    }

    correct() {
        let pos1 = createVector(Math.min(this.pos1.x, this.pos2.x), Math.min(this.pos1.y, this.pos2.y));
        let pos2 = createVector(Math.max(this.pos1.x, this.pos2.x), Math.max(this.pos1.y, this.pos2.y));
        this.pos1 = pos1;
        this.pos2 = pos2;
    }

    areaOfIntersection(intersectRect: Rect): number {
        let interWidth  = Math.min(this.pos2.x, intersectRect.pos2.x) - Math.max(this.pos1.x, intersectRect.pos1.x);
        let interHeight = Math.min(this.pos2.y, intersectRect.pos2.y) - Math.max(this.pos1.y, intersectRect.pos1.y);

        if (interWidth <= 0 || interHeight <= 0) return 0;
        else return interWidth * interHeight;
    }

    getSize(): p5.Vector {
        return createVector(this.pos2.x - this.pos1.x, this.pos2.x - this.pos1.x);
    }

    getScaledNumber(sizeIn: number): number {
        let sizeVec: p5.Vector = this.getSize();
        sizeVec.mult(sizeIn);
        return sqrt(sizeVec.magSq() / 2);
    }

    getScaledSize(sizeIn: p5.Vector): p5.Vector {
        let sizeVec: p5.Vector = this.getSize();
        sizeVec.x *= sizeIn.x;
        sizeVec.y *= sizeIn.y;
        return sizeVec;
    }

    getScaledPoint(pointOnBounds: p5.Vector): p5.Vector {
        return createVector(lerp(this.pos1.x, this.pos2.x, pointOnBounds.x), lerp(this.pos1.y, this.pos2.y, pointOnBounds.y))
    }

    getScaledRect(rectOnBounds: Rect): Rect {
        return new Rect(this.getScaledPoint(rectOnBounds.pos1), this.getScaledPoint(rectOnBounds.pos2))
    }


    getUnscaledSize(sizeIn: p5.Vector): p5.Vector {
        let sizeVec: p5.Vector = this.getSize();
        sizeVec.x /= sizeIn.x;
        sizeVec.y /= sizeIn.y;
        return sizeVec;
    }

    getUnscaledPoint(pointOnBounds: p5.Vector): p5.Vector {
        return createVector(map(pointOnBounds.x, this.pos1.x, this.pos2.x, 0, 1), map(pointOnBounds.y, this.pos1.y, this.pos2.y, 0, 1))
    }

    getUnscaledRect(rectOnBounds: Rect): Rect {
        return new Rect(this.getUnscaledPoint(rectOnBounds.pos1), this.getUnscaledPoint(rectOnBounds.pos2))
    }
    
    pointInBounds(point: p5.Vector): boolean {
        let relativePoint: p5.Vector = this.getUnscaledPoint(point);
        return 0 <= relativePoint.x && relativePoint.x <= 1 && 0 <= relativePoint.y && relativePoint.y <= 1;
    }

    draw(color: p5.Color, strokeColor?: p5.Color): void {
        fill(color);
        strokeWeight(sqrt(this.getSize().magSq() / 2) / 50);
        if (strokeColor === undefined) noStroke();
        else stroke(strokeColor);
        rectMode(CORNERS);
        rect(this.pos1.x, this.pos1.y, this.pos2.x, this.pos2.y);
    }

    get width(): number {
        return this.pos2.x - this.pos1.x;
    }

    get height(): number {
        return this.pos2.y - this.pos1.y;
    }
}