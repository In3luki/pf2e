import { AlignmentTrait } from "@actor/creature/types";
import { ClassTrait } from "@item/class/data";
import { RANGE_TRAITS } from "@item/data/values";
import { PreciousMaterialType } from "@item/physical/types";
import { MagicSchool, MagicTradition } from "@item/spell/types";
import { OtherWeaponTag } from "@item/weapon/types";
import { sluggify } from "@util";

// Ancestry and heritage traits
const ancestryTraits = {
    "half-elf": "PF2E.TraitHalfElf",
    "half-orc": "PF2E.TraitHalfOrc",
    aasimar: "PF2E.TraitAasimar",
    aberration: "PF2E.TraitAberration",
    anadi: "PF2E.TraitAnadi",
    android: "PF2E.TraitAndroid",
    aphorite: "PF2E.TraitAphorite",
    automaton: "PF2E.TraitAutomaton",
    azarketi: "PF2E.TraitAzarketi",
    beastkin: "PF2E.TraitBeastkin",
    catfolk: "PF2E.TraitCatfolk",
    changeling: "PF2E.TraitChangeling",
    conrasu: "PF2E.TraitConrasu",
    dhampir: "PF2E.TraitDhampir",
    duskwalker: "PF2E.TraitDuskwalker",
    dwarf: "PF2E.TraitDwarf",
    elf: "PF2E.TraitElf",
    fetchling: "PF2E.TraitFetchling",
    fleshwarp: "PF2E.TraitFleshwarp",
    ganzi: "PF2E.TraitGanzi",
    geniekin: "PF2E.TraitGeniekin",
    gnoll: "PF2E.TraitGnoll",
    gnome: "PF2E.TraitGnome",
    goblin: "PF2E.TraitGoblin",
    goloma: "PF2E.TraitGoloma",
    grippli: "PF2E.TraitGrippli",
    halfling: "PF2E.TraitHalfling",
    hobgoblin: "PF2E.TraitHobgoblin",
    human: "PF2E.TraitHuman",
    ifrit: "PF2E.TraitIfrit",
    kitsune: "PF2E.TraitKitsune",
    kobold: "PF2E.TraitKobold",
    leshy: "PF2E.TraitLeshy",
    lizardfolk: "PF2E.TraitLizardfolk",
    orc: "PF2E.TraitOrc",
    oread: "PF2E.TraitOread",
    poppet: "PF2E.TraitPoppet",
    ratfolk: "PF2E.TraitRatfolk",
    shisk: "PF2E.TraitShisk",
    shoony: "PF2E.TraitShoony",
    skeleton: "PF2E.TraitSkeleton",
    sprite: "PF2E.TraitSprite",
    strix: "PF2E.TraitStrix",
    suli: "PF2E.TraitSuli",
    sylph: "PF2E.TraitSylph",
    tengu: "PF2E.TraitTengu",
    tiefling: "PF2E.TraitTiefling",
    undine: "PF2E.TraitUndine",
};

// Secondary traits of ancestries and heritages
const ancestryItemTraits = {
    ...ancestryTraits,
    amphibious: "PF2E.TraitAmphibious",
    fey: "PF2E.TraitFey",
    fungus: "PF2E.TraitFungus",
    humanoid: "PF2E.TraitHumanoid",
    plant: "PF2E.TraitPlant",
};

const elementalTraits = {
    air: "PF2E.TraitAir",
    earth: "PF2E.TraitEarth",
    fire: "PF2E.TraitFire",
    water: "PF2E.TraitWater",
};

const energyDamageTypes = {
    acid: "PF2E.TraitAcid",
    cold: "PF2E.TraitCold",
    electricity: "PF2E.TraitElectricity",
    fire: "PF2E.TraitFire",
    force: "PF2E.TraitForce",
    negative: "PF2E.TraitNegative",
    positive: "PF2E.TraitPositive",
    sonic: "PF2E.TraitSonic",
};

const magicTraditions: Record<MagicTradition, string> = {
    arcane: "PF2E.TraitArcane",
    divine: "PF2E.TraitDivine",
    occult: "PF2E.TraitOccult",
    primal: "PF2E.TraitPrimal",
};

