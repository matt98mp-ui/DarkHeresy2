import { state } from "./state.js";
import { scheduleAutosave } from "./autosave.js";
import { snapshot } from "./history.js";
import { el, qsa } from "./dom.js";

const KEYS = ["str","dex","con","int","wis","cha"];
const UPPER = {str:"STR",dex:"DEX",con:"CON",int:"INT",wis:"WIS",cha:"CHA"};

export function modFromScore(score) {
  const s = Number(score)||0;
  return Math.floor((s - 10) / 2);
}

export function readScoresFromDOM() {
  const scores = {};
  for (const k of KEYS) {
    const node = el(k);
    const v = node ? Number(node.value || 0) : (state.character?.scores?.[UPPER[k]] ?? 10);
    scores[UPPER[k]] = Number.isFinite(v) ? v : 10;
  }
  return scores;
}

export function writeScoresToDOM(scores) {
  for (const k of KEYS) {
    const up = UPPER[k];
    const node = el(k);
    if (node && node.value !== String(scores[up] ?? 10)) node.value = String(scores[up] ?? 10);
  }
}

export function syncAbilitiesToStateAndUI() {
  state.character ||= {};
  const scores = readScoresFromDOM();
  state.character.scores = scores;
  state.character.abilities = {};
  for (const [abbr, score] of Object.entries(scores)) {
    state.character.abilities[abbr] = modFromScore(score);
  }
  // UI mods
  for (const k of KEYS) {
    const up = UPPER[k];
    const mod = state.character.abilities[up] ?? 0;
    const out = el("mod_" + k);
    if (out) out.textContent = (mod>=0?"+":"") + String(mod);
  }
  // Save tables (many duplicates exist; update all matching prefixes)
  for (const up of Object.values(UPPER)) {
    const mod = state.character.abilities[up] ?? 0;
    qsa(`[id^="save_abil_${up}"]`).forEach((node) => {
      node.textContent = (mod >= 0 ? "+" : "") + String(mod);
    });
    // totals (prof ignored here; existing UI can add it)
    qsa(`[id^="save_total_${up}"]`).forEach((node) => {
      node.textContent = (mod >= 0 ? "+" : "") + String(mod);
    });
  }
  scheduleAutosave();
}

export function setAllScores(score) {
  snapshot();
  const scores = {};
  for (const k of KEYS) scores[UPPER[k]] = score;
  writeScoresToDOM(scores);
  syncAbilitiesToStateAndUI();
}

export function applyStandardArray() {
  snapshot();
  const arr = [15,14,13,12,10,8];
  const scores = {};
  for (let i=0;i<KEYS.length;i++) scores[UPPER[KEYS[i]]] = arr[i];
  writeScoresToDOM(scores);
  syncAbilitiesToStateAndUI();
}

export function roll4d6DropLowest() {
  snapshot();
  function one() {
    const rolls = [0,0,0,0].map(()=>Math.floor(Math.random()*6)+1).sort((a,b)=>a-b);
    return rolls[1]+rolls[2]+rolls[3];
  }
  const arr = [one(),one(),one(),one(),one(),one()].sort((a,b)=>b-a);
  const scores = {};
  for (let i=0;i<KEYS.length;i++) scores[UPPER[KEYS[i]]] = arr[i];
  writeScoresToDOM(scores);
  syncAbilitiesToStateAndUI();
  return arr;
}
