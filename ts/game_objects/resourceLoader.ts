import * as p5Global from "p5/global";
import * as p5 from "p5";

import Level from "./level.js";

import resizeNN from "../libs/resizeNN.js"

export default class ResourceObj {
    commodoreFont: p5.Font;
    levels: Level[] = [];
    images: {star: {gray: p5.Image, yellow: p5.Image}};

    constructor() {
        this.commodoreFont = loadFont("resources/Commodore.ttf");
        this.loadLevels();

        this.images = {
            star: {
                gray:   createImage(0, 0),
                yellow: createImage(0, 0),
            },
        }

        loadImage("resources/images/star/star_gray.png",   (image) => this.images.star.gray   = resizeNN(image, 1000, 0));
        loadImage("resources/images/star/star_yellow.png", (image) => this.images.star.yellow = resizeNN(image, 1000, 0));

        this.images.star.gray
    }

    private async loadLevels(): Promise<void> {
        let filesToFetch = await this.getLevelMetadata();

        filesToFetch.forEach(async (filePath, index) => this.levels[index] = new Level(await (async (res) => res.ok ? res.text() : "")(await fetch(filePath))));
    }

    private async getLevelMetadata(): Promise<string[]> {
        return fetch("resources/levelMetadata.paths").then(
            res => {
                if (res.ok) return res.text();
                else return "";
            }
        ).then(
            pathsString => pathsString.split("\n").filter(Boolean)
        );
    }
}