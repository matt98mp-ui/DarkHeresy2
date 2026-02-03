import { state } from "./state.js";
import { scheduleAutosave } from "./autosave.js";
import { inferCategory, stableStringify } from "./utils.js";

function normalizeItem(raw) {
  const item = { ...(raw || {}) };
  if (item.qty == null) item.qty = 1;

  // keep unit weight separate; treat weight as unit weight if numeric
  const unitW = Number(item.weight);
  if (!Number.isNaN(unitW)) item._unitWeight = unitW;

  if (!item.category) item.category = inferCategory(item);
  return item;
}

// stack key: same name + same essential fields
function stackKey(item) {
  // Items may have varying schemas; name + dice/damage + traits + lore is usually enough
  return stableStringify({
    name: item.name || "",
    dice: item.dice || "",
    damage: item.damage || "",
    traits: item.traits || "",
    category: item.category || "",
    lore: item.lore || "",
    description: item.description || "",
  });
}

export function addItem(rawItem) {
  const item = normalizeItem(rawItem);

  // Prefer stacking for consumables/ammo or when explicitly stackable
  const wantsStack = Boolean(item.stackable) || item.category === "Ammo" || item.category === "Explosives" || item.category === "Medical" || item.category === "Supplies";
  const key = stackKey(item);

  if (wantsStack) {
    const existingIndex = (state.inventory || []).findIndex((x) => stackKey(normalizeItem(x)) === key);
    if (existingIndex >= 0) {
      const ex = state.inventory[existingIndex];
      ex.qty = (Number(ex.qty) || 1) + (Number(item.qty) || 1);
      scheduleAutosave();
      return;
    }
  }

  state.inventory.push(item);
  scheduleAutosave();
}

export function incrementItem(index, delta = 1) {
  const it = state.inventory?.[index];
  if (!it) return;
  it.qty = Math.max(1, (Number(it.qty) || 1) + delta);
  scheduleAutosave();
}

export function decrementItem(index, delta = 1) {
  const it = state.inventory?.[index];
  if (!it) return;
  const q = (Number(it.qty) || 1) - delta;
  if (q <= 0) {
    state.inventory.splice(index, 1);
  } else {
    it.qty = q;
  }
  scheduleAutosave();
}

export function removeItem(index) {
  // Backward compat: remove means delete row
  state.inventory.splice(index, 1);
  scheduleAutosave();
}

// Weapon slots live on the character, not the generic inventory list.
export function equipWeaponSlot(slot, weapon) {
  state.character.weaponSlots ||= [null, null, null];
  const idx = Math.max(0, Math.min(2, Number(slot) || 0));
  state.character.weaponSlots[idx] = weapon;
  state.selectedWeaponSlot = idx;
  scheduleAutosave();
}
