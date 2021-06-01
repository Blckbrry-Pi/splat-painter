import State from "./states";

import Level, { Painting } from "../game_objects/level.js";
import Rect from "../game_objects/rect.js";

import ResourceObj from "../game_objects/resourceLoader";
import PaintSplatter from "../game_objects/paintSplatter";

export default class InLevel {
    levelPlaying: Level;
    paintingDrawing: Painting;
    paintSplatters: PaintSplatter[] = [];
    
    resources: ResourceObj;

    stateStart: number;

    constructor(prevState: State, resources: ResourceObj, levelToLoad: Level) {
        this.resources = resources;
        this.stateStart = window.millis !== undefined ? millis() : 0;

        this.levelPlaying = levelToLoad.clone();
        this.paintingDrawing = levelToLoad.painting.getBlank();
    }

    update(): State {
        return this;
    }

    draw(): void {

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


        this.levelPlaying.draw(showBounds);
    }
}