const creatureTraits = {
    ...ancestryItemTraits,
    ...elementalTraits,
    ...energyDamageTypes,
    ...magicTraditions,
    aberration: "PF2E.TraitAberration",
    aeon: "PF2E.TraitAeon",
    aesir: "PF2E.TraitAesir",
    agathion: "PF2E.TraitAgathion",
    alchemical: "PF2E.TraitAlchemical",
    angel: "PF2E.TraitAngel",
    animal: "PF2E.TraitAnimal",
    anugobu: "PF2E.TraitAnugobu",
    aquatic: "PF2E.TraitAquatic",
    archon: "PF2E.TraitArchon",
    astral: "PF2E.TraitAstral",
    asura: "PF2E.TraitAsura",
    azata: "PF2E.TraitAzata",
    beast: "PF2E.TraitBeast",
    boggard: "PF2E.TraitBoggard",
    caligni: "PF2E.TraitCaligni",
    celestial: "PF2E.TraitCelestial",
    "charau-ka": "PF2E.TraitCharauKa",
    clockwork: "PF2E.TraitClockwork",
    construct: "PF2E.TraitConstruct",
    couatl: "PF2E.TraitCouatl",
    daemon: "PF2E.TraitDaemon",
    darvakka: "PF2E.TraitDarvakka",
    demon: "PF2E.TraitDemon",
    dero: "PF2E.TraitDero",
    devil: "PF2E.TraitDevil",
    dinosaur: "PF2E.TraitDinosaur",
    div: "PF2E.TraitDiv",
    dragon: "PF2E.TraitDragon",
    dream: "PF2E.TraitDream",
    drow: "PF2E.TraitDrow",
    duergar: "PF2E.TraitDuergar",
    duskwalker: "PF2E.TraitDuskwalker",
    eidolon: "PF2E.TraitEidolon",
    elemental: "PF2E.TraitElemental",
    ethereal: "PF2E.TraitEthereal",
    evocation: "PF2E.TraitEvocation",
    fiend: "PF2E.TraitFiend",
    formian: "PF2E.TraitFormian",
    fungus: "PF2E.TraitFungus",
    genie: "PF2E.TraitGenie",
    ghoran: "PF2E.TraitGhoran",
    ghost: "PF2E.TraitGhost",
    ghoul: "PF2E.TraitGhoul",
    ghul: "PF2E.TraitGhul",
    giant: "PF2E.TraitGiant",
    golem: "PF2E.TraitGolem",
    gremlin: "PF2E.TraitGremlin",
    grioth: "PF2E.TraitGrioth",
    grippli: "PF2E.TraitGrippli",
    hag: "PF2E.TraitHag",
    hantu: "PF2E.TraitHantu",
    herald: "PF2E.TraitHerald",
    humanoid: "PF2E.TraitHumanoid",
    ifrit: "PF2E.TraitIfrit",
    ikeshti: "PF2E.TraitIkeshti",
    illusion: "PF2E.TraitIllusion",
    incorporeal: "PF2E.TraitIncorporeal",
    inevitable: "PF2E.TraitInevitable",
    kami: "PF2E.TraitKami",
    kovintus: "PF2E.TraitKovintus",
    light: "PF2E.TraitLight",
    locathah: "PF2E.TraitLocathah",
    mental: "PF2E.TraitMental",
    merfolk: "PF2E.TraitMerfolk",
    mindless: "PF2E.TraitMindless",
    minion: "PF2E.TraitMinion",
    monitor: "PF2E.TraitMonitor",
    morlock: "PF2E.TraitMorlock",
    mortic: "PF2E.TraitMortic",
    mummy: "PF2E.TraitMummy",
    munavri: "PF2E.TraitMunavri",
    mutant: "PF2E.TraitMutant",
    nagaji: "PF2E.TraitNagaji",
    nymph: "PF2E.TraitNymph",
    oni: "PF2E.TraitOni",
    ooze: "PF2E.TraitOoze",
    orc: "PF2E.TraitOrc",
    oread: "PF2E.TraitOread",
    paaridar: "PF2E.TraitPaaridar",
    petitioner: "PF2E.TraitPetitioner",
    phantom: "PF2E.TraitPhantom",
    protean: "PF2E.TraitProtean",
    psychopomp: "PF2E.TraitPsychopomp",
    qlippoth: "PF2E.TraitQlippoth",
    rakshasa: "PF2E.TraitRakshasa",
    reflection: "PF2E.TraitReflection",
    sahkil: "PF2E.TraitSahkil",
    samsaran: "PF2E.TraitSamsaran",
    "sea devil": "PF2E.TraitSeaDevil",
    serpentfolk: "PF2E.TraitSerpentfolk",
    seugathi: "PF2E.TraitSeugathi",
    shabti: "PF2E.TraitShabti",
    shadow: "PF2E.TraitShadow",
    shobhad: "PF2E.TraitShobhad",
    siktempora: "PF2E.TraitSiktempora",
    skeleton: "PF2E.TraitSkeleton",
    skelm: "PF2E.TraitSkelm",
    skulk: "PF2E.TraitSkulk",
    soulbound: "PF2E.TraitSoulbound",
    spirit: "PF2E.TraitSpirit",
    spriggan: "PF2E.TraitSpriggan",
    stheno: "PF2E.TraitStheno",
    summoned: "PF2E.TraitSummoned",
    swarm: "PF2E.TraitSwarm",
    sylph: "PF2E.TraitSylph",
    tane: "PF2E.TraitTane",
    tanggal: "PF2E.TraitTanggal",
    tengu: "PF2E.TraitTengu",
    time: "PF2E.TraitTime",
    titan: "PF2E.TraitTitan",
    troll: "PF2E.TraitTroll",
    troop: "PF2E.TraitTroop",
    undead: "PF2E.TraitUndead",
    undine: "PF2E.TraitUndine",
    urdefhan: "PF2E.TraitUrdefhan",
    vampire: "PF2E.TraitVampire",
    vanara: "PF2E.TraitVanara",
    velstrac: "PF2E.TraitVelstrac",
    vishkanya: "PF2E.TraitVishkanya",
    wayang: "PF2E.TraitWayang",
    werecreature: "PF2E.TraitWerecreature",
    wight: "PF2E.TraitWight",
    wraith: "PF2E.TraitWraith",
    wyrwood: "PF2E.TraitWyrwood",
    xulgath: "PF2E.TraitXulgath",
    zombie: "PF2E.TraitZombie",
};

