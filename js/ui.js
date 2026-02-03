import { state } from "./state.js";
import { el } from "./dom.js";

function esc(s) {
  return String(s ?? "").replace(/[&<>"]/g, (c) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"
  }[c]));
}

export function renderCharacter() {
  const wounds = getEl("wounds");
  if (wounds) wounds.textContent = state.character?.wounds ?? 0;
}


export function renderGlance() {
  const ch = state.character || {};

  const setVal = (id, val) => {
    const node = getEl(id);
    if (!node) return;
    const v = (val ?? "");
    if (node.value !== String(v)) node.value = String(v);
  };

  // Name + vitals
  setVal("glanceNameInput", ch.name || "");
  setVal("glanceRankInput", ch.rank ?? ch.level ?? "");
  setVal("glanceWoundsInput", ch.wounds ?? 0);
  setVal("glanceFateInput", ch.fate ?? ch.fatePoints ?? 0);
  setVal("glanceCorruptionInput", ch.corruption ?? 0);
  setVal("glanceInsanityInput", ch.insanity ?? 0);

  // Career/Homeworld searchable inputs
  setVal("glanceCareerSelect", ch.career || ch.class || "");
  setVal("glanceHomeworldSelect", ch.homeworld || ch.background || ch.race || "");

  // iOS select sync
  const careerSel = getEl("glanceCareerSelect");
  const careerOther = getEl("glanceCareerOther");
  const career = String(ch.career || ch.class || "");
  if (careerSel) {
    const has = Array.from(careerSel.options).some(o => o.value === career);
    if (career && has) {
      careerSel.value = career;
      if (careerOther) careerOther.style.display = "none";
    } else if (career) {
      careerSel.value = "__other__";
      if (careerOther) { careerOther.style.display = "inline-block"; careerOther.value = career; }
    } else {
      careerSel.value = "";
      if (careerOther) careerOther.style.display = "none";
    }
  }

  const homeSel = getEl("glanceHomeworldSelect");
  const homeOther = getEl("glanceHomeworldOther");
  const home = String(ch.homeworld || ch.background || ch.race || "");
  if (homeSel) {
    const has = Array.from(homeSel.options).some(o => o.value === home);
    if (home && has) {
      homeSel.value = home;
      if (homeOther) homeOther.style.display = "none";
    } else if (home) {
      homeSel.value = "__other__";
      if (homeOther) { homeOther.style.display = "inline-block"; homeOther.value = home; }
    } else {
      homeSel.value = "";
      if (homeOther) homeOther.style.display = "none";
    }
  }
}


