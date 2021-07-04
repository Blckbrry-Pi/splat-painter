import SplashScreen from "./states/splashScreen.js";
import ResourceObj from "./game_objects/resourceLoader.js";
import SettingsObj from "./game_objects/settings.js";
import * as RGBLAB from "../libs/rgbLabConversions.js";
let currState;
let resources;
function preload() {
    resources = new ResourceObj();
    window.gameResources = resources;
}
function setup() {
    frameRate(120);
    createCanvas(windowWidth, windowHeight);
    currState = new SplashScreen(undefined, resources);
    let black = RGBLAB.rgb2lab([0, 0, 0]);
    let white = RGBLAB.rgb2lab([255, 255, 255]);
    console.log(black, RGBLAB.lab2rgb(black));
    console.log(white, RGBLAB.lab2rgb(white));
    console.log(RGBLAB.deltaE(black, white));
}
function draw() {
    background(255);
    currState = currState.update();
    currState.draw();
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
window.gameSettings = new SettingsObj();
window.preload = preload;
window.setup = setup;
window.draw = draw;
window.windowResized = windowResized;