const classTraits: Record<ClassTrait, string> = {
    alchemist: "PF2E.TraitAlchemist",
    barbarian: "PF2E.TraitBarbarian",
    bard: "PF2E.TraitBard",
    champion: "PF2E.TraitChampion",
    cleric: "PF2E.TraitCleric",
    druid: "PF2E.TraitDruid",
    fighter: "PF2E.TraitFighter",
    gunslinger: "PF2E.TraitGunslinger",
    inventor: "PF2E.TraitInventor",
    investigator: "PF2E.TraitInvestigator",
    magus: "PF2E.TraitMagus",
    monk: "PF2E.TraitMonk",
    oracle: "PF2E.TraitOracle",
    psychic: "PF2E.TraitPsychic",
    ranger: "PF2E.TraitRanger",
    rogue: "PF2E.TraitRogue",
    sorcerer: "PF2E.TraitSorcerer",
    summoner: "PF2E.TraitSummoner",
    swashbuckler: "PF2E.TraitSwashbuckler",
    thaumaturge: "PF2E.TraitThaumaturge",
    witch: "PF2E.TraitWitch",
    wizard: "PF2E.TraitWizard",
};

const spellOtherTraits = {
    amp: "PF2E.TraitAmp",
    attack: "PF2E.TraitAttack",
    auditory: "PF2E.TraitAuditory",
    aura: "PF2E.TraitAura",
    beast: "PF2E.TraitBeast",
    cantrip: "PF2E.TraitCantrip",
    composition: "PF2E.TraitComposition",
    concentrate: "PF2E.TraitConcentrate",
    consecration: "PF2E.TraitConsecration",
    contingency: "PF2E.TraitContingency",
    curse: "PF2E.TraitCurse",
    cursebound: "PF2E.TraitCursebound",
    darkness: "PF2E.TraitDarkness",
    death: "PF2E.TraitDeath",
    detection: "PF2E.TraitDetection",
    disease: "PF2E.TraitDisease",
    dream: "PF2E.TraitDream",
    eidolon: "PF2E.TraitEidolon",
    emotion: "PF2E.TraitEmotion",
    extradimensional: "PF2E.TraitExtradimensional",
    fear: "PF2E.TraitFear",
    fortune: "PF2E.TraitFortune",
    fungus: "PF2E.TraitFungus",
    healing: "PF2E.TraitHealing",
    hex: "PF2E.TraitHex",
    incapacitation: "PF2E.TraitIncapacitation",
    incarnate: "PF2E.TraitIncarnate",
    inhaled: "PF2E.TraitInhaled",
    light: "PF2E.TraitLight",
    linguistic: "PF2E.TraitLinguistic",
    litany: "PF2E.TraitLitany",
    metamagic: "PF2E.TraitMetamagic",
    mindless: "PF2E.TraitMindless",
    misfortune: "PF2E.TraitMisfortune",
    morph: "PF2E.TraitMorph",
    move: "PF2E.TraitMove",
    nonlethal: "PF2E.TraitNonlethal",
    olfactory: "PF2E.TraitOlfactory",
    plant: "PF2E.TraitPlant",
    poison: "PF2E.TraitPoison",
    polymorph: "PF2E.TraitPolymorph",
    possession: "PF2E.TraitPossession",
    prediction: "PF2E.TraitPrediction",
    psyche: "PF2E.TraitPsyche",
    revelation: "PF2E.TraitRevelation",
    scrying: "PF2E.TraitScrying",
    shadow: "PF2E.TraitShadow",
    sleep: "PF2E.TraitSleep",
    stance: "PF2E.TraitStance",
    summoned: "PF2E.TraitSummoned",
    teleportation: "PF2E.TraitTeleportation",
    "true-name": "PF2E.TraitTrueName",
    visual: "PF2E.TraitVisual",
};