export function renderInventory() {
  // Controls
  const search = getEl("inventorySearch");
  if (search && search.value !== (state.inventorySearch || "")) search.value = state.inventorySearch || "";

  const sortSel = getEl("inventorySort");
  if (sortSel && sortSel.value !== (state.inventorySort || "name")) sortSel.value = state.inventorySort || "name";

  const groupChk = getEl("inventoryGroup");
  if (groupChk && groupChk.checked !== Boolean(state.inventoryGroup)) groupChk.checked = Boolean(state.inventoryGroup);

  // Data
  const raw = state.inventory || [];
  const term = String(state.inventorySearch || "").trim().toLowerCase();

  let items = raw.map((it, idx) => ({ it, idx }));

  if (term) {
    items = items.filter(({ it }) => {
      const t = (String(it?.name || "") + " " + String(it?.category || "") + " " + (Array.isArray(it?.traits) ? it.traits.join(" ") : String(it?.traits || ""))).toLowerCase();
      return t.includes(term);
    });
  }

  // Sorting
  const sort = state.inventorySort || "name";
  const getWeight = (it) => {
    const u = Number(it?._unitWeight ?? it?.weight) || 0;
    const q = Number(it?.qty) || 1;
    return u * q;
  };

  items.sort((a, b) => {
    const A = a.it, B = b.it;
    if (sort === "weight") return getWeight(B) - getWeight(A);
    if (sort === "category") return String(A?.category || "").localeCompare(String(B?.category || "")) || String(A?.name || "").localeCompare(String(B?.name || ""));
    // name
    return String(A?.name || "").localeCompare(String(B?.name || ""));
  });

  // Render table
  const table = getEl("inventoryTable");
  if (table) {
    table.innerHTML = `<tr><th>Item</th><th>Category</th><th>Qty</th><th>Unit Wt</th><th>Total Wt</th><th>Traits</th><th>Actions</th></tr>`;

    let currentCat = null;
    const addCatRow = (cat) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td colspan="7" style="font-weight:700; opacity:.9; background:rgba(255,255,255,0.03);">${esc(cat)}</td>`;
      table.appendChild(tr);
    };

    for (const { it, idx } of items) {
      const cat = it?.category || "Misc";
      if (state.inventoryGroup && cat !== currentCat) {
        currentCat = cat;
        addCatRow(cat);
      }

      const name = it?.name ?? "(item)";
      const qty = Number(it?.qty) || 1;
      const unitW = Number(it?._unitWeight ?? it?.weight);
      const unitWTxt = Number.isFinite(unitW) ? unitW : "";
      const totalW = Number.isFinite(unitW) ? (unitW * qty) : "";
      const traits = Array.isArray(it?.traits) ? it.traits.join(", ") : (it?.traits ?? "");

      const tr = document.createElement("tr");
      tr.style.cursor = "pointer";
      tr.dataset.action = "inventory-row";
      tr.dataset.index = String(idx);
      tr.innerHTML = `
        <td>${esc(name)}</td>
        <td>${esc(cat)}</td>
        <td>${esc(qty)}</td>
        <td>${esc(unitWTxt)}</td>
        <td>${esc(totalW)}</td>
        <td>${esc(traits)}</td>
        <td>
          <button type="button" class="button" data-action="inventory-info" data-index="${idx}">ℹ️</button>
          <button type="button" class="button" data-action="inventory-inc" data-index="${idx}">+</button>
          <button type="button" class="button" data-action="inventory-dec" data-index="${idx}">−</button>
          <button type="button" class="button" data-action="remove-inventory" data-index="${idx}">Remove</button>
        </td>
      `;
      table.appendChild(tr);
    }
  }

  // Totals
  const totalEl = getEl("totalWeight");
  const encEl = getEl("encumbrance");

  const total = (state.inventory || []).reduce((s, it) => {
    const u = Number(it?._unitWeight ?? it?.weight) || 0;
    const q = Number(it?.qty) || 1;
    return s + u * q;
  }, 0);

  if (totalEl) totalEl.textContent = String(total);

  if (encEl) {
    // Simple tiers; replace with your system later
    const tier = total <= 15 ? "Light" : total <= 30 ? "Medium" : "Heavy";
    encEl.textContent = tier;
  }
}

export function renderSelectedSlotLabel() {
  const node = getEl("selectedWeaponSlotLabel");
  if (!node) return;
  const s = (Number(state.selectedWeaponSlot) || 0) + 1;
  node.textContent = String(s);
}

export function renderWeaponSlots() {
  const table = getEl("weaponTable");
  if (!table) return;

  // keep header row
  table.innerHTML = `<tr><th>Slot</th><th>Weapon</th><th>Damage</th><th>Traits</th><th>Actions</th></tr>`;

  const slots = state.character?.weaponSlots || [null, null, null];
  const selected = Number(state.selectedWeaponSlot) || 0;

  slots.forEach((w, i) => {
    const name = w?.name ?? "(empty)";
    const dmg = w?.dice ?? w?.damage ?? "";
    const baseTraits = Array.isArray(w?.traits) ? w.traits.join(", ") : (w?.traits ?? "");
    const att = (state.weaponAttachments?.[i] || []).map(a => a.name).join(", ");
    const traits = [baseTraits, att ? `Attachments: ${att}` : ""].filter(Boolean).join(" • ");
    const isSel = i === selected;

    const row = document.createElement("tr");
    row.style.cursor = "pointer";
    if (isSel) row.style.outline = "2px solid rgba(200,200,200,0.35)";
    row.addEventListener("click", () => {
      state.selectedWeaponSlot = i;
      renderSelectedSlotLabel();
  renderWeaponSlots();
    });

    row.innerHTML = `
      <td>${i+1}</td>
      <td>${esc(name)}</td>
      <td>${esc(dmg)}</td>
      <td>${esc(traits)}</td>
      <td>
        <button type="button" class="button" data-action="weapon-slot-select" data-slot="${i}">Select</button>
        ${w ? `<button type="button" class="button" data-action="weapon-slot-info" data-slot="${i}">ℹ️</button>` : ""}
      </td>
    `;
    table.appendChild(row);
  });

  // Sync any other slot selects if present
  const atkSel = getEl("atk_weaponSlot");
  if (atkSel && atkSel.value !== String(selected)) atkSel.value = String(selected);
  const modSel = getEl("weaponModSlotSelect");
  if (modSel && modSel.value !== String(selected)) modSel.value = String(selected);
}

export function renderBrowser() {
  const container = getEl("browserResults");
  if (!container) return;

  container.innerHTML = "";

  const results = state.browserResults || [];
  if (!results.length) {
    container.textContent = "No results.";
    return;
  }

  const kind = String(state.browserKind || "weapons");
  const max = results.length - 1;
  if (state.browserSelectedIndex == null) state.browserSelectedIndex = 0;
  state.browserSelectedIndex = Math.max(0, Math.min(max, state.browserSelectedIndex));

  const total = state.browserTotal || 0;
  const size = state.browserPageSize || 25;
  const page = (state.browserPage || 0) + 1;
  const pages = Math.max(1, Math.ceil(total / size));

  const header = document.createElement("div");
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";
  header.style.marginBottom = "6px";
  header.innerHTML = `<div style="opacity:.85;">Kind: ${kind} • Page ${page} / ${pages} • Total ${total}</div>
    <div style="display:flex; gap:8px; align-items:center;">
      <label style="display:flex; gap:6px; align-items:center; opacity:.85; font-size:12px;">
        Page size <select id="browserPageSize" style="padding:2px 4px;">
          <option value="25">25</option><option value="50">50</option><option value="100">100</option>
        </select>
      </label>
      <div style="opacity:.75; font-size:12px;">Tip: click to inspect • double-click to apply</div>
      <button type="button" class="button" data-action="browser-prev">◀ Prev</button>
      <button type="button" class="button" data-action="browser-next">Next ▶</button>
      <button type="button" class="button primary" data-action="browser-equip">Apply highlighted</button>
    </div>`;
  container.appendChild(header);

  const sel = getEl("browserPageSize");
  if (sel && sel.value !== String(size)) sel.value = String(size);

  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  function ths(cols) {
    thead.innerHTML = `<tr>${cols.map(c => `<th>${esc(c)}</th>`).join("")}</tr>`;
  }

  function rowCells(item) {
    const traits = Array.isArray(item?.traits) ? item.traits.join(", ") : (item?.traits ?? "");
    if (kind === "weapons") {
      return [
        item?.name ?? "",
        item?.dice ?? item?.damage ?? "",
        item?.range ?? "",
        traits,
      ];
    }
    if (kind === "armors") {
      return [
        item?.name ?? "",
        item?.ac ?? item?.ap ?? item?.armorPoints ?? "",
        item?.weight ?? "",
        traits,
      ];
    }
    if (kind === "gear") {
      return [
        item?.name ?? "",
        item?.weight ?? "",
        traits,
      ];
    }
    if (kind === "talents") {
      return [
        item?.name ?? "",
        item?.tier ?? "",
        item?.prereq ?? item?.prerequisites ?? "",
      ];
    }
    if (kind === "psychic" || kind === "psychicPowers") {
      return [
        item?.name ?? "",
        item?.warpCost ?? item?.threshold ?? "",
        traits,
      ];
    }
    // fallback
    return [item?.name ?? "", traits];
  }

  // Column headers
  if (kind === "weapons") ths(["Name","Damage","Range","Traits"]);
  else if (kind === "armors") ths(["Name","AC/AP","Weight","Traits"]);
  else if (kind === "gear") ths(["Name","Weight","Traits"]);
  else if (kind === "talents") ths(["Name","Tier","Prereq"]);
  else if (kind === "psychic" || kind === "psychicPowers") ths(["Name","Cost/Threshold","Traits"]);
  else ths(["Name","Traits"]);

  results.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.style.cursor = "pointer";
    tr.dataset.index = String(index);
    tr.dataset.action = "browser-row";

    if (index === state.browserSelectedIndex) tr.classList.add("selected");

    const cells = rowCells(item);
    tr.innerHTML = cells.map(v => `<td>${esc(v)}</td>`).join("");
    tbody.appendChild(tr);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  container.appendChild(table);
}


export function renderDice() {
  const res = getEl("diceResult");
  if (res) res.textContent = state.lastDiceResult || "";

  const logEl = getEl("diceLog");
  if (!logEl) return;
  const items = state.diceLog || [];
  if (!items.length) {
    logEl.textContent = "No rolls yet.";
    return;
  }
  logEl.innerHTML = items.slice(0, 50).map(it => `<div style="margin-bottom:6px;"><span style="opacity:.7; font-size:11px;">${new Date(it.ts).toLocaleTimeString()}</span> — <span style="font-family:monospace;">${it.text}</span></div>`).join("");
}

export function renderAll() {
  renderGlance();
  renderCharacter();
  renderInventory();
  renderSelectedSlotLabel();
  renderWeaponSlots();
  renderBrowser();
  renderDice();
}
