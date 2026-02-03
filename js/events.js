import { addItem, equipWeaponSlot, removeItem, incrementItem, decrementItem } from "./inventory.js";
import { exportCharacter, importCharacter } from "./character.js";
import { saveSlot, loadSlot } from "./slots.js";
import { equipArmor } from "./armor.js";
import { rollDice, rollSave, clearDiceLog, logDice, rollWarpRisk } from "./dice.js";
import { syncAbilitiesToStateAndUI, setAllScores, applyStandardArray, roll4d6DropLowest } from "./abilities.js";
import { attachWeaponMod } from "./weaponMods.js";
import { showInfoForSelected, closeInfo } from "./info.js";
import { learnPower, removePower } from "./psychic.js";
import { openBrowser, browserSearch } from "./browser.js";
import { applyGMPreset, resetGMSettings, toggleGMPanel } from "./gm.js";
import { learnTalent } from "./talents.js";
import { state } from "./state.js";
import { scheduleAutosave } from "./autosave.js";
import { snapshot, undo, redo, canUndo, canRedo } from "./history.js";
import { renderAll } from "./ui.js";
import { el, qs } from "./dom.js";


function updateUndoRedoUI() {
  const u = qs('[data-action="undo"]');
  const r = qs('[data-action="redo"]');
  if (u) u.disabled = !canUndo();
  if (r) r.disabled = !canRedo();
}


function validateDatalistInput(inputId, listId, warnId) {
  const input = el(inputId);
  const list = el(listId);
  const warn = el(warnId);
  if (!input || !list) return;

  const val = String(input.value || "").trim();
  if (!val) {
    input.classList.remove("input-warn");
    if (warn) warn.style.display = "none";
    return;
  }

  const match = Array.from(list.options).some(o => o.value === val);
  if (!match) {
    input.classList.add("input-warn");
    if (warn) warn.style.display = "block";
  } else {
    input.classList.remove("input-warn");
    if (warn) warn.style.display = "none";
  }
}

function saveInvPrefs() {
  try {
    localStorage.setItem("dh_inventory_ui", JSON.stringify({
      search: state.inventorySearch || "",
      sort: state.inventorySort || "name",
      group: Boolean(state.inventoryGroup),
    }));
  } catch {
    // ignore storage failures
  }
}

function isTypingTarget(t) {
  return t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
}

function findByName(list, name) {
  const n = String(name || "").trim();
  if (!n) return null;
  return (list || []).find(x => String(x?.name || "").trim() === n) || null;
}

