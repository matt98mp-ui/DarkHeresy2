import { state } from "./state.js";
import { scheduleAutosave } from "./autosave.js";

export function learnPower(power) {
  state.character.psychicPowers ||= [];
  state.character.psychicPowers.push(power);
  scheduleAutosave();
}

export function removePower(index) {
  state.character.psychicPowers.splice(index, 1);
  scheduleAutosave();
}
