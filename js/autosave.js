import { state } from "./state.js";
import { exportCharacter } from "./character.js";

const SLOT_PREFIX = "darkheresy_slot_";

export const scheduleAutosave = (() => {
  let timer = null;

  return function () {
    if (!state.autosaveEnabled) return;

    clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        localStorage.setItem(
          SLOT_PREFIX + state.selectedSlot,
          exportCharacter()
        );
      } catch (e) {
        console.warn("Autosave failed", e);
      }
    }, 700);
  };
})();
