import HomeMenu from "./homeMenu.js";
import InLevel from "./inLevel.js";
import Button from "../game_objects/button.js";
import Rect from "../game_objects/rect.js";
export default class LevelEndScreen {
    constructor(prevState, resources) {
        this.buttons = [];
        this.onMousePress = false;
        this.mouseWasPressed = true;
        this.stateEnd = 0;
        this.resources = resources;
        this.stateStart = window.millis !== undefined ? millis() : 0;
        this.levelPlaying = prevState.levelPlaying;
        this.paintingDrawing = prevState.paintingDrawing;
        this.prevState = prevState;
        this.score = this.getLevelScore(this.levelPlaying.level.painting, this.paintingDrawing, this.levelPlaying.level.offset);
        this.stars = 0;
        this.nextPlayable = this.score >= this.levelPlaying.level.stars[0];
        this.initButtons();
    }
    getLevelScore(painting1, painting2, offset) {
        let baseScore = painting1.comparePainting(painting2);
        return Math.round((baseScore - offset) / (painting1.width * painting1.height - offset / 100));
    }
    initButtons() {
        let buttonStyle = {
            strk: color(255, 255, 255),
            strkW: 0.006,
            fill: color(100, 100, 100),
            textC: color(255, 255, 255),
        };
        this.buttons.push(new Button("Menu", createVector(0.2, 0.6), createVector(0.25, 0.1), this.resources.commodoreFont, buttonStyle.strk, buttonStyle.strkW, buttonStyle.fill, buttonStyle.textC));
        this.buttons.push(new Button("Replay", createVector(0.5, 0.6), createVector(0.25, 0.1), this.resources.commodoreFont, buttonStyle.strk, buttonStyle.strkW, buttonStyle.fill, buttonStyle.textC));
        this.buttons.push(new Button("Next", createVector(0.8, 0.6), createVector(0.25, 0.1), this.resources.commodoreFont, buttonStyle.strk, buttonStyle.strkW, buttonStyle.fill, buttonStyle.textC));
        this.buttons.push(new Button(`Score: 0`, createVector(0.5, 0.45), createVector(0.5, 0.15), this.resources.commodoreFont, buttonStyle.strk, buttonStyle.strkW, buttonStyle.fill, buttonStyle.textC));
    }
    update() {
        this.onMousePress = mouseIsPressed && !this.mouseWasPressed;
        this.mouseWasPressed = mouseIsPressed;
        let bounds = this.calculateBounds();
        let relativeMouse = bounds.getUnscaledPoint(createVector(mouseX, mouseY));
        if (this.onMousePress) {
            if (this.buttons[0].isHovered(relativeMouse))
                return new HomeMenu(this, this.resources);
            if (this.buttons[1].isHovered(relativeMouse))
                return new InLevel(this, this.resources, {
                    level: this.resources.levels[this.levelPlaying.levelNum],
                    levelNum: this.levelPlaying.levelNum,
                });
            if (this.buttons[2].isHovered(relativeMouse) && this.nextPlayable)
                return new InLevel(this, this.resources, {
                    level: this.resources.levels[this.levelPlaying.levelNum + 1],
                    levelNum: this.levelPlaying.levelNum + 1,
                });
        }
        let currInt = parseInt(this.buttons[3].text.slice(7));
        if (currInt < this.score) {
            currInt += 2;
            currInt = Math.min(currInt, this.score);
            this.stars = 0;
            this.levelPlaying.level.stars.forEach((starThreshold) => { if (currInt >= starThreshold)
                this.stars++; }, 0);
            this.buttons[3].text = `Score: ${currInt}`;
        }
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
        [
            new Rect(createVector(0.225, 0.2), createVector(0.375, 0.35)),
            new Rect(createVector(0.425, 0.2), createVector(0.575, 0.35)),
            new Rect(createVector(0.625, 0.2), createVector(0.775, 0.35)),
        ]
            .map((star) => bounds.getScaledRect(star))
            .forEach((location, index) => this.drawStar(index + 1 <= this.stars, location));
        this.buttons.forEach((button) => button.draw(bounds, stateOpacity));
    }
    drawStar(filled, bounds) {
        image(filled ? this.resources.images.star.yellow : this.resources.images.star.gray, bounds.pos1.x, bounds.pos1.y, bounds.width, bounds.height);
    }
    calculateBounds() {
        let size = Math.min(width, height);
        return new Rect(createVector((width - size) / 2, (height - size) / 2), createVector((width + size) / 2, (height + size) / 2));
    }
}
