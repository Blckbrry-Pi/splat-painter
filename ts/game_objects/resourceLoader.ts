import * as p5Global from "p5/global";
import * as p5 from "p5";

export default class {
  commodoreFont: p5.Font

  constructor() {
    this.commodoreFont = loadFont("/resources/Commodore.ttf");
  }
}