export function initEvents() {

  // Glance (editable header) bindings
  const bind = (id, fn, isNumber=false) => {
    const node = el(id);
    if (!node || node.dataset.bound) return;
    node.dataset.bound = "1";
    node.addEventListener("input", () => {
      snapshot();
      const v = isNumber ? Number(node.value || 0) : node.value;
      fn(v);
      scheduleAutosave();
      updateUndoRedoUI?.();
      renderAll();
    });
  };

  state.character ||= {};
  bind("glanceNameInput", (v) => (state.character.name = String(v || "")));
  bind("glanceCareerInput", (v) => (state.character.career = String(v || "")));
  bind("glanceRankInput", (v) => (state.character.rank = Number(v || 0)), true);
  // Career/Homeworld searchable inputs (datalist-backed)
  bind("glanceCareerSelect", (v) => (state.character.career = String(v || "")));
  bind("glanceHomeworldSelect", (v) => (state.character.homeworld = String(v || "")));
  // Validate against suggestion lists (still allow custom values)
  const careerInput = el("glanceCareerSelect");
  if (careerInput && !careerInput.dataset.boundValidate) {
    careerInput.dataset.boundValidate = "1";
    careerInput.addEventListener("input", () => validateDatalistInput("glanceCareerSelect", "careerList", "careerWarn"));
    validateDatalistInput("glanceCareerSelect", "careerList", "careerWarn");
  }
  const homeInput = el("glanceHomeworldSelect");
  if (homeInput && !homeInput.dataset.boundValidate) {
    homeInput.dataset.boundValidate = "1";
    homeInput.addEventListener("input", () => validateDatalistInput("glanceHomeworldSelect", "homeworldList", "homeworldWarn"));
    validateDatalistInput("glanceHomeworldSelect", "homeworldList", "homeworldWarn");
  }



  
  bind("glanceWoundsInput", (v) => (state.character.wounds = Number(v || 0)), true);
  bind("glanceFateInput", (v) => (state.character.fate = Number(v || 0)), true);
  bind("glanceCorruptionInput", (v) => (state.character.corruption = Number(v || 0)), true);
  bind("glanceInsanityInput", (v) => (state.character.insanity = Number(v || 0)), true);


  // Click actions
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;

    switch (btn.dataset.action) {
      case "undo": {
        if (undo()) {
          renderAll();
        }
        updateUndoRedoUI();
        return;
      }
      case "redo": {
        if (redo()) {
          renderAll();
        }
        updateUndoRedoUI();
        return;
      }
      case "reset-ui": {
        // Clears UI-only localStorage keys (does not touch character slots)
        try {
          localStorage.removeItem("dh_browser_page_size");
          localStorage.removeItem("dh_browser_state_by_kind");
          localStorage.removeItem("dh_inventory_ui");
          localStorage.removeItem("dh_theme");
          localStorage.removeItem("dh_density");
        } catch {
          // ignore storage failures
        }
        // reset in-memory UI state
        state.browserPageSize = 25;
        state.browserPage = 0;
        state.browserTerm = "";
        state.browserSelectedIndex = 0;
        state.browserStateByKind = {};
        state.inventorySearch = "";
        state.inventorySort = "name";
        state.inventoryGroup = true;
        document.body.dataset.theme = "grimdark";
        document.body.dataset.density = "comfortable";
        const themeSelect = el("themeSelect");
        if (themeSelect) themeSelect.value = "grimdark";
        const ds = el("densitySelect");
        if (ds) ds.value = "comfortable";
        const invS = el("inventorySearch");
        if (invS) invS.value = "";
        const invSort = el("inventorySort");
        if (invSort) invSort.value = "name";
        const invGrp = el("inventoryGroup");
        if (invGrp) invGrp.checked = true;
        // refresh UI
        renderAll();
        updateUndoRedoUI?.();
        return;
      }

      case "reset-theme": {
        try {
          localStorage.removeItem("dh_theme");
          localStorage.removeItem("dh_density");
        } catch {
          // ignore storage failures
        }
        document.body.dataset.theme = "grimdark";
        document.body.dataset.density = "comfortable";
        // sync selects
        const themeSelect2 = el("themeSelect");
        if (themeSelect2) themeSelect2.value = "grimdark";
        const ds2 = el("densitySelect");
        if (ds2) ds2.value = "comfortable";
        return;
      }
      // --- modal actions ---
      case "info-equip-weapon":
        snapshot();
        if (state.selectedInfo) equipWeaponSlot(state.selectedWeaponSlot ?? 0, state.selectedInfo);
        break;
      case "info-equip-armor":
        snapshot();
        if (state.selectedInfo) equipArmor(state.selectedInfo);
        break;
      case "info-learn-power":
        snapshot();
        if (state.selectedInfo) learnPower(state.selectedInfo);
        break;
      case "info-learn-talent":
        snapshot();
        if (state.selectedInfo) learnTalent(state.selectedInfo);
        break;
      case "info-close":
        closeInfo();
        break;

      // --- weapon slot UI helpers ---
      case "weapon-slot-select":
        state.selectedWeaponSlot = Number(btn.dataset.slot) || 0;
        break;
      case "weapon-slot-info": {
        const i = Number(btn.dataset.slot) || 0;
        const w = state.character?.weaponSlots?.[i];
        if (w) {
          state.selectedWeaponSlot = i;
          state.selectedInfo = w;
          showInfoForSelected();
        }
        break;
      }

      // --- main buttons ---
      case "equip-weapon-slot": {
        snapshot();
        const sel = el("weaponSelect");
        const chosen = findByName(state.data?.weapons, sel?.value);
        if (chosen) equipWeaponSlot(state.selectedWeaponSlot ?? 0, chosen);
        break;
      }
      case "add-item":
        snapshot(); addItem({ name: "Lasgun" }); break;
      case "equip-armor":
        snapshot(); equipArmor({ name: "Flak Armor" }); break;

      case "export-character": {
        const box = el("jsonBox");
        if (box) box.value = exportCharacter();
        break;
      }
      case "import-character": {
        snapshot();
        const box = el("jsonBox");
        if (box && box.value) importCharacter(box.value);
        break;
      }
      case "save-slot":
        snapshot(); saveSlot(0); break;
      case "load-slot":
        snapshot(); loadSlot(0); break;

      case "roll-dice":
        snapshot();
        {
          const expr = el("diceExpr")?.value || "1d20";
          const r = rollDice(expr);
          const msg = `${expr} = ${r.total} [${r.rolls.join(", ")}]${r.mod ? (r.mod>0?` +${r.mod}`:` ${r.mod}`) : ""}`;
          state.lastDiceResult = msg;
          logDice(msg);
        }
        break;
      case "roll-save":
        snapshot();
        {
          const abil = btn.dataset.ability;
          const r = rollSave(abil);
          const msg = `${abil} save: ${r.roll} + ${r.abil} = ${r.total}`;
          state.lastDiceResult = msg;
          logDice(msg);
        }
        break;

      case "browser-next":
        state.browserPage = (state.browserPage || 0) + 1;
        openBrowser(state.browserKind);
        break;

      case "browser-prev":
        state.browserPage = Math.max(0, (state.browserPage || 0) - 1);
        openBrowser(state.browserKind);
        break;

      case "browse":
        openBrowser(btn.dataset.kind);
        break;

      case "learn-power": learnPower({ name: "Power" }); break;
      case "remove-psychic":
        snapshot(); removePower(0); break;

      case "apply-gm-preset":
        snapshot(); applyGMPreset(btn.dataset.preset); break;
      case "reset-gm":
        snapshot(); resetGMSettings(); break;
      case "toggle-gm": toggleGMPanel(); break;

      case "browser-equip": {
        snapshot();
        const results = state.browserResults || [];
        const idx = Math.max(0, Math.min(results.length - 1, state.browserSelectedIndex ?? 0));
        const item = results[idx];
        if (!item) break;

        const kind = String(state.browserKind || "weapons");
        if (kind === "weapons") {
          equipWeaponSlot(state.selectedWeaponSlot ?? 0, item);
        } else if (kind === "armors") {
          equipArmor(item);
        } else if (kind === "gear") {
          addItem(item);
        } else if (kind === "talents") {
          learnTalent(item);
        } else if (kind === "psychic" || kind === "psychicPowers") {
          learnPower(item);
        } else {
          state.selectedInfo = item;
          showInfoForSelected();
        }
        break;
      }

      case "info-selected":
        // Keep existing "info-selected" for gear/talents/weapons select-based info if present:
        // use state.selectedInfo already set by callers; otherwise no-op
        showInfoForSelected();
        break;

      case "inventory-inc":
        snapshot();
        incrementItem(Number(btn.dataset.index), 1);
        break;
      case "inventory-dec":
        snapshot();
        decrementItem(Number(btn.dataset.index), 1);
        break;
      case "remove-inventory":
        snapshot();
        removeItem(Number(btn.dataset.index));
        break;
      case "inventory-info": {
        const idx = Number(btn.dataset.index);
        const it = state.inventory?.[idx];
        if (it) { state.selectedInfo = it; showInfoForSelected(); }
        break;
      }
      
      case "clear-dice-log":
        snapshot();
        clearDiceLog();
        state.lastDiceResult = "";
        break;
      case "recalc-hp": {
        snapshot();
        // Simple recalc: (rank/level or 1) * (6 + CON mod), minimum 1
        state.character ||= {};
        const lvl = Number(state.character.rank ?? state.character.level ?? 1) || 1;
        const conMod = state.character?.abilities?.CON ?? 0;
        state.character.wounds = Math.max(1, lvl * (6 + conMod));
        break;
      }
      case "print-sheet":
        window.print();
        return;
      case "roll-warp-risk": {
        snapshot();
        const r = rollWarpRisk();
        const msg = `Warp Risk 1d100 = ${r}` + (r >= 75 ? " ⚠️ Perils?" : "");
        state.lastDiceResult = msg;
        logDice(msg);
        break;
      }
      case "attach-weapon-mod": {
        const slotSel = el("weaponModSlotSelect");
        const modSel = el("weaponModSelect");
        const slot = Number(slotSel?.value || state.selectedWeaponSlot || 0);
        const name = modSel?.value || "";
        const mod = (state.data.weaponMods || []).find(m => m.name === name) || (name ? { name } : null);
        if (mod) attachWeaponMod(slot, mod);
        break;
      }
      case "abil-point-buy-reset":
        setAllScores(8);
        break;
      case "abil-standard-array":
        applyStandardArray();
        break;
      case "abil-roll-4d6": {
        const arr = roll4d6DropLowest();
        const msg = `4d6 drop lowest → [${arr.join(", ")}]`;
        state.lastDiceResult = msg;
        logDice(msg);
        break;
      }

      default:
        console.warn("Unhandled action:", btn.dataset.action);
    }

    saveInvPrefs();
    renderAll();
  });

  
  // Browser row: single click = info, double click = equip (weapons)
  // Use a short timer so single-click doesn't fire when double-click happens.
  let clickTimer = null;

  document.addEventListener("click", (e) => {
    const row = e.target.closest('tr[data-action="browser-row"]');
    if (!row) return;

    const idx = Number(row.dataset.index);
    const results = state.browserResults || [];
    const item = results[idx];
    if (!item) return;

    state.browserSelectedIndex = idx;

    // Delay info open to allow dblclick to take precedence
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => {
      state.selectedInfo = item;
      showInfoForSelected();
      saveInvPrefs();
    renderAll();
    }, 200);
  });

  document.addEventListener("dblclick", (e) => {
    const row = e.target.closest('tr[data-action="browser-row"]');
    if (!row) return;

    clearTimeout(clickTimer);

    const idx = Number(row.dataset.index);
    const results = state.browserResults || [];
    const item = results[idx];
    if (!item) return;

    state.browserSelectedIndex = idx;

    const kind = String(state.browserKind || "weapons");
    if (kind === "weapons") {
      equipWeaponSlot(state.selectedWeaponSlot ?? 0, item);
      saveInvPrefs();
    renderAll();
    } else if (kind === "armors") {
      equipArmor(item);
      renderAll();
    } else if (kind === "gear") {
      addItem(item);
      renderAll();
    } else if (kind === "talents") {
      learnTalent(item);
      renderAll();
    } else if (kind === "psychic" || kind === "psychicPowers") {
      learnPower(item);
      renderAll();
    } else {
      state.selectedInfo = item;
      showInfoForSelected();
      renderAll();
    }
  });


  // Inventory row click opens info
  document.addEventListener("click", (e) => {
    const row = e.target.closest('tr[data-action="inventory-row"]');
    if (!row) return;
    const idx = Number(row.dataset.index);
    const it = state.inventory?.[idx];
    if (!it) return;
    state.selectedInfo = it;
    showInfoForSelected();
    renderAll();
  });


  
  // Theme selector
  const themeSel = el("themeSelect");
  const densitySel = el("densitySelect");
  if (themeSel && !themeSel.dataset.bound) {
    themeSel.dataset.bound = "1";
    themeSel.addEventListener("change", () => {
      const v = themeSel.value;
      document.body.dataset.theme = v;
      try {
        localStorage.setItem("dh_theme", v);
      } catch {
        // ignore storage failures
      }
    });
  }

  // Density selector
  if (densitySel && !densitySel.dataset.bound) {
    densitySel.dataset.bound = "1";
    // initialize select from body dataset
    if (document.body.dataset.density) densitySel.value = document.body.dataset.density;
    densitySel.addEventListener("change", () => {
      const v = densitySel.value;
      document.body.dataset.density = v;
      try {
        localStorage.setItem("dh_density", v);
      } catch {
        // ignore storage failures
      }
    });
  }


  // iOS-friendly Career/Homeworld selects with Other… fallback
  const careerSel = el("glanceCareerSelect");
  const careerOther = el("glanceCareerOther");
  if (careerSel && !careerSel.dataset.boundIOS) {
    careerSel.dataset.boundIOS = "1";
    careerSel.addEventListener("change", () => {
      snapshot();
      state.character ||= {};
      if (careerSel.value === "__other__") {
        if (careerOther) careerOther.style.display = "inline-block";
        state.character.career = careerOther?.value || "";
      } else {
        if (careerOther) careerOther.style.display = "none";
        state.character.career = careerSel.value || "";
      }
      scheduleAutosave();
      renderAll();
      updateUndoRedoUI?.();
    });
  }
  if (careerOther && !careerOther.dataset.boundIOS) {
    careerOther.dataset.boundIOS = "1";
    careerOther.addEventListener("input", () => {
      snapshot();
      state.character ||= {};
      state.character.career = careerOther.value || "";
      scheduleAutosave();
      renderAll();
      updateUndoRedoUI?.();
    });
  }

  const homeSel = el("glanceHomeworldSelect");
  const homeOther = el("glanceHomeworldOther");
  if (homeSel && !homeSel.dataset.boundIOS) {
    homeSel.dataset.boundIOS = "1";
    homeSel.addEventListener("change", () => {
      snapshot();
      state.character ||= {};
      if (homeSel.value === "__other__") {
        if (homeOther) homeOther.style.display = "inline-block";
        state.character.homeworld = homeOther?.value || "";
      } else {
        if (homeOther) homeOther.style.display = "none";
        state.character.homeworld = homeSel.value || "";
      }
      scheduleAutosave();
      renderAll();
      updateUndoRedoUI?.();
    });
  }
  if (homeOther && !homeOther.dataset.boundIOS) {
    homeOther.dataset.boundIOS = "1";
    homeOther.addEventListener("input", () => {
      snapshot();
      state.character ||= {};
      state.character.homeworld = homeOther.value || "";
      scheduleAutosave();
      renderAll();
      updateUndoRedoUI?.();
    });
  }

