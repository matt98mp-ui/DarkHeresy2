import { state } from "./state.js";
import { el } from "./dom.js";

function esc(s) {
  return String(s ?? "").replace(/[&<>"]/g, (c) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"
  }[c]));
}

function isWeapon(item) {
  return item && (item.damage || item.range || item.rateOfFire || item.weaponType || item.classification);
}
function isArmor(item) {
  return item && (item.ap || item.armorPoints || item.protection || item.type === "armor" || item.name?.toLowerCase().includes("armor"));
}
function isPsychic(item) {
  return item && (item.discipline || item.psyRating || item.focusPower || item.type === "psychic" || item.name?.toLowerCase().includes("power"));
}
function isTalent(item) {
  return item && (item.prereq || item.prerequisites || item.type === "talent" || item.name?.toLowerCase().includes("talent") || item.benefit);
}

function renderKV(item, keys) {
  const rows = keys
    .filter(k => item?.[k] !== undefined && item?.[k] !== null && item?.[k] !== "")
    .map(k => `<tr><th>${esc(k)}</th><td>${esc(item[k])}</td></tr>`)
    .join("");
  return rows ? `<table class="info-table"><tbody>${rows}</tbody></table>` : "";
}

function renderDetails(item) {
  if (!item) return "<div>Nothing selected.</div>";
  const title = `<div class="info-title">${esc(item.name || "Selected Item")}</div>`;

  if (isWeapon(item)) {
    return title + renderKV(item, ["class","classification","weaponType","damage","penetration","range","rateOfFire","clip","reload","weight","availability","special"]);
  }
  if (isArmor(item)) {
    return title + renderKV(item, ["type","ap","armorPoints","protection","locations","weight","availability","special"]);
  }
  if (isPsychic(item)) {
    return title + renderKV(item, ["discipline","threshold","focusPower","sustained","range","duration","description"]);
  }
  if (isTalent(item)) {
    return title + renderKV(item, ["tier","prereq","prerequisites","description","benefit"]);
  }

  return title + `<pre class="info-pre">${esc(JSON.stringify(item, null, 2))}</pre>`;
}

function renderActions(item) {
  if (!item) return "";
  const btn = (action, label) => `<button type="button" class="button primary" data-action="${action}">${esc(label)}</button>`;
  let out = "";
  if (isWeapon(item)) out += btn("info-equip-weapon", "Equip weapon (selected slot)");
  if (isArmor(item)) out += btn("info-equip-armor", "Equip armor");
  if (isPsychic(item)) out += btn("info-learn-power", "Learn power");
  if (isTalent(item)) out += btn("info-learn-talent", "Learn talent");
  return out ? `<div class="info-actions">${out}</div>` : "";
}

export function showInfoForSelected() {
  const modal = el("infoModal");
  const body = el("infoBody");
  if (!modal || !body) return;

  const item = state.selectedInfo;
  body.innerHTML = renderActions(item) + renderDetails(item);

  modal.style.display = "block";
  state.infoOpen = true;
}

export function closeInfo() {
  const modal = el("infoModal");
  if (modal) modal.style.display = "none";
  state.infoOpen = false;
}
