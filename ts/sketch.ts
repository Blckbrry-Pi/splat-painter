import * as p5Global from "p5/global";
import * as p5 from "p5";

import State from "./states/states.js";
import splashScreen from "./states/splashScreen.js";

import ResourceObj from "./game_objects/resourceLoader.js";
import SettingsObj from "./game_objects/settings.js";

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

  currState = currState.update();
  currState.draw();
}

function windowResized(): void {
  resizeCanvas(windowWidth, windowHeight);
}



declare global {
  interface Window {
    p5: any;
    gameSettings: SettingsObj;
    preload: ()=>void;
    setup: ()=>void;
    draw: ()=>void;
    windowResized: ()=>void;
  }
}
window.gameSettings = new SettingsObj();
window.preload = preload;
window.setup = setup;
window.draw = draw;
window.windowResized = windowResized;