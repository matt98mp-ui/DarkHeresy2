export function inferCategory(item) {
  const name = String(item?.name || "").toLowerCase();
  const traits = Array.isArray(item?.traits) ? item.traits.join(" ").toLowerCase() : String(item?.traits || "").toLowerCase();
  const text = (name + " " + traits).trim();

  if (!text) return "Misc";
  if (text.includes("ammo") || text.includes("clip") || text.includes("cartridge")) return "Ammo";
  if (text.includes("grenade") || text.includes("bomb") || text.includes("explosive")) return "Explosives";
  if (text.includes("medkit") || text.includes("stim") || text.includes("drug")) return "Medical";
  if (text.includes("tool") || text.includes("kit") || text.includes("repair")) return "Tools";
  if (text.includes("cyber") || text.includes("implant") || text.includes("bionic")) return "Cyberware";
  if (text.includes("armor")) return "Armor";
  if (text.includes("ration") || text.includes("water") || text.includes("food")) return "Supplies";
  return "Misc";
}

export function stableStringify(obj) {
  try {
    const keys = Object.keys(obj || {}).sort();
    const out = {};
    for (const k of keys) out[k] = obj[k];
    return JSON.stringify(out);
  } catch {
    return JSON.stringify(obj);
  }
}
