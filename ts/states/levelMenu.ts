import * as p5Global from "p5/global";
import p5 from "p5";

import State from "./states.js";
import InLevel from "./inLevel.js";

import PaintSplatter from "../game_objects/paintSplatter.js";
import Button from "../game_objects/button.js";
import Rect from "../game_objects/rect.js";

import ResourceObj from "../game_objects/resourceLoader.js";

export default class LevelMenu {
    resources: ResourceObj;
    
    buttons: Button[] = [];
    pageNumber: number;

    onMousePress: boolean = false;
    mouseWasPressed: boolean = true;

    stateStart: number;

    constructor(prevState: State, resources: ResourceObj) {
        this.resources = resources;
        this.stateStart = window.millis !== undefined ? millis() : 0;

        this.pageNumber = 0;

        this.initButtons(this.pageNumber);
    }

    initButtons(pageNumber: number): void {
        
        
        this.buttons = [];

        let dimensions = 4;
        
        for (let i = 0; i < dimensions; i++)
            for (let j = 0; j < dimensions; j++) 
                if (pageNumber * dimensions * dimensions + i * dimensions + j < this.resources.levels.length)
                    this.buttons.push(new Button(
                        (pageNumber * dimensions * dimensions + i * dimensions + j + 1).toString(),
                        createVector(1/(dimensions+1) * (j+1), 1/(dimensions+1) * (i+1.5)),
                        createVector(1/(dimensions+1) * 3/4, 1/(dimensions+1) * 3/4),
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

        if (this.onMousePress)
            for (let i = 0; i < this.buttons.length; i++)
                if (this.buttons[i].isHovered(relativeMouse))
                    return new InLevel(
                        this,
                        this.resources,
                        {
                            level: this.resources.levels[this.pageNumber * 25 + i],
                            levelNum: this.pageNumber * 25 + i,
                        }
                    );
        
        return this;
    }

    draw(): void {
        let size: number = Math.min(width, height);
        let bounds: Rect = new Rect(createVector((width - size) / 2, (height - size) / 2), createVector((width + size) / 2, (height + size) / 2));
    
        this.buttons.forEach((button) => button.draw(bounds));
    }
}