const alignmentTraits: Record<AlignmentTrait, string> = {
    chaotic: "PF2E.TraitChaotic",
    evil: "PF2E.TraitEvil",
    good: "PF2E.TraitGood",
    lawful: "PF2E.TraitLawful",
};

const damageTraits = {
    ...alignmentTraits,
    ...elementalTraits,
    ...energyDamageTypes,
    light: "PF2E.TraitLight",
    magical: "PF2E.TraitMagical",
    mental: "PF2E.TraitMental",
    nonlethal: "PF2E.TraitNonlethal",
    plant: "PF2E.TraitPlant",
    radiation: "PF2E.TraitRadiation",
};

const magicSchools: Record<MagicSchool, string> = {
    abjuration: "PF2E.TraitAbjuration",
    conjuration: "PF2E.TraitConjuration",
    divination: "PF2E.TraitDivination",
    enchantment: "PF2E.TraitEnchantment",
    evocation: "PF2E.TraitEvocation",
    illusion: "PF2E.TraitIllusion",
    necromancy: "PF2E.TraitNecromancy",
    transmutation: "PF2E.TraitTransmutation",
};

const spellTraits = {
    ...alignmentTraits,
    ...classTraits,
    ...damageTraits,
    ...elementalTraits,
    ...magicSchools,
    ...spellOtherTraits,
};

