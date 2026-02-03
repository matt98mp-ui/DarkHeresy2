window.CLASSES = [
{name:"Acolyte",
    hitDie:8,
    saveProfs:["dex", "wis"], hd:"1d6", stats:["STR","DEX","INT"], traits:["Basic Training"], lore:"Novice members of a chapter or organization."}
,
  {name:"Guardsman",
    hitDie:10,
    saveProfs:["str", "con"], hd:"1d8", stats:["STR","DEX"], traits:["Fireteam Tactics","Steady"], lore:"Standard infantry of the Astra Militarum."}
,
  {name:"Sanctioned Psyker",
    hitDie:6,
    saveProfs:["int", "wis"], hd:"1d6", stats:["INT","WIS"], traits:["Psychic Powers","Warp Resistance"], lore:"Trained psyker sanctioned by the Imperium."}
,
  {name:"Tech-Priest",
    hitDie:8,
    saveProfs:["wis", "cha"], hd:"1d6", stats:["INT","WIS"], traits:["Machine Cognition","Tech Adept"], lore:"Servitors of the Omnissiah, skilled in machinery."}
,
  {name:"Inquisitor",
    hitDie:8,
    saveProfs:["dex", "wis"], hd:"1d8", stats:["STR","INT","WIS"], traits:["Authority","Investigator","Combat Trained"], lore:"Agents of the Inquisition."}
,
  {name:"Rogue Trader",
    hitDie:8,
    saveProfs:["dex", "int"], hd:"1d8", stats:["CHA","DEX"], traits:["Trader","Explorer","Negotiator"], lore:"Leaders of exploratory ventures."}
,
  {name:"Assassin",
    hitDie:8,
    saveProfs:["dex", "int"], hd:"1d6", stats:["DEX","STR"], traits:["Stealth","Precision Strike","Deadly"], lore:"Agents of the Officio Assassinorum."}
,
  {name:"Arbites Enforcer",
    hitDie:8,
    saveProfs:["dex", "wis"], hd:"1d8", stats:["STR","DEX"], traits:["Law Enforcement","Interrogation","Tactical Awareness"], lore:"Imperial law enforcers."}
,
  {name:"Imperial Navy Officer",
    hitDie:8,
    saveProfs:["dex", "wis"], hd:"1d8", stats:["STR","DEX","CHA"], traits:["Navigation","Ship Combat","Leadership"], lore:"Commanders of the Imperial Navy."}
,
  {name:"Sister of Battle",
    hitDie:8,
    saveProfs:["wis", "cha"], hd:"1d8", stats:["STR","WIS"], traits:["Faith","Combat Training","Armor Proficiency"], lore:"Warrior nuns of the Adepta Sororitas."}
,
  {name:"Adeptus Mechanicus Magos",
    hitDie:8,
    saveProfs:["int", "con"], hd:"1d6", stats:["INT","WIS"], traits:["Tech Mastery","Repair","Knowledge"], lore:"High-ranking tech-priests."}
,
  {name:"Explorator",
    hitDie:8,
    saveProfs:["dex", "wis"], hd:"1d8", stats:["STR","DEX","INT"], traits:["Explorer","Tech Expertise","Survey"], lore:"Tech-priests exploring lost worlds."}
,
  {name:"Psyker Adept",
    hitDie:6,
    saveProfs:["int", "wis"], hd:"1d6", stats:["INT","WIS"], traits:["Psychic Powers","Warp Sensitivity"], lore:"Trained in controlling warp energy."}
,
  {name:"Scout",
    hitDie:8,
    saveProfs:["dex", "wis"], hd:"1d6", stats:["DEX","INT"], traits:["Stealth","Reconnaissance","Marksmanship"], lore:"Recon and ambush specialist."}
,
  {name:"Veteran Guardsman",
    hitDie:10,
    saveProfs:["str", "con"], hd:"1d8", stats:["STR","DEX"], traits:["Experienced Fighter","Tactical Insight","Endurance"], lore:"Seasoned soldiers."}
,
  {name:"Assault Marine",
    hitDie:8,
    saveProfs:["dex", "wis"], hd:"1d10", stats:["STR","DEX"], traits:["Melee Specialist","Jump Pack Training","Tough"], lore:"Space Marines specialized in fast assaults."}
,
  {name:"Heavy Weapons Marine",
    hitDie:8,
    saveProfs:["dex", "wis"], hd:"1d10", stats:["STR","DEX"], traits:["Heavy Weapon Proficiency","Tactical Awareness","Durable"], lore:"Space Marines operating heavy weapons."}
,
  {name:"Sniper",
    hitDie:8,
    saveProfs:["dex", "wis"], hd:"1d6", stats:["DEX","INT"], traits:["Precision Shot","Stealth","Observation"], lore:"Long-range engagement expert."}
,
  {name:"Scout Sniper",
    hitDie:8,
    saveProfs:["dex", "wis"], hd:"1d6", stats:["DEX","INT"], traits:["Camouflage","Long-Range Marksmanship","Stealth"], lore:"Specialist for reconnaissance and long-range elimination."}
,
  {name:"Assault Specialist",
    hitDie:8,
    saveProfs:["dex", "wis"], hd:"1d8", stats:["STR","DEX"], traits:["Close Combat Expert","Rapid Assault","Agility"], lore:"Expert in aggressive combat."}
,
  // Added: expanded roles (v11)
  {name:"Sister of Battle",
    saveProfs:["wis", "cha"], hitDie:10, primeStat:"WIS", proficiencies:["Martial Weapons","Heavy Armor","Faith"], features:["Acts of Faith","Purity of Purpose"], lore:"Zealous warrior of the Ecclesiarchy, armored in devotion."}
,
  {name:"Tech-Priest",
    saveProfs:["wis", "cha"], hitDie:8, primeStat:"INT", proficiencies:["Tech","Light Weapons","Augmetics"], features:["Rites of Repair","Mechadendrites"], lore:"Adept of Mars, part flesh, part machine, all purpose."}
,
  {name:"Storm Trooper",
    saveProfs:["str", "con"], hitDie:10, primeStat:"DEX", proficiencies:["Martial Weapons","Carapace","Tactics"], features:["Volley Drill","Suppressive Fire"], lore:"Elite Astra Militarum soldier trained for decisive strikes."}
,
  {name:"Navigator",
    saveProfs:["dex", "wis"], hitDie:6, primeStat:"WIS", proficiencies:["Warp Lore","Voidcraft","Sanctioned Psykana"], features:["Third Eye","Warp Sight"], lore:"Warp-guiding mutant essential to void travel—feared and vital."}
];
