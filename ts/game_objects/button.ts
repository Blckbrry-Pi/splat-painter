import * as _ from "lodash";
import * as p5 from "p5";
import * as p5Global from "p5/global";
import Rect from "./rect.js";

export default class Button {
  text: String;
  pos: p5.Vector;
  size: p5.Vector;
  stroke: p5.Color;
  strokeWeight: number;
  fill: p5.Color;
  textColor: p5.Color;
  font: p5.Font;

  constructor(text: String, pos: p5.Vector, size: p5.Vector, font: p5.Font, stroke?: p5.Color, strokeWeight?: number, fill?: p5.Color, textColor?: p5.Color) {
    this.text = text;
    this.pos = pos;
    this.size = size;
    this.font = font;
    
    if (typeof stroke === "undefined") this.stroke = color(0);
    else this.stroke = stroke;

    if (typeof strokeWeight === "undefined") this.strokeWeight = 0.01;
    else this.strokeWeight = strokeWeight;

    if (typeof fill === "undefined") this.fill = color(200);
    else this.fill = fill;

    if (typeof textColor === "undefined") this.textColor = color(0);
    else this.textColor = textColor;
  }

  isHovered(mousePoint: p5.Vector): boolean {
    let xInBounds: boolean = abs(this.pos.x - mousePoint.x) <= this.size.x / 2;
    let yInBounds: boolean = abs(this.pos.y - mousePoint.y) <= this.size.y / 2;

    return xInBounds && yInBounds;
  }

  draw(bounds: Rect, opacity: number = 1): void {
    let onScreenPosition = bounds.getScaledPoint(this.pos);
    let onScreenSize = bounds.getScaledSize(this.size);
    let onScreenOffset = onScreenSize.copy().div(2);

    let displayStrokeWeight = bounds.getScaledNumber(this.strokeWeight);

    noStroke();
    rectMode(CENTER);

    // Draw fill
    let transpFill: p5.Color = Object.create(this.fill);
    transpFill.setAlpha(0);
    fill(lerpColor(transpFill, this.fill, opacity));
    rect(onScreenPosition.x, onScreenPosition.y, onScreenSize.x - displayStrokeWeight * 3, onScreenSize.y);
    rect(onScreenPosition.x, onScreenPosition.y, onScreenSize.x, onScreenSize.y - displayStrokeWeight * 3);


    // Draw stroke
    let transpStroke: p5.Color = Object.create(this.stroke);
    transpStroke.setAlpha(0);
    fill(lerpColor(transpStroke, this.stroke, opacity));

    rect(onScreenPosition.x, onScreenPosition.y - onScreenOffset.y, onScreenSize.x - displayStrokeWeight * 3, displayStrokeWeight);
    rect(onScreenPosition.x, onScreenPosition.y + onScreenOffset.y, onScreenSize.x - displayStrokeWeight * 3, displayStrokeWeight);
    rect(onScreenPosition.x - onScreenOffset.x, onScreenPosition.y, displayStrokeWeight, onScreenSize.y - displayStrokeWeight * 3);
    rect(onScreenPosition.x + onScreenOffset.x, onScreenPosition.y, displayStrokeWeight, onScreenSize.y - displayStrokeWeight * 3);

    let onScreenOffset2 = createVector(onScreenOffset.x - displayStrokeWeight, onScreenOffset.y - displayStrokeWeight);
    rect(onScreenPosition.x - onScreenOffset2.x, onScreenPosition.y - onScreenOffset2.y, displayStrokeWeight, displayStrokeWeight);
    rect(onScreenPosition.x - onScreenOffset2.x, onScreenPosition.y + onScreenOffset2.y, displayStrokeWeight, displayStrokeWeight);
    rect(onScreenPosition.x + onScreenOffset2.x, onScreenPosition.y - onScreenOffset2.y, displayStrokeWeight, displayStrokeWeight);
    rect(onScreenPosition.x + onScreenOffset2.x, onScreenPosition.y + onScreenOffset2.y, displayStrokeWeight, displayStrokeWeight);


    // Draw text
    let transpTextColor: p5.Color = Object.create(this.textColor);
    transpTextColor.setAlpha(0);
    fill(lerpColor(transpTextColor, this.textColor, opacity));

    textAlign(CENTER, CENTER);
    textFont(this.font);
    textSize(onScreenOffset.y);
    text(this.text, onScreenPosition.x, onScreenPosition.y);
  }
}