const weaponTraits = {
    ...alignmentTraits,
    ...ancestryTraits,
    ...elementalTraits,
    ...energyDamageTypes,
    ...magicSchools,
    ...magicTraditions,
    alchemical: "PF2E.TraitAlchemical",
    agile: "PF2E.TraitAgile",
    artifact: "PF2E.TraitArtifact",
    "attached-to-shield": "PF2E.TraitAttachedToShield",
    "attached-to-crossbow-or-firearm": "PF2E.TraitAttachedToCrossbowOrFirearm",
    auditory: "PF2E.TraitAuditory",
    backstabber: "PF2E.TraitBackstabber",
    backswing: "PF2E.TraitBackswing",
    bomb: "PF2E.TraitBomb",
    "capacity-3": "PF2E.TraitCapacity3",
    "capacity-4": "PF2E.TraitCapacity4",
    "capacity-5": "PF2E.TraitCapacity5",
    charm: "PF2E.TraitCharm",
    climbing: "PF2E.TraitClimbing",
    clockwork: "PF2E.TraitClockwork",
    cobbled: "PF2E.TraitCobbled",
    combination: "PF2E.TraitCombination",
    concealable: "PF2E.TraitConcealable",
    concentrate: "PF2E.TraitConcentrate",
    concussive: "PF2E.TraitConcussive",
    consumable: "PF2E.TraitConsumable",
    "critical-fusion": "PF2E.TraitCriticalFusion",
    cursed: "PF2E.TraitCursed",
    "deadly-d6": "PF2E.TraitDeadlyD6",
    "deadly-d8": "PF2E.TraitDeadlyD8",
    "deadly-2d8": "PF2E.TraitDeadly2D8",
    "deadly-3d8": "PF2E.TraitDeadly3D8",
    "deadly-4d8": "PF2E.TraitDeadly4D8",
    "deadly-d10": "PF2E.TraitDeadlyD10",
    "deadly-2d10": "PF2E.TraitDeadly2D10",
    "deadly-3d10": "PF2E.TraitDeadly3D10",
    "deadly-4d10": "PF2E.TraitDeadly4D10",
    "deadly-d12": "PF2E.TraitDeadlyD12",
    "deadly-2d12": "PF2E.TraitDeadly2D12",
    "deadly-3d12": "PF2E.TraitDeadly3D12",
    "deadly-4d12": "PF2E.TraitDeadly4D12",
    death: "PF2E.TraitDeath",
    disarm: "PF2E.TraitDisarm",
    disease: "PF2E.TraitDisease",
    "double-barrel": "PF2E.TraitDoubleBarrel",
    emotion: "PF2E.TraitEmotion",
    "fatal-aim-d10": "PF2E.TraitFatalAimD10",
    "fatal-aim-d12": "PF2E.TraitFatalAimD12",
    "fatal-d8": "PF2E.TraitFatalD8",
    "fatal-d10": "PF2E.TraitFatalD10",
    "fatal-d12": "PF2E.TraitFatalD12",
    fear: "PF2E.TraitFear",
    finesse: "PF2E.TraitFinesse",
    forceful: "PF2E.TraitForceful",
    fortune: "PF2E.TraitFortune",
    "free-hand": "PF2E.TraitFreeHand",
    fungus: "PF2E.TraitFungus",
    good: "PF2E.TraitGood",
    grapple: "PF2E.TraitGrapple",
    hampering: "PF2E.TraitHampering",
    healing: "PF2E.TraitHealing",
    infused: "PF2E.TraitInfused",
    inhaled: "PF2E.TraitInhaled",
    injection: "PF2E.TraitInjection",
    intelligent: "PF2E.TraitIntelligent",
    invested: "PF2E.TraitInvested",
    "jousting-d6": "PF2E.TraitJoustingD6",
    kickback: "PF2E.TraitKickback",
    light: "PF2E.TraitLight",
    magical: "PF2E.TraitMagical",
    mental: "PF2E.TraitMental",
    modular: "PF2E.TraitModular",
    monk: "PF2E.TraitMonk",
    nonlethal: "PF2E.TraitNonlethal",
    olfactory: "PF2E.TraitOlfactory",
    parry: "PF2E.TraitParry",
    plant: "PF2E.TraitPlant",
    poison: "PF2E.TraitPoison",
    propulsive: "PF2E.TraitPropulsive",
    "ranged-trip": "PF2E.TraitRangedTrip",
    reach: "PF2E.TraitReach",
    repeating: "PF2E.TraitRepeating",
    resonant: "PF2E.TraitResonant",
    saggorak: "PF2E.TraitSaggorak",
    "scatter-5": "PF2E.TraitScatter5",
    "scatter-10": "PF2E.TraitScatter10",
    "scatter-15": "PF2E.TraitScatter15",
    shadow: "PF2E.TraitShadow",
    shove: "PF2E.TraitShove",
    splash: "PF2E.TraitSplash",
    staff: "PF2E.TraitStaff",
    sweep: "PF2E.TraitSweep",
    telepathy: "PF2E.TraitTelepathy",
    teleportation: "PF2E.TraitTeleportation",
    tethered: "PF2E.TraitTethered",
    thrown: "PF2E.TraitThrown",
    "thrown-10": "PF2E.TraitThrown10",
    "thrown-15": "PF2E.TraitThrown15",
    "thrown-20": "PF2E.TraitThrown20",
    "thrown-30": "PF2E.TraitThrown30",
    "thrown-40": "PF2E.TraitThrown40",
    "thrown-60": "PF2E.TraitThrown60",
    "thrown-100": "PF2E.TraitThrown100",
    time: "PF2E.TraitTime",
    trip: "PF2E.TraitTrip",
    twin: "PF2E.TraitTwin",
    "two-hand-d6": "PF2E.TraitTwoHandD6",
    "two-hand-d8": "PF2E.TraitTwoHandD8",
    "two-hand-d10": "PF2E.TraitTwoHandD10",
    "two-hand-d12": "PF2E.TraitTwoHandD12",
    unarmed: "PF2E.TraitUnarmed",
    "versatile-acid": "PF2E.TraitVersatileAcid",
    "versatile-b": "PF2E.TraitVersatileB",
    "versatile-chaotic": "PF2E.TraitVersatileChaotic",
    "versatile-cold": "PF2E.TraitVersatileCold",
    "versatile-electricity": "PF2E.TraitVersatileElectricity",
    "versatile-evil": "PF2E.TraitVersatileEvil",
    "versatile-fire": "PF2E.TraitVersatileFire",
    "versatile-force": "PF2E.TraitVersatileForce",
    "versatile-good": "PF2E.TraitVersatileGood",
    "versatile-lawful": "PF2E.TraitVersatileLawful",
    "versatile-negative": "PF2E.TraitVersatileNegative",
    "versatile-p": "PF2E.TraitVersatileP",
    "versatile-positive": "PF2E.TraitVersatilePositive",
    "versatile-s": "PF2E.TraitVersatileS",
    "versatile-sonic": "PF2E.TraitVersatileSonic",
    "volley-20": "PF2E.TraitVolley20",
    "volley-30": "PF2E.TraitVolley30",
    "volley-50": "PF2E.TraitVolley50",
};

