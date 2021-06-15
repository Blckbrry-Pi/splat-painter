import InLevel from "./inLevel.js";
import Button from "../game_objects/button.js";
import Rect from "../game_objects/rect.js";
export default class LevelMenu {
    constructor(prevState, resources) {
        this.buttons = [];
        this.onMousePress = false;
        this.mouseWasPressed = true;
        this.resources = resources;
        this.stateStart = window.millis !== undefined ? millis() : 0;
        this.pageNumber = 0;
        this.initButtons(this.pageNumber);
    }
    initButtons(pageNumber) {
        this.buttons = [];
        let dimensions = 4;
        for (let i = 0; i < dimensions; i++)
            for (let j = 0; j < dimensions; j++)
                if (pageNumber * dimensions * dimensions + i * dimensions + j < this.resources.levels.length)
                    this.buttons.push(new Button((pageNumber * dimensions * dimensions + i * dimensions + j + 1).toString(), createVector(1 / (dimensions + 1) * (j + 1), 1 / (dimensions + 1) * (i + 1.5)), createVector(1 / (dimensions + 1) * 3 / 4, 1 / (dimensions + 1) * 3 / 4), this.resources.commodoreFont, undefined, 0.006, undefined, undefined));
    }
    update() {
        this.onMousePress = mouseIsPressed && !this.mouseWasPressed;
        this.mouseWasPressed = mouseIsPressed;
        let size = Math.min(width, height);
        let bounds = new Rect(createVector((width - size) / 2, (height - size) / 2), createVector((width + size) / 2, (height + size) / 2));
        let relativeMouse = bounds.getUnscaledPoint(createVector(mouseX, mouseY));
        if (this.onMousePress)
            for (let i = 0; i < this.buttons.length; i++)
                if (this.buttons[i].isHovered(relativeMouse))
                    return new InLevel(this, this.resources, this.resources.levels[this.pageNumber * 25 + i]);
        return this;
    }
    draw() {
        let size = Math.min(width, height);
        let bounds = new Rect(createVector((width - size) / 2, (height - size) / 2), createVector((width + size) / 2, (height + size) / 2));
        this.buttons.forEach((button) => button.draw(bounds));
    }
}
