const VAL_DATA = {
  modes: {
    COMPETITIVE: { name: 'COMPETITIVE', winRounds: 13, swapRound: 12, startCreds: 800, overtime: true,  desc: 'First to 13 • Win by 2 Overtime • Ranked RR' },
    UNRATED:     { name: 'UNRATED',     winRounds: 13, swapRound: 12, startCreds: 800, overtime: false, desc: 'First to 13 • Standard 5v5 Economy' },
    SWIFTPLAY:   { name: 'SWIFTPLAY',   winRounds: 5,  swapRound: 4,  startCreds: 800, overtime: false, desc: 'First to 5 • Boosted Credits (+2,400/rd)' },
    SPIKE_RUSH:  { name: 'SPIKE RUSH',  winRounds: 4,  swapRound: 3,  startCreds: 0,   overtime: false, desc: 'First to 4 • Random Loadouts + Power Orbs' },
    DEATHMATCH:  { name: 'DEATHMATCH',  winKills: 40,  swapRound: 99, startCreds: 9000,overtime: false, desc: 'First to 40 Kills • Instant Respawn • No Skills' },
    TDM:         { name: 'TEAM DEATHMATCH', winKills: 100, swapRound: 99, startCreds: 9000, overtime: false, desc: '5v5 First to 100 Kills • Stage Weapons' },
    ESCALATION:  { name: 'ESCALATION',  winKills: 12,  swapRound: 99, startCreds: 0,   overtime: false, desc: '12-Level Gun Game Progression' }
  },

  skins: [
    { id: 'STANDARD', name: 'STANDARD MATTE',   color: 0x20262e, accent: 0xff4655, tracer: 0xffb74d, pitch: 1.0 },
    { id: 'PRIME',    name: 'PRIME // GOLD',    color: 0xf8fafc, accent: 0xfacc15, tracer: 0x38bdf8, pitch: 1.25 },
    { id: 'REAVER',   name: 'REAVER // SHADOW', color: 0x1e1b4b, accent: 0xa855f7, tracer: 0xc084fc, pitch: 0.82 },
    { id: 'ONI',      name: 'ONI // DEMON',     color: 0x7f1d1d, accent: 0x10b981, tracer: 0x34d399, pitch: 0.94 },
    { id: 'KURONAMI', name: 'KURONAMI // STORM',color: 0x0f172a, accent: 0x38bdf8, tracer: 0x7dd3fc, pitch: 1.15 }
  ],

  maps: {
    HAVEN:    { coords: "27°28'A\"N 89°38'E\"W • THIMPHU, BHUTAN",   sky: 0xb8d4e3, floor: 0x9e9589, wall: 0xcfa078, sites: [[-34,-34,'A'],[0,-30,'B'],[34,-34,'C']], feature: '3_SITES' },
    BIND:     { coords: "34°02'N 6°51'W • RABAT, MOROCCO",         sky: 0xd9b382, floor: 0xc2a378, wall: 0xd49664, sites: [[-28,-34,'A'],[28,-34,'B']], feature: 'TELEPORTERS' },
    ASCENT:   { coords: "45°26'N 12°20'E • VENICE, ITALY",         sky: 0x9ec5e5, floor: 0x8f8a82, wall: 0xc77d63, sites: [[-28,-34,'A'],[28,-34,'B']], feature: 'BLAST_DOORS' },
    ICEBOX:   { coords: "76°44'N 149°30'E • BENNETT ISLAND, RUSSIA",sky: 0x6f8fa6, floor: 0x4a5866, wall: 0x2b3a4a, sites: [[-28,-34,'A'],[28,-34,'B']], feature: 'ZIPLINES' },
    SPLIT:    { coords: "35°41'N 139°41'E • TOKYO, JAPAN",          sky: 0xa7c7e7, floor: 0x7a828a, wall: 0xb8bec4, sites: [[-28,-34,'A'],[28,-34,'B']], feature: 'ASCENDER_ROPES' },
    LOTUS:    { coords: "14°00'N 75°30'E • WESTERN GHATS, INDIA",  sky: 0x9ad1c4, floor: 0x7c8c74, wall: 0x8f7a62, sites: [[-34,-34,'A'],[0,-30,'B'],[34,-34,'C']], feature: 'ROTATING_DOORS' },
    BREEZE:   { coords: "26°11'N 71°10'W • BERMUDA TRIANGLE",      sky: 0x7dd3fc, floor: 0xe7d8b1, wall: 0xd6ccc2, sites: [[-34,-36,'A'],[34,-36,'B']], feature: 'OPEN_LONG' },
    FRACTURE: { coords: "35°48'N 106°08'W • SANTA FE, NEW MEXICO", sky: 0xd97706, floor: 0x78716c, wall: 0xb45309, sites: [[-32,-26,'A'],[32,-26,'B']], feature: 'PINCH_SPAWN' },
    PEARL:    { coords: "38°42'N 9°08'W • LISBON, PORTUGAL",       sky: 0x0284c7, floor: 0x64748b, wall: 0x94a3b8, sites: [[-28,-34,'A'],[28,-34,'B']], feature: 'UNDERWATER_DOME' },
    SUNSET:   { coords: "34°03'N 118°14'W • LOS ANGELES, USA",     sky: 0xfb923c, floor: 0x9ca3af, wall: 0xfdba74, sites: [[-28,-34,'A'],[28,-34,'B']], feature: 'MID_MARKET' },
    ABYSS:    { coords: "71°00'N 8°00'W • JAN MAYEN, NORWAY",      sky: 0x1e293b, floor: 0x334155, wall: 0x475569, sites: [[-26,-32,'A'],[26,-32,'B']], feature: 'ABYSS_PIT' }
  },
  weapons: [
    { name: 'CLASSIC',  cat: 'SIDEARM',       cost: 0,    mag: 12,  reserve: 36,  dmg: 26,  headDmg: 78,  fireRate: 0.14, pen: 'LOW' },
    { name: 'SHORTY',   cat: 'SIDEARM',       cost: 300,  mag: 2,   reserve: 10,  dmg: 72,  headDmg: 144, fireRate: 0.30, pen: 'LOW' },
    { name: 'FRENZY',   cat: 'SIDEARM',       cost: 450,  mag: 13,  reserve: 39,  dmg: 26,  headDmg: 78,  fireRate: 0.08, pen: 'LOW' },
    { name: 'GHOST',    cat: 'SIDEARM',       cost: 500,  mag: 15,  reserve: 45,  dmg: 30,  headDmg: 105, fireRate: 0.14, pen: 'MEDIUM' },
    { name: 'SHERIFF',  cat: 'SIDEARM',       cost: 800,  mag: 6,   reserve: 24,  dmg: 55,  headDmg: 159, fireRate: 0.25, pen: 'HIGH' },
    { name: 'STINGER',  cat: 'SMG & SHOTGUN', cost: 1100, mag: 20,  reserve: 60,  dmg: 27,  headDmg: 67,  fireRate: 0.06, pen: 'LOW' },
    { name: 'SPECTRE',  cat: 'SMG & SHOTGUN', cost: 1600, mag: 30,  reserve: 90,  dmg: 26,  headDmg: 78,  fireRate: 0.075,pen: 'MEDIUM' },
    { name: 'BUCKY',    cat: 'SMG & SHOTGUN', cost: 850,  mag: 5,   reserve: 15,  dmg: 80,  headDmg: 160, fireRate: 0.65, pen: 'LOW' },
    { name: 'JUDGE',    cat: 'SMG & SHOTGUN', cost: 1850, mag: 7,   reserve: 21,  dmg: 68,  headDmg: 136, fireRate: 0.28, pen: 'LOW' },
    { name: 'BULLDOG',  cat: 'RIFLE',         cost: 2050, mag: 24,  reserve: 72,  dmg: 35,  headDmg: 115, fireRate: 0.10, pen: 'MEDIUM' },
    { name: 'GUARDIAN', cat: 'RIFLE',         cost: 2250, mag: 12,  reserve: 36,  dmg: 65,  headDmg: 195, fireRate: 0.19, pen: 'HIGH' },
    { name: 'PHANTOM',  cat: 'RIFLE',         cost: 2900, mag: 30,  reserve: 90,  dmg: 39,  headDmg: 156, fireRate: 0.09, pen: 'MEDIUM' },
    { name: 'VANDAL',   cat: 'RIFLE',         cost: 2900, mag: 25,  reserve: 75,  dmg: 40,  headDmg: 160, fireRate: 0.10, pen: 'MEDIUM' },
    { name: 'MARSHAL',  cat: 'SNIPER & HEAVY',cost: 950,  mag: 5,   reserve: 15,  dmg: 101, headDmg: 202, fireRate: 0.65, pen: 'MEDIUM' },
    { name: 'OUTLAW',   cat: 'SNIPER & HEAVY',cost: 2400, mag: 2,   reserve: 10,  dmg: 140, headDmg: 238, fireRate: 0.35, pen: 'HIGH' },
    { name: 'OPERATOR', cat: 'SNIPER & HEAVY',cost: 4700, mag: 5,   reserve: 10,  dmg: 150, headDmg: 255, fireRate: 0.95, pen: 'HIGH' },
    { name: 'ARES',     cat: 'SNIPER & HEAVY',cost: 1600, mag: 50,  reserve: 100, dmg: 30,  headDmg: 72,  fireRate: 0.08, pen: 'HIGH' },
    { name: 'ODIN',     cat: 'SNIPER & HEAVY',cost: 3200, mag: 100, reserve: 200, dmg: 38,  headDmg: 95,  fireRate: 0.065,pen: 'HIGH' }
  ],

  agents: [
    // DUELISTS
    { name: 'PHOENIX', role: 'DUELIST',    ultCost: 6, desc: 'Ignites the battlefield with Curveball flashes and Blaze walls.', abilities: { c: 'BLAZE WALL', q: 'CURVEBALL FLASH', e: 'HOT HANDS HEAL', x: 'RUN IT BACK' } },
    { name: 'JETT',    role: 'DUELIST',    ultCost: 8, desc: 'Agile fighter who dashes out of danger with Tailwind.', abilities: { c: 'CLOUDBURST SMOKE', q: 'UPDRAFT JUMP', e: 'TAILWIND DASH', x: 'BLADE STORM' } },
    { name: 'REYNA',   role: 'DUELIST',    ultCost: 6, desc: 'Feeds on soul orbs to heal or turn intangible.', abilities: { c: 'LEER BLIND', q: 'DEVOUR HEAL', e: 'DISMISS PHASE', x: 'EMPRESS' } },
    { name: 'RAZE',    role: 'DUELIST',    ultCost: 8, desc: 'Explosives expert with Blast Pack satchel jumps and Showstopper.', abilities: { c: 'BOOM BOT', q: 'BLAST PACK JUMP', e: 'PAINT SHELLS', x: 'SHOWSTOPPER' } },
    { name: 'YORU',    role: 'DUELIST',    ultCost: 7, desc: 'Rips through reality with Gatecrash teleports and Blindside.', abilities: { c: 'FAKEOUT DECOY', q: 'BLINDSIDE FLASH', e: 'GATECRASH TP', x: 'DIMENSIONAL DRIFT' } },
    { name: 'NEON',    role: 'DUELIST',    ultCost: 8, desc: 'Surges forward at shocking speeds with High Gear sprint.', abilities: { c: 'FAST LANE WALL', q: 'RELAY BOLT STUN', e: 'HIGH GEAR SPRINT', x: 'OVERDRIVE' } },
    { name: 'ISO',     role: 'DUELIST',    ultCost: 7, desc: 'Focuses ambient energy into bulletproof Double Tap shields.', abilities: { c: 'CONTINGENCY WALL', q: 'UNDERCUT VULN', e: 'DOUBLE TAP SHIELD', x: 'KILL CONTRACT' } },
    { name: 'WAYLAY',  role: 'DUELIST',    ultCost: 8, desc: 'Prismatic duelist who refracts light for high-speed entry.', abilities: { c: 'SATURATE', q: 'LIGHTSPEED', e: 'REFRACT', x: 'CONVERGENT PATHS' } },
    // CONTROLLERS
    { name: 'BRIMSTONE',role:'CONTROLLER', ultCost: 8, desc: 'Calls down orbital Sky Smokes and Stim Beacons.', abilities: { c: 'STIM BEACON', q: 'INCENDIARY', e: 'SKY SMOKE', x: 'ORBITAL STRIKE' } },
    { name: 'VIPER',   role: 'CONTROLLER', ultCost: 8, desc: 'Deploys poisonous Toxic Screens and gas clouds.', abilities: { c: 'SNAKE BITE', q: 'POISON CLOUD', e: 'TOXIC SCREEN', x: "VIPER'S PIT" } },
    { name: 'OMEN',    role: 'CONTROLLER', ultCost: 7, desc: 'Hunts in shadows with Dark Cover smokes and Paranoia.', abilities: { c: 'SHROUDED STEP', q: 'PARANOIA FLASH', e: 'DARK COVER SMOKE', x: 'FROM THE SHADOWS' } },
    { name: 'ASTRA',   role: 'CONTROLLER', ultCost: 7, desc: 'Harnesses cosmic Stars to create Nebulas and Gravity Wells.', abilities: { c: 'GRAVITY WELL', q: 'NOVA PULSE', e: 'NEBULA SMOKE', x: 'COSMIC DIVIDE' } },
    { name: 'HARBOR',  role: 'CONTROLLER', ultCost: 7, desc: 'Commands water walls and bulletproof Cove shields.', abilities: { c: 'CASCADE WALL', q: 'COVE SHIELD', e: 'HIGH TIDE WALL', x: 'RECKONING' } },
    { name: 'CLOVE',   role: 'CONTROLLER', ultCost: 8, desc: 'Deploys Ruse smokes even after death and self-revives.', abilities: { c: 'PICK-ME-UP', q: 'MEDDLE DECAY', e: 'RUSE SMOKE', x: 'NOT DEAD YET' } },
    // INITIATORS
    { name: 'SOVA',    role: 'INITIATOR',  ultCost: 8, desc: 'Reveals enemy positions through walls with Recon Bolts.', abilities: { c: 'OWL DRONE', q: 'SHOCK BOLT', e: 'RECON BOLT', x: "HUNTER'S FURY" } },
    { name: 'BREACH',  role: 'INITIATOR',  ultCost: 9, desc: 'Fires kinetic blasts and flashes straight through walls.', abilities: { c: 'AFTERSHOCK', q: 'FLASHPOINT', e: 'FAULT LINE STUN', x: 'ROLLING THUNDER' } },
    { name: 'SKYE',    role: 'INITIATOR',  ultCost: 8, desc: 'Guides Guiding Light hawks and Regrowth healing.', abilities: { c: 'REGROWTH HEAL', q: 'TRAILBLAZER', e: 'GUIDING LIGHT', x: 'SEEKERS' } },
    { name: 'KAY/O',   role: 'INITIATOR',  ultCost: 8, desc: 'Suppresses enemy abilities with ZERO/POINT blades.', abilities: { c: 'FRAG/MENT', q: 'FLASH/DRIVE', e: 'ZERO/POINT', x: 'NULL/CMD' } },
    { name: 'FADE',    role: 'INITIATOR',  ultCost: 8, desc: 'Hunts foes with nightmare Prowlers and Haunt eyes.', abilities: { c: 'PROWLER', q: 'SEIZE TETHER', e: 'HAUNT REVEAL', x: 'NIGHTFALL' } },
    { name: 'GEKKO',   role: 'INITIATOR',  ultCost: 8, desc: 'Sends Wingman to autonomously plant or defuse the Spike!', abilities: { c: 'MOSH PIT', q: 'WINGMAN PLANT', e: 'DIZZY FLASH', x: 'THRASH' } },
    { name: 'TEJO',    role: 'INITIATOR',  ultCost: 8, desc: 'Ballistic tactician with guided salvo strikes and stealth drones.', abilities: { c: 'STEALTH DRONE', q: 'SPECIAL DELIVERY', e: 'GUIDED SALVO', x: 'ARMAGEDDON' } },
    // SENTINELS
    { name: 'SAGE',    role: 'SENTINEL',   ultCost: 8, desc: 'Creates solid Barrier Walls, Slow Orbs, and Healing.', abilities: { c: 'BARRIER WALL', q: 'SLOW ORB', e: 'HEALING ORB', x: 'RESURRECTION' } },
    { name: 'CYPHER',  role: 'SENTINEL',   ultCost: 6, desc: 'Monitors flanks with Trapwires and Neural Theft.', abilities: { c: 'TRAPWIRE', q: 'CYBER CAGE', e: 'SPYCAM REVEAL', x: 'NEURAL THEFT' } },
    { name: 'KILLJOY', role: 'SENTINEL',   ultCost: 8, desc: 'Locks down sites with automated Turrets and Lockdown.', abilities: { c: 'NANOSWARM', q: 'ALARMBOT', e: 'AUTO-TURRET', x: 'LOCKDOWN' } },
    { name: 'CHAMBER', role: 'SENTINEL',   ultCost: 8, desc: 'Equips custom Headhunter pistols and Rendezvous teleports.', abilities: { c: 'TRADEMARK', q: 'HEADHUNTER', e: 'RENDEZVOUS TP', x: 'TOUR DE FORCE' } },
    { name: 'DEADLOCK',role: 'SENTINEL',   ultCost: 7, desc: 'Deploys Sonic Sensors and Barrier Mesh nets.', abilities: { c: 'GRAVNET', q: 'SONIC SENSOR', e: 'BARRIER MESH', x: 'ANNIHILATION' } },
    { name: 'VYSE',    role: 'SENTINEL',   ultCost: 8, desc: 'Controls liquid metal Shear walls and Arc Rose flashes.', abilities: { c: 'RAZORVINE', q: 'SHEAR WALL', e: 'ARC ROSE FLASH', x: 'STEEL GARDEN' } }
  ],

  ranks: [
    { name: 'IRON 1', short: 'I1' }, { name: 'IRON 2', short: 'I2' }, { name: 'IRON 3', short: 'I3' },
    { name: 'BRONZE 1', short: 'B1' }, { name: 'BRONZE 2', short: 'B2' }, { name: 'BRONZE 3', short: 'B3' },
    { name: 'SILVER 1', short: 'S1' }, { name: 'SILVER 2', short: 'S2' }, { name: 'SILVER 3', short: 'S3' },
    { name: 'GOLD 1', short: 'G1' }, { name: 'GOLD 2', short: 'G2' }, { name: 'GOLD 3', short: 'G3' },
    { name: 'PLATINUM 1', short: 'P1' }, { name: 'PLATINUM 2', short: 'P2' }, { name: 'PLATINUM 3', short: 'P3' },
    { name: 'DIAMOND 1', short: 'D1' }, { name: 'DIAMOND 2', short: 'D2' }, { name: 'DIAMOND 3', short: 'D3' },
    { name: 'ASCENDANT 1', short: 'A1' }, { name: 'ASCENDANT 2', short: 'A2' }, { name: 'ASCENDANT 3', short: 'A3' },
    { name: 'IMMORTAL 1', short: 'IM1' }, { name: 'IMMORTAL 2', short: 'IM2' }, { name: 'IMMORTAL 3', short: 'IM3' },
    { name: 'RADIANT', short: 'RAD' }
  ]
};
