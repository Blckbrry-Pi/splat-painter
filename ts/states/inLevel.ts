import p5 from "p5";

import State from "./states";
import FinishingLevel from "./finishingLevel.js";

import Level, { PaintBall, Painting } from "../game_objects/level.js";
import Rect from "../game_objects/rect.js";

import ResourceObj from "../game_objects/resourceLoader.js";
import PaintSplatter from "../game_objects/paintSplatter.js";

export default class InLevel {
    levelPlaying: Level;
    paintingDrawing: Painting;
    paintSplatters: PaintSplatter[] = [];

    onMousePress: boolean = false;
    mouseWasPressed: boolean = true;
    
    resources: ResourceObj;

    stateStart: number;

    constructor(prevState: State, resources: ResourceObj, levelToLoad: Level) {
        this.resources = resources;
        this.stateStart = window.millis !== undefined ? millis() : 0;

        this.levelPlaying = levelToLoad.clone();
        this.paintingDrawing = levelToLoad.painting.getBlank();
    }

    update(): State {
        this.onMousePress = mouseIsPressed && !this.mouseWasPressed;
        this.mouseWasPressed = mouseIsPressed;

        let {showBounds, playBounds} = this.calculateBounds();
        
        let relativeMouse: p5.Vector = playBounds.getUnscaledPoint(createVector(mouseX, mouseY));

        if (this.onMousePress && playBounds.pointInBounds(createVector(mouseX, mouseY))) {
            let nextPaintball = this.levelPlaying.paintballs.shift()
            if (nextPaintball !== undefined) this.generatePaintSplatter(nextPaintball, relativeMouse);
        }

        if (this.levelPlaying.paintballs.length <= 0) return new FinishingLevel(this, this.resources);
        return this;
    }

    draw(): void {
        let {showBounds, playBounds} = this.calculateBounds();


        this.paintSplatters.forEach((paintSplatter) => paintSplatter.draw(playBounds));

        this.levelPlaying.draw(showBounds);

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

    generatePaintSplatter(paintball: PaintBall, position: p5.Vector): void {
        this.paintSplatters.push(new PaintSplatter(
            position,
            paintball.size / this.levelPlaying.painting.size * 5,
            paintball.color
        ));
    }
}