// Inventory controls
  el("inventorySearch")?.addEventListener("input", (e) => {
    state.inventorySearch = e.target.value || "";
    renderAll();
  });
  el("inventorySort")?.addEventListener("change", (e) => {
    state.inventorySort = e.target.value || "name";
    renderAll();
  });
  el("inventoryGroup")?.addEventListener("change", (e) => {
    state.inventoryGroup = Boolean(e.target.checked);
    renderAll();
  });

// Browser search input
  
  // Page size dropdown
  el("browserPageSize")?.addEventListener("change", (e) => {
    const v = Number(e.target.value) || 25;
    state.browserPageSize = v;
    try {
      localStorage.setItem("dh_browser_page_size", String(v));
    } catch {
      // ignore storage failures
    }
    state.browserPage = 0;
    openBrowser(state.browserKind);
    renderAll();
  });

el("browserSearch")?.addEventListener("input", (e) => {
    browserSearch(e.target.value);
    state.browserSelectedIndex = 0;
    renderAll();
  });

  // Keep selected weapon slot in sync with other selectors (if present)
  el("atk_weaponSlot")?.addEventListener("change", (e) => {
    state.selectedWeaponSlot = Number(e.target.value) || 0;
    renderAll();
  });
  el("weaponModSlotSelect")?.addEventListener("change", (e) => {
    state.selectedWeaponSlot = Number(e.target.value) || 0;
    renderAll();
  });

  
  // Ability score inputs → recompute mods/saves
  ["str","dex","con","int","wis","cha"].forEach((id) => {
    const node = el(id);
    if (!node || node.dataset.boundAbil) return;
    node.dataset.boundAbil = "1";
    node.addEventListener("input", () => {
      snapshot();
      syncAbilitiesToStateAndUI();
      renderAll();
      updateUndoRedoUI();
    });
  });
  // initial compute once
  syncAbilitiesToStateAndUI();

