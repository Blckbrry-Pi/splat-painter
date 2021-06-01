import * as p5Global from "p5/global";
import * as p5 from "p5";

import Level from "./level.js";

export default class ResourceObj {
    commodoreFont: p5.Font;
    levels: Level[] = [];

    constructor() {
        this.commodoreFont = loadFont("/resources/Commodore.ttf");
        this.loadLevels();
    }

    private async loadLevels(): Promise<void> {
        let filesToFetch = await this.getLevelMetadata();

        filesToFetch.forEach(async (filePath) => this.levels.push(new Level(await (async (res) => res.ok ? res.text() : "")(await fetch(filePath)))));
    }

    private async getLevelMetadata(): Promise<string[]> {
        return fetch("/resources/levelMetadata.paths").then(
        res => {
            if (res.ok) return res.text();
            else return "";
        }
        ).then(
            pathsString => pathsString.split("\n").filter(Boolean)
        );
    }
}