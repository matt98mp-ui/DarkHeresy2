import { state } from "./state.js";

export function exportCharacter() {
  return JSON.stringify(state.character);
}

export function importCharacter(json) {
  state.character = JSON.parse(json);
}
