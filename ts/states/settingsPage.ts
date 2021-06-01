import * as p5Global from "p5/global";
import p5 from "p5";

import State from "./states.js";

import Button from "../game_objects/button.js";
import Rect from "../game_objects/rect.js";

import ResourceObj from "../game_objects/resourceLoader.js";

export default class {
    resources: ResourceObj;
    
    onMousePress: boolean = false;
    mouseWasPressed: boolean = true;

    buttonLists: Button[][] = [];

    stateStart: number;
    stateEnd: number = 0;
    stateToReturnTo: State;

    constructor(prevState: State, resources: ResourceObj) {
        this.resources = resources;
        this.stateStart = window.millis !== undefined ? millis() : 0;
        this.stateToReturnTo = prevState;

        this.initButtons();
    }

    private initButtons(): void {
        let buttonStyle = {
            strk:  color(255, 255, 255),
            strkW: 0.006,
            fill:  color(100, 100, 100),
            textC: color(255, 255, 255),
        }

        // Back Button
        this.buttonLists.push([new Button(
            "Back", 
            createVector(0.15, 0.1),
            createVector(0.2, 0.1),
            this.resources.commodoreFont,
            buttonStyle.strk,
            buttonStyle.strkW,
            buttonStyle.fill,
            buttonStyle.textC,
        )]);

        // Music Volume
        {
            this.buttonLists.push([]);

            // Display
            this.buttonLists[this.buttonLists.length-1].push(new Button(
                "Music Volume: " + window.gameSettings.musicVolume,
                createVector(0.5, 0.25),
                createVector(0.3, 0.075),
                this.resources.commodoreFont,
                buttonStyle.strk,
                buttonStyle.strkW,
                buttonStyle.fill,
                buttonStyle.textC,
            ));
            // Down
            this.buttonLists[this.buttonLists.length-1].push(new Button(
                "<",
                createVector(0.25, 0.25),
                createVector(0.1, 0.075),
                this.resources.commodoreFont,
                buttonStyle.strk,
                buttonStyle.strkW,
                buttonStyle.fill,
                buttonStyle.textC,
            ));
            // Up
            this.buttonLists[this.buttonLists.length-1].push(new Button(
                ">",
                createVector(0.75, 0.25),
                createVector(0.1, 0.075),
                this.resources.commodoreFont,
                buttonStyle.strk,
                buttonStyle.strkW,
                buttonStyle.fill,
                buttonStyle.textC,
            ));
        }

        // SFx Volume
        {
            this.buttonLists.push([]);

            // Display
            this.buttonLists[this.buttonLists.length-1].push(new Button(
                "SFx Volume: " + window.gameSettings.sfxVolume,
                createVector(0.5, 0.35),
                createVector(0.3, 0.075),
                this.resources.commodoreFont,
                buttonStyle.strk,
                buttonStyle.strkW,
                buttonStyle.fill,
                buttonStyle.textC,
            ));
            // Down
            this.buttonLists[this.buttonLists.length-1].push(new Button(
                "<",
                createVector(0.25, 0.35),
                createVector(0.1, 0.075),
                this.resources.commodoreFont,
                buttonStyle.strk,
                buttonStyle.strkW,
                buttonStyle.fill,
                buttonStyle.textC,
            ));
            // Up
            this.buttonLists[this.buttonLists.length-1].push(new Button(
                ">",
                createVector(0.75, 0.35),
                createVector(0.1, 0.075),
                this.resources.commodoreFont,
                buttonStyle.strk,
                buttonStyle.strkW,
                buttonStyle.fill,
                buttonStyle.textC,
            ));
        }
    }

    update(): State {
        this.onMousePress = mouseIsPressed && !this.mouseWasPressed;
        this.mouseWasPressed = mouseIsPressed;

        let size: number = Math.min(width, height);
        let bounds: Rect = new Rect(createVector((width - size) / 2, (height - size) / 2), createVector((width + size) / 2, (height + size) / 2));
        let relativeMouse: p5.Vector = bounds.getUnscaledPoint(createVector(mouseX, mouseY));

        if (this.buttonLists[0][0].isHovered(relativeMouse) && this.onMousePress) if (!this.stateEnd) this.stateEnd = millis() + 200;

        this.updateMusicVolume(relativeMouse);
        this.updateSfxVolume(relativeMouse);

        if (this.stateEnd && millis() >= this.stateEnd) return this.stateToReturnTo;
        else return this;
    }
    
    private updateMusicVolume(relativeMouse: p5.Vector): void {
        if (this.buttonLists[1][1].isHovered(relativeMouse) && this.onMousePress) {
            window.gameSettings.musicVolume -= 10;
        }
        if (this.buttonLists[1][2].isHovered(relativeMouse) && this.onMousePress) {
            window.gameSettings.musicVolume += 10;
        }
        window.gameSettings.musicVolume = constrain(window.gameSettings.musicVolume, 0, 100);
        this.buttonLists[1][0].text = this.buttonLists[1][0].text.split(new RegExp("\\d{1,3}"))[0] + window.gameSettings.musicVolume;
    }
    
    private updateSfxVolume(relativeMouse: p5.Vector): void {
        if (this.buttonLists[2][1].isHovered(relativeMouse) && this.onMousePress) {
            window.gameSettings.sfxVolume -= 10;
        }
        if (this.buttonLists[2][2].isHovered(relativeMouse) && this.onMousePress) {
            window.gameSettings.sfxVolume += 10;
        }
        window.gameSettings.sfxVolume = constrain(window.gameSettings.sfxVolume, 0, 100);
        this.buttonLists[2][0].text = this.buttonLists[2][0].text.split(new RegExp("\\d{1,3}"))[0] + window.gameSettings.sfxVolume;
    }

    draw(): void {
        let size = Math.min(width, height);
        let bounds = new Rect(createVector((width - size) / 2, (height - size) / 2), createVector((width + size) / 2, (height + size) / 2));

        this.stateToReturnTo.draw();
        
        let stateOpacity = (this.stateEnd ? constrain(this.stateEnd - millis(), 0, 200) : constrain(millis() - this.stateStart, 0, 200)) / 200;

        fill(0, stateOpacity * 200)
        noStroke();
        rectMode(CORNER);
        rect(0, 0, width, height);

        this.buttonLists.forEach((buttons) => buttons.forEach((button) => button.draw(bounds, stateOpacity)));
    }
}

