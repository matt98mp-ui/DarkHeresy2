import { state } from "./state.js";

export function ensureDiceLog() {
  state.diceLog ||= [];
}

export function logDice(entry) {
  ensureDiceLog();
  state.diceLog.unshift({ ts: Date.now(), text: entry });
  // cap
  if (state.diceLog.length > 200) state.diceLog.length = 200;
}

export function clearDiceLog() {
  state.diceLog = [];
}

export function rollDice(expr = "1d100") {
  // Supports NdM +/- K, e.g. 1d20+5, 2d10-1
  const m = String(expr).trim().match(/^\s*(\d+)\s*d\s*(\d+)\s*([+-]\s*\d+)?\s*$/i);
  if (!m) {
    // fallback: just try 1d100
    return rollDice("1d100");
  }
  const count = Number(m[1]);
  const sides = Number(m[2]);
  const mod = m[3] ? Number(m[3].replace(/\s+/g,"")) : 0;

  let total = 0;
  const rolls = [];
  for (let i = 0; i < count; i++) {
    const r = Math.floor(Math.random() * sides) + 1;
    rolls.push(r);
    total += r;
  }
  const final = total + mod;
  return { total: final, rolls, mod, raw: total };
}

export function rollSave(ability) {
  const abil = state.character?.abilities?.[ability] ?? 0;
  const roll = Math.floor(Math.random() * 20) + 1;
  return { roll, abil, total: roll + abil };
}

export function rollWarpRisk() {
  const r = Math.floor(Math.random() * 100) + 1;
  return r;
}
