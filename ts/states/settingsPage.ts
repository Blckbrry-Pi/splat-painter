import * as p5Global from "p5/global";
import p5 from "p5";

import State from "./states.js";


import ResourceObj from "../resourceLoader.js";

export default class {
  resources: ResourceObj;
  onMousePress: boolean;
  mouseWasPressed: boolean;
  stateStart: number;
  stateToReturnTo: State;

  constructor(prevState: State, resources: ResourceObj) {
    this.resources = resources;
    this.onMousePress = false;
    this.mouseWasPressed = true;
    this.stateStart = window.millis !== undefined ? millis() : 0;
    this.stateToReturnTo = prevState;
  }

  update(): State|undefined {
    return undefined;
  }
  
  draw(): void {
    this.stateToReturnTo.draw();
    
    fill(0, constrain(millis() - this.stateStart, 0, 200));
    noStroke();
    rectMode(CORNER);
    rect(0, 0, width, height);

    
  }
}