const preciousMaterials: Record<PreciousMaterialType, string> = {
    abysium: "PF2E.PreciousMaterialAbysium",
    adamantine: "PF2E.PreciousMaterialAdamantine",
    coldIron: "PF2E.PreciousMaterialColdIron",
    darkwood: "PF2E.PreciousMaterialDarkwood",
    djezet: "PF2E.PreciousMaterialDjezet",
    dragonhide: "PF2E.PreciousMaterialDragonhide",
    "grisantian-pelt": "PF2E.PreciousMaterialGrisantianPelt",
    inubrix: "PF2E.PreciousMaterialInubrix",
    mithral: "PF2E.PreciousMaterialMithral",
    noqual: "PF2E.PreciousMaterialNoqual",
    orichalcum: "PF2E.PreciousMaterialOrichalcum",
    peachwood: "PF2E.PreciousMaterialPeachwood",
    siccatite: "PF2E.PreciousMaterialSiccatite",
    silver: "PF2E.PreciousMaterialSilver",
    sovereignSteel: "PF2E.PreciousMaterialSovereignSteel",
    warpglass: "PF2E.PreciousMaterialWarpglass",
};

const otherWeaponTags: Record<OtherWeaponTag, string> = {
    crossbow: "PF2E.Weapon.Base.crossbow",
    improvised: "PF2E.Item.Weapon.Improvised",
};

const rangeTraits = RANGE_TRAITS.reduce(
    (descriptions, trait) => ({ ...descriptions, [trait]: `PF2E.Trait${sluggify(trait, { camel: "bactrian" })}` }),
    {} as Record<typeof RANGE_TRAITS[number], string>
);

