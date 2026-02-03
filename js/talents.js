import { state } from "./state.js";
import { scheduleAutosave } from "./autosave.js";

export function learnTalent(talent) {
  state.character.talents ||= [];
  state.character.talents.push(talent);
  scheduleAutosave();
}
