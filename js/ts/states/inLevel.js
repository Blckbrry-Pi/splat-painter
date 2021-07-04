import FinishingLevel from "./finishingLevel.js";
import Rect from "../game_objects/rect.js";
import PaintSplatter from "../game_objects/paintSplatter.js";
export default class InLevel {
    constructor(prevState, resources, levelToLoad) {
        this.paintSplatters = [];
        this.onMousePress = false;
        this.mouseWasPressed = true;
        this.resources = resources;
        this.stateStart = window.millis !== undefined ? millis() : 0;
        this.levelPlaying = {
            level: levelToLoad.level.clone(),
            levelNum: levelToLoad.levelNum
        };
        this.paintingDrawing = levelToLoad.level.painting.getBlank();
    }
    update() {
        this.onMousePress = mouseIsPressed && !this.mouseWasPressed;
        this.mouseWasPressed = mouseIsPressed;
        let { showBounds, playBounds } = this.calculateBounds();
        let relativeMouse = playBounds.getUnscaledPoint(createVector(mouseX, mouseY));
        if (this.onMousePress && playBounds.pointInBounds(createVector(mouseX, mouseY))) {
            let nextPaintball = this.levelPlaying.level.paintballs.shift();
            if (nextPaintball !== undefined)
                this.generatePaintSplatter(nextPaintball, relativeMouse);
        }
        if (this.levelPlaying.level.paintballs.length <= 0)
            return new FinishingLevel(this, this.resources);
        return this;
    }
    draw() {
        let { showBounds, playBounds } = this.calculateBounds();
        this.paintSplatters.forEach((paintSplatter) => paintSplatter.draw(playBounds));
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
    generatePaintSplatter(paintball, position) {
        this.paintSplatters.push(new PaintSplatter(position, paintball.size / this.levelPlaying.level.painting.size * 5, paintball.color));
    }
}
