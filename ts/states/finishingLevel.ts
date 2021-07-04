import p5 from "p5";

import State from "./states";
import InLevel from "./inLevel";
import LevelEndScreen from "./levelEndScreen.js";

import Level, { PaintBall, Painting } from "../game_objects/level.js";
import Rect from "../game_objects/rect.js";

import ResourceObj from "../game_objects/resourceLoader.js";
import PaintSplatter from "../game_objects/paintSplatter.js";

export default class FinishingLevel {
    levelPlaying: {level: Level, levelNum: number};
    paintingDrawing: Painting;
    paintSplatters: PaintSplatter[];
    
    resources: ResourceObj;

    stateStart: number;

    constructor(prevState: InLevel, resources: ResourceObj) {
        this.resources = resources;
        this.stateStart = window.millis !== undefined ? millis() : 0;
        
        this.levelPlaying = prevState.levelPlaying;
        this.paintingDrawing = prevState.paintingDrawing;
        this.paintSplatters = prevState.paintSplatters;

    }

    update(): State {
        let {showBounds, playBounds} = this.calculateBounds();

        this.paintingDrawing.setToSplatters(playBounds, this.paintSplatters, map(millis() - this.stateStart, 2000, 3500, 0, 1, true));

        if (millis() - this.stateStart > 8000) return new LevelEndScreen(this, this.resources);
        else return this;
    }

    draw(): void {
        background(215);

        let {showBounds, playBounds} = this.calculateBounds();


        this.paintSplatters.forEach((paintSplatter) => paintSplatter.draw(playBounds, map(millis() - this.stateStart, 2000, 3500, 1, 0, true)));

        this.levelPlaying.level.draw(showBounds);

        this.paintingDrawing.draw(playBounds);
    }

    calculateBounds(): {showBounds: Rect, playBounds: Rect} {
        let showBounds: Rect;
        let playBounds: Rect;

        if (width > height) {
            let size: number = Math.min(width / 2, height);
            showBounds = new Rect(
                createVector(width/2 - size, height/2 - size/2),
                createVector(width/2       , height/2 + size/2),
            );
            playBounds = new Rect(
                createVector(width/2 + size, height/2 - size/2),
                createVector(width/2       , height/2 + size/2),
            );
        } else {
            let size: number = Math.min(width, height / 2);
            showBounds = new Rect(
                createVector(width/2 - size/2, height/2 - size),
                createVector(width/2 + size/2, height/2       ),
            );
            playBounds = new Rect(
                createVector(width/2 - size/2, height/2 + size),
                createVector(width/2 + size/2, height/2       ),
            );
        }

        return {showBounds, playBounds};
    }
}