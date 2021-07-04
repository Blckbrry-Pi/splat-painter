import * as p5Global from "p5/global";
import * as p5 from "p5";

import State from "./states/states.js";
import SplashScreen from "./states/splashScreen.js";

import ResourceObj from "./game_objects/resourceLoader.js";
import SettingsObj from "./game_objects/settings.js";

import extendImagePrototypeWithResizeNN from "./libs/resizeNN";

let currState: State;

let resources: ResourceObj;

function preload(): void {
    resources = new ResourceObj();
    window.gameResources = resources;
}

function setup(): void {
    frameRate(120);
    createCanvas(windowWidth, windowHeight);

    currState = new SplashScreen(undefined, resources);
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
        gameResources: ResourceObj;
        levelsUnlocked: number[]
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