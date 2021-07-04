import Level from "./level.js";
export default class ResourceObj {
    constructor() {
        this.levels = [];
        this.commodoreFont = loadFont("resources/Commodore.ttf");
        this.loadLevels();
    }
    async loadLevels() {
        let filesToFetch = await this.getLevelMetadata();
        filesToFetch.forEach(async (filePath, index) => this.levels[index] = new Level(await (async (res) => res.ok ? res.text() : "")(await fetch(filePath))));
    }
    async getLevelMetadata() {
        return fetch("resources/levelMetadata.paths").then(res => {
            if (res.ok)
                return res.text();
            else
                return "";
        }).then(pathsString => pathsString.split("\n").filter(Boolean));
    }
}
