import { state } from "./state.js";

const BROWSER_STATE_KEY = "dh_browser_state_by_kind";

function loadPersistedState() {
  try {
    const raw = localStorage.getItem(BROWSER_STATE_KEY);
    if (!raw) return;
    const obj = JSON.parse(raw);
    if (obj && typeof obj === "object") state.browserStateByKind = obj;
  } catch {
    void 0;
  }
}

function savePersistedState() {
  try {
    localStorage.setItem(BROWSER_STATE_KEY, JSON.stringify(state.browserStateByKind || {}));
  } catch {
    void 0;
  }
}

loadPersistedState();

const KIND_MAP = {
  weapons: "weapons",
  armors: "armors",
  gear: "gear",
  talents: "talents",
  psychic: "psychicPowers",
  psychicPowers: "psychicPowers",
  weaponMods: "weaponMods",
  classes: "classes",
  races: "races",
  backgrounds: "backgrounds",
  injuries: "injuries",
  talentTrees: "talentTrees",
};

function normalizeKind(kind) {
  if (!kind) return "weapons";
  const k = String(kind).trim();
  return KIND_MAP[k] ? k : (KIND_MAP[k.toLowerCase()] ? k.toLowerCase() : "weapons");
}

function itemText(item) {
  if (!item) return "";
  // Prioritize common descriptive fields, fall back to JSON
  const parts = [
    item.name,
    item.lore,
    item.description,
    item.traits?.join?.(" "),
    item.special,
  ].filter(Boolean);
  if (parts.length) return parts.join(" ").toLowerCase();
  try { return JSON.stringify(item).toLowerCase(); } catch { return ""; }
}

export function openBrowser(kind) {
  const prevKind = String(state.browserKind || "weapons");

  // Save current kind state
  state.browserStateByKind ||= {};
  state.browserStateByKind[prevKind] = {
    page: state.browserPage || 0,
    term: state.browserTerm || "",
    index: state.browserSelectedIndex || 0,
  };

  const k = normalizeKind(kind);
  state.browserKind = k;

  // Restore new kind state (if any)
  const saved = state.browserStateByKind[k];
  if (saved) {
    state.browserPage = Math.max(0, Number(saved.page) || 0);
    state.browserTerm = String(saved.term || "");
    state.browserSelectedIndex = Math.max(0, Number(saved.index) || 0);
  } else {
    state.browserPage = 0;
    state.browserTerm = "";
    state.browserSelectedIndex = 0;
  }

  savePersistedState();

  const dataKey = KIND_MAP[k];
  const list = state.data?.[dataKey] ?? [];

  state.browserAll = Array.isArray(list) ? list : [];
  browserSearch(state.browserTerm || "");
}

export function browserSearch(term) {
  state.browserTerm = term ?? "";
  const t = String(term ?? "").trim().toLowerCase();

  if (!t) {
    const size = state.browserPageSize || 25;
    const start = (state.browserPage || 0) * size;
    state.browserTotal = state.browserAll.length;
    state.browserResults = state.browserAll.slice(start, start + size);
    return;
  }

  const out = [];
  for (const item of state.browserAll) {
    if (itemText(item).includes(t)) out.push(item);
    if (out.length >= 200) break; // guard: keep UI fast
  }
  const size = state.browserPageSize || 25;
  const start = (state.browserPage || 0) * size;
  state.browserTotal = out.length;
  state.browserResults = out.slice(start, start + size);
}