const npcAttackTraits = {
    ...weaponTraits,
    ...preciousMaterials,
    ...rangeTraits,
    brutal: "PF2E.TraitBrutal",
    curse: "PF2E.TraitCurse",
    "reach-0": "PF2E.TraitReach0",
    "reach-10": "PF2E.TraitReach10",
    "reach-15": "PF2E.TraitReach15",
    "reach-20": "PF2E.TraitReach20",
    "reach-25": "PF2E.TraitReach25",
    "reach-30": "PF2E.TraitReach30",
    "reach-40": "PF2E.TraitReach40",
    "reach-50": "PF2E.TraitReach50",
    "reach-60": "PF2E.TraitReach60",
    "reach-100": "PF2E.TraitReach100",
    "reach-1000": "PF2E.TraitReach1000",
    "reload-0": "PF2E.TraitReload0",
    "reload-1": "PF2E.TraitReload1",
    "reload-2": "PF2E.TraitReload2",
    "reload-1-min": "PF2E.TraitReload1Min",
};

const featTraits = {
    ...ancestryTraits,
    ...classTraits,
    ...damageTraits,
    ...magicSchools,
    ...magicTraditions,
    ...spellTraits,
    additive1: "PF2E.TraitAdditive1",
    additive2: "PF2E.TraitAdditive2",
    additive3: "PF2E.TraitAdditive3",
    aftermath: "PF2E.TraitAftermath",
    alchemical: "PF2E.TraitAlchemical",
    archetype: "PF2E.TraitArchetype",
    auditory: "PF2E.TraitAuditory",
    aura: "PF2E.TraitAura",
    class: "PF2E.Class",
    concentrate: "PF2E.TraitConcentrate",
    dedication: "PF2E.TraitDedication",
    detection: "PF2E.TraitDetection",
    deviant: "PF2E.TraitDeviant",
    downtime: "PF2E.TraitDowntime",
    emotion: "PF2E.TraitEmotion",
    evolution: "PF2E.TraitEvolution",
    esoterica: "PF2E.TraitEsoterica",
    exploration: "PF2E.TraitExploration",
    fear: "PF2E.TraitFear",
    finisher: "PF2E.TraitFinisher",
    flourish: "PF2E.TraitFlourish",
    fortune: "PF2E.TraitFortune",
    general: "PF2E.TraitGeneral",
    injury: "PF2E.TraitInjury",
    lineage: "PF2E.TraitLineage",
    manipulate: "PF2E.TraitManipulate",
    metamagic: "PF2E.TraitMetamagic",
    mindshift: "PF2E.TraitMindshift",
    modification: "PF2E.TraitModification",
    move: "PF2E.TraitMove",
    multiclass: "PF2E.TraitMulticlass",
    oath: "PF2E.TraitOath",
    olfactory: "PF2E.TraitOlfactory",
    open: "PF2E.TraitOpen",
    "pervasive-magic": "PF2E.TraitPervasiveMagic",
    poison: "PF2E.TraitPoison",
    press: "PF2E.TraitPress",
    rage: "PF2E.TraitRage",
    reckless: "PF2E.TraitReckless",
    reflection: "PF2E.TraitReflection",
    secret: "PF2E.TraitSecret",
    skill: "PF2E.TraitSkill",
    social: "PF2E.TraitSocial",
    spellshot: "PF2E.TraitSpellshot",
    stamina: "PF2E.TraitStamina",
    stance: "PF2E.TraitStance",
    tandem: "PF2E.TraitTandem",
    time: "PF2E.TraitTime",
    "true-name": "PF2E.TraitTrueName",
    unstable: "PF2E.TraitUnstable",
    vigilante: "PF2E.TraitVigilante",
    virulent: "PF2E.TraitVirulent",
};

