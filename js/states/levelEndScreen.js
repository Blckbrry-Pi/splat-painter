import Rect from "../game_objects/rect.js";
export default class LevelEndScreen {
    constructor(prevState, resources) {
        this.buttons = [];
        this.stateEnd = 0;
        this.resources = resources;
        this.stateStart = window.millis !== undefined ? millis() : 0;
        this.levelPlaying = prevState.levelPlaying;
        this.paintingDrawing = prevState.paintingDrawing;
        this.prevState = prevState;
    }
    update() {
        return this;
    }
    draw() {
        this.prevState.draw();
        let stateOpacity = constrain(millis() - this.stateStart, 0, 200) / 200;
        fill(0, stateOpacity * 200);
        noStroke();
        rectMode(CORNER);
        rect(0, 0, width, height);
        let bounds = this.calculateBounds();
        this.buttons.forEach((button) => button.draw(bounds, stateOpacity));
    }
    calculateBounds() {
        let size = Math.min(width, height);
        return new Rect(createVector((width - size) / 2, (height - size) / 2), createVector((width + size) / 2, (height + size) / 2));
    }
}