// Keyboard navigation (browser)
  document.addEventListener("keydown", (e) => {
    if (isTypingTarget(e.target)) return;

    const isMod = e.ctrlKey || e.metaKey;
    if (isMod && (e.key === "z" || e.key === "Z")) {
      if (undo()) { renderAll(); updateUndoRedoUI(); }
      e.preventDefault();
      return;
    }
    if (isMod && (e.key === "y" || e.key === "Y")) {
      if (redo()) { renderAll(); updateUndoRedoUI(); }
      e.preventDefault();
      return;
    }

    const results = state.browserResults || [];

    if (e.key === "Escape") {
      if (state.infoOpen) {
        closeInfo();
        renderAll();
        updateUndoRedoUI();
        return;
      }
    }

    if (!results.length) return;

    if (e.key === "ArrowDown") {
      state.browserSelectedIndex = Math.min(results.length - 1, (state.browserSelectedIndex ?? 0) + 1);
      renderAll();
      e.preventDefault();
      return;
    }
    if (e.key === "ArrowUp") {
      state.browserSelectedIndex = Math.max(0, (state.browserSelectedIndex ?? 0) - 1);
      renderAll();
      e.preventDefault();
      return;
    }
    if (e.key === "Enter") {
      const idx = Math.max(0, Math.min(results.length - 1, state.browserSelectedIndex ?? 0));
      state.selectedInfo = results[idx];
      showInfoForSelected();
      renderAll();
      e.preventDefault();
      return;
    }
  });
}
