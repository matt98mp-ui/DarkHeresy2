import { state } from "./state.js";

const PREFIX = "darkheresy_slot_";

export function saveSlot(slot) {
  localStorage.setItem(PREFIX + slot, JSON.stringify(state));
}

export function loadSlot(slot) {
  const data = localStorage.getItem(PREFIX + slot);
  if (!data) return;
  Object.assign(state, JSON.parse(data));
}
