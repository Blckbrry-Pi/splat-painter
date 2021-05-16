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

  areaOfIntersection(intersectRect: this) {

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

  getScaledRect(rectOnBounds: this): Rect {
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

  getUnscaledRect(rectOnBounds: this): Rect {
    return new Rect(this.getUnscaledPoint(rectOnBounds.pos1), this.getUnscaledPoint(rectOnBounds.pos2))
  }
  
  draw(color: p5.Color): void {
    fill(color);
    noStroke();
    rectMode(CORNERS);
    rect(this.pos1.x, this.pos1.y, this.pos2.x, this.pos2.y);
    
  }
}