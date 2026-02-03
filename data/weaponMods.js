window.WEAPON_MODS = [
  {
    "id": "mod_red_dot",
    "name": "Red-Dot Sight",
    "type": "Optic",
    "hitBonus": 1,
    "dmgBonus": 0,
    "rangeBonus": 0,
    "notes": "+1 to hit on ranged attacks.",
    "tags": [
      "Ranged",
      "Optic"
    ]
  },
  {
    "id": "mod_scope",
    "name": "Magnified Scope",
    "type": "Optic",
    "hitBonus": 1,
    "dmgBonus": 0,
    "rangeBonus": 30,
    "notes": "+1 to hit at long range; +30ft range (GM).",
    "tags": [
      "Ranged",
      "Optic",
      "Sniper"
    ]
  },
  {
    "id": "mod_suppressor",
    "name": "Suppressor",
    "type": "Muzzle",
    "hitBonus": 0,
    "dmgBonus": 0,
    "rangeBonus": -10,
    "notes": "Attacks are quiet; -10ft range (GM).",
    "tags": [
      "Stealth"
    ]
  },
  {
    "id": "mod_bayonet",
    "name": "Bayonet",
    "type": "Underbarrel",
    "hitBonus": 0,
    "dmgBonus": 0,
    "rangeBonus": 0,
    "notes": "Counts as a melee weapon (1d6) attached; no slot used.",
    "tags": [
      "Melee",
      "Ranged"
    ]
  },
  {
    "id": "mod_suspensor",
    "name": "Suspensor Harness",
    "type": "Support",
    "hitBonus": 0,
    "dmgBonus": 0,
    "rangeBonus": 0,
    "notes": "Ignore Heavy penalty; reduce recoil/encumbrance (GM).",
    "tags": [
      "Heavy",
      "Mechanicus"
    ]
  },
  {
    "id": "mod_overcharge_coils",
    "name": "Overcharge Coils",
    "type": "Power",
    "hitBonus": 0,
    "dmgBonus": 2,
    "rangeBonus": 0,
    "notes": "+2 damage (energy weapons); on nat 1, weapon overheats (GM).",
    "tags": [
      "Plasma",
      "Melta",
      "Risk"
    ]
  },
  {
    "id": "mod_blessed_casing",
    "name": "Blessed Casing",
    "type": "Ammo",
    "hitBonus": 0,
    "dmgBonus": 1,
    "rangeBonus": 0,
    "notes": "+1 damage vs Daemons/Heretics (GM).",
    "tags": [
      "Inquisition",
      "Ammo"
    ]
  },
  {
    "id": "mod_braced_stock",
    "name": "Braced Stock",
    "type": "Stock",
    "hitBonus": 1,
    "dmgBonus": 0,
    "rangeBonus": 0,
    "notes": "+1 to hit; helps recoil control.",
    "tags": [
      "Ranged"
    ]
  },
{ id:"mod_kraken_rounds", name:"Kraken Penetrators", type:"Ammo", hitBonus:0, dmgBonus:0, rangeBonus:0, notes:"Bolter ammo: AP +1 on next hit (GM).", tags:["Ammo","Bolt","Inquisition"] },
  { id:"mod_dragonfire", name:"Dragonfire Rounds", type:"Ammo", hitBonus:0, dmgBonus:1, rangeBonus:0, notes:"Bolter ammo: +1 damage and ignores smoke (GM).", tags:["Ammo","Bolt"] },
  { id:"mod_hotshot_pack", name:"Hot-shot Pack", type:"Power", hitBonus:1, dmgBonus:1, rangeBonus:0, notes:"Las weapons: +1 hit and +1 dmg; drains power quickly (GM).", tags:["Las","Power"] }
];
