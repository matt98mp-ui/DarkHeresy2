import { state } from "./state.js";
import { el } from "./dom.js";

export function applyGMPreset(preset) {
  state.gmPreset = preset;
}

export function resetGMSettings() {
  state.gmPreset = null;
}

export function toggleGMPanel() {
  state.gmOpen = !state.gmOpen;
  const panel = el("gmPanel");
  if (panel) panel.style.display = state.gmOpen ? "block" : "none";
}
