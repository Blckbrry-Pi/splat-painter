import LevelEndScreen from "./levelEndScreen.js";
import Rect from "../game_objects/rect.js";
export default class FinishingLevel {
    constructor(prevState, resources) {
        this.resources = resources;
        this.stateStart = window.millis !== undefined ? millis() : 0;
        this.levelPlaying = prevState.levelPlaying;
        this.paintingDrawing = prevState.paintingDrawing;
        this.paintSplatters = prevState.paintSplatters;
    }
    update() {
        let { showBounds, playBounds } = this.calculateBounds();
        this.paintingDrawing.setToSplatters(playBounds, this.paintSplatters, map(millis() - this.stateStart, 1000, 2500, 0, 1, true));
        if (millis() - this.stateStart > 4000)
            return new LevelEndScreen(this, this.resources);
        else
            return this;
    }
    draw() {
        let { showBounds, playBounds } = this.calculateBounds();
        this.paintSplatters.forEach((paintSplatter) => paintSplatter.draw(playBounds, map(millis() - this.stateStart, 1000, 2500, 1, 0, true)));
        this.levelPlaying.level.draw(showBounds);
        this.paintingDrawing.draw(playBounds);
    }
    calculateBounds() {
        let showBounds;
        let playBounds;
        if (width > height) {
            let size = Math.min(width / 2, height);
            showBounds = new Rect(createVector(width / 2 - size, height / 2 - size / 2), createVector(width / 2, height / 2 + size / 2));
            playBounds = new Rect(createVector(width / 2 + size, height / 2 - size / 2), createVector(width / 2, height / 2 + size / 2));
        }
        else {
            let size = Math.min(width, height / 2);
            showBounds = new Rect(createVector(width / 2 - size / 2, height / 2 - size), createVector(width / 2 + size / 2, height / 2));
            playBounds = new Rect(createVector(width / 2 - size / 2, height / 2 + size), createVector(width / 2 + size / 2, height / 2));
        }
        return { showBounds, playBounds };
    }
}
