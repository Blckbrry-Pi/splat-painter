import * as p5Global from "p5/global";
import * as p5 from "p5";
import State from "./states/states.js";
import splashScreen from "./states/splashScreen.js";
import ResourceObj from "./resourceLoader.js";

let currState: State;

let resources: ResourceObj;

function preload(): void {
  resources = new ResourceObj();
}

function setup(): void {
  createCanvas(windowWidth, windowHeight);
  currState = new splashScreen(undefined, resources);
}

function draw(): void {

  background(255);

  let updateReturnVal = currState.update();
  switch (updateReturnVal) {
    case undefined:
      currState.draw()
      break;
  
    default:
      currState = updateReturnVal;
      draw();
  }
}

function windowResized(): void {
  resizeCanvas(windowWidth, windowHeight);
}



declare global {
  interface Window {
    p5: any;
    preload: ()=>void;
    setup: ()=>void;
    draw: ()=>void;
    windowResized: ()=>void;
  }
}
window.preload = preload;
window.setup = setup;
window.draw = draw;
window.windowResized = windowResized;