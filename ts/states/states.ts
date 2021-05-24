import ResourceObj from "../resourceLoader.js";

export default interface State {
  resources: ResourceObj;
  stateStart: number;

  update(): State;
  draw(): void;   
}