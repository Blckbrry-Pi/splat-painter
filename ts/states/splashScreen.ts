import * as p5Global from "p5/global";
import State from "./states.js";
import homeMenu from "./homeMenu.js";
import PaintSplatter from "../game_objects/paintSplatter.js";
import Rect from "../game_objects/rect.js";
import ResourceObj from "../resourceLoader.js";

export default class {
  resources: ResourceObj;
  stateStart: number;
  paintSplatters: PaintSplatter[];

  constructor(prevState: State|undefined, resources: ResourceObj) {
    this.stateStart = window.millis !== undefined ? millis() : 0;
    this.paintSplatters = [];
    this.resources = resources;
  }
  

  update(): State {
    if (
      (millis() - this.stateStart >  400 && this.paintSplatters.length < 1) ||
      (millis() - this.stateStart >  800 && this.paintSplatters.length < 2) ||
      (millis() - this.stateStart > 1500 && this.paintSplatters.length < 3)
    ) {
      this.paintSplatters.push(new PaintSplatter());
    }
    
    if (millis() - this.stateStart >= 4000) return new homeMenu(this, this.resources);
    else return this;
  }
  
  draw(): void {
    let size = Math.min(width, height);
    let bounds = new Rect(createVector((width - size) / 2, (height - size) / 2), createVector((width + size) / 2, (height + size) / 2));
    this.paintSplatters.forEach((splatter) => splatter.draw(bounds));

    if (millis() - this.stateStart > 2200) {
      let textZoomAnimationValue: number = map(millis() - this.stateStart, 2200, 2700, 0, 1, true);
      let textMoveAnimationValue: number = map(millis() - this.stateStart, 3200, 4000, 0, 1, true);

      fill(lerpColor(color(0, 0), color(0, 255), textZoomAnimationValue));
      
      stroke(lerpColor(color(0, 0), color(50, 240, 240, 255), textZoomAnimationValue));
      strokeWeight(width / 150);

      textFont(this.resources.commodoreFont);
      textSize(lerp(width, width / 20, textZoomAnimationValue));
      textAlign(CENTER, CENTER);
      text("Splat Painter", width / 2, height / lerp(2, 4, textMoveAnimationValue));
    }
  }
}

