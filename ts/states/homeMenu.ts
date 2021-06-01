import * as p5Global from "p5/global";
import p5 from "p5";

import State from "./states.js";
import SplashScreen from "./splashScreen.js";
import SettingsPage from "./settingsPage.js";
import LevelMenu from "./levelMenu.js";

import PaintSplatter from "../game_objects/paintSplatter.js";
import Button from "../game_objects/button.js";
import Rect from "../game_objects/rect.js";

import ResourceObj from "../game_objects/resourceLoader.js";

export default class {
    resources: ResourceObj;
    onMousePress: boolean;
    mouseWasPressed: boolean;
    stateStart: number;
    backgroundPaintSplatters: PaintSplatter[];
    buttons: Button[];

    constructor(prevState: State, resources: ResourceObj) {
        this.resources = resources;
        this.onMousePress = false;
        this.mouseWasPressed = true;
        this.stateStart = window.millis !== undefined ? millis() : 0;

        if (prevState instanceof SplashScreen) this.backgroundPaintSplatters = prevState.paintSplatters;
        else this.backgroundPaintSplatters = new Array(3).map((_) => new PaintSplatter());
        
        this.buttons = [];

        this.buttons.push(new Button(
            "Play",
            createVector(0.5, 0.6),
            createVector(0.5, 0.15),
            this.resources.commodoreFont,
            undefined,
            0.006,
            undefined,
            undefined,
        ));
        this.buttons.push(new Button(
            "Settings",
            createVector(0.5, 0.8),
            createVector(0.5, 0.15),
            this.resources.commodoreFont,
            undefined,
            0.006,
            undefined,
            undefined,
        ));
    }
    

    update(): State {
        this.onMousePress = mouseIsPressed && !this.mouseWasPressed;
        this.mouseWasPressed = mouseIsPressed;

        let size: number = Math.min(width, height);
        let bounds: Rect = new Rect(createVector((width - size) / 2, (height - size) / 2), createVector((width + size) / 2, (height + size) / 2));
        let relativeMouse: p5.Vector = bounds.getUnscaledPoint(createVector(mouseX, mouseY));

        if(this.buttons[0].isHovered(relativeMouse) && this.onMousePress) return new LevelMenu(this, this.resources);
        if(this.buttons[1].isHovered(relativeMouse) && this.onMousePress) return new SettingsPage(this, this.resources);
        return this;
    }
    
    draw(): void {
        let size: number = Math.min(width, height);
        let bounds: Rect = new Rect(createVector((width - size) / 2, (height - size) / 2), createVector((width + size) / 2, (height + size) / 2));

        this.backgroundPaintSplatters.forEach((splatter) => splatter.draw(bounds));
        this.buttons.forEach((button) => button.draw(bounds, map(millis() - this.stateStart, 0, 200, 0, 1, true)));
        
        
        fill(0, 255);
        
        stroke(50, 240, 240, 255);
        strokeWeight(width / 150);

        textFont(this.resources.commodoreFont);
        textSize(width / 20);
        textAlign(CENTER, CENTER);
        text("Splat Painter", width / 2, height / 4);

    }
}