import { state } from "./state.js";
import { snapshot } from "./history.js";
import { scheduleAutosave } from "./autosave.js";

export function attachWeaponMod(slot, mod) {
  snapshot();
  const s = Math.max(0, Math.min(2, Number(slot)||0));
  state.weaponAttachments ||= {};
  state.weaponAttachments[s] ||= [];
  // don't duplicate same mod
  if (!state.weaponAttachments[s].some(m => m.name === mod.name)) {
    state.weaponAttachments[s].push(mod);
  }
  scheduleAutosave();
}
