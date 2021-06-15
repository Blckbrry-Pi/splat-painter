import p5 from "p5";

import State from "./states";
import FinishingLevel from "./finishingLevel";

import Level, { Painting } from "../game_objects/level.js";
import Button from "../game_objects/button.js";
import Rect from "../game_objects/rect.js"

import ResourceObj from "../game_objects/resourceLoader.js";

export default class LevelEndScreen {
    levelPlaying: Level;
    paintingDrawing: Painting;
    buttons: Button[] = [];
    
    prevState: State;
    
    resources: ResourceObj;

    stateStart: number;
    stateEnd: number = 0;

    constructor(prevState: FinishingLevel, resources: ResourceObj) {
        this.resources = resources;
        this.stateStart = window.millis !== undefined ? millis() : 0;
        
        this.levelPlaying = prevState.levelPlaying;
        this.paintingDrawing = prevState.paintingDrawing;
        this.prevState = prevState;
    }


    update(): State {
        return this;
    }

    draw(): void {
        this.prevState.draw();
        
        let stateOpacity = constrain(millis() - this.stateStart, 0, 200) / 200;

        fill(0, stateOpacity * 200);
        noStroke();
        rectMode(CORNER);
        rect(0, 0, width, height);

        let bounds = this.calculateBounds();

        this.buttons.forEach((button) => button.draw(bounds, stateOpacity));
    }

    calculateBounds(): Rect {
        let size: number = Math.min(width, height);
        return new Rect(createVector((width - size) / 2, (height - size) / 2), createVector((width + size) / 2, (height + size) / 2));
    }
}