const consumableTraits = {
    ...damageTraits,
    ...elementalTraits,
    ...magicSchools,
    ...magicTraditions,
    air: "PF2E.TraitAir",
    alchemical: "PF2E.TraitAlchemical",
    auditory: "PF2E.TraitAuditory",
    aura: "PF2E.TraitAura",
    catalyst: "PF2E.TraitCatalyst",
    clockwork: "PF2E.TraitClockwork",
    consumable: "PF2E.TraitConsumable",
    contact: "PF2E.TraitContact",
    drug: "PF2E.TraitDrug",
    elixir: "PF2E.TraitElixir",
    emotion: "PF2E.TraitEmotion",
    fear: "PF2E.TraitFear",
    fey: "PF2E.TraitFey",
    fortune: "PF2E.TraitFortune",
    fulu: "PF2E.TraitFulu",
    gadget: "PF2E.TraitGadget",
    healing: "PF2E.TraitHealing",
    incapacitation: "PF2E.TraitIncapacitation",
    infused: "PF2E.TraitInfused",
    ingested: "PF2E.TraitIngested",
    inhaled: "PF2E.TraitInhaled",
    injury: "PF2E.TraitInjury",
    kobold: "PF2E.TraitKobold",
    light: "PF2E.TraitLight",
    magical: "PF2E.TraitMagical",
    mechanical: "PF2E.TraitMechanical",
    misfortune: "PF2E.TraitMisfortune",
    morph: "PF2E.TraitMorph",
    mutagen: "PF2E.TraitMutagen",
    oil: "PF2E.TraitOil",
    olfactory: "PF2E.TraitOlfactory",
    poison: "PF2E.TraitPoison",
    polymorph: "PF2E.TraitPolymorph",
    potion: "PF2E.TraitPotion",
    precious: "PF2E.TraitPrecious",
    scroll: "PF2E.TraitScroll",
    scrying: "PF2E.TraitScrying",
    sleep: "PF2E.TraitSleep",
    snare: "PF2E.TraitSnare",
    splash: "PF2E.TraitSplash",
    structure: "PF2E.TraitStructure",
    talisman: "PF2E.TraitTalisman",
    teleportation: "PF2E.TraitTeleportation",
    trap: "PF2E.TraitTrap",
    virulent: "PF2E.TraitVirulent",
    visual: "PF2E.TraitVisual",
    wand: "PF2E.TraitWand",
};

const actionTraits = {
    ...featTraits,
    ...consumableTraits,
    ...spellTraits,
    circus: "PF2E.TraitCircus",
    summon: "PF2E.TraitSummon",
};

const hazardTraits = {
    ...damageTraits,
    ...magicSchools,
    ...magicTraditions,
    alchemical: "PF2E.TraitAlchemical",
    aquatic: "PF2E.TraitAquatic",
    auditory: "PF2E.TraitAuditory",
    clockwork: "PF2E.TraitClockwork",
    consumable: "PF2E.TraitConsumable",
    curse: "PF2E.TraitCurse",
    environmental: "PF2E.TraitEnvironmental",
    fungus: "PF2E.TraitFungus",
    haunt: "PF2E.TraitHaunt",
    inhaled: "PF2E.TraitInhaled",
    kaiju: "PF2E.TraitKaiju",
    magical: "PF2E.TraitMagical",
    mechanical: "PF2E.TraitMechanical",
    poison: "PF2E.TraitPoison",
    steam: "PF2E.TraitSteam",
    summoned: "PF2E.TraitSummoned",
    technological: "PF2E.TraitTechnological",
    teleportation: "PF2E.TraitTeleportation",
    trap: "PF2E.TraitTrap",
    virulent: "PF2E.TraitVirulent",
};

const vehicleTraits = {
    ...magicSchools,
    artifact: "PF2E.TraitArtifact",
    clockwork: "PF2E.TraitClockwork",
    magical: "PF2E.TraitMagical",
    teleportation: "PF2E.TraitTeleportation",
};

export {
    actionTraits,
    alignmentTraits,
    ancestryItemTraits,
    ancestryTraits,
    classTraits,
    consumableTraits,
    creatureTraits,
    damageTraits,
    elementalTraits,
    energyDamageTypes,
    featTraits,
    hazardTraits,
    magicSchools,
    magicTraditions,
    npcAttackTraits,
    otherWeaponTags,
    preciousMaterials,
    spellOtherTraits,
    spellTraits,
    vehicleTraits,
    weaponTraits,
};
