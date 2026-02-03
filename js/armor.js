import { state } from "./state.js";
import { scheduleAutosave } from "./autosave.js";

export function equipArmor(armor) {
  state.character.armor = armor;
  scheduleAutosave();
}
