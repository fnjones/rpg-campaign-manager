import React, { useState, useEffect } from 'react';
import { Users, Eye, EyeOff, Plus, Trash2, Edit2, Shield, User, X, Save, Map, Scroll, BookOpen, MessageSquare, Link2, Anchor, Package, Coins, Flag, BookText, PawPrint, Minus, ChevronUp, ChevronDown, Search, Check, Network, Gem, ArrowLeft, Crosshair, Zap, Wrench, UserPlus, ArrowRightLeft, History, Info } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';

// --- Firebase Initialization ---
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// --- Campaign Rules & Constants (From PDF) ---
const DATA_TABLE = { 
  1: { "Prof Bonus": 2, "Features": 1, "Level Manifestations": 1, "Charge Abilities Known": 1, "Hard Points": 1, "Arcane Charges": 1 }, 
  2: { "Prof Bonus": 2, "Features": 2, "Level Manifestations": 2, "Charge Abilities Known": 1, "Hard Points": 1, "Arcane Charges": 1 }, 
  3: { "Prof Bonus": 2, "Features": 2, "Level Manifestations": 2, "Charge Abilities Known": 1, "Hard Points": 1, "Arcane Charges": 1 }, 
  4: { "Prof Bonus": 2, "Features": "ASI", "Level Manifestations": 2, "Charge Abilities Known": 1, "Hard Points": 1, "Arcane Charges": 1 }, 
  5: { "Prof Bonus": 3, "Features": 3, "Level Manifestations": 3, "Charge Abilities Known": 2, "Hard Points": 1, "Arcane Charges": 1 }, 
  6: { "Prof Bonus": 3, "Features": 3, "Level Manifestations": 3, "Charge Abilities Known": 2, "Hard Points": 1, "Arcane Charges": 1 }, 
  7: { "Prof Bonus": 3, "Features": 3, "Level Manifestations": 3, "Charge Abilities Known": 2, "Hard Points": 2, "Arcane Charges": 2 }, 
  8: { "Prof Bonus": 3, "Features": "ASI", "Level Manifestations": 3, "Charge Abilities Known": 2, "Hard Points": 2, "Arcane Charges": 2 }, 
  9: { "Prof Bonus": 4, "Features": 4, "Level Manifestations": 4, "Charge Abilities Known": 2, "Hard Points": 2, "Arcane Charges": 2 }, 
  10: { "Prof Bonus": 4, "Features": 4, "Level Manifestations": 4, "Charge Abilities Known": 2, "Hard Points": 2, "Arcane Charges": 2 }, 
  11: { "Prof Bonus": 4, "Features": 4, "Level Manifestations": 4, "Charge Abilities Known": 3, "Hard Points": 2, "Arcane Charges": 2 }, 
  12: { "Prof Bonus": 4, "Features": "ASI", "Level Manifestations": 4, "Charge Abilities Known": 3, "Hard Points": 3, "Arcane Charges": 2 }, 
  13: { "Prof Bonus": 5, "Features": 5, "Level Manifestations": 5, "Charge Abilities Known": 3, "Hard Points": 2, "Arcane Charges": 2 }, 
  14: { "Prof Bonus": 5, "Features": 5, "Level Manifestations": 5, "Charge Abilities Known": 3, "Hard Points": 3, "Arcane Charges": 3 }, 
  15: { "Prof Bonus": 5, "Features": 5, "Level Manifestations": 5, "Charge Abilities Known": 3, "Hard Points": 3, "Arcane Charges": 3 }, 
  16: { "Prof Bonus": 5, "Features": "ASI", "Level Manifestations": 6, "Charge Abilities Known": 4, "Hard Points": 3, "Arcane Charges": 3 }, 
  17: { "Prof Bonus": 6, "Features": 6, "Level Manifestations": 6, "Charge Abilities Known": 4, "Hard Points": 3, "Arcane Charges": 3 }, 
  18: { "Prof Bonus": 6, "Features": 6, "Level Manifestations": 6, "Charge Abilities Known": 4, "Hard Points": 3, "Arcane Charges": 3 }, 
  19: { "Prof Bonus": 6, "Features": 7, "Level Manifestations": 7, "Charge Abilities Known": 4, "Hard Points": 3, "Arcane Charges": 3 }, 
  20: { "Prof Bonus": 6, "Features": 7, "Level Manifestations": 7, "Charge Abilities Known": 4, "Hard Points": 3, "Arcane Charges": 3 } 
};

const VEHICLE_DATA_TABLE = { 
  1: { "Prof Bonus": 2, "Features": "-", "Attunement Slots": 1, "Hard Points": 1, "Arcane Charges": 1 }, 
  2: { "Prof Bonus": 2, "Features": "Uncommon Upgrade", "Attunement Slots": 2, "Hard Points": 1, "Arcane Charges": 1 }, 
  3: { "Prof Bonus": 2, "Features": "Uncommon Upgrade", "Attunement Slots": 2, "Hard Points": 1, "Arcane Charges": 1 }, 
  4: { "Prof Bonus": 2, "Features": "-", "Attunement Slots": 2, "Hard Points": 1, "Arcane Charges": 1 }, 
  5: { "Prof Bonus": 3, "Features": "Uncommon Upgrade", "Attunement Slots": 3, "Hard Points": 1, "Arcane Charges": 1 }, 
  6: { "Prof Bonus": 3, "Features": "-", "Attunement Slots": 3, "Hard Points": 1, "Arcane Charges": 1 }, 
  7: { "Prof Bonus": 3, "Features": "Rare Upgrade", "Attunement Slots": 3, "Hard Points": 2, "Arcane Charges": 2 }, 
  8: { "Prof Bonus": 3, "Features": "-", "Attunement Slots": 3, "Hard Points": 2, "Arcane Charges": 2 }, 
  9: { "Prof Bonus": 4, "Features": "-", "Attunement Slots": 4, "Hard Points": 2, "Arcane Charges": 2 }, 
  10: { "Prof Bonus": 4, "Features": "Uncommon Upgrade", "Attunement Slots": 4, "Hard Points": 2, "Arcane Charges": 2 }, 
  11: { "Prof Bonus": 4, "Features": "-", "Attunement Slots": 4, "Hard Points": 2, "Arcane Charges": 2 }, 
  12: { "Prof Bonus": 4, "Features": "-", "Attunement Slots": 4, "Hard Points": 3, "Arcane Charges": 2 }, 
  13: { "Prof Bonus": 5, "Features": "Rare Upgrade", "Attunement Slots": 5, "Hard Points": 2, "Arcane Charges": 2 }, 
  14: { "Prof Bonus": 5, "Features": "-", "Attunement Slots": 5, "Hard Points": 3, "Arcane Charges": 3 }, 
  15: { "Prof Bonus": 5, "Features": "-", "Attunement Slots": 5, "Hard Points": 3, "Arcane Charges": 3 }, 
  16: { "Prof Bonus": 5, "Features": "-", "Attunement Slots": 6, "Hard Points": 3, "Arcane Charges": 3 }, 
  17: { "Prof Bonus": 6, "Features": "Very Rare Upgrade", "Attunement Slots": 6, "Hard Points": 3, "Arcane Charges": 3 }, 
  18: { "Prof Bonus": 6, "Features": "-", "Attunement Slots": 6, "Hard Points": 3, "Arcane Charges": 3 }, 
  19: { "Prof Bonus": 6, "Features": "-", "Attunement Slots": 7, "Hard Points": 3, "Arcane Charges": 3 }, 
  20: { "Prof Bonus": 6, "Features": "-", "Attunement Slots": 7, "Hard Points": 3, "Arcane Charges": 3 } 
};

const ORIGINS = [ 
  { name: "Predator", type: "predator" }, 
  { name: "Piercer", type: "piercer" }, 
  { name: "Arcanabeast", type: "arcanabeast" } 
];

const PHYSICAL_POINT_COSTS = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9, 16: 12, 17: 16 };
const MENTAL_POINT_COSTS = { 5: 0, 6: 1, 7: 2, 8: 3, 9: 4, 10: 5, 11: 6, 12: 7, 13: 8, 14: 10, 15: 12, 16: 15, 17: 19 };
const MAX_POINTS = 25; 

// --- Rich Mount Abilities ---
const MANIFESTATIONS = [
  { name: "Aggressive", description: "As a bonus action, the mount can move up to its speed toward a hostile creature it can see." },
  { name: "Avoidance", description: "If the mount makes a save to take half damage, it takes no damage on success, and half on failure." },
  { name: "Big boned", description: "The mount has advantage on saving throws against being moved or knocked prone." },
  { name: "Chameleon skin", description: "The mount has advantage on Stealth checks to hide." },
  { name: "Charge", description: "If the mount moves 20 feet straight toward a target and hits with a melee attack, it deals extra damage.", isAttack: true, damageCount: 2, damageDie: 6 },
  { name: "Deflect attack", description: "When a creature misses the mount with a melee attack, it can use a reaction to make a melee attack.", isAttack: true, damageCount: 1, damageDie: 8 },
  { name: "Distracting attack", description: "When the mount hits a creature, the next attack roll against the target by an ally has advantage." },
  { name: "Grapple attack", description: "Melee Weapon Attack. On a hit, the target takes damage and is grappled.", isAttack: true, damageCount: 1, damageDie: 6 },
  { name: "Hemocache", description: "The mount has a fleshy pouch that can safely store items." },
  { name: "Keen sense", description: "The mount has advantage on Perception checks that rely on sight, hearing, or smell." },
  { name: "Legendary resistance", description: "If the mount fails a saving throw, it can choose to succeed instead. (1/Day)." },
  { name: "Magic attacks", description: "The mount's attacks are magical for the purpose of overcoming resistance and immunity." },
  { name: "Magic resistance", description: "The mount has advantage on saving throws against spells and other magical effects." },
  { name: "Mounted flyby", description: "The mount doesn't provoke opportunity attacks when it flies out of an enemy's reach." },
  { name: "Multiattack", description: "The mount makes two melee attacks when taking the Attack action." },
  { name: "Retaliation", description: "When damaged by a creature within 5 feet, the mount can use its reaction to attack.", isAttack: true, damageCount: 1, damageDie: 8 },
  { name: "Speech", description: "The mount can speak one language." },
  { name: "Stubborn", description: "The mount has advantage on saving throws against being charmed or frightened." }
];

const CHARGE_ABILITIES = [
  { name: "Antimagic cone", description: "Create a 30-foot cone of antimagic. Spells can't be cast, summoned creatures disappear, and magic items are mundane." },
  { name: "Cloud coverage", description: "Create a 20-foot-radius sphere of fog. The sphere spreads around corners, and its area is heavily obscured." },
  { name: "Blink", description: "Roll a d20 at the end of each turn. On an 11 or higher, vanish into the Ethereal Plane." },
  { name: "Breath weapon", description: "Exhale destructive energy in a 15-foot cone. Each creature makes a Dex save.", isSave: true, damageCount: 3, damageDie: 6 },
  { name: "Lesser petrifying gaze", description: "Target a creature within 30 feet. Con save or begin turning to stone." },
  { name: "Fearsome growl", description: "Each creature within 30 feet must succeed on a Wis save or become frightened for 1 minute." },
  { name: "Energy sphere", description: "Hurl a ball of energy at a point within 60 feet. It explodes in a 20-foot radius. Dex save.", isSave: true, damageCount: 4, damageDie: 6 },
  { name: "Sonic Step", description: "Teleport up to 30 feet. Each creature within 10 feet of the destination takes Thunder damage.", isSave: true, damageCount: 1, damageDie: 10 },
  { name: "Swallow", description: "Make a bite attack. On a hit, a Medium or smaller target is swallowed and takes acid damage.", isAttack: true, damageCount: 2, damageDie: 8 }
];

const VEHICLE_WEAPONS = [
  { name: "Standard Harpoon", hardpoints: 1, cost: "100gp", details: "Ranged Weapon Attack: +4 to hit, range 60/120 ft. Hit: 11 (2d10) piercing damage.", attackMod: 4, damageCount: 2, damageDie: 10 },
  { name: "Scrap Cannon", hardpoints: 2, cost: "300gp", details: "Ranged Weapon Attack: +5 to hit, range 80/320 ft. Hit: 16 (3d10) bludgeoning damage.", attackMod: 5, damageCount: 3, damageDie: 10 }
];

const VEHICLE_UPGRADES = [
  { name: "Aether smite", slots: 1, hardpoints: 1, rarity: "Uncommon", cost: "5000gp", description: "Empower next melee/ranged attack with 3d8 extra damage (acid, fire, lightning, or thunder). +2d8 vs Huge/Gargantuan.", isAttack: true, attackMod: 0, damageCount: 3, damageDie: 8 },
  { name: "Afterburner", slots: 1, hardpoints: 0, rarity: "Uncommon", cost: "5000gp", description: "When Brumestone surge is used, the vehicle can move an additional 60 feet." },
  { name: "Battery charge", slots: 2, hardpoints: 0, rarity: "Very Rare", cost: "25000gp", description: "When at 0 arcane charges, roll 1d6 at the end of your turn. On a 6, regain a charge." },
  { name: "Cloud coverage", slots: 1, hardpoints: 0, rarity: "Uncommon", cost: "5000gp", description: "Expend an arcane charge to create a 120-ft-radius dense cloud within 180 feet that hovers for 1 minute." },
  { name: "Durable plating", slots: 2, hardpoints: 0, rarity: "Rare", cost: "10000gp", description: "Bludgeoning, piercing, and slashing damage from nonmagical attacks is reduced by 3." },
  { name: "Huge frame", slots: 1, hardpoints: 0, rarity: "Uncommon", cost: "5000gp", description: "Gain 2 additional hardpoints, accommodate 8 riders. Can install 1 heavy hardpoint (takes 3 standard hardpoints)." },
  { name: "Hullbuster", slots: 1, hardpoints: 1, rarity: "Uncommon", cost: "5000gp", description: "Melee/spell attack (5ft). On hit: 5d10 damage and creates a hole in the hull large enough for a medium creature.", isAttack: true, attackMod: 5, damageCount: 5, damageDie: 10 },
  { name: "Impact Halo", slots: 1, hardpoints: 1, rarity: "Uncommon", cost: "5000gp", description: "Expend charge for 1 min field. Once per turn on hit, deal extra damage equal to your proficiency bonus." },
  { name: "Launchpad", slots: 1, hardpoints: 0, rarity: "Uncommon", cost: "5000gp", description: "When launching from an allied Skycarrier, double speed this turn. Recharges after 1 hour stationary." },
  { name: "Magical hardpoints", slots: 1, hardpoints: 0, rarity: "Uncommon", cost: "5000gp", description: "You can use Intelligence, Charisma, or Wisdom for martial hardpoint attack and damage rolls." },
  { name: "Mirror Image", slots: 1, hardpoints: 0, rarity: "Uncommon", cost: "5000gp", description: "Expend charge to generate three illusory images of yourself or your vehicle, as the spell." },
  { name: "Null magic missile", slots: 2, hardpoints: 1, rarity: "Very Rare", cost: "25000gp", description: "Expend charge to create a 150-ft radius antimagic field within 800 feet for 1 min. Recharges after 8 hours." },
  { name: "Razorwake", slots: 1, hardpoints: 0, rarity: "Uncommon", cost: "5000gp", description: "Expend charge to create 90-ft-radius tube of spikes within 300ft. 2d4 piercing per 30ft traveled inside. Lasts 1 min." },
  { name: "Remote piloting", slots: 1, hardpoints: 0, rarity: "Uncommon", cost: "5000gp", description: "Designated pilot can issue movement commands as a bonus action while within 1 mile of the vehicle." },
  { name: "Repair subroutine", slots: 1, hardpoints: 1, rarity: "Uncommon", cost: "5000gp", description: "Expend charge to patch a creature/vehicle within 30ft, granting 2d8 temporary hit points for 1 min." },
  { name: "Shatterblast", slots: 1, hardpoints: 1, rarity: "Uncommon", cost: "5000gp", description: "Expend charge: 15-ft radius sphere within 120ft. Con save, 3d8 Thunder damage (half on success). +2d8 vs Huge/Gargantuan.", isSave: true, saveDC: 15, damageCount: 3, damageDie: 8 },
  { name: "Skyhook", slots: 1, hardpoints: 1, rarity: "Uncommon", cost: "5000gp", description: "Expend charge to attack flying target 30-180ft away. Pulls target or yourself depending on size, or reroll Dex saves." },
  { name: "Spelljack Nexus", slots: 1, hardpoints: 0, rarity: "Very Rare", cost: "25000gp", description: "Extend cast time of 'Self' spells by 1 round to make them originate from the vehicle instead." },
  { name: "Twinbolt Conduit", slots: 1, hardpoints: 1, rarity: "Rare", cost: "10000gp", description: "Requires 2 vehicles. 5ft line of lightning between them (up to 300ft). Dex save DC 16: 6d10 lightning (+2d10 huge/garg).", isSave: true, saveDC: 16, damageCount: 6, damageDie: 10 },
  { name: "Versatile hardpoints", slots: 1, hardpoints: 0, rarity: "Uncommon", cost: "5000gp", description: "Use Strength or Dexterity modifier for martial hardpoint attack and damage rolls." },
  { name: "Widows wing", slots: 1, hardpoints: 0, rarity: "Uncommon", cost: "5000gp", description: "Gain 60ft speed. Explodes if it travels > 1,020 feet (deals PBd6 fire damage within 15ft)." }
];

const SHIP_WEAPONS = [
  { name: "Cannon", hardpoints: 1, crew: 3, cost: "50gp", details: "Ranged Weapon Attack: +6 to hit, range 120/480 ft., one target. Hit: 16 (3d10) bludgeoning damage. Deals an additional 5 (1d10) damage to huge and gargantuan targets.", attackMod: 6, damageCount: 3, damageDie: 10 },
  { name: "Mangonel", hardpoints: 1, crew: 4, cost: "100gp", details: "Ranged Weapon Attack: +5 to hit, range 210/870 ft. (can’t hit targets within 60 feet of it), one target. Hit: 27 (5d10) bludgeoning damage. Deals an additional 5 (1d10) damage to huge and gargantuan targets.", attackMod: 5, damageCount: 5, damageDie: 10 },
  { name: "Blunt Ram", hardpoints: 1, crew: 0, cost: "300gp", details: "Melee Weapon Attack: +10 to hit, range 0 ft. one huge or gargantuan target. Hit: 137 (25d10) bludgeoning damage. The attacking ship takes half as much damage and comes to a dead stop.", attackMod: 10, damageCount: 25, damageDie: 10 },
  { name: "Harpoon winch", hardpoints: 1, crew: 4, cost: "150gp", details: "Ranged Weapon Attack: +6 to hit, range 120/390 ft., one large, huge, or gargantuan target. Hit: 11 (2d10) piercing damage. When affected, the target is restrained.", attackMod: 6, damageCount: 2, damageDie: 10 },
  { name: "Gale Cannon", hardpoints: 3, crew: 5, cost: "2500gp", details: "Fixed mount. Ranged Weapon Attack: +6 to hit, range 600/2400 ft. Hit: 55 (10d10) bludgeoning damage. Deals an additional 27 (5d10) damage to huge and gargantuan targets.", attackMod: 6, damageCount: 10, damageDie: 10 }
];

const SHIP_UPGRADES = [
  { name: "Brumestone gravity vortex", slots: 1, rarity: "Very Rare", cost: "10000gp", description: "Create a 210-ft radius area of warped gravity for 1 minute. Creatures/vehicles move 2x speed toward center, 0.5x speed away. Creatures within 60ft of center make DC 15 STR save, taking 10d10 force damage on fail (half on success)." },
  { name: "Calibration field", slots: 1, rarity: "Uncommon", cost: "10000gp", description: "Cast Bless with a range of 150 feet on 8 targets." },
  { name: "Cloud coverage", slots: 1, rarity: "Uncommon", cost: "10000gp", description: "Create a 180-ft-radius dense cloud at a point within 360 feet." },
  { name: "Healing station", slots: 1, rarity: "Uncommon", cost: "10000gp", description: "Designate a 5x5ft area. An allied creature in this area can use an Officer Command to spend Hit Dice to heal at a 2-to-1 rate (e.g. spend 4 hit dice to roll 2). The creature is stunned until the end of their next turn." },
  { name: "Mobile hut", slots: 1, rarity: "Uncommon", cost: "10000gp", description: "Cast Tiny Hut on the deck for 10 minutes. Crew can pass through freely." },
  { name: "Razorwake", slots: 1, rarity: "Uncommon", cost: "10000gp", description: "Create a 150-ft-radius tube of sharp edges. The area is difficult terrain and deals 2d4 piercing damage for every 30 feet traveled within it." },
  { name: "Spelljack Nexus", slots: 1, rarity: "Very Rare", cost: "10000gp", description: "A spellcaster in a designated 5x5ft area can extend a spell with range 'Self' by 1 round to make it originate from the ship instead." },
  { name: "Storm generator", slots: 1, rarity: "Rare", cost: "10000gp", description: "Cast Control Weather." }
];

const OFFICER_COMMANDS = [
  { name: "Salvo (Recharge 6)", description: "Each creature or vehicle in a 720-foot-long line originating from the skycarrier must make a DC 16 Dexterity saving throw, unless they are behind total cover. On a failed save, the target takes 27 (5d10) bludgeoning damage, or half as much on a successful save. Against huge and gargantuan targets, this damage increases by 11 (2d10) for every 10 crew members currently alive and aboard the ship to a max of 247 (45d10) total damage from a possible 200 crew members." },
  { name: "Reload", description: "If salvo is not available, roll an additional 1d6 to determine if another salvo becomes available." },
  { name: "Combat repairs", description: "The crew executes a quick battlefield repair that restores structural integrity. When applied, the ship gains 3d8 temporary hit points, which may not exceed its hit point maximum. These temporary hit points last for 1 minute or until depleted. This ability recharges after one hour." },
  { name: "Full steam", description: "The ship surges forward at maximum output. The skycarrier can move an additional 30 feet this turn, following the skycarrier movement rules." },
  { name: "Evasive maneuvers", description: "The crew focuses entirely on avoiding attacks. Until the start of the ship’s next turn, any attack roll made against the ship has disadvantage, and the ship makes Dexterity saving throws with advantage. However, the ship does not roll to recharge Salvo at the end of the ship’s next turn, and ship’s hardpoints will not make attacks this turn." },
  { name: "Repel boarders", description: "The crew takes arms to repel any enemies on the ship. Any hostile creatures visible on your ship must make a DC 14 Dexterity saving throw. On a failed save they take 3d6 slashing damage or half as much on a successful save." },
  { name: "Something else", description: "You are not limited to just these commands. Feel free to provide contextually appropriate orders to your crew." }
];

const MOUNT_SKILLS = [
  { name: "Acrobatics", stat: "DEX" },
  { name: "Athletics", stat: "STR" },
  { name: "Perception", stat: "WIS" },
  { name: "Stealth", stat: "DEX" },
  { name: "Survival", stat: "WIS" }
];

// --- Configuration ---
const CATEGORIES = [
  { id: 'npc', label: 'NPCs', singular: 'NPC', icon: Users, desc: 'Characters and inhabitants' },
  { id: 'location', label: 'Locations', singular: 'Location', icon: Map, desc: 'Regions, cities, and landmarks' },
  { id: 'quest', label: 'Quests', singular: 'Quest', icon: Scroll, desc: 'Active and completed missions' },
  { id: 'session', label: 'Session Notes', singular: 'Session Note', icon: BookOpen, desc: 'Chronicles and recaps' },
  { id: 'faction', label: 'Factions & Guilds', singular: 'Faction', icon: Flag, desc: 'Alliances and organizations' },
  { id: 'inventory', label: 'Party Inventory', singular: 'Inventory Item', icon: Package, desc: 'Shared loot and resources' },
  { id: 'ship', label: 'Ships', singular: 'Ship', icon: Anchor, desc: 'Vessels and loadouts' },
  { id: 'ledger', label: 'Coffers & Ledger', singular: 'Ledger Entry', icon: Coins, desc: 'Group funds and expenses' },
  { id: 'mount', label: 'Mounts & Vehicles', singular: 'Mount / Vehicle', icon: PawPrint, desc: 'Custom creatures and machines' },
  { id: 'item', label: 'Notable Items', singular: 'Notable Item', icon: Gem, desc: 'Artifacts and rare relics' }
];

const CATEGORY_GROUPS = [
  { title: "Shared Assets", ids: ['inventory', 'ship', 'ledger'] },
  { title: "Notes", ids: ['npc', 'location', 'quest', 'session', 'faction'] },
  { title: "Mounts & Notable Items", ids: ['mount', 'item'] }
];

const theme = {
  bg: "font-inter bg-[#111827] text-gray-200 min-h-screen flex flex-col",
  card: "bg-[#1F2937] rounded-xl p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] flex flex-col relative",
  cardHeaderTitle: "text-xl font-bold text-[#FCA5A5] border-b border-[#374151] pb-3 mb-4",
  input: "w-full bg-[#374151] border border-[#4B5563] text-[#D1D5DB] rounded-lg px-4 py-3 focus:outline-none focus:border-[#F87171] focus:shadow-[0_0_0_3px_rgba(248,113,113,0.3)] transition-all",
  btnPrimary: "px-6 py-3 bg-[#DC2626] hover:bg-[#B91C1C] active:scale-95 text-white font-bold rounded-lg transition-all disabled:bg-[#4B5563] disabled:cursor-not-allowed flex items-center justify-center gap-2",
  btnSecondary: "px-6 py-3 bg-[#4B5563] hover:bg-[#6B7280] active:scale-95 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2",
  modalOverlay: "fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4",
  modalBox: "bg-[#1F2937] rounded-2xl p-6 md:p-8 max-w-3xl w-full border border-[#4B5563] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] max-h-[95vh] flex flex-col"
};

const calculateModifier = (score) => Math.floor((score - 10) / 2);

const calculateDynamicSpeed = (baseSpeed, hpMax, hpCurrent) => {
   const damage = Math.max(0, hpMax - hpCurrent);
   const penalty = Math.floor(damage / 10) * 20;
   return Math.max(0, baseSpeed - penalty);
};

// --- Free Vehicle Upgrade Helper Functions ---
const getEquippedRarities = (upgradesList) => {
    let equipped = { uncommon: 0, rare: 0, veryRare: 0 };
    upgradesList.forEach(uName => {
        const u = VEHICLE_UPGRADES.find(x => x.name === uName);
        if(u) {
            if(u.rarity === 'Uncommon') equipped.uncommon++;
            else if(u.rarity === 'Rare') equipped.rare++;
            else if(u.rarity === 'Very Rare') equipped.veryRare++;
        }
    });
    return equipped;
};

const getFreeVehicleUpgrades = (level) => {
   let uncommon = 0, rare = 0, veryRare = 0;
   if (level >= 2) uncommon++;
   if (level >= 3) uncommon++;
   if (level >= 5) uncommon++;
   if (level >= 10) uncommon++;
   if (level >= 7) rare++;
   if (level >= 13) rare++;
   if (level >= 17) veryRare++;
   return { uncommon, rare, veryRare };
};

const calculateVehicleUpgradesCost = (upgradesList, level) => {
   const free = getFreeVehicleUpgrades(level);
   const equipped = getEquippedRarities(upgradesList);
   let paidUncommon = Math.max(0, equipped.uncommon - free.uncommon);
   let paidRare = Math.max(0, equipped.rare - free.rare);
   let paidVeryRare = Math.max(0, equipped.veryRare - free.veryRare);
   return (paidUncommon * 5000) + (paidRare * 10000) + (paidVeryRare * 25000);
};

const getMountSkill = (skillName, statName, entry, profBonus) => {
    const score = (entry.stats?.[statName] || 10) + (entry.asiAllocations?.[statName] || 0);
    let mod = calculateModifier(score);
    let isProf = false;
    let note = "";

    const manifs = entry.manifestations || [];

    if (skillName === "Stealth" && manifs.includes("Chameleon skin")) {
        isProf = true;
        note = "Advantage (Chameleon Skin)";
    }
    if (skillName === "Perception" && manifs.includes("Keen sense")) {
        isProf = true;
        note = "Advantage (Keen Sense)";
    }
    if (skillName === "Survival" && manifs.includes("Keen sense")) {
        isProf = true;
    }
    if (skillName === "Athletics" && manifs.includes("Big boned")) {
        isProf = true;
        note = "Advantage vs Prone/Moved (Big Boned)";
    }

    if (isProf) mod += profBonus;

    return { name: skillName, mod, note, statName, isProf };
};

// --- Network Web Visualization Component ---
const NetworkWeb = ({ entry, connectedEntries, onNavigate, title = "Connected Web", icon: Icon = Network }) => {
  const N = connectedEntries.length;
  const baseRadius = N <= 5 ? 100 : N <= 10 ? 130 : 150;
  let maxStagger = 0;
  if (N > 16) maxStagger = 130; 
  else if (N > 6) maxStagger = 65; 
  
  const containerSize = (baseRadius + maxStagger) * 2 + 130; 
  const EntryIcon = CATEGORIES.find(c => c.id === entry.type)?.icon || Link2;

  return (
    <div className="pt-4 border-t border-[#374151] mt-5">
      <h4 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5" /> {title}
      </h4>
      <div className="overflow-x-auto custom-scrollbar pb-2">
        <div className="relative mx-auto bg-[#111827] border border-[#374151] rounded-xl overflow-hidden shadow-inner" style={{ minHeight: containerSize, minWidth: Math.max(containerSize, 360) }}>
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#D1D5DB 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {connectedEntries.map((conn, i) => {
              const angle = (i / N) * 2 * Math.PI - Math.PI / 2;
              let currentRadius = baseRadius;
              if (N > 16) currentRadius += (i % 3) * 65;
              else if (N > 6) currentRadius += (i % 2) * 65;
              const x2 = `calc(50% + ${Math.cos(angle) * currentRadius}px)`;
              const y2 = `calc(50% + ${Math.sin(angle) * currentRadius}px)`;
              return (
                <line key={conn.id} x1="50%" y1="50%" x2={x2} y2={y2} stroke={conn.isParent ? "#FCA5A5" : "#4B5563"} strokeWidth={conn.isParent ? "2.5" : "2"} strokeDasharray={conn.isParent ? "none" : "4 4"} className={conn.isParent ? "opacity-75" : "opacity-50"} />
              );
            })}
          </svg>
          <div className="absolute z-10 flex flex-col items-center justify-center p-3 bg-[#DC2626] border-2 border-[#FCA5A5] rounded-xl shadow-lg shadow-[#DC2626]/20" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', maxWidth: '140px' }}>
            <EntryIcon className="w-6 h-6 text-white mb-1" />
            <span className="text-sm font-bold text-white text-center leading-tight truncate w-full px-2">{entry.name}</span>
          </div>
          {connectedEntries.map((conn, i) => {
            const angle = (i / N) * 2 * Math.PI - Math.PI / 2;
            let currentRadius = baseRadius;
            if (N > 16) currentRadius += (i % 3) * 65;
            else if (N > 6) currentRadius += (i % 2) * 65;
            const left = `calc(50% + ${Math.cos(angle) * currentRadius}px)`;
            const top = `calc(50% + ${Math.sin(angle) * currentRadius}px)`;
            const CatIcon = conn.isParent ? ChevronUp : (CATEGORIES.find(c => c.id === conn.type)?.icon || Link2);
            return (
              <div key={conn.id} className="absolute z-10" style={{ top, left, transform: 'translate(-50%, -50%)' }}>
                <button onClick={(e) => { e.stopPropagation(); onNavigate(conn.type, conn.name); }} className={`flex flex-col items-center justify-center p-2.5 bg-[#1F2937] border ${conn.isParent ? 'border-[#FCA5A5] shadow-[#FCA5A5]/20' : 'border-[#4B5563]'} rounded-lg shadow-md hover:bg-[#374151] hover:border-[#FCA5A5] hover:scale-105 transition-all group max-w-[110px] min-w-[85px]`} title={`Jump to ${conn.name}`}>
                  <CatIcon className={`w-4 h-4 ${conn.isParent ? 'text-[#FCA5A5]' : 'text-[#9CA3AF]'} group-hover:text-[#FCA5A5] mb-1 transition-colors`} />
                  <span className="text-[10px] font-bold text-[#E5E7EB] text-center leading-tight line-clamp-2 w-full">{conn.name}</span>
                  {conn.subType && <span className="text-[8px] font-bold text-[#6B7280] uppercase mt-0.5 truncate w-full text-center">{conn.subType}</span>}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [currentView, setCurrentView] = useState('home'); 
  const [entries, setEntries] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customAlert, setCustomAlert] = useState(null);
  
  // Shared Assets / Ledger State
  const [partyFunds, setPartyFunds] = useState({ gp: 0, sp: 0, cp: 0, logs: [] });
  const [ledgerForm, setLedgerForm] = useState({ amount: '', currency: 'gp', reason: '' });

  // Navigation & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCards, setExpandedCards] = useState({}); 

  // Ship & Vehicle Custom States
  const [repairHpCount, setRepairHpCount] = useState({});
  const [repairLocationIsPort, setRepairLocationIsPort] = useState({});
  const [crewHireCount, setCrewHireCount] = useState({});
  const [activeCommandHover, setActiveCommandHover] = useState({});
  const [formHoveredWeapon, setFormHoveredWeapon] = useState(null);
  const [formHoveredUpgrade, setFormHoveredUpgrade] = useState(null);
  const [formHoveredManifestation, setFormHoveredManifestation] = useState(null);
  const [formHoveredChargeAbility, setFormHoveredChargeAbility] = useState(null);
  const [activeRoll, setActiveRoll] = useState(null);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', gmNotes: '', isPublic: false, connections: [],
    
    // Mount & Vehicle Fields
    mountType: 'mount', // 'mount' or 'vehicle'
    level: 1, origin: '', stats: { STR: 8, DEX: 8, CON: 8, INT: 5, WIS: 5, CHA: 5 }, manifestations: [], chargeAbilities: [], asiAllocations: {},
    mountDetails: { hpMax: 50, hpCurrent: 50, baseSpeed: 100, baseAc: 10 },
    vehicleStats: { hpMax: 50, hpCurrent: 50, ac: 15, baseSpeed: 150, extraHardpoints: 0, extraSlots: 0 },
    vehicleLoadout: { weapons: [], upgrades: [] },

    // Location Fields
    parentLocationId: '', locationSubType: 'Point of Interest',
    
    // Ship Fields
    shipStats: { hpMax: 100, hpCurrent: 100, crewMax: 20, crewCurrent: 20, hardpointsMax: 3, slotsMax: 1 },
    shipLoadout: { weapons: [], upgrades: [] }
  });

  const [isNotesFormOpen, setIsNotesFormOpen] = useState(false);
  const [activeNotesEntry, setActiveNotesEntry] = useState(null);
  const [playerNotesText, setPlayerNotesText] = useState('');

  // Define derived variables that are used in rendering
  const statsToUse = formData.stats || { STR: 8, DEX: 8, CON: 8, INT: 5, WIS: 5, CHA: 5 };
  const levelToUse = formData.level || 1;
  const allocsToUse = formData.asiAllocations || {};

  const physicalPointsSpent = PHYSICAL_POINT_COSTS[statsToUse.STR] + PHYSICAL_POINT_COSTS[statsToUse.DEX] + PHYSICAL_POINT_COSTS[statsToUse.CON];
  const mentalPointsSpent = MENTAL_POINT_COSTS[statsToUse.INT] + MENTAL_POINT_COSTS[statsToUse.WIS] + MENTAL_POINT_COSTS[statsToUse.CHA];
  const totalPointsSpent = physicalPointsSpent + mentalPointsSpent;
  
  const mountProgression = DATA_TABLE[levelToUse] || DATA_TABLE[1];
  const vehicleProgression = VEHICLE_DATA_TABLE[levelToUse] || VEHICLE_DATA_TABLE[1];
  
  const asisEarned = [4, 8, 12, 16].filter(l => levelToUse >= l).length;
  const totalAsiPoints = asisEarned * 2;
  const asiSpent = Object.values(allocsToUse).reduce((a, b) => a + b, 0);
  
  const freeUpgrades = getFreeVehicleUpgrades(levelToUse);
  const equippedRarities = getEquippedRarities(formData.vehicleLoadout?.upgrades || []);

  // 1. Initialize Auth
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth Error:", err);
        setError("Failed to authenticate.");
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // 2. Fetch Data (Entries & Ledger)
  useEffect(() => {
    if (!user || !role) {
      setLoading(false);
      return;
    }
    setLoading(true);
    
    const entriesRef = collection(db, 'artifacts', appId, 'public', 'data', 'campaign_entries');
    const unsubEntries = onSnapshot(entriesRef, (snapshot) => {
        const fetchedEntries = [];
        snapshot.forEach((doc) => fetchedEntries.push({ id: doc.id, ...doc.data() }));
        fetchedEntries.sort((a, b) => a.name.localeCompare(b.name));
        setEntries(fetchedEntries);
        setLoading(false);
    }, (err) => {
        console.error("Error:", err);
        setError("Failed to load campaign data.");
        setLoading(false);
    });

    const fundsRef = doc(db, 'artifacts', appId, 'public', 'data', 'party_coffer', 'singleton');
    const unsubFunds = onSnapshot(fundsRef, (docSnap) => {
        if (docSnap.exists()) {
            setPartyFunds(docSnap.data());
        } else {
            setPartyFunds({ gp: 0, sp: 0, cp: 0, logs: [] });
        }
    });

    return () => { unsubEntries(); unsubFunds(); };
  }, [user, role]);

  // --- Handlers ---
  const selectRole = (selectedRole) => setRole(selectedRole);
  const handleLogout = () => {
    setRole(null); setSearchQuery(''); setCurrentView('home'); setExpandedCards({});
  };

  const changeCategory = (categoryId) => {
    setActiveCategory(categoryId); setSearchQuery(''); setCurrentView('category');
  };

  // --- Ledger Actions ---
  const handleLedgerTransaction = async (type) => {
    const amount = parseInt(ledgerForm.amount);
    if (!amount || amount <= 0) return setCustomAlert("Please enter a valid amount.");
    if (!ledgerForm.reason.trim()) return setCustomAlert("Please enter a reason for the ledger.");

    let newFunds = { ...partyFunds };
    let logMsg = "";
    const curr = ledgerForm.currency.toUpperCase();

    if (type === 'add') {
      newFunds[ledgerForm.currency] = (newFunds[ledgerForm.currency] || 0) + amount;
      logMsg = `Deposited ${amount} ${curr}: ${ledgerForm.reason}`;
    } else {
      if ((newFunds[ledgerForm.currency] || 0) < amount) return setCustomAlert(`Not enough ${curr} in the coffers!`);
      newFunds[ledgerForm.currency] -= amount;
      logMsg = `Spent ${amount} ${curr}: ${ledgerForm.reason}`;
    }

    const newLogs = [{ id: crypto.randomUUID(), date: new Date().toISOString(), text: logMsg, user: role === 'gm' ? 'Game Master' : 'Party Member' }, ...(newFunds.logs || [])].slice(0, 100);
    newFunds.logs = newLogs;

    try {
      const fundsRef = doc(db, 'artifacts', appId, 'public', 'data', 'party_coffer', 'singleton');
      await setDoc(fundsRef, newFunds, { merge: true });
      setLedgerForm({ amount: '', currency: 'gp', reason: '' });
      setCustomAlert("Ledger updated successfully.");
    } catch (err) {
      console.error(err);
      setCustomAlert("Failed to update ledger.");
    }
  };

  // --- Dice Roller Logic ---
  const handleRollWeapon = (weapon) => {
    const d20 = Math.floor(Math.random() * 20) + 1;
    const attackTotal = d20 + (weapon.attackMod || 0);
    let damageRolls = [];
    let damageTotal = 0;
    
    for (let i = 0; i < (weapon.damageCount || 0); i++) {
      const roll = Math.floor(Math.random() * (weapon.damageDie || 1)) + 1;
      damageRolls.push(roll);
      damageTotal += roll;
    }
    
    setActiveRoll({ weapon, d20, attackTotal, damageRolls, damageTotal, isCheck: false });
  };

  const handleRollAbilityCheck = (statName, mod) => {
    const d20 = Math.floor(Math.random() * 20) + 1;
    setActiveRoll({
      weapon: { name: `${statName} Check` },
      d20,
      attackTotal: d20 + mod,
      damageRolls: [],
      damageTotal: 0,
      isCheck: true
    });
  };

  const handleRollSkill = (skill) => {
    const d20 = Math.floor(Math.random() * 20) + 1;
    setActiveRoll({
        weapon: { name: `${skill.name} Check` },
        d20,
        attackTotal: d20 + skill.mod,
        damageRolls: [],
        damageTotal: 0,
        isCheck: true,
        note: skill.note
    });
  };

  const handleRollSalvo = (entry) => {
    const baseCount = 5; 
    const crewTens = Math.floor((entry.shipStats?.crewCurrent || 0) / 10);
    const bonusCount = crewTens * 2; 
    const damageCount = baseCount + bonusCount;
    
    let damageRolls = [];
    let damageTotal = 0;
    
    for (let i = 0; i < damageCount; i++) {
      const roll = Math.floor(Math.random() * 10) + 1;
      damageRolls.push(roll);
      damageTotal += roll;
    }
    
    setActiveRoll({ 
      weapon: { name: "Salvo Barrage", isSave: true, saveDC: 16, damageCount, damageDie: 10 }, 
      d20: null, 
      attackTotal: null, 
      damageRolls, 
      damageTotal,
      salvoDetails: { baseCount, bonusCount },
      isCheck: false
    });
  };

  // --- Universal Direct Stat Action (HP/Crew) ---
  const handleDirectStatChange = async (entry, category, stat, change) => {
     let newStats = { ...entry[category] };
     
     if (stat === 'hpCurrent') {
        newStats.hpCurrent = Math.max(0, Math.min(newStats.hpMax || 50, (newStats.hpCurrent || 0) + change));
     } else if (stat === 'crewCurrent' && newStats.crewMax !== undefined) {
        newStats.crewCurrent = Math.max(0, Math.min(newStats.crewMax, newStats.crewCurrent + change));
     }
     
     try {
       const entryRef = doc(db, 'artifacts', appId, 'public', 'data', 'campaign_entries', entry.id);
       await updateDoc(entryRef, { [category]: newStats });
     } catch(err) { console.error("Failed to quick-adjust stats", err); }
  };

  const handleShipRepair = async (entry, hpAmount, isPort) => {
    const costPerHp = isPort ? 10 : 20;
    const totalCost = hpAmount * costPerHp;
    const isVehicle = entry.mountType === 'vehicle';
    const statCategory = isVehicle ? 'vehicleStats' : 'shipStats';
    let newStats = { ...entry[statCategory] };

    if ((partyFunds.gp || 0) < totalCost) {
      return setCustomAlert(`Transaction Denied: You do not have enough Gold Pieces (GP) in the Party Coffers. Required: ${totalCost} GP. Available: ${partyFunds.gp || 0} GP.`);
    }
    if (newStats.hpCurrent >= newStats.hpMax) return setCustomAlert("Target is already at max HP!");

    newStats.hpCurrent = Math.min(newStats.hpMax, newStats.hpCurrent + hpAmount);
    const logMsg = `Repaired ${hpAmount} Hull Points on ${entry.name} ${isPort ? 'at Port' : 'in the Field'} for ${totalCost} GP.`;

    try {
      const entryRef = doc(db, 'artifacts', appId, 'public', 'data', 'campaign_entries', entry.id);
      await updateDoc(entryRef, { [statCategory]: newStats });

      let newFunds = { ...partyFunds };
      newFunds.gp -= totalCost;
      const newLogs = [{ id: crypto.randomUUID(), date: new Date().toISOString(), text: logMsg, user: role === 'gm' ? 'Game Master' : 'Party Member' }, ...(newFunds.logs || [])].slice(0, 100);
      newFunds.logs = newLogs;

      const fundsRef = doc(db, 'artifacts', appId, 'public', 'data', 'party_coffer', 'singleton');
      await setDoc(fundsRef, newFunds, { merge: true });
      
      setCustomAlert(logMsg);
    } catch (err) {
      console.error(err);
      setCustomAlert("Failed to execute repairs.");
    }
  };

  const handleShipCrewHire = async (entry, crewAmount) => {
    const cost = crewAmount * 10;
    let newStats = { ...entry.shipStats };

    if ((partyFunds.gp || 0) < cost) {
      return setCustomAlert(`Transaction Denied: You do not have enough Gold Pieces (GP) in the Party Coffers. Required: ${cost} GP. Available: ${partyFunds.gp || 0} GP.`);
    }
    if (newStats.crewCurrent >= newStats.crewMax) return setCustomAlert("Ship crew capacity is already full!");

    newStats.crewCurrent = Math.min(newStats.crewMax, newStats.crewCurrent + crewAmount);
    const logMsg = `Hired ${crewAmount} replacement crew member(s) for ${entry.name} for ${cost} GP.`;

    try {
      const entryRef = doc(db, 'artifacts', appId, 'public', 'data', 'campaign_entries', entry.id);
      await updateDoc(entryRef, { shipStats: newStats });

      let newFunds = { ...partyFunds };
      newFunds.gp -= cost;
      const newLogs = [{ id: crypto.randomUUID(), date: new Date().toISOString(), text: logMsg, user: role === 'gm' ? 'Game Master' : 'Party Member' }, ...(newFunds.logs || [])].slice(0, 100);
      newFunds.logs = newLogs;

      const fundsRef = doc(db, 'artifacts', appId, 'public', 'data', 'party_coffer', 'singleton');
      await setDoc(fundsRef, newFunds, { merge: true });
      
      setCustomAlert(logMsg);
    } catch (err) {
      console.error(err);
      setCustomAlert("Failed to hire crew.");
    }
  };

  // --- Form Actions ---
  const resetForm = () => {
    setFormData({ 
      name: '', description: '', gmNotes: '', isPublic: false, connections: [],
      mountType: 'mount', level: 1, origin: '', stats: { STR: 8, DEX: 8, CON: 8, INT: 5, WIS: 5, CHA: 5 }, manifestations: [], chargeAbilities: [], asiAllocations: {},
      mountDetails: { hpMax: 50, hpCurrent: 50, baseSpeed: 100, baseAc: 10 },
      vehicleStats: { hpMax: 50, hpCurrent: 50, ac: 15, baseSpeed: 150, extraHardpoints: 0, extraSlots: 0 },
      vehicleLoadout: { weapons: [], upgrades: [] },
      parentLocationId: '', locationSubType: 'Point of Interest',
      shipStats: { hpMax: 100, hpCurrent: 100, crewMax: 20, crewCurrent: 20, hardpointsMax: 3, slotsMax: 1 },
      shipLoadout: { weapons: [], upgrades: [] }
    });
    setEditingId(null);
    setFormHoveredWeapon(null);
    setFormHoveredUpgrade(null);
    setFormHoveredManifestation(null);
    setFormHoveredChargeAbility(null);
    setIsFormOpen(false);
  };

  const handleEdit = (entry) => {
    setFormData({
      name: entry.name || '', description: entry.description || '', gmNotes: entry.gmNotes || '', isPublic: entry.isPublic || false, connections: entry.connections || [],
      mountType: entry.mountType || 'mount', level: entry.level || 1, origin: entry.origin || '', stats: entry.stats || { STR: 8, DEX: 8, CON: 8, INT: 5, WIS: 5, CHA: 5 }, manifestations: entry.manifestations || [], chargeAbilities: entry.chargeAbilities || [], asiAllocations: entry.asiAllocations || {},
      mountDetails: entry.mountDetails || { hpMax: 50, hpCurrent: 50, baseSpeed: 100, baseAc: 10 },
      vehicleStats: entry.vehicleStats || { hpMax: 50, hpCurrent: 50, ac: 15, baseSpeed: 150, extraHardpoints: 0, extraSlots: 0 }, vehicleLoadout: entry.vehicleLoadout || { weapons: [], upgrades: [] },
      parentLocationId: entry.parentLocationId || '', locationSubType: entry.locationSubType || 'Point of Interest',
      shipStats: entry.shipStats || { hpMax: 100, hpCurrent: 100, crewMax: 20, crewCurrent: 20, hardpointsMax: 3, slotsMax: 1 }, shipLoadout: entry.shipLoadout || { weapons: [], upgrades: [] }
    });
    setEditingId(entry.id);
    setIsFormOpen(true);
  };

  const handleSaveEntry = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      const docId = editingId || crypto.randomUUID();
      const entryRef = doc(db, 'artifacts', appId, 'public', 'data', 'campaign_entries', docId);
      
      // Calculate Gold Deductions for Ships & Vehicles
      let totalCost = 0;
      let logs = [];
      const isVehicle = activeCategory === 'mount' && formData.mountType === 'vehicle';
      
      if (activeCategory === 'ship') {
        const oldEntry = editingId ? entries.find(e => e.id === editingId) : null;
        
        let hpDiff = formData.shipStats.hardpointsMax - (oldEntry ? (oldEntry.shipStats?.hardpointsMax || 3) : 3);
        let slotDiff = formData.shipStats.slotsMax - (oldEntry ? (oldEntry.shipStats?.slotsMax || 1) : 1);
        
        if (hpDiff > 0) { totalCost += hpDiff * 1000; logs.push(`Purchased ${hpDiff} Hardpoint(s) for ${hpDiff * 1000} GP`); }
        if (slotDiff > 0) { totalCost += slotDiff * 1000; logs.push(`Purchased ${slotDiff} Slot(s) for ${slotDiff * 1000} GP`); }

        const addedUpgrades = formData.shipLoadout.upgrades.filter(u => !(oldEntry?.shipLoadout?.upgrades || []).includes(u));
        if (addedUpgrades.length > 0) {
          totalCost += addedUpgrades.length * 10000;
          logs.push(`Installed Ship Upgrade(s) (${addedUpgrades.join(', ')}) for ${addedUpgrades.length * 10000} GP`);
        }

        const addedWeapons = formData.shipLoadout.weapons.filter(w => !(oldEntry?.shipLoadout?.weapons || []).includes(w));
        let weaponCost = 0;
        addedWeapons.forEach(w => {
          const costStr = SHIP_WEAPONS.find(sw => sw.name === w)?.cost || "0gp";
          weaponCost += parseInt(costStr.replace('gp','')) || 0;
        });
        if (weaponCost > 0) {
          totalCost += weaponCost;
          logs.push(`Installed Ship Weapon(s) (${addedWeapons.join(', ')}) for ${weaponCost} GP`);
        }

      } else if (isVehicle) {
        const oldEntry = editingId ? entries.find(e => e.id === editingId) : null;
        
        let hpDiff = formData.vehicleStats.extraHardpoints - (oldEntry ? (oldEntry.vehicleStats?.extraHardpoints || 0) : 0);
        let slotDiff = formData.vehicleStats.extraSlots - (oldEntry ? (oldEntry.vehicleStats?.extraSlots || 0) : 0);
        
        if (hpDiff > 0) { totalCost += hpDiff * 1000; logs.push(`Purchased ${hpDiff} Extra Hardpoint(s) for ${hpDiff * 1000} GP`); }
        if (slotDiff > 0) { totalCost += slotDiff * 1000; logs.push(`Purchased ${slotDiff} Extra Slot(s) for ${slotDiff * 1000} GP`); }

        const oldUpgradesCost = oldEntry && oldEntry.mountType === 'vehicle' 
            ? calculateVehicleUpgradesCost(oldEntry.vehicleLoadout.upgrades, oldEntry.level) 
            : 0;
        const newUpgradesCost = calculateVehicleUpgradesCost(formData.vehicleLoadout.upgrades, formData.level);
        
        if (newUpgradesCost > oldUpgradesCost) {
            const diff = newUpgradesCost - oldUpgradesCost;
            totalCost += diff;
            logs.push(`Purchased new Vehicle Upgrades for ${diff} GP`);
        }

        const addedWeapons = formData.vehicleLoadout.weapons.filter(w => !(oldEntry?.vehicleLoadout?.weapons || []).includes(w));
        let weaponCost = 0;
        addedWeapons.forEach(w => {
          const costStr = VEHICLE_WEAPONS.find(sw => sw.name === w)?.cost || "0gp";
          weaponCost += parseInt(costStr.replace('gp','')) || 0;
        });
        if (weaponCost > 0) {
          totalCost += weaponCost;
          logs.push(`Installed Vehicle Weapon(s) (${addedWeapons.join(', ')}) for ${weaponCost} GP`);
        }
      }

      if (totalCost > 0) {
        if ((partyFunds.gp || 0) < totalCost) {
          setCustomAlert(`Transaction Denied: Modifications require ${totalCost} GP, but the coffers only hold ${partyFunds.gp || 0} GP.`);
          return; // STOP SAVE
        }
        // Process ledger deduction
        let newFunds = { ...partyFunds };
        newFunds.gp -= totalCost;
        const dateIso = new Date().toISOString();
        const newLogs = logs.map(txt => ({ id: crypto.randomUUID(), date: dateIso, text: txt, user: role === 'gm' ? 'Game Master' : 'Party Member' }));
        newFunds.logs = [...newLogs, ...(newFunds.logs || [])].slice(0, 100);
        const fundsRef = doc(db, 'artifacts', appId, 'public', 'data', 'party_coffer', 'singleton');
        await setDoc(fundsRef, newFunds, { merge: true });
      }

      const payload = { name: formData.name, description: formData.description, type: activeCategory, connections: formData.connections || [], updatedAt: new Date().toISOString() };

      if (role === 'gm') { payload.gmNotes = formData.gmNotes; payload.isPublic = formData.isPublic; }
      if (activeCategory === 'mount') { 
        Object.assign(payload, { 
          mountType: formData.mountType, 
          level: formData.level, origin: formData.origin, stats: formData.stats, manifestations: formData.manifestations, chargeAbilities: formData.chargeAbilities, asiAllocations: formData.asiAllocations || {},
          mountDetails: formData.mountDetails, vehicleStats: formData.vehicleStats, vehicleLoadout: formData.vehicleLoadout
        }); 
      }
      if (activeCategory === 'location') { Object.assign(payload, { parentLocationId: formData.parentLocationId, locationSubType: formData.locationSubType }); }
      if (activeCategory === 'ship') { Object.assign(payload, { shipStats: formData.shipStats, shipLoadout: formData.shipLoadout }); }

      if (!editingId) {
        payload.playerNotes = '';
        if (role === 'player') { payload.isPublic = true; payload.createdBy = user.uid; }
      }

      await setDoc(entryRef, payload, { merge: true });
      setExpandedCards(prev => ({ ...prev, [docId]: true })); 
      resetForm();
    } catch (err) {
      console.error(err);
      setCustomAlert("Failed to save record.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const entryRef = doc(db, 'artifacts', appId, 'public', 'data', 'campaign_entries', id);
      await deleteDoc(entryRef);
    } catch (err) {
      console.error(err); setCustomAlert("Failed to delete record.");
    }
  };

  const togglePublic = async (id, currentStatus) => {
    try {
      const entryRef = doc(db, 'artifacts', appId, 'public', 'data', 'campaign_entries', id);
      await updateDoc(entryRef, { isPublic: !currentStatus });
    } catch (err) {
      console.error(err); setCustomAlert("Failed to update visibility.");
    }
  };

  const savePlayerNotes = async () => {
    if (!activeNotesEntry) return;
    try {
      const entryRef = doc(db, 'artifacts', appId, 'public', 'data', 'campaign_entries', activeNotesEntry.id);
      await updateDoc(entryRef, { playerNotes: playerNotesText });
      setIsNotesFormOpen(false); setActiveNotesEntry(null);
    } catch (err) {
      console.error(err); setCustomAlert("Failed to save player notes.");
    }
  };

  // --- Builder Logics ---
  const handleStatChange = (stat, change) => {
    const isPhysical = ['STR', 'DEX', 'CON'].includes(stat);
    const minVal = isPhysical ? 8 : 5;
    const maxVal = 25;
    const baseStat = formData.stats[stat] || minVal;
    const asiStat = formData.asiAllocations?.[stat] || 0;
    const totalStat = baseStat + asiStat;
    
    if (change === 1) {
      if (totalStat >= maxVal) return;
      if (baseStat < 17) {
        // Calculate unified point buy pool
        const currentTotalPoints = 
           PHYSICAL_POINT_COSTS[formData.stats.STR || 8] + 
           PHYSICAL_POINT_COSTS[formData.stats.DEX || 8] + 
           PHYSICAL_POINT_COSTS[formData.stats.CON || 8] +
           MENTAL_POINT_COSTS[formData.stats.INT || 5] + 
           MENTAL_POINT_COSTS[formData.stats.WIS || 5] + 
           MENTAL_POINT_COSTS[formData.stats.CHA || 5];
        
        const pointCostMap = isPhysical ? PHYSICAL_POINT_COSTS : MENTAL_POINT_COSTS;
        if (currentTotalPoints + pointCostMap[baseStat + 1] - pointCostMap[baseStat] <= MAX_POINTS) {
          setFormData(prev => ({ ...prev, stats: { ...prev.stats, [stat]: baseStat + 1 } }));
          return;
        }
      }
      if (asiSpent < totalAsiPoints) setFormData(prev => ({...prev, asiAllocations: { ...(prev.asiAllocations || {}), [stat]: asiStat + 1 } }));
    } else if (change === -1) {
      if (totalStat <= minVal) return;
      if (asiStat > 0) setFormData(prev => ({...prev, asiAllocations: { ...(prev.asiAllocations || {}), [stat]: asiStat - 1 } }));
      else if (baseStat > minVal) setFormData(prev => ({ ...prev, stats: { ...prev.stats, [stat]: baseStat - 1 } }));
    }
  };

  const handleArrayToggle = (field, item, maxAllowed) => {
    setFormData(prev => {
      const array = prev[field];
      if (array.includes(item)) return { ...prev, [field]: array.filter(i => i !== item) };
      if (array.length >= maxAllowed) return prev; 
      return { ...prev, [field]: [...array, item] };
    });
  };

  const getUsedHardpoints = (weapons) => weapons.reduce((acc, wName) => acc + (SHIP_WEAPONS.find(w => w.name === wName)?.hardpoints || 0), 0);
  const getUsedSlots = (upgrades) => upgrades.reduce((acc, uName) => acc + (SHIP_UPGRADES.find(u => u.name === uName)?.slots || 0), 0);
  
  const handleShipStatChange = (statName, val) => setFormData(prev => ({...prev, shipStats: {...prev.shipStats, [statName]: parseInt(val) || 0}}));
  const handleMountDetailChange = (statName, val) => setFormData(prev => ({...prev, mountDetails: {...prev.mountDetails, [statName]: parseInt(val) || 0}}));

  const handleAddShipItem = (type, itemName) => {
    setFormData(prev => {
      if (type === 'weapons' && getUsedHardpoints(prev.shipLoadout.weapons) + SHIP_WEAPONS.find(w => w.name === itemName).hardpoints <= prev.shipStats.hardpointsMax) {
           return {...prev, shipLoadout: {...prev.shipLoadout, weapons: [...prev.shipLoadout.weapons, itemName]}};
      } else if (type === 'upgrades' && getUsedSlots(prev.shipLoadout.upgrades) + SHIP_UPGRADES.find(u => u.name === itemName).slots <= prev.shipStats.slotsMax) {
           return {...prev, shipLoadout: {...prev.shipLoadout, upgrades: [...prev.shipLoadout.upgrades, itemName]}};
      }
      return prev;
    });
  };
  const handleRemoveShipItem = (type, index) => {
    setFormData(prev => { const arr = [...prev.shipLoadout[type]]; arr.splice(index, 1); return {...prev, shipLoadout: {...prev.shipLoadout, [type]: arr}}; });
  };

  // --- Vehicle Logic ---
  const getUsedVehicleHardpoints = (loadout) => {
    let pts = 0;
    (loadout?.weapons || []).forEach(wName => pts += (VEHICLE_WEAPONS.find(w => w.name === wName)?.hardpoints || 0));
    (loadout?.upgrades || []).forEach(uName => pts += (VEHICLE_UPGRADES.find(u => u.name === uName)?.hardpoints || 0));
    return pts;
  };
  const getUsedVehicleSlots = (loadout) => {
    let slots = 0;
    (loadout?.upgrades || []).forEach(uName => slots += (VEHICLE_UPGRADES.find(u => u.name === uName)?.slots || 0));
    return slots;
  };
  
  const handleVehicleStatChange = (statName, val) => setFormData(prev => ({...prev, vehicleStats: {...prev.vehicleStats, [statName]: parseInt(val) || 0}}));
  
  const handleAddVehicleItem = (type, itemName) => {
    setFormData(prev => {
      const currentLoadout = prev.vehicleLoadout;
      const progression = VEHICLE_DATA_TABLE[prev.level] || VEHICLE_DATA_TABLE[1];
      const maxHp = progression['Hard Points'] + (prev.vehicleStats.extraHardpoints || 0);
      const maxSlots = progression['Attunement Slots'] + (prev.vehicleStats.extraSlots || 0);

      if (type === 'weapons') {
        const item = VEHICLE_WEAPONS.find(w => w.name === itemName);
        if (getUsedVehicleHardpoints(currentLoadout) + item.hardpoints <= maxHp) {
             return {...prev, vehicleLoadout: {...currentLoadout, weapons: [...currentLoadout.weapons, itemName]}};
        }
      } else if (type === 'upgrades') {
        const item = VEHICLE_UPGRADES.find(u => u.name === itemName);
        const fitsHardpoints = getUsedVehicleHardpoints(currentLoadout) + (item.hardpoints || 0) <= maxHp;
        const fitsSlots = getUsedVehicleSlots(currentLoadout) + (item.slots || 0) <= maxSlots;
        if (fitsHardpoints && fitsSlots) {
             return {...prev, vehicleLoadout: {...currentLoadout, upgrades: [...currentLoadout.upgrades, itemName]}};
        }
      }
      return prev;
    });
  };
  const handleRemoveVehicleItem = (type, index) => {
    setFormData(prev => { const arr = [...prev.vehicleLoadout[type]]; arr.splice(index, 1); return {...prev, vehicleLoadout: {...prev.vehicleLoadout, [type]: arr}}; });
  };

  // --- Render Helpers ---
  const displayEntries = entries.filter(entry => {
    if (entry.type !== activeCategory) return false;
    if (role === 'player' && !entry.isPublic && entry.createdBy !== user?.uid) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!entry.name?.toLowerCase().includes(query) && !entry.description?.toLowerCase().includes(query)) return false;
    } else {
      if (entry.type === 'location' && entry.parentLocationId) return false;
    }
    return true;
  });

  const toggleCard = (id) => setExpandedCards(prev => ({...prev, [id]: !prev[id]}));

  const getConnectedEntries = (entry) => {
    const explicitIds = entry.connections || [];
    const implicitEntries = entries.filter(e => e.connections?.includes(entry.id)).map(e => e.id);
    const allIds = [...new Set([...explicitIds, ...implicitEntries])];
    return allIds.map(id => entries.find(e => e.id === id)).filter(Boolean).filter(e => role === 'gm' ? true : e.isPublic)
      .sort((a, b) => { if (a.type !== b.type) return a.type.localeCompare(b.type); return a.name.localeCompare(b.name); });
  };

  const ActiveIcon = CATEGORIES.find(c => c.id === activeCategory)?.icon || Users;

  // --- Global Styles Injection ---
  const GlobalStyles = () => (
    <style dangerouslySetInnerHTML={{__html: `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
      .font-inter { font-family: 'Inter', sans-serif; }
      .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: rgba(31, 41, 55, 0.5); border-radius: 4px; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(75, 85, 99, 0.8); border-radius: 4px; }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(107, 114, 128, 1); }
      input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
    `}} />
  );

  if (error) {
    return (
      <div className={theme.bg + " items-center justify-center p-4"}>
        <GlobalStyles />
        <div className={theme.card + " text-center border-[#DC2626] max-w-md w-full"}>
          <p className="text-[#FCA5A5] font-bold mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className={theme.btnPrimary}>Reload Toolkit</button>
        </div>
      </div>
    );
  }

  if (!role) {
    return (
      <div className={theme.bg + " items-center justify-center p-4"}>
        <GlobalStyles />
        <div className={theme.card + " max-w-md mx-auto text-center w-full"}>
          <h1 className="text-3xl font-bold mb-4 text-[#FCA5A5]">Vectis School Toolkit</h1>
          <p className="text-[#9CA3AF] mb-8">Please select your access clearance to continue.</p>
          <div className="flex flex-col gap-4">
            <button onClick={() => selectRole('gm')} className={theme.btnPrimary}><Shield className="w-5 h-5" /> Game Master Login</button>
            <button onClick={() => selectRole('player')} className={theme.btnSecondary}><User className="w-5 h-5" /> Player Login</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={theme.bg}>
      <GlobalStyles />

      {/* Custom Alert Overlay */}
      {customAlert && (
        <div className={theme.modalOverlay}>
          <div className={theme.modalBox + " max-w-sm items-center text-center !p-8 border-[#FCA5A5]"}>
            <p className="text-lg font-bold text-[#FCA5A5] mb-6 leading-tight">{customAlert}</p>
            <button onClick={() => setCustomAlert(null)} className={theme.btnPrimary + " w-full"}>Acknowledge</button>
          </div>
        </div>
      )}

      {/* Interactive Dice Roller Modal */}
      {activeRoll && (
        <div className={theme.modalOverlay} onClick={() => setActiveRoll(null)}>
          <div className={theme.modalBox + " max-w-sm items-center text-center !p-6 border-[#FCA5A5]"} onClick={e => e.stopPropagation()}>
             <h2 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-2">
               {activeRoll.weapon.isCheck || activeRoll.weapon.isSkill ? <User className="w-6 h-6 text-[#FCA5A5]"/> : <Crosshair className="w-6 h-6 text-[#FCA5A5]"/>} 
               {activeRoll.weapon.name}
             </h2>
             
             <div className="bg-[#111827] border border-[#374151] rounded-lg p-5 w-full mb-6 shadow-inner">
                {activeRoll.weapon.isCheck || activeRoll.weapon.isSkill ? (
                   <>
                     <h3 className="text-[#FCA5A5] font-bold text-2xl mb-1">🎲 Check: {activeRoll.attackTotal}</h3>
                     <p className="text-[#9CA3AF] text-sm mb-3">
                       [Rolled {activeRoll.d20} + {activeRoll.attackTotal - activeRoll.d20}] 
                       <span className={activeRoll.d20 === 20 ? "text-[#10B981] ml-1 font-bold" : activeRoll.d20 === 1 ? "text-[#EF4444] ml-1 font-bold" : ""}>
                         {activeRoll.d20 === 20 ? "(NAT 20!)" : activeRoll.d20 === 1 ? "(NAT 1!)" : ""}
                       </span>
                     </p>
                     {activeRoll.note && <p className="text-[#60A5FA] text-xs font-bold mb-2">{activeRoll.note}</p>}
                   </>
                ) : activeRoll.weapon.isSave ? (
                   <>
                     <h3 className="text-[#FCA5A5] font-bold text-2xl mb-1">🛡️ Save: DC {activeRoll.weapon.saveDC}</h3>
                     <p className="text-[#9CA3AF] text-sm mb-3">Half damage on success.</p>
                   </>
                ) : (
                   <>
                     <h3 className="text-[#FCA5A5] font-bold text-2xl mb-1">⚔️ Attack: {activeRoll.attackTotal}</h3>
                     <p className="text-[#9CA3AF] text-sm mb-3">
                       [Rolled {activeRoll.d20} + {activeRoll.weapon.attackMod}] 
                       <span className={activeRoll.d20 === 20 ? "text-[#10B981] ml-1 font-bold" : activeRoll.d20 === 1 ? "text-[#EF4444] ml-1 font-bold" : ""}>
                         {activeRoll.d20 === 20 ? "(CRITICAL HIT!)" : activeRoll.d20 === 1 ? "(CRITICAL MISS!)" : ""}
                       </span>
                     </p>
                   </>
                )}
                
                {!activeRoll.weapon.isCheck && !activeRoll.weapon.isSkill && (
                  <>
                    <div className="border-t border-[#374151] my-4"></div>

                    <h3 className="text-[#DC2626] font-bold text-2xl mb-1">💥 Damage: {activeRoll.damageTotal}</h3>
                    {activeRoll.salvoDetails ? (
                      <p className="text-[#9CA3AF] text-sm mb-4">
                        Rolling {activeRoll.weapon.damageCount}d{activeRoll.weapon.damageDie} <br/>
                        <span className="text-[10px] text-[#6B7280]">({activeRoll.salvoDetails.baseCount}d10 Base + {activeRoll.salvoDetails.bonusCount}d10 Huge/Gargantuan Bonus)</span>
                      </p>
                    ) : (
                      <p className="text-[#9CA3AF] text-sm mb-4">Rolling {activeRoll.weapon.damageCount}d{activeRoll.weapon.damageDie}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-2 justify-center max-h-56 overflow-y-auto custom-scrollbar p-2">
                       {activeRoll.damageRolls.map((r, idx) => (
                           <div key={idx} className="w-10 h-10 bg-[#1F2937] border-2 border-[#DC2626] rounded flex items-center justify-center text-white font-bold text-lg shadow-md animate-in zoom-in duration-300" style={{animationFillMode: 'both', animationDelay: `${idx * 25}ms`}}>
                              {r}
                           </div>
                       ))}
                    </div>
                  </>
                )}
             </div>

             <button onClick={() => setActiveRoll(null)} className={theme.btnPrimary + " w-full"}>Dismiss</button>
          </div>
        </div>
      )}
      
      {/* Dynamic Header */}
      <header className="bg-[#1F2937] border-b border-[#374151] sticky top-0 z-20 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            {currentView === 'category' && (
              <button onClick={() => setCurrentView('home')} className="p-2 bg-[#111827] hover:bg-[#374151] rounded-lg transition-colors border border-[#374151] text-[#9CA3AF] hover:text-white mr-2" title="Back to Dashboard">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-2xl font-bold text-[#FCA5A5] flex items-center gap-2">
              Vectis {role === 'gm' ? 'Command' : 'Archive'}
              {currentView === 'category' && (<><span className="text-[#4B5563]">/</span><span className="text-[#D1D5DB] text-xl">{CATEGORIES.find(c => c.id === activeCategory)?.label}</span></>)}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            {currentView === 'category' && activeCategory !== 'ledger' && (role === 'gm' || (role === 'player' && ['mount','ship','inventory'].includes(activeCategory))) && (
              <button onClick={() => setIsFormOpen(true)} className={theme.btnPrimary + " py-2 px-4 text-sm"}>
                <Plus className="w-4 h-4" /> Add Record
              </button>
            )}
            <button onClick={handleLogout} className={theme.btnSecondary + " py-2 px-4 text-sm"}>
              Log Out
            </button>
          </div>
        </div>
      </header>

      {/* --- DASHBOARD HOME VIEW --- */}
      {currentView === 'home' && (
        <main className="max-w-7xl mx-auto px-6 py-10 w-full flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {CATEGORY_GROUPS.map((group) => (
              <div key={group.title} className="flex flex-col">
                <h3 className="text-sm font-bold text-[#9CA3AF] uppercase tracking-wider mb-4 border-b border-[#374151] pb-2">{group.title}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                  {group.ids.map(id => {
                    const cat = CATEGORIES.find(c => c.id === id);
                    const Icon = cat.icon;
                    return (
                      <button key={cat.id} onClick={() => changeCategory(cat.id)} className="flex items-center gap-4 p-4 rounded-xl font-bold text-left transition-all shadow-sm active:scale-95 bg-[#1F2937] border border-[#374151] text-[#D1D5DB] hover:text-white hover:bg-[#374151] hover:border-[#4B5563] hover:shadow-md group">
                        <div className="p-3 bg-[#111827] rounded-lg group-hover:bg-[#4B5563] transition-colors border border-[#374151] group-hover:border-[#6B7280]">
                          <Icon className="w-6 h-6 text-[#FCA5A5] group-hover:text-white" />
                        </div>
                        <div className="flex-1">
                          <span className="block text-lg">{cat.label}</span>
                          <span className="block text-xs text-[#6B7280] font-normal mt-0.5">{cat.desc}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* --- CATEGORY FULL SCREEN VIEW --- */}
      {currentView === 'category' && activeCategory !== 'ledger' && (
        <main className="max-w-7xl mx-auto px-6 py-8 relative flex-1 w-full">
          
          {(entries.some(e => e.type === activeCategory) || searchQuery) && (
            <div className="mb-6 relative max-w-xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Search className="h-5 w-5 text-[#6B7280]" /></div>
              <input type="text" placeholder={`Search ${CATEGORIES.find(c=>c.id===activeCategory)?.label}...`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[#1F2937] border border-[#374151] text-[#D1D5DB] rounded-xl pl-12 pr-10 py-3.5 focus:outline-none focus:border-[#F87171] focus:shadow-[0_0_0_3px_rgba(248,113,113,0.3)] transition-all font-bold"/>
              {searchQuery && (<button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#9CA3AF] hover:text-white transition-colors"><X className="h-5 w-5" /></button>)}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-20 text-[#6B7280]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#DC2626]"></div></div>
          ) : displayEntries.length === 0 ? (
            <div className="text-center py-20 bg-[#1F2937]/50 rounded-xl border border-[#374151] border-dashed mx-auto max-w-lg">
              <ActiveIcon className="w-12 h-12 text-[#4B5563] mx-auto mb-3" />
              <p className="text-[#D1D5DB] text-lg font-bold">{searchQuery ? `No matches found for "${searchQuery}"` : "No records found."}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 align-top items-start">
              {displayEntries.map((entry) => {
                const connectedEntries = getConnectedEntries(entry);
                const isHidden = role === 'gm' && !entry.isPublic;
                const isExpanded = expandedCards[entry.id] || searchQuery !== ''; 
                const canEditItem = role === 'gm' || ['inventory', 'ship'].includes(entry.type) || (entry.type === 'mount' && entry.createdBy === user?.uid);

                const missingHp = (entry.shipStats?.hpMax || 100) - (entry.shipStats?.hpCurrent || 0);
                const activeRepairHp = Math.min(missingHp, repairHpCount[entry.id] || 5);
                const repairIsPort = repairLocationIsPort[entry.id] !== false; 
                const repairCost = activeRepairHp * (repairIsPort ? 10 : 20);
                
                // Ship Specific Math
                const activeCrewHire = Math.min((entry.shipStats?.crewMax || 20) - (entry.shipStats?.crewCurrent || 0), crewHireCount[entry.id] || 1);
                const crewCost = activeCrewHire * 10;
                
                // Vehicle Specific Math
                const vProgression = VEHICLE_DATA_TABLE[entry.level || 1] || VEHICLE_DATA_TABLE[1];
                const totalVehicleHardpoints = vProgression['Hard Points'] + (entry.vehicleStats?.extraHardpoints || 0);
                const totalVehicleSlots = vProgression['Attunement Slots'] + (entry.vehicleStats?.extraSlots || 0);

                // Mount Specific Math & Skills
                const strMod = calculateModifier((entry.stats?.STR || 8) + (entry.asiAllocations?.STR || 0));
                const dexMod = calculateModifier((entry.stats?.DEX || 8) + (entry.asiAllocations?.DEX || 0));
                const conMod = calculateModifier((entry.stats?.CON || 8) + (entry.asiAllocations?.CON || 0));
                const profBonus = (DATA_TABLE[entry.level || 1] || DATA_TABLE[1])['Prof Bonus'];
                const mountAttackMod = Math.max(strMod, dexMod) + profBonus;
                const mountSaveDC = 8 + profBonus + Math.max(strMod, dexMod, conMod);
                const mountAC = (entry.mountDetails?.baseAc || 10) + dexMod;

                return (
                <div key={entry.id} className={theme.card + ` ${isHidden ? 'opacity-75 border-dashed border-[#4B5563]' : ''}`}>
                  
                  <div className="flex justify-between items-start gap-2 cursor-pointer group" onClick={() => toggleCard(entry.id)}>
                    <div className="min-w-0 flex-1 flex gap-3">
                      <div className="mt-0.5 shrink-0">
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-[#9CA3AF] group-hover:text-white transition-colors" /> : <ChevronDown className="w-5 h-5 text-[#9CA3AF] group-hover:text-white transition-colors" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className={theme.cardHeaderTitle + " truncate block w-full border-none pb-0 mb-0 group-hover:text-[#FECACA] transition-colors"} title={entry.name}>{entry.name}</h3>
                        {entry.type === 'location' && entry.locationSubType && (<p className="text-xs text-[#9CA3AF] uppercase font-bold tracking-wider mt-1">{entry.locationSubType}</p>)}
                        {entry.type === 'mount' && entry.mountType !== 'vehicle' && (<p className="text-xs text-[#9CA3AF] uppercase font-bold tracking-wider mt-1">Level {entry.level} {entry.origin} Mount</p>)}
                        {entry.type === 'mount' && entry.mountType === 'vehicle' && (<p className="text-xs text-[#9CA3AF] uppercase font-bold tracking-wider mt-1">Level {entry.level} Mechanical Vehicle</p>)}
                        {entry.type === 'ship' && (<p className="text-xs text-[#9CA3AF] uppercase font-bold tracking-wider mt-1">Skycarrier Vessel</p>)}
                      </div>
                    </div>
                    
                    {canEditItem && (
                      <div className="flex items-center gap-1 shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                        {role === 'gm' && (
                          <button onClick={() => togglePublic(entry.id, entry.isPublic)} title={entry.isPublic ? "Visible to Players" : "Hidden from Players"} className={`p-1.5 rounded-md transition-colors ${entry.isPublic ? 'text-[#D1D5DB] hover:bg-[#374151]' : 'text-[#4B5563] hover:bg-[#374151]'}`}>
                            {entry.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                        )}
                        <button onClick={() => handleEdit(entry)} className="p-1.5 rounded-md text-[#9CA3AF] hover:text-white hover:bg-[#374151] transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(entry.id)} className="p-1.5 rounded-md text-[#9CA3AF] hover:text-[#DC2626] hover:bg-[#374151] transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    )}
                  </div>
                  
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-[#374151] flex flex-col grow">
                      
                      {/* SHIP SPECIFIC STATS & ACTIONS */}
                      {entry.type === 'ship' && entry.shipStats && (
                        <div className="mb-5 space-y-4">
                           {/* Quick Action Interactive Dashboard */}
                           <div className="bg-[#111827] border border-[#374151] p-4 rounded-xl space-y-4">
                              <h4 className="text-xs font-bold text-[#FCA5A5] uppercase tracking-wider mb-2 flex items-center gap-1.5"><Wrench className="w-4 h-4" /> Drydock & Maintenance</h4>
                              
                              {/* Repairs Interactive Panel */}
                              <div className="p-3 bg-[#1F2937] border border-[#4B5563] rounded-lg space-y-3">
                                <div className="flex justify-between items-center">
                                   <span className="text-xs font-bold text-[#E5E7EB]">Repair Hull Integrity:</span>
                                   <span className="text-xs text-[#9CA3AF] font-bold">{missingHp} HP Missing</span>
                                </div>
                                {missingHp > 0 ? (
                                  <>
                                    <div className="flex items-center gap-4 bg-[#111827] rounded border border-[#374151] p-1">
                                      <button type="button" onClick={() => setRepairHpCount(p => ({...p, [entry.id]: Math.max(1, (p[entry.id] || 5) - 1)}))} className="p-1 hover:bg-[#374151] rounded text-[#9CA3AF] hover:text-white"><Minus className="w-4 h-4"/></button>
                                      <span className="flex-1 text-center font-bold text-white text-sm">Repair {activeRepairHp} HP</span>
                                      <button type="button" onClick={() => setRepairHpCount(p => ({...p, [entry.id]: Math.min(missingHp, (p[entry.id] || 5) + 1)}))} className="p-1 hover:bg-[#374151] rounded text-[#9CA3AF] hover:text-white"><Plus className="w-4 h-4"/></button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                       <button type="button" onClick={() => setRepairLocationIsPort(p => ({...p, [entry.id]: true}))} className={`text-xs font-bold py-1.5 px-2 rounded border transition-all ${repairIsPort ? 'bg-[#DC2626] border-[#B91C1C] text-white' : 'bg-[#111827] border-[#374151] text-[#9CA3AF]'}`}>At Port (10 GP/HP)</button>
                                       <button type="button" onClick={() => setRepairLocationIsPort(p => ({...p, [entry.id]: false}))} className={`text-xs font-bold py-1.5 px-2 rounded border transition-all ${!repairIsPort ? 'bg-[#DC2626] border-[#B91C1C] text-white' : 'bg-[#111827] border-[#374151] text-[#9CA3AF]'}`}>In Field (20 GP/HP)</button>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-[#374151]">
                                       <span className="text-xs text-[#9CA3AF]">Coffer Cost: <span className="text-[#E5E7EB] font-bold">{repairCost} GP</span></span>
                                       <button 
                                         onClick={() => handleShipRepair(entry, activeRepairHp, repairIsPort)}
                                         disabled={(partyFunds.gp || 0) < repairCost}
                                         className={`text-xs font-bold px-3 py-1.5 rounded transition-all ${((partyFunds.gp || 0) < repairCost) ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-[#DC2626] hover:bg-[#B91C1C] text-white'}`}
                                       >
                                         {(partyFunds.gp || 0) < repairCost ? "Insufficient Funds" : "Purchase Repairs"}
                                       </button>
                                    </div>
                                  </>
                                ) : (
                                  <p className="text-xs text-[#6B7280] italic">Hull is fully intact.</p>
                                )}
                              </div>

                              {/* Crew Hire Panel */}
                              <div className="p-3 bg-[#1F2937] border border-[#4B5563] rounded-lg space-y-3">
                                <div className="flex justify-between items-center">
                                   <span className="text-xs font-bold text-[#E5E7EB]">Hire Replacement Crew:</span>
                                   <span className="text-xs text-[#9CA3AF] font-bold">{(entry.shipStats.crewMax || 20) - (entry.shipStats.crewCurrent || 0)} Crew Missing</span>
                                </div>
                                {(entry.shipStats.crewMax || 20) > (entry.shipStats.crewCurrent || 0) ? (
                                  <>
                                    <div className="flex items-center gap-4 bg-[#111827] rounded border border-[#374151] p-1">
                                      <button type="button" onClick={() => setCrewHireCount(p => ({...p, [entry.id]: Math.max(1, (p[entry.id] || 1) - 1)}))} className="p-1 hover:bg-[#374151] rounded text-[#9CA3AF] hover:text-white"><Minus className="w-4 h-4"/></button>
                                      <span className="flex-1 text-center font-bold text-white text-sm">Hire {activeCrewHire} Crew member(s)</span>
                                      <button type="button" onClick={() => setCrewHireCount(p => ({...p, [entry.id]: Math.min((entry.shipStats.crewMax || 20) - (entry.shipStats.crewCurrent || 0), (p[entry.id] || 1) + 1)}))} className="p-1 hover:bg-[#374151] rounded text-[#9CA3AF] hover:text-white"><Plus className="w-4 h-4"/></button>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-[#374151]">
                                       <span className="text-xs text-[#9CA3AF]">Coffer Cost: <span className="text-[#E5E7EB] font-bold">{crewCost} GP</span> <span className="text-[10px] text-[#6B7280]">(10 GP/crew)</span></span>
                                       <button 
                                         onClick={() => handleShipCrewHire(entry, activeCrewHire)}
                                         disabled={(partyFunds.gp || 0) < crewCost}
                                         className={`text-xs font-bold px-3 py-1.5 rounded transition-all ${((partyFunds.gp || 0) < crewCost) ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-[#DC2626] hover:bg-[#B91C1C] text-white'}`}
                                       >
                                         {(partyFunds.gp || 0) < crewCost ? "Insufficient Funds" : "Hire Crew"}
                                       </button>
                                    </div>
                                  </>
                                ) : (
                                  <p className="text-xs text-[#6B7280] italic">Crew quarters are full.</p>
                                )}
                              </div>
                           </div>

                           <div className="grid grid-cols-5 gap-2">
                             <div className="bg-[#111827] border border-[#374151] rounded-lg p-1.5 text-center shadow-inner relative group">
                               <span className="block text-[9px] text-[#9CA3AF] uppercase font-bold tracking-wider mb-1">Hull Pts</span>
                               <div className="flex items-center justify-center gap-1.5">
                                 <button onClick={(e) => {e.stopPropagation(); handleDirectStatChange(entry, 'shipStats', 'hpCurrent', -1);}} className="p-0.5 rounded text-[#6B7280] hover:text-[#DC2626] hover:bg-[#374151]"><Minus className="w-3 h-3"/></button>
                                 <span className="text-sm font-bold text-[#FCA5A5] min-w-[36px]">{entry.shipStats.hpCurrent}/{entry.shipStats.hpMax}</span>
                                 <button onClick={(e) => {e.stopPropagation(); handleDirectStatChange(entry, 'shipStats', 'hpCurrent', 1);}} className="p-0.5 rounded text-[#6B7280] hover:text-[#10B981] hover:bg-[#374151]"><Plus className="w-3 h-3"/></button>
                               </div>
                             </div>
                             <div className="bg-[#111827] border border-[#374151] rounded-lg p-1.5 text-center shadow-inner relative group">
                               <span className="block text-[9px] text-[#9CA3AF] uppercase font-bold tracking-wider mb-1">Crew</span>
                               <div className="flex items-center justify-center gap-1.5">
                                 <button onClick={(e) => {e.stopPropagation(); handleDirectStatChange(entry, 'shipStats', 'crewCurrent', -1);}} className="p-0.5 rounded text-[#6B7280] hover:text-[#DC2626] hover:bg-[#374151]"><Minus className="w-3 h-3"/></button>
                                 <span className="text-sm font-bold text-[#D1D5DB] min-w-[36px]">{entry.shipStats.crewCurrent}/{entry.shipStats.crewMax}</span>
                                 <button onClick={(e) => {e.stopPropagation(); handleDirectStatChange(entry, 'shipStats', 'crewCurrent', 1);}} className="p-0.5 rounded text-[#6B7280] hover:text-[#10B981] hover:bg-[#374151]"><Plus className="w-3 h-3"/></button>
                               </div>
                             </div>
                             <div className="bg-[#111827] border border-[#374151] rounded-lg p-2 text-center shadow-inner">
                               <span className="block text-[9px] text-[#9CA3AF] uppercase font-bold tracking-wider">Speed</span>
                               <span className="text-sm font-bold text-[#D1D5DB] block mt-1">{(entry.shipStats.crewCurrent || 0) * 5} ft</span>
                             </div>
                             <div className="bg-[#111827] border border-[#374151] rounded-lg p-2 text-center shadow-inner">
                               <span className="block text-[9px] text-[#9CA3AF] uppercase font-bold tracking-wider">Hardpts</span>
                               <span className="text-sm font-bold text-[#D1D5DB] block mt-1">{getUsedHardpoints(entry.shipLoadout?.weapons || [])}/{entry.shipStats.hardpointsMax}</span>
                             </div>
                             <div className="bg-[#111827] border border-[#374151] rounded-lg p-2 text-center shadow-inner">
                               <span className="block text-[9px] text-[#9CA3AF] uppercase font-bold tracking-wider">Slots</span>
                               <span className="text-sm font-bold text-[#D1D5DB] block mt-1">{getUsedSlots(entry.shipLoadout?.upgrades || [])}/{entry.shipStats.slotsMax}</span>
                             </div>
                           </div>
                           
                           {/* Weapons List */}
                           <div className="bg-[#111827] border border-[#374151] rounded-lg p-3">
                             <h4 className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2 flex items-center gap-1.5"><Crosshair className="w-3 h-3 text-[#FCA5A5]" /> Installed Weapons</h4>
                             {entry.shipLoadout?.weapons?.length > 0 ? (
                               <div className="space-y-2">
                                 {entry.shipLoadout.weapons.map((wName, i) => {
                                   const weapon = SHIP_WEAPONS.find(w => w.name === wName);
                                   return (
                                     <div key={i} className="text-xs bg-[#1F2937] p-2 rounded border border-[#4B5563]">
                                        <div className="flex justify-between items-start mb-1">
                                          <span className="font-bold text-[#E5E7EB] block">{weapon?.name || wName} <span className="text-[#9CA3AF] font-normal">(HPts: {weapon?.hardpoints})</span></span>
                                          {weapon && (
                                            <button onClick={(e) => { e.stopPropagation(); handleRollWeapon(weapon); }} className="bg-[#DC2626] hover:bg-[#B91C1C] text-white px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-colors shadow-sm active:scale-95">
                                              <Crosshair className="w-3 h-3"/> Fire
                                            </button>
                                          )}
                                        </div>
                                        <span className="text-[#9CA3AF] text-[10px] leading-tight block">{weapon?.details}</span>
                                     </div>
                                   )
                                 })}
                               </div>
                             ) : <span className="text-xs text-[#6B7280] italic">No weapons installed.</span>}
                           </div>

                           {/* Upgrades List */}
                           <div className="bg-[#111827] border border-[#374151] rounded-lg p-3">
                             <h4 className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2 flex items-center gap-1.5"><Zap className="w-3 h-3 text-[#60A5FA]" /> Active Upgrades</h4>
                             {entry.shipLoadout?.upgrades?.length > 0 ? (
                               <div className="space-y-2">
                                 {entry.shipLoadout.upgrades.map((uName, i) => {
                                   const upgrade = SHIP_UPGRADES.find(u => u.name === uName);
                                   return (
                                     <div key={i} className="text-xs bg-[#1F2937] p-2 rounded border border-[#4B5563]">
                                        <span className="font-bold text-[#60A5FA] block mb-1">{upgrade?.name || uName} <span className="text-[#9CA3AF] font-normal">({upgrade?.rarity})</span></span>
                                        <span className="text-[#9CA3AF] text-[10px] leading-tight block">{upgrade?.description}</span>
                                     </div>
                                   )
                                 })}
                               </div>
                             ) : <span className="text-xs text-[#6B7280] italic">No upgrades installed.</span>}
                           </div>

                           {/* Commands Reference with Interactivity */}
                           <div className="bg-[#111827] border border-[#374151] rounded-lg p-3 space-y-2">
                              <h4 className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider flex items-center gap-1"><Info className="w-3.5 h-3.5" /> Officer Commands (Hover / Tap to view details)</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                {OFFICER_COMMANDS.map(cmd => {
                                  const isSelected = activeCommandHover[entry.id] === cmd.name;
                                  return (
                                    <div key={cmd.name} className="relative flex gap-1">
                                      <button 
                                        type="button"
                                        onMouseEnter={() => setActiveCommandHover(p => ({...p, [entry.id]: cmd.name}))}
                                        onMouseLeave={() => setActiveCommandHover(p => ({...p, [entry.id]: null}))}
                                        onClick={() => setActiveCommandHover(p => ({...p, [entry.id]: isSelected ? null : cmd.name}))}
                                        className={`flex-1 text-left bg-[#1F2937] hover:bg-[#374151] rounded px-3 py-2 border transition-all text-xs font-bold leading-none ${isSelected ? 'border-[#FCA5A5] text-[#FCA5A5]' : 'border-[#374151] text-[#E5E7EB]'}`}
                                      >
                                        {cmd.name}
                                      </button>
                                      {cmd.name.includes("Salvo") && (
                                        <button 
                                          onClick={(e) => { e.stopPropagation(); handleRollSalvo(entry); }}
                                          className="bg-[#DC2626] hover:bg-[#B91C1C] text-white px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-colors shadow-sm active:scale-95 shrink-0"
                                        >
                                          <Crosshair className="w-3 h-3"/> Fire
                                        </button>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                              {activeCommandHover[entry.id] && (
                                <div className="p-3 bg-[#1F2937] border border-[#FCA5A5]/30 rounded-lg text-xs leading-normal animate-in fade-in duration-200">
                                   <span className="font-bold text-[#FCA5A5] block mb-1">{activeCommandHover[entry.id]}</span>
                                   <p className="text-gray-300 italic">{OFFICER_COMMANDS.find(c => c.name === activeCommandHover[entry.id])?.description}</p>
                                </div>
                              )}
                           </div>
                        </div>
                      )}

                      {/* VEHICLE SPECIFIC STATS & ACTIONS (In Mount Category) */}
                      {entry.type === 'mount' && entry.mountType === 'vehicle' && entry.vehicleStats && (
                        <div className="mb-5 space-y-4">
                           
                           {/* Vehicle Progression Readout */}
                           <div className="bg-[#111827] border border-[#374151] rounded-lg p-3">
                             <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                               {[
                                 { label: 'Prof Bonus', val: `+${vProgression['Prof Bonus']}` },
                                 { label: 'Features', val: vProgression['Features'] },
                                 { label: 'Slots', val: vProgression['Attunement Slots'] },
                                 { label: 'Chrgs', val: vProgression['Charge Abilities Known'] },
                                 { label: 'HPts', val: vProgression['Hard Points'] },
                                 { label: 'Arcn', val: vProgression['Arcane Charges'] }
                               ].map(stat => (
                                 <div key={stat.label} className="text-center">
                                   <span className="block text-[9px] text-[#9CA3AF] uppercase font-bold tracking-wider">{stat.label}</span>
                                   <span className="text-xs font-bold text-[#E5E7EB]">{stat.val}</span>
                                 </div>
                               ))}
                             </div>
                           </div>
                           
                           <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                             <div className="bg-[#111827] border border-[#374151] rounded-lg p-1.5 text-center shadow-inner relative group col-span-2 sm:col-span-1">
                               <span className="block text-[9px] text-[#9CA3AF] uppercase font-bold tracking-wider mb-1">Hull Pts</span>
                               <div className="flex items-center justify-center gap-1.5">
                                 <button onClick={(e) => {e.stopPropagation(); handleDirectVehicleStatChange(entry, 'hpCurrent', -1);}} className="p-0.5 rounded text-[#6B7280] hover:text-[#DC2626] hover:bg-[#374151]"><Minus className="w-3 h-3"/></button>
                                 <span className="text-sm font-bold text-[#FCA5A5] min-w-[36px]">{entry.vehicleStats.hpCurrent}/{entry.vehicleStats.hpMax}</span>
                                 <button onClick={(e) => {e.stopPropagation(); handleDirectVehicleStatChange(entry, 'hpCurrent', 1);}} className="p-0.5 rounded text-[#6B7280] hover:text-[#10B981] hover:bg-[#374151]"><Plus className="w-3 h-3"/></button>
                               </div>
                             </div>
                             <div className="bg-[#111827] border border-[#374151] rounded-lg p-2 text-center shadow-inner">
                               <span className="block text-[9px] text-[#9CA3AF] uppercase font-bold tracking-wider">Armor</span>
                               <span className="text-sm font-bold text-[#D1D5DB] block mt-1">{entry.vehicleStats.ac}</span>
                             </div>
                             <div className="bg-[#111827] border border-[#374151] rounded-lg p-2 text-center shadow-inner">
                               <span className="block text-[9px] text-[#9CA3AF] uppercase font-bold tracking-wider">Speed</span>
                               <span className="text-sm font-bold text-[#D1D5DB] block mt-1">{calculateDynamicSpeed(entry.vehicleStats.baseSpeed || 150, entry.vehicleStats.hpMax, entry.vehicleStats.hpCurrent)} ft</span>
                             </div>
                             <div className="bg-[#111827] border border-[#374151] rounded-lg p-2 text-center shadow-inner">
                               <span className="block text-[9px] text-[#9CA3AF] uppercase font-bold tracking-wider">Hardpts</span>
                               <span className="text-sm font-bold text-[#D1D5DB] block mt-1">{getUsedVehicleHardpoints(entry.vehicleLoadout)}/{totalVehicleHardpoints}</span>
                             </div>
                             <div className="bg-[#111827] border border-[#374151] rounded-lg p-2 text-center shadow-inner">
                               <span className="block text-[9px] text-[#9CA3AF] uppercase font-bold tracking-wider">Slots</span>
                               <span className="text-sm font-bold text-[#D1D5DB] block mt-1">{getUsedVehicleSlots(entry.vehicleLoadout)}/{totalVehicleSlots}</span>
                             </div>
                           </div>
                           
                           {/* Vehicle Weapons List */}
                           <div className="bg-[#111827] border border-[#374151] rounded-lg p-3">
                             <h4 className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2 flex items-center gap-1.5"><Crosshair className="w-3 h-3 text-[#FCA5A5]" /> Installed Weapons</h4>
                             {entry.vehicleLoadout?.weapons?.length > 0 ? (
                               <div className="space-y-2">
                                 {entry.vehicleLoadout.weapons.map((wName, i) => {
                                   const weapon = VEHICLE_WEAPONS.find(w => w.name === wName);
                                   return (
                                     <div key={i} className="text-xs bg-[#1F2937] p-2 rounded border border-[#4B5563]">
                                        <div className="flex justify-between items-start mb-1">
                                          <span className="font-bold text-[#E5E7EB] block">{weapon?.name || wName} <span className="text-[#9CA3AF] font-normal">(HPts: {weapon?.hardpoints})</span></span>
                                          {weapon && (
                                            <button onClick={(e) => { e.stopPropagation(); handleRollWeapon(weapon); }} className="bg-[#DC2626] hover:bg-[#B91C1C] text-white px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-colors shadow-sm active:scale-95">
                                              <Crosshair className="w-3 h-3"/> Fire
                                            </button>
                                          )}
                                        </div>
                                        <span className="text-[#9CA3AF] text-[10px] leading-tight block">{weapon?.details}</span>
                                     </div>
                                   )
                                 })}
                               </div>
                             ) : <span className="text-xs text-[#6B7280] italic">No weapons installed.</span>}
                           </div>

                           {/* Vehicle Upgrades List */}
                           <div className="bg-[#111827] border border-[#374151] rounded-lg p-3">
                             <h4 className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2 flex items-center gap-1.5"><Zap className="w-3 h-3 text-[#60A5FA]" /> Active Upgrades</h4>
                             {entry.vehicleLoadout?.upgrades?.length > 0 ? (
                               <div className="space-y-2">
                                 {entry.vehicleLoadout.upgrades.map((uName, i) => {
                                   const upgrade = VEHICLE_UPGRADES.find(u => u.name === uName);
                                   return (
                                     <div key={i} className="text-xs bg-[#1F2937] p-2 rounded border border-[#4B5563]">
                                        <div className="flex justify-between items-start mb-1">
                                          <span className="font-bold text-[#60A5FA] block">
                                            {upgrade?.name || uName} 
                                            <span className="text-[#9CA3AF] font-normal">
                                              ({upgrade?.rarity}{upgrade?.hardpoints ? ` | HPts: ${upgrade.hardpoints}` : ''})
                                            </span>
                                          </span>
                                          {upgrade && (upgrade.isAttack || upgrade.isSave) && (
                                            <button onClick={(e) => { e.stopPropagation(); handleRollWeapon(upgrade); }} className="bg-[#DC2626] hover:bg-[#B91C1C] text-white px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-colors shadow-sm active:scale-95">
                                              <Crosshair className="w-3 h-3"/> Fire
                                            </button>
                                          )}
                                        </div>
                                        <span className="text-[#9CA3AF] text-[10px] leading-tight block">{upgrade?.description}</span>
                                     </div>
                                   )
                                 })}
                               </div>
                             ) : <span className="text-xs text-[#6B7280] italic">No upgrades installed.</span>}
                           </div>
                        </div>
                      )}

                      {/* Mount Specific Stats */}
                      {entry.type === 'mount' && entry.mountType !== 'vehicle' && entry.stats && (
                        <div className="mb-4 space-y-4">
                          {/* Top Row: HP, AC, Speed for Mounts */}
                          <div className="grid grid-cols-3 gap-2">
                             <div className="bg-[#111827] border border-[#374151] rounded-lg p-1.5 text-center shadow-inner relative group">
                               <span className="block text-[9px] text-[#9CA3AF] uppercase font-bold tracking-wider mb-1">Hull / HP</span>
                               <div className="flex items-center justify-center gap-1.5">
                                 <button onClick={(e) => {e.stopPropagation(); handleDirectStatChange(entry, 'mountDetails', 'hpCurrent', -1);}} className="p-0.5 rounded text-[#6B7280] hover:text-[#DC2626] hover:bg-[#374151]"><Minus className="w-3 h-3"/></button>
                                 <span className="text-sm font-bold text-[#FCA5A5] min-w-[36px]">{(entry.mountDetails?.hpCurrent ?? 50)}/{(entry.mountDetails?.hpMax || 50)}</span>
                                 <button onClick={(e) => {e.stopPropagation(); handleDirectStatChange(entry, 'mountDetails', 'hpCurrent', 1);}} className="p-0.5 rounded text-[#6B7280] hover:text-[#10B981] hover:bg-[#374151]"><Plus className="w-3 h-3"/></button>
                               </div>
                             </div>
                             <div className="bg-[#111827] border border-[#374151] rounded-lg p-2 text-center shadow-inner flex flex-col justify-center items-center">
                               <span className="block text-[9px] text-[#9CA3AF] uppercase font-bold tracking-wider mb-1">Armor Class</span>
                               <span className="text-lg font-bold text-[#D1D5DB] flex items-center gap-1.5"><Shield className="w-4 h-4 text-[#10B981]"/> {(entry.mountDetails?.baseAc || 10) + calculateModifier((entry.stats?.DEX || 8) + (entry.asiAllocations?.DEX || 0))}</span>
                             </div>
                             <div className="bg-[#111827] border border-[#374151] rounded-lg p-2 text-center shadow-inner flex flex-col justify-center items-center">
                               <span className="block text-[9px] text-[#9CA3AF] uppercase font-bold tracking-wider">Speed</span>
                               <span className="text-sm font-bold text-[#D1D5DB] block mt-1">{calculateDynamicSpeed(entry.mountDetails?.baseSpeed || 100, entry.mountDetails?.hpMax || 50, entry.mountDetails?.hpCurrent ?? 50)} ft</span>
                             </div>
                          </div>

                          <div className="grid grid-cols-6 gap-2">
                            {['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map(stat => {
                              const score = (entry.stats[stat] || (['STR','DEX','CON'].includes(stat) ? 8 : 5)) + (entry.asiAllocations?.[stat] || 0);
                              const mod = calculateModifier(score);
                              return (
                                <div key={stat} onClick={(e) => { e.stopPropagation(); handleRollAbilityCheck(stat, mod); }} className="bg-[#111827] border border-[#374151] rounded-md text-center py-2 flex flex-col items-center shadow-inner relative group cursor-pointer hover:border-[#FCA5A5] transition-colors">
                                  <span className="text-[10px] font-bold text-[#9CA3AF] mb-1 group-hover:text-[#FCA5A5] transition-colors">{stat}</span>
                                  <span className="text-sm font-bold text-[#E5E7EB] min-w-[20px]">{score}</span>
                                  <span className="text-[10px] text-[#6B7280] mt-1">{mod >= 0 ? `+${mod}` : mod}</span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Skill Checks & Proficiencies */}
                          <div className="bg-[#111827] border border-[#374151] rounded-lg p-3">
                             <h4 className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Skills & Proficiencies</h4>
                             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                               {MOUNT_SKILLS.map(skill => {
                                  const skillData = getMountSkill(skill.name, skill.stat, entry, (DATA_TABLE[entry.level || 1] || DATA_TABLE[1])['Prof Bonus']);
                                  return (
                                    <button 
                                      key={skill.name} 
                                      onClick={(e) => { e.stopPropagation(); handleRollSkill(skillData); }}
                                      className={`flex flex-col items-center justify-center p-2 rounded-md border transition-colors shadow-sm active:scale-95 ${skillData.isProf ? 'bg-[#1F2937] border-[#10B981] hover:bg-[#374151]' : 'bg-[#1F2937] border-[#4B5563] hover:border-[#FCA5A5]'}`}
                                    >
                                       <span className={`text-[10px] font-bold uppercase tracking-wider ${skillData.isProf ? 'text-[#10B981]' : 'text-[#9CA3AF]'}`}>{skill.name}</span>
                                       <span className="text-sm font-bold text-[#E5E7EB] mt-0.5">{skillData.mod >= 0 ? `+${skillData.mod}` : skillData.mod}</span>
                                    </button>
                                  );
                               })}
                             </div>
                          </div>
                          
                          <div className="bg-[#111827] border border-[#374151] rounded-lg p-3">
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                              {[
                                { label: 'Prof', val: `+${(DATA_TABLE[entry.level] || DATA_TABLE[1])['Prof Bonus']}` },
                                { label: 'Feats', val: (DATA_TABLE[entry.level] || DATA_TABLE[1])['Features'] },
                                { label: 'Manif', val: (DATA_TABLE[entry.level] || DATA_TABLE[1])['Level Manifestations'] },
                                { label: 'Chrgs', val: (DATA_TABLE[entry.level] || DATA_TABLE[1])['Charge Abilities Known'] },
                                { label: 'HPts', val: (DATA_TABLE[entry.level] || DATA_TABLE[1])['Hard Points'] },
                                { label: 'Arcn', val: (DATA_TABLE[entry.level] || DATA_TABLE[1])['Arcane Charges'] }
                              ].map(stat => (
                                <div key={stat.label} className="text-center">
                                  <span className="block text-[9px] text-[#9CA3AF] uppercase font-bold tracking-wider">{stat.label}</span>
                                  <span className="text-xs font-bold text-[#E5E7EB]">{stat.val}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Manifestations List */}
                          <div className="bg-[#111827] border border-[#374151] rounded-lg p-3">
                            <h4 className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Manifestations</h4>
                            {entry.manifestations?.length > 0 ? (
                              <div className="space-y-2">
                                {entry.manifestations.map((mName, i) => {
                                  const manifest = MANIFESTATIONS.find(m => m.name === mName);
                                  
                                  const strMod = calculateModifier((entry.stats?.STR || 8) + (entry.asiAllocations?.STR || 0));
                                  const dexMod = calculateModifier((entry.stats?.DEX || 8) + (entry.asiAllocations?.DEX || 0));
                                  const conMod = calculateModifier((entry.stats?.CON || 8) + (entry.asiAllocations?.CON || 0));
                                  const profBonus = (DATA_TABLE[entry.level || 1] || DATA_TABLE[1])['Prof Bonus'];
                                  
                                  const dynamicManifest = manifest ? {
                                     ...manifest,
                                     attackMod: manifest.isAttack ? (Math.max(strMod, dexMod) + profBonus) : manifest.attackMod,
                                     saveDC: manifest.isSave ? (8 + profBonus + Math.max(strMod, dexMod, conMod)) : manifest.saveDC
                                  } : null;

                                  return (
                                    <div key={i} className="text-xs bg-[#1F2937] p-2 rounded border border-[#4B5563]">
                                       <div className="flex justify-between items-start mb-1">
                                         <span className="font-bold text-[#E5E7EB] block">{manifest?.name || mName}</span>
                                         {dynamicManifest && (dynamicManifest.isAttack || dynamicManifest.isSave) && (
                                           <button onClick={(e) => { e.stopPropagation(); handleRollWeapon(dynamicManifest); }} className="bg-[#DC2626] hover:bg-[#B91C1C] text-white px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-colors shadow-sm active:scale-95">
                                             <Crosshair className="w-3 h-3"/> Fire
                                           </button>
                                         )}
                                       </div>
                                       <span className="text-[#9CA3AF] text-[10px] leading-tight block">{manifest?.description}</span>
                                    </div>
                                  )
                                })}
                              </div>
                            ) : <span className="text-xs text-[#6B7280] italic">No manifestations active.</span>}
                          </div>

                          {/* Charge Abilities List */}
                          <div className="bg-[#111827] border border-[#374151] rounded-lg p-3">
                            <h4 className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2 flex items-center gap-1.5"><Zap className="w-3 h-3 text-[#60A5FA]" /> Charge Abilities</h4>
                            {entry.chargeAbilities?.length > 0 ? (
                              <div className="space-y-2">
                                {entry.chargeAbilities.map((aName, i) => {
                                  const ability = CHARGE_ABILITIES.find(a => a.name === aName);
                                  
                                  const strMod = calculateModifier((entry.stats?.STR || 8) + (entry.asiAllocations?.STR || 0));
                                  const dexMod = calculateModifier((entry.stats?.DEX || 8) + (entry.asiAllocations?.DEX || 0));
                                  const conMod = calculateModifier((entry.stats?.CON || 8) + (entry.asiAllocations?.CON || 0));
                                  const profBonus = (DATA_TABLE[entry.level || 1] || DATA_TABLE[1])['Prof Bonus'];
                                  
                                  const dynamicAbility = ability ? {
                                     ...ability,
                                     attackMod: ability.isAttack ? (Math.max(strMod, dexMod) + profBonus) : ability.attackMod,
                                     saveDC: ability.isSave ? (8 + profBonus + Math.max(strMod, dexMod, conMod)) : ability.saveDC
                                  } : null;

                                  return (
                                    <div key={i} className="text-xs bg-[#1F2937] p-2 rounded border border-[#4B5563]">
                                       <div className="flex justify-between items-start mb-1">
                                         <span className="font-bold text-[#60A5FA] block">{ability?.name || aName}</span>
                                         {dynamicAbility && (dynamicAbility.isAttack || dynamicAbility.isSave) && (
                                           <button onClick={(e) => { e.stopPropagation(); handleRollWeapon(dynamicAbility); }} className="bg-[#DC2626] hover:bg-[#B91C1C] text-white px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-colors shadow-sm active:scale-95">
                                             <Crosshair className="w-3 h-3"/> Fire
                                           </button>
                                         )}
                                       </div>
                                       <span className="text-[#9CA3AF] text-[10px] leading-tight block">{ability?.description}</span>
                                    </div>
                                  )
                                })}
                              </div>
                            ) : <span className="text-xs text-[#6B7280] italic">No charge abilities known.</span>}
                          </div>
                        </div>
                      )}

                      {/* Location Specific Hierarchy Web */}
                      {entry.type === 'location' && (() => {
                        const parentLoc = entries.find(e => e.id === entry.parentLocationId);
                        const childLocs = entries.filter(e => e.type === 'location' && e.parentLocationId === entry.id && (role === 'gm' || e.isPublic));
                        const hierarchyNodes = [];
                        if (parentLoc) hierarchyNodes.push({ ...parentLoc, isParent: true, subType: 'Parent Area' });
                        childLocs.forEach(child => hierarchyNodes.push({ ...child, isParent: false, subType: child.locationSubType }));

                        if (hierarchyNodes.length === 0) return null;
                        return (
                          <NetworkWeb entry={entry} connectedEntries={hierarchyNodes} onNavigate={(type, name) => { changeCategory(type); setSearchQuery(name); }} title="Location Hierarchy" icon={Map} />
                        );
                      })()}

                      {/* Card Body - Outline */}
                      <div className="space-y-4 grow">
                        {entry.description && (
                          <div className="text-[#D1D5DB] text-sm whitespace-pre-wrap leading-relaxed mt-2">
                            {entry.description}
                          </div>
                        )}

                        {/* General Connections Web */}
                        {connectedEntries.length > 0 && (
                          <NetworkWeb entry={entry} connectedEntries={connectedEntries} onNavigate={(type, name) => { changeCategory(type); setSearchQuery(name); }} />
                        )}
                        
                        {/* GM Notes Area */}
                        {role === 'gm' && entry.gmNotes && (
                          <div className="bg-[#111827] p-3 rounded-lg border border-[#374151] mt-4 shadow-inner">
                            <h4 className="text-xs font-bold text-[#FCA5A5] uppercase tracking-wider mb-1 flex items-center gap-1">
                              <Shield className="w-3 h-3" /> GM Notes (Hidden)
                            </h4>
                            <p className="text-sm text-[#9CA3AF] whitespace-pre-wrap italic">{entry.gmNotes}</p>
                          </div>
                        )}
                      </div>

                      {/* Card Footer - Player Notes */}
                      <div className="mt-4 pt-4 border-t border-[#374151]">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-xs font-bold text-[#D1D5DB] uppercase tracking-wider flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" /> Shared Notes
                          </h4>
                          <button onClick={() => openPlayerNotes(entry)} className="text-xs font-bold text-[#9CA3AF] hover:text-white bg-[#374151] px-3 py-1 rounded transition-colors">
                            {entry.playerNotes ? 'Edit' : 'Add'}
                          </button>
                        </div>
                        {entry.playerNotes ? (
                           <p className="text-sm text-[#9CA3AF] whitespace-pre-wrap italic border-l-2 border-[#DC2626]/50 pl-3 py-1 line-clamp-3">
                             {entry.playerNotes}
                           </p>
                        ) : (
                           <p className="text-sm text-[#6B7280] italic">No notes added.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )})}
            </div>
          )}
        </main>
      )}

      {/* --- DEDICATED LEDGER VIEW --- */}
      {currentView === 'category' && activeCategory === 'ledger' && (
        <main className="max-w-4xl mx-auto px-6 py-8 w-full">
           <div className={theme.card}>
              <h2 className={theme.cardHeaderTitle + " flex items-center gap-2"}><Coins className="w-6 h-6 text-[#FCA5A5]"/> Party Coffers</h2>
              
              {/* Massive Funds Display */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                 <div className="bg-[#111827] border-2 border-[#FCA5A5]/30 rounded-xl p-6 text-center flex flex-col items-center justify-center shadow-inner">
                    <span className="text-[#FCA5A5] font-bold text-4xl mb-1">{partyFunds.gp || 0}</span>
                    <span className="text-[#9CA3AF] text-sm font-bold uppercase tracking-wider">Gold Pieces</span>
                 </div>
                 <div className="bg-[#111827] border border-[#374151] rounded-xl p-6 text-center flex flex-col items-center justify-center shadow-inner">
                    <span className="text-[#D1D5DB] font-bold text-3xl mb-1">{partyFunds.sp || 0}</span>
                    <span className="text-[#9CA3AF] text-sm font-bold uppercase tracking-wider">Silver Pieces</span>
                 </div>
                 <div className="bg-[#111827] border border-[#374151] rounded-xl p-6 text-center flex flex-col items-center justify-center shadow-inner">
                    <span className="text-[#D1D5DB] font-bold text-3xl mb-1">{partyFunds.cp || 0}</span>
                    <span className="text-[#9CA3AF] text-sm font-bold uppercase tracking-wider">Copper Pieces</span>
                 </div>
              </div>

              {/* Transaction Controls */}
              <div className="bg-[#111827] border border-[#374151] rounded-xl p-5 mb-8 shadow-sm">
                <h4 className="text-sm font-bold text-[#D1D5DB] uppercase tracking-wider mb-4">Log a Transaction</h4>
                <div className="flex flex-col md:flex-row gap-4">
                   <input type="number" min="1" placeholder="Amount" value={ledgerForm.amount} onChange={e => setLedgerForm(p => ({...p, amount: e.target.value}))} className={theme.input + " md:w-32 text-center text-lg font-bold"} />
                   <select value={ledgerForm.currency} onChange={e => setLedgerForm(p => ({...p, currency: e.target.value}))} className={theme.input + " md:w-24 text-center font-bold uppercase appearance-none"}>
                      <option value="gp">GP</option>
                      <option value="sp">SP</option>
                      <option value="cp">CP</option>
                   </select>
                   <input type="text" placeholder="Reason for transaction..." value={ledgerForm.reason} onChange={e => setLedgerForm(p => ({...p, reason: e.target.value}))} className={theme.input + " flex-1"} />
                </div>
                <div className="flex gap-4 mt-4">
                   <button onClick={() => handleLedgerTransaction('add')} className="flex-1 bg-[#1F2937] hover:bg-[#374151] border border-[#4B5563] hover:border-[#60A5FA] text-[#D1D5DB] hover:text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 active:scale-95">
                     <Plus className="w-5 h-5 text-[#60A5FA]" /> Deposit Funds
                   </button>
                   <button onClick={() => handleLedgerTransaction('remove')} className="flex-1 bg-[#1F2937] hover:bg-[#374151] border border-[#4B5563] hover:border-[#FCA5A5] text-[#D1D5DB] hover:text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 active:scale-95">
                     <ArrowRightLeft className="w-5 h-5 text-[#FCA5A5]" /> Spend Funds
                   </button>
                </div>
              </div>

              {/* Transaction History */}
              <div>
                 <h4 className="text-sm font-bold text-[#9CA3AF] uppercase tracking-wider mb-4 border-b border-[#374151] pb-2 flex items-center gap-2"><History className="w-4 h-4" /> Transaction History</h4>
                 <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                   {partyFunds.logs?.length > 0 ? partyFunds.logs.map((log) => (
                     <div key={log.id} className="bg-[#111827] border border-[#374151] p-3 rounded-lg flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold text-[#E5E7EB]">{log.text}</p>
                          <p className="text-[10px] text-[#6B7280] font-mono mt-1">{new Date(log.date).toLocaleString()} • Logged by {log.user}</p>
                        </div>
                        <div className={`shrink-0 p-1.5 rounded-md ${log.text.startsWith('Deposited') ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#EF4444]/20 text-[#EF4444]'}`}>
                          <Coins className="w-4 h-4" />
                        </div>
                     </div>
                   )) : (
                     <p className="text-sm text-[#6B7280] italic text-center py-8">No transactions logged yet.</p>
                   )}
                 </div>
              </div>
           </div>
        </main>
      )}

      {/* --- Add/Edit Modal (For Non-Ledger Categories) --- */}
      {isFormOpen && (
        <div className={theme.modalOverlay}>
          <div className={theme.modalBox}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={theme.cardHeaderTitle + " border-none mb-0 pb-0"}>
                {editingId ? 'Edit Record' : `Create New ${CATEGORIES.find(c => c.id === activeCategory)?.singular || 'Record'}`}
              </h2>
              <button onClick={resetForm} className="text-[#9CA3AF] hover:text-white p-2 bg-[#111827] rounded-lg transition-colors border border-[#374151]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto pr-2 custom-scrollbar space-y-6 pb-4">
              <form id="gm-form" onSubmit={handleSaveEntry} className="space-y-6">
                
                {/* 1. Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-[#9CA3AF] mb-2">Name / Title</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={theme.input} placeholder="Enter name..." />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#9CA3AF] mb-2">Public Description</label>
                    <textarea rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className={theme.input + " resize-none"} placeholder="General knowledge, rules, or details..." />
                  </div>
                </div>

                {/* 2c. SHIP SPECIFIC UI */}
                {activeCategory === 'ship' && (
                  <div className="space-y-6 border-t border-[#374151] pt-6">
                    
                    {/* Ship Stats Editor */}
                    <div className="col-span-2 sm:col-span-4 bg-[#111827] p-3 rounded-lg text-center border border-[#374151] mb-2 shadow-inner">
                       <span className="text-xs text-[#9CA3AF] font-bold uppercase tracking-wider mr-3">Current Ship Speed:</span>
                       <span className="text-lg text-[#FCA5A5] font-bold">{(formData.shipStats.crewCurrent || 0) * 5} ft</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-[#9CA3AF] uppercase mb-1">Max HP</label>
                        <input type="number" min="1" value={formData.shipStats.hpMax} onChange={(e) => handleShipStatChange('hpMax', e.target.value)} className={theme.input + " py-2 text-center"} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#9CA3AF] uppercase mb-1">Current HP</label>
                        <input type="number" min="0" value={formData.shipStats.hpCurrent} onChange={(e) => handleShipStatChange('hpCurrent', e.target.value)} className={theme.input + " py-2 text-center text-[#FCA5A5]"} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#9CA3AF] uppercase mb-1">Max Crew</label>
                        <input type="number" min="0" value={formData.shipStats.crewMax} onChange={(e) => handleShipStatChange('crewMax', e.target.value)} className={theme.input + " py-2 text-center"} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#9CA3AF] uppercase mb-1">Current Crew</label>
                        <input type="number" min="0" value={formData.shipStats.crewCurrent} onChange={(e) => handleShipStatChange('crewCurrent', e.target.value)} className={theme.input + " py-2 text-center text-[#D1D5DB]"} />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] font-bold text-[#9CA3AF] uppercase mb-1 flex justify-between">
                          <span>Hardpoints</span>
                          <span className="text-[#FCA5A5]">Costs 1,000 GP each</span>
                        </label>
                        <input type="number" min="0" value={formData.shipStats.hardpointsMax} onChange={(e) => handleShipStatChange('hardpointsMax', e.target.value)} className={theme.input + " py-2 text-center"} />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] font-bold text-[#9CA3AF] uppercase mb-1 flex justify-between">
                          <span>Attunement Slots</span>
                          <span className="text-[#FCA5A5]">Costs 1,000 GP each</span>
                        </label>
                        <input type="number" min="0" value={formData.shipStats.slotsMax} onChange={(e) => handleShipStatChange('slotsMax', e.target.value)} className={theme.input + " py-2 text-center"} />
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Weapons Manager */}
                      <div className="bg-[#111827] border border-[#374151] rounded-xl p-4 shadow-inner">
                        <div className="flex justify-between items-center mb-3 border-b border-[#374151] pb-2">
                          <h4 className="text-sm font-bold text-[#9CA3AF] uppercase tracking-wider flex items-center gap-1.5"><Crosshair className="w-4 h-4 text-[#FCA5A5]"/> Weapons</h4>
                          <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${getUsedHardpoints(formData.shipLoadout.weapons) >= formData.shipStats.hardpointsMax ? 'bg-[#7F1D1D] text-white' : 'bg-[#374151] text-[#D1D5DB]'}`}>
                            {getUsedHardpoints(formData.shipLoadout.weapons)} / {formData.shipStats.hardpointsMax} HPts
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {SHIP_WEAPONS.map(w => {
                            const canAfford = getUsedHardpoints(formData.shipLoadout.weapons) + w.hardpoints <= formData.shipStats.hardpointsMax;
                            return (
                              <button
                                type="button"
                                key={w.name}
                                onClick={() => handleAddShipItem('weapons', w.name)}
                                onMouseEnter={() => setFormHoveredWeapon(w)}
                                onMouseLeave={() => setFormHoveredWeapon(null)}
                                disabled={!canAfford}
                                className={`px-2.5 py-1 text-xs rounded border transition-colors font-bold ${
                                  !canAfford ? 'bg-[#1F2937] border-[#374151] text-[#4B5563] cursor-not-allowed' : 'bg-[#374151] border-[#4B5563] text-[#D1D5DB] hover:text-white hover:border-[#6B7280]'
                                }`}
                              >
                                + {w.name} <span className="opacity-60">({w.cost})</span>
                              </button>
                            );
                          })}
                        </div>
                        
                        {/* Fixed Height Tooltip Box */}
                        <div className="h-28 bg-[#1F2937] border border-[#4B5563] rounded-lg p-3 overflow-hidden shadow-inner mb-3">
                           {formHoveredWeapon ? (
                             <div className="animate-in fade-in duration-200 h-full">
                                <span className="font-bold text-[#FCA5A5] block mb-1">{formHoveredWeapon.name} <span className="text-[#9CA3AF] font-normal">({formHoveredWeapon.cost} | {formHoveredWeapon.hardpoints} HPt | {formHoveredWeapon.crew} Crew)</span></span>
                                <p className="text-gray-300 italic text-xs">{formHoveredWeapon.details}</p>
                             </div>
                           ) : (
                             <div className="flex h-full items-center justify-center text-[#6B7280] italic text-xs">
                                Hover over a weapon to see details.
                             </div>
                           )}
                        </div>

                        <div className="space-y-1">
                          {formData.shipLoadout.weapons.length === 0 ? <p className="text-xs text-[#6B7280] italic">No weapons equipped.</p> : null}
                          {formData.shipLoadout.weapons.map((w, i) => (
                            <div key={i} className="flex justify-between items-center bg-[#1F2937] px-3 py-1.5 rounded border border-[#4B5563]">
                              <span className="text-xs font-bold text-[#E5E7EB]">{w}</span>
                              <button type="button" onClick={() => handleRemoveShipItem('weapons', i)} className="text-[#FCA5A5] hover:text-[#DC2626]"><X className="w-3.5 h-3.5"/></button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Upgrades Manager */}
                      <div className="bg-[#111827] border border-[#374151] rounded-xl p-4 shadow-inner">
                        <div className="flex justify-between items-center mb-3 border-b border-[#374151] pb-2">
                          <h4 className="text-sm font-bold text-[#9CA3AF] uppercase tracking-wider flex items-center gap-1.5"><Zap className="w-4 h-4 text-[#60A5FA]"/> Magical Upgrades</h4>
                          <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${getUsedSlots(formData.shipLoadout.upgrades) >= formData.shipStats.slotsMax ? 'bg-[#7F1D1D] text-white' : 'bg-[#374151] text-[#D1D5DB]'}`}>
                            {getUsedSlots(formData.shipLoadout.upgrades)} / {formData.shipStats.slotsMax} Slots
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {SHIP_UPGRADES.map(u => {
                            const canAfford = getUsedSlots(formData.shipLoadout.upgrades) + u.slots <= formData.shipStats.slotsMax;
                            return (
                              <button
                                type="button"
                                key={u.name}
                                onClick={() => handleAddShipItem('upgrades', u.name)}
                                onMouseEnter={() => setFormHoveredUpgrade(u)}
                                onMouseLeave={() => setFormHoveredUpgrade(null)}
                                disabled={!canAfford}
                                className={`px-2.5 py-1 text-xs rounded border transition-colors font-bold ${
                                  !canAfford ? 'bg-[#1F2937] border-[#374151] text-[#4B5563] cursor-not-allowed' : 'bg-[#374151] border-[#4B5563] text-[#D1D5DB] hover:text-white hover:border-[#6B7280]'
                                }`}
                              >
                                + {u.name} <span className="opacity-60">({u.cost})</span>
                              </button>
                            );
                          })}
                        </div>
                        
                        {/* Fixed Height Tooltip Box */}
                        <div className="h-28 bg-[#1F2937] border border-[#4B5563] rounded-lg p-3 overflow-hidden shadow-inner mb-3">
                           {formHoveredUpgrade ? (
                             <div className="animate-in fade-in duration-200 h-full">
                                <span className="font-bold text-[#60A5FA] block mb-1">
                                  {formHoveredUpgrade.name} 
                                  <span className="text-[#9CA3AF] font-normal">
                                    ({formHoveredUpgrade.rarity} | {formHoveredUpgrade.cost} | {formHoveredUpgrade.slots} Slot{formHoveredUpgrade.hardpoints ? ` | ${formHoveredUpgrade.hardpoints} HPt` : ''})
                                  </span>
                                </span>
                                <p className="text-gray-300 italic text-xs">{formHoveredUpgrade.description}</p>
                             </div>
                           ) : (
                             <div className="flex h-full items-center justify-center text-[#6B7280] italic text-xs">
                                Hover over an upgrade to see details.
                             </div>
                           )}
                        </div>

                        <div className="space-y-1">
                          {formData.shipLoadout.upgrades.length === 0 ? <p className="text-xs text-[#6B7280] italic">No upgrades equipped.</p> : null}
                          {formData.shipLoadout.upgrades.map((u, i) => (
                            <div key={i} className="flex justify-between items-center bg-[#1F2937] px-3 py-1.5 rounded border border-[#4B5563]">
                              <span className="text-xs font-bold text-[#60A5FA]">{u}</span>
                              <button type="button" onClick={() => handleRemoveShipItem('upgrades', i)} className="text-[#FCA5A5] hover:text-[#DC2626]"><X className="w-3.5 h-3.5"/></button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2a. LOCATION SPECIFIC UI */}
                {activeCategory === 'location' && (
                  <div className="space-y-6 border-t border-[#374151] pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-[#9CA3AF] mb-2">Location Type</label>
                        <select value={formData.locationSubType} onChange={(e) => setFormData({...formData, locationSubType: e.target.value})} className={theme.input + " appearance-none cursor-pointer"}>
                          <option value="Region">Region</option>
                          <option value="City / Town">City / Town</option>
                          <option value="District / Ward">District / Ward</option>
                          <option value="Tavern / Inn">Tavern / Inn</option>
                          <option value="Shop / Commerce">Shop / Commerce</option>
                          <option value="House / Manor">House / Manor</option>
                          <option value="Temple / Shrine">Temple / Shrine</option>
                          <option value="Point of Interest">Point of Interest</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#9CA3AF] mb-2">Located In (Parent Location)</label>
                        <select value={formData.parentLocationId} onChange={(e) => setFormData({...formData, parentLocationId: e.target.value})} className={theme.input + " appearance-none cursor-pointer"}>
                          <option value="">None (Top Level)</option>
                          {entries.filter(e => e.type === 'location' && e.id !== editingId).map(loc => (<option key={loc.id} value={loc.id}>{loc.name}</option>))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2b. MOUNT / VEHICLE SPECIFIC BUILDER UI */}
                {activeCategory === 'mount' && (
                  <div className="space-y-6 border-t border-[#374151] pt-6">
                    
                    {/* Toggle between Mount and Vehicle */}
                    <div className="flex bg-[#111827] rounded-lg p-1 border border-[#374151]">
                      <button type="button" onClick={() => setFormData({...formData, mountType: 'mount'})} className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${formData.mountType === 'mount' ? 'bg-[#DC2626] text-white' : 'text-[#9CA3AF] hover:text-white hover:bg-[#1F2937]'}`}>Biological Mount</button>
                      <button type="button" onClick={() => setFormData({...formData, mountType: 'vehicle'})} className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${formData.mountType === 'vehicle' ? 'bg-[#DC2626] text-white' : 'text-[#9CA3AF] hover:text-white hover:bg-[#1F2937]'}`}>Mechanical Vehicle</button>
                    </div>

                    {formData.mountType === 'mount' ? (
                      <>
                        {/* LEVEL UP PROGRESSION BANNER */}
                        <div className="bg-[#111827] rounded-xl border border-[#374151] overflow-hidden shadow-inner">
                           <div className="bg-[#374151]/50 p-4 border-b border-[#374151] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                             <h3 className="text-lg font-bold text-[#FCA5A5] flex items-center gap-2"><ChevronUp className="w-5 h-5" /> Mount Progression</h3>
                             <div className="flex items-center gap-4">
                               <div className="flex items-center gap-2">
                                 <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Origin</label>
                                 <select value={formData.origin} onChange={(e) => setFormData({...formData, origin: e.target.value})} className="bg-[#1F2937] border border-[#4B5563] text-white text-sm font-bold rounded px-2 py-1.5 outline-none cursor-pointer">
                                   <option value="">Select...</option>
                                   {ORIGINS.map(o => <option key={o.name} value={o.name}>{o.name}</option>)}
                                 </select>
                               </div>
                               <div className="flex items-center gap-2">
                                 <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Level</label>
                                 <div className="flex items-center bg-[#1F2937] border border-[#4B5563] rounded p-0.5">
                                   <button type="button" onClick={() => setFormData(p => ({...p, level: Math.max(1, p.level - 1)}))} className="p-1 hover:bg-[#374151] active:scale-90 transition-transform rounded text-[#9CA3AF] hover:text-white"><Minus className="w-4 h-4"/></button>
                                   <span className="w-8 text-center font-bold text-white text-base">{formData.level}</span>
                                   <button type="button" onClick={() => setFormData(p => ({...p, level: Math.min(20, p.level + 1)}))} className="p-1 hover:bg-[#374151] active:scale-90 transition-transform rounded text-[#9CA3AF] hover:text-white"><Plus className="w-4 h-4"/></button>
                                 </div>
                               </div>
                             </div>
                           </div>
                           
                           <div className="grid grid-cols-3 sm:grid-cols-6 gap-px bg-[#374151]">
                              {[
                                { label: 'Prof Bonus', val: `+${mountProgression['Prof Bonus']}` }, { label: 'Features', val: mountProgression['Features'] }, { label: 'Manifestations', val: mountProgression['Level Manifestations'] }, { label: 'Charge Abilities', val: mountProgression['Charge Abilities Known'] }, { label: 'Hard Points', val: mountProgression['Hard Points'] }, { label: 'Arcane Charges', val: mountProgression['Arcane Charges'] }
                              ].map(stat => (
                                <div key={stat.label} className="bg-[#111827] p-3 text-center">
                                   <span className="block text-[9px] text-[#9CA3AF] uppercase font-bold tracking-wider mb-1 truncate" title={stat.label}>{stat.label}</span>
                                   <span className="text-xl font-bold text-[#E5E7EB]">{stat.val}</span>
                                </div>
                              ))}
                           </div>
                        </div>

                        {/* Mount Base Stats Editor */}
                        <div className="grid grid-cols-3 gap-3 mb-6 bg-[#111827] p-4 rounded-xl shadow-inner border border-[#374151]">
                           <div>
                             <label className="block text-[10px] font-bold text-[#9CA3AF] uppercase mb-1">Max HP</label>
                             <input type="number" min="1" value={formData.mountDetails?.hpMax || 50} onChange={(e) => handleMountDetailChange('hpMax', e.target.value)} className={theme.input + " py-2 text-center"} />
                           </div>
                           <div>
                             <label className="block text-[10px] font-bold text-[#9CA3AF] uppercase mb-1">Base AC (Unarmored)</label>
                             <input type="number" min="1" value={formData.mountDetails?.baseAc || 10} onChange={(e) => handleMountDetailChange('baseAc', e.target.value)} className={theme.input + " py-2 text-center"} />
                           </div>
                           <div>
                             <label className="block text-[10px] font-bold text-[#9CA3AF] uppercase mb-1">Base Speed</label>
                             <input type="number" min="0" value={formData.mountDetails?.baseSpeed || 100} onChange={(e) => handleMountDetailChange('baseSpeed', e.target.value)} className={theme.input + " py-2 text-center"} />
                           </div>
                        </div>

                        {/* POINT BUY GRIDS */}
                        <div className="bg-[#111827] border border-[#374151] rounded-xl p-4 shadow-inner">
                          <div className="flex justify-between items-center mb-4 border-b border-[#374151] pb-2">
                            <h4 className="text-sm font-bold text-[#9CA3AF] uppercase tracking-wider">Base Stat Point Buy</h4>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${totalPointsSpent > MAX_POINTS ? 'bg-[#7F1D1D] text-white' : 'bg-[#374151] text-[#D1D5DB]'}`}>{totalPointsSpent} / {MAX_POINTS} Total Pts</span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid grid-cols-3 gap-2">
                              {['STR', 'DEX', 'CON'].map(stat => (
                                <div key={stat} className="bg-[#1F2937] border border-[#4B5563] rounded-lg p-2 text-center">
                                  <span className="block text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">{stat}</span>
                                  <div className="flex items-center justify-between bg-[#111827] rounded border border-[#374151] p-0.5">
                                    <button type="button" onClick={() => handleStatChange(stat, -1)} className="p-1 hover:bg-[#374151] active:scale-90 rounded text-[#9CA3AF] hover:text-white transition-transform"><Minus className="w-3 h-3"/></button>
                                    <span className={`font-bold text-sm ${formData.asiAllocations?.[stat] ? 'text-[#FCA5A5]' : 'text-white'}`}>{formData.stats[stat] + (formData.asiAllocations?.[stat] || 0)}</span>
                                    <button type="button" onClick={() => handleStatChange(stat, 1)} className="p-1 hover:bg-[#374151] active:scale-90 rounded text-[#9CA3AF] hover:text-white transition-transform"><Plus className="w-3 h-3"/></button>
                                  </div>
                                  <span className="block text-[10px] font-bold text-[#6B7280] mt-2">MOD: {calculateModifier(formData.stats[stat] + (formData.asiAllocations?.[stat] || 0))}</span>
                                </div>
                              ))}
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2">
                              {['INT', 'WIS', 'CHA'].map(stat => (
                                <div key={stat} className="bg-[#1F2937] border border-[#4B5563] rounded-lg p-2 text-center">
                                  <span className="block text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">{stat}</span>
                                  <div className="flex items-center justify-between bg-[#111827] rounded border border-[#374151] p-0.5">
                                    <button type="button" onClick={() => handleStatChange(stat, -1)} className="p-1 hover:bg-[#374151] active:scale-90 rounded text-[#9CA3AF] hover:text-white transition-transform"><Minus className="w-3 h-3"/></button>
                                    <span className={`font-bold text-sm ${formData.asiAllocations?.[stat] ? 'text-[#FCA5A5]' : 'text-white'}`}>{formData.stats[stat] + (formData.asiAllocations?.[stat] || 0)}</span>
                                    <button type="button" onClick={() => handleStatChange(stat, 1)} className="p-1 hover:bg-[#374151] active:scale-90 rounded text-[#9CA3AF] hover:text-white transition-transform"><Plus className="w-3 h-3"/></button>
                                  </div>
                                  <span className="block text-[10px] font-bold text-[#6B7280] mt-2">MOD: {calculateModifier(formData.stats[stat] + (formData.asiAllocations?.[stat] || 0))}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* ASI Banner */}
                        {totalAsiPoints > 0 && (
                          <div className="bg-[#111827] border border-[#FCA5A5]/50 text-[#FCA5A5] p-3 rounded-lg flex items-center justify-between shadow-inner mt-6">
                             <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                <div><span className="block font-bold text-sm">ASI Unlocked!</span><span className="block text-xs text-[#9CA3AF]">You can raise stats up to 25 max.</span></div>
                             </div>
                             <div className={`text-xs font-bold px-3 py-1.5 rounded border ${asiSpent > totalAsiPoints ? 'bg-[#7F1D1D] text-white border-[#DC2626]' : asiSpent < totalAsiPoints ? 'bg-[#DC2626]/20 border-[#DC2626] text-white animate-pulse' : 'bg-[#1F2937] border-[#4B5563] text-[#9CA3AF]'}`}>
                               {asiSpent} / {totalAsiPoints} ASI Spent
                             </div>
                          </div>
                        )}

                        {/* ABILITIES SELECTION */}
                        <div className="space-y-4 mt-6">
                          <div>
                            <div className="flex justify-between items-end mb-2">
                              <label className="block text-sm font-bold text-[#9CA3AF]">Manifestations</label>
                              <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">{formData.manifestations.length} / {mountProgression["Level Manifestations"]} Allowed</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {MANIFESTATIONS.map(manifest => {
                                const isSelected = formData.manifestations.includes(manifest.name);
                                const maxReached = formData.manifestations.length >= mountProgression["Level Manifestations"];
                                return (
                                  <button
                                    type="button" key={manifest.name}
                                    onClick={() => handleArrayToggle('manifestations', manifest.name, mountProgression["Level Manifestations"])}
                                    onMouseEnter={() => setFormHoveredManifestation(manifest)}
                                    onMouseLeave={() => setFormHoveredManifestation(null)}
                                    disabled={!isSelected && maxReached}
                                    className={`px-3 py-1.5 text-xs rounded border transition-all font-bold ${isSelected ? 'bg-[#DC2626] border-[#B91C1C] text-white shadow-md' : (!isSelected && maxReached) ? 'bg-[#1F2937] border-[#374151] text-[#4B5563] cursor-not-allowed' : 'bg-[#374151] border-[#4B5563] text-[#D1D5DB] hover:text-white hover:border-[#6B7280] hover:bg-[#4B5563]'}`}
                                  >
                                    {manifest.name}
                                  </button>
                                )
                              })}
                            </div>
                            {/* Interactive Tooltip Hover Box */}
                            <div className="h-24 bg-[#1F2937] border border-[#4B5563] rounded-lg p-3 overflow-hidden shadow-inner mb-3">
                               {formHoveredManifestation ? (
                                 <div className="animate-in fade-in duration-200 h-full">
                                    <span className="font-bold text-[#FCA5A5] block mb-1">{formHoveredManifestation.name}</span>
                                    <p className="text-gray-300 italic text-xs">{formHoveredManifestation.description}</p>
                                 </div>
                               ) : (
                                 <div className="flex h-full items-center justify-center text-[#6B7280] italic text-xs">
                                    Hover over a manifestation to see details.
                                 </div>
                               )}
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-end mb-2">
                              <label className="block text-sm font-bold text-[#9CA3AF]">Charge Abilities</label>
                              <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">{formData.chargeAbilities.length} / {mountProgression["Charge Abilities Known"]} Allowed</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {CHARGE_ABILITIES.map(ability => {
                                const isSelected = formData.chargeAbilities.includes(ability.name);
                                const maxReached = formData.chargeAbilities.length >= mountProgression["Charge Abilities Known"];
                                return (
                                  <button
                                    type="button" key={ability.name}
                                    onClick={() => handleArrayToggle('chargeAbilities', ability.name, mountProgression["Charge Abilities Known"])}
                                    onMouseEnter={() => setFormHoveredChargeAbility(ability)}
                                    onMouseLeave={() => setFormHoveredChargeAbility(null)}
                                    disabled={!isSelected && maxReached}
                                    className={`px-3 py-1.5 text-xs rounded border transition-all font-bold ${isSelected ? 'bg-[#DC2626] border-[#B91C1C] text-white shadow-md' : (!isSelected && maxReached) ? 'bg-[#1F2937] border-[#374151] text-[#4B5563] cursor-not-allowed' : 'bg-[#374151] border-[#4B5563] text-[#D1D5DB] hover:text-white hover:border-[#6B7280] hover:bg-[#4B5563]'}`}
                                  >
                                    {ability.name}
                                  </button>
                                )
                              })}
                            </div>
                            {/* Interactive Tooltip Hover Box */}
                            <div className="h-24 bg-[#1F2937] border border-[#4B5563] rounded-lg p-3 overflow-hidden shadow-inner mb-3">
                               {formHoveredChargeAbility ? (
                                 <div className="animate-in fade-in duration-200 h-full">
                                    <span className="font-bold text-[#60A5FA] block mb-1">{formHoveredChargeAbility.name}</span>
                                    <p className="text-gray-300 italic text-xs">{formHoveredChargeAbility.description}</p>
                                 </div>
                               ) : (
                                 <div className="flex h-full items-center justify-center text-[#6B7280] italic text-xs">
                                    Hover over a charge ability to see details.
                                 </div>
                               )}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* VEHICLE BUILDER UI */}
                        
                        {/* LEVEL UP PROGRESSION BANNER (Vehicle Adapted) */}
                        <div className="bg-[#111827] rounded-xl border border-[#374151] overflow-hidden shadow-inner mb-4">
                           <div className="bg-[#374151]/50 p-4 border-b border-[#374151] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                             <h3 className="text-lg font-bold text-[#FCA5A5] flex items-center gap-2"><ChevronUp className="w-5 h-5" /> Vehicle Progression</h3>
                             <div className="flex items-center gap-4">
                               <div className="flex items-center gap-2">
                                 <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Level</label>
                                 <div className="flex items-center bg-[#1F2937] border border-[#4B5563] rounded p-0.5">
                                   <button type="button" onClick={() => setFormData(p => ({...p, level: Math.max(1, p.level - 1)}))} className="p-1 hover:bg-[#374151] active:scale-90 transition-transform rounded text-[#9CA3AF] hover:text-white"><Minus className="w-4 h-4"/></button>
                                   <span className="w-8 text-center font-bold text-white text-base">{formData.level}</span>
                                   <button type="button" onClick={() => setFormData(p => ({...p, level: Math.min(20, p.level + 1)}))} className="p-1 hover:bg-[#374151] active:scale-90 transition-transform rounded text-[#9CA3AF] hover:text-white"><Plus className="w-4 h-4"/></button>
                                 </div>
                               </div>
                             </div>
                           </div>
                           
                           <div className="grid grid-cols-3 sm:grid-cols-6 gap-px bg-[#374151]">
                              {[
                                { label: 'Prof Bonus', val: `+${vehicleProgression['Prof Bonus']}` }, 
                                { label: 'Features', val: vehicleProgression['Features'] }, 
                                { label: 'Attunement Slots', val: vehicleProgression['Attunement Slots'] }, 
                                { label: 'Charge Abilities', val: vehicleProgression['Charge Abilities Known'] }, 
                                { label: 'Hard Points', val: vehicleProgression['Hard Points'] }, 
                                { label: 'Arcane Charges', val: vehicleProgression['Arcane Charges'] }
                              ].map(stat => (
                                <div key={stat.label} className="bg-[#111827] p-3 text-center">
                                   <span className="block text-[9px] text-[#9CA3AF] uppercase font-bold tracking-wider mb-1 truncate" title={stat.label}>{stat.label}</span>
                                   <span className="text-xl font-bold text-[#E5E7EB]">{stat.val}</span>
                                </div>
                              ))}
                           </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-[#9CA3AF] uppercase mb-1">Max HP</label>
                            <input type="number" min="1" value={formData.vehicleStats.hpMax} onChange={(e) => handleVehicleStatChange('hpMax', e.target.value)} className={theme.input + " py-2 text-center"} />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-[#9CA3AF] uppercase mb-1">Current HP</label>
                            <input type="number" min="0" value={formData.vehicleStats.hpCurrent} onChange={(e) => handleVehicleStatChange('hpCurrent', e.target.value)} className={theme.input + " py-2 text-center text-[#FCA5A5]"} />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-[#9CA3AF] uppercase mb-1">Armor AC</label>
                            <input type="number" min="0" value={formData.vehicleStats.ac} onChange={(e) => handleVehicleStatChange('ac', e.target.value)} className={theme.input + " py-2 text-center"} />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-[#9CA3AF] uppercase mb-1">Base Speed</label>
                            <input type="number" min="0" value={formData.vehicleStats.baseSpeed || 150} onChange={(e) => handleVehicleStatChange('baseSpeed', e.target.value)} className={theme.input + " py-2 text-center"} />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-[10px] font-bold text-[#9CA3AF] uppercase mb-1 flex justify-between">
                              <span>Extra Hardpoints</span>
                              <span className="text-[#FCA5A5]">Costs 1,000 GP each</span>
                            </label>
                            <input type="number" min="0" value={formData.vehicleStats.extraHardpoints} onChange={(e) => handleVehicleStatChange('extraHardpoints', e.target.value)} className={theme.input + " py-2 text-center"} />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-[10px] font-bold text-[#9CA3AF] uppercase mb-1 flex justify-between">
                              <span>Extra Slots</span>
                              <span className="text-[#FCA5A5]">Costs 1,000 GP each</span>
                            </label>
                            <input type="number" min="0" value={formData.vehicleStats.extraSlots} onChange={(e) => handleVehicleStatChange('extraSlots', e.target.value)} className={theme.input + " py-2 text-center"} />
                          </div>
                        </div>

                        <div className="space-y-4">
                          {/* Weapons Manager */}
                          <div className="bg-[#111827] border border-[#374151] rounded-xl p-4 shadow-inner">
                            <div className="flex justify-between items-center mb-3 border-b border-[#374151] pb-2">
                              <h4 className="text-sm font-bold text-[#9CA3AF] uppercase tracking-wider flex items-center gap-1.5"><Crosshair className="w-4 h-4 text-[#FCA5A5]"/> Vehicle Weapons</h4>
                              <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${getUsedVehicleHardpoints(formData.vehicleLoadout) >= (vehicleProgression['Hard Points'] + (formData.vehicleStats.extraHardpoints || 0)) ? 'bg-[#7F1D1D] text-white' : 'bg-[#374151] text-[#D1D5DB]'}`}>
                                {getUsedVehicleHardpoints(formData.vehicleLoadout)} / {(vehicleProgression['Hard Points'] + (formData.vehicleStats.extraHardpoints || 0))} HPts
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {VEHICLE_WEAPONS.map(w => {
                                const maxHp = vehicleProgression['Hard Points'] + (formData.vehicleStats.extraHardpoints || 0);
                                const canAfford = getUsedVehicleHardpoints(formData.vehicleLoadout) + w.hardpoints <= maxHp;
                                return (
                                  <button
                                    type="button"
                                    key={w.name}
                                    onClick={() => handleAddVehicleItem('weapons', w.name)}
                                    onMouseEnter={() => setFormHoveredWeapon(w)}
                                    onMouseLeave={() => setFormHoveredWeapon(null)}
                                    disabled={!canAfford}
                                    className={`px-2.5 py-1 text-xs rounded border transition-colors font-bold ${
                                      !canAfford ? 'bg-[#1F2937] border-[#374151] text-[#4B5563] cursor-not-allowed' : 'bg-[#374151] border-[#4B5563] text-[#D1D5DB] hover:text-white hover:border-[#6B7280]'
                                    }`}
                                  >
                                    + {w.name} <span className="opacity-60">({w.cost})</span>
                                  </button>
                                );
                              })}
                            </div>
                            
                            {/* Fixed Height Tooltip Box */}
                            <div className="h-28 bg-[#1F2937] border border-[#4B5563] rounded-lg p-3 overflow-hidden shadow-inner mb-3">
                               {formHoveredWeapon ? (
                                 <div className="animate-in fade-in duration-200 h-full">
                                    <span className="font-bold text-[#FCA5A5] block mb-1">{formHoveredWeapon.name} <span className="text-[#9CA3AF] font-normal">({formHoveredWeapon.cost} | {formHoveredWeapon.hardpoints} HPt)</span></span>
                                    <p className="text-gray-300 italic text-xs">{formHoveredWeapon.details}</p>
                                 </div>
                               ) : (
                                 <div className="flex h-full items-center justify-center text-[#6B7280] italic text-xs">
                                    Hover over a weapon to see details.
                                 </div>
                               )}
                            </div>

                            <div className="space-y-1">
                              {formData.vehicleLoadout.weapons.length === 0 ? <p className="text-xs text-[#6B7280] italic">No weapons equipped.</p> : null}
                              {formData.vehicleLoadout.weapons.map((w, i) => (
                                <div key={i} className="flex justify-between items-center bg-[#1F2937] px-3 py-1.5 rounded border border-[#4B5563]">
                                  <span className="text-xs font-bold text-[#E5E7EB]">{w}</span>
                                  <button type="button" onClick={() => handleRemoveVehicleItem('weapons', i)} className="text-[#FCA5A5] hover:text-[#DC2626]"><X className="w-3.5 h-3.5"/></button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Upgrades Manager */}
                          <div className="bg-[#111827] border border-[#374151] rounded-xl p-4 shadow-inner">
                            <div className="flex justify-between items-center mb-3 border-b border-[#374151] pb-2">
                              <h4 className="text-sm font-bold text-[#9CA3AF] uppercase tracking-wider flex items-center gap-1.5"><Zap className="w-4 h-4 text-[#60A5FA]"/> Magical Upgrades</h4>
                              <div className="flex gap-2">
                                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${getUsedVehicleSlots(formData.vehicleLoadout) >= (vehicleProgression['Attunement Slots'] + (formData.vehicleStats.extraSlots || 0)) ? 'bg-[#7F1D1D] text-white' : 'bg-[#374151] text-[#D1D5DB]'}`}>
                                  {getUsedVehicleSlots(formData.vehicleLoadout)} / {(vehicleProgression['Attunement Slots'] + (formData.vehicleStats.extraSlots || 0))} Slots
                                </span>
                              </div>
                            </div>
                            
                            {/* Free Upgrade Tracker Banner */}
                            <div className="flex flex-wrap gap-2 mb-3 bg-[#1F2937] p-2 rounded-lg border border-[#4B5563]">
                               <span className="text-xs font-bold text-[#D1D5DB] w-full mb-1">Level Unlocks Available:</span>
                               <span className={`text-[10px] px-2 py-1 rounded font-bold ${equippedRarities.uncommon < freeUpgrades.uncommon ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#374151] text-[#9CA3AF]'}`}>
                                 Uncommon: {Math.max(0, freeUpgrades.uncommon - equippedRarities.uncommon)}
                               </span>
                               <span className={`text-[10px] px-2 py-1 rounded font-bold ${equippedRarities.rare < freeUpgrades.rare ? 'bg-[#3B82F6]/20 text-[#3B82F6]' : 'bg-[#374151] text-[#9CA3AF]'}`}>
                                 Rare: {Math.max(0, freeUpgrades.rare - equippedRarities.rare)}
                               </span>
                               <span className={`text-[10px] px-2 py-1 rounded font-bold ${equippedRarities.veryRare < freeUpgrades.veryRare ? 'bg-[#8B5CF6]/20 text-[#8B5CF6]' : 'bg-[#374151] text-[#9CA3AF]'}`}>
                                 Very Rare: {Math.max(0, freeUpgrades.veryRare - equippedRarities.veryRare)}
                               </span>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-3">
                              {VEHICLE_UPGRADES.map(u => {
                                const maxHp = vehicleProgression['Hard Points'] + (formData.vehicleStats.extraHardpoints || 0);
                                const maxSlots = vehicleProgression['Attunement Slots'] + (formData.vehicleStats.extraSlots || 0);

                                const fitsHardpoints = getUsedVehicleHardpoints(formData.vehicleLoadout) + (u.hardpoints || 0) <= maxHp;
                                const fitsSlots = getUsedVehicleSlots(formData.vehicleLoadout) + (u.slots || 0) <= maxSlots;
                                const canAffordSlots = fitsHardpoints && fitsSlots;

                                let isFree = false;
                                if (u.rarity === 'Uncommon' && equippedRarities.uncommon < freeUpgrades.uncommon) isFree = true;
                                if (u.rarity === 'Rare' && equippedRarities.rare < freeUpgrades.rare) isFree = true;
                                if (u.rarity === 'Very Rare' && equippedRarities.veryRare < freeUpgrades.veryRare) isFree = true;

                                const displayCost = isFree ? 'FREE' : u.cost;

                                return (
                                  <button
                                    type="button"
                                    key={u.name}
                                    onClick={() => handleAddVehicleItem('upgrades', u.name)}
                                    onMouseEnter={() => setFormHoveredUpgrade(u)}
                                    onMouseLeave={() => setFormHoveredUpgrade(null)}
                                    disabled={!canAffordSlots}
                                    className={`px-2.5 py-1 text-xs rounded border transition-colors font-bold ${
                                      !canAffordSlots ? 'bg-[#1F2937] border-[#374151] text-[#4B5563] cursor-not-allowed' : 
                                      isFree ? 'bg-[#10B981]/20 border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-white' :
                                      'bg-[#374151] border-[#4B5563] text-[#D1D5DB] hover:text-white hover:border-[#6B7280]'
                                    }`}
                                  >
                                    + {u.name} <span className={isFree ? "opacity-100" : "opacity-60"}>({displayCost})</span>
                                  </button>
                                );
                              })}
                            </div>
                            
                            {/* Fixed Height Tooltip Box */}
                            <div className="h-28 bg-[#1F2937] border border-[#4B5563] rounded-lg p-3 overflow-hidden shadow-inner mb-3">
                               {formHoveredUpgrade ? (
                                 <div className="animate-in fade-in duration-200 h-full">
                                    <span className="font-bold text-[#60A5FA] block mb-1">
                                      {formHoveredUpgrade.name} 
                                      <span className="text-[#9CA3AF] font-normal">
                                        ({formHoveredUpgrade.rarity} | {formHoveredUpgrade.cost} | {formHoveredUpgrade.slots} Slot{formHoveredUpgrade.hardpoints ? ` | ${formHoveredUpgrade.hardpoints} HPt` : ''})
                                      </span>
                                    </span>
                                    <p className="text-gray-300 italic text-xs">{formHoveredUpgrade.description}</p>
                                 </div>
                               ) : (
                                 <div className="flex h-full items-center justify-center text-[#6B7280] italic text-xs">
                                    Hover over an upgrade to see details.
                                 </div>
                               )}
                            </div>

                            <div className="space-y-1">
                              {formData.vehicleLoadout.upgrades.length === 0 ? <p className="text-xs text-[#6B7280] italic">No upgrades equipped.</p> : null}
                              {formData.vehicleLoadout.upgrades.map((u, i) => (
                                <div key={i} className="flex justify-between items-center bg-[#1F2937] px-3 py-1.5 rounded border border-[#4B5563]">
                                  <span className="text-xs font-bold text-[#60A5FA]">{u}</span>
                                  <button type="button" onClick={() => handleRemoveVehicleItem('upgrades', i)} className="text-[#FCA5A5] hover:text-[#DC2626]"><X className="w-3.5 h-3.5"/></button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* 3. Connections & Notes */}
                <div className="space-y-4 border-t border-[#374151] pt-6">
                  <div>
                    <label className="block text-sm font-bold text-[#9CA3AF] mb-2 flex items-center gap-2"><Network className="w-4 h-4" /> Link Connections</label>
                    <div className="max-h-48 overflow-y-auto p-4 bg-[#111827] border border-[#374151] rounded-lg custom-scrollbar shadow-inner">
                      {entries.length <= 1 ? (
                        <p className="text-sm text-[#6B7280] italic p-2">No other entries exist yet.</p>
                      ) : (
                        CATEGORIES.map(cat => {
                          const categoryEntries = entries.filter(e => e.type === cat.id && e.id !== editingId);
                          if (categoryEntries.length === 0) return null;
                          const Icon = cat.icon;
                          return (
                            <div key={cat.id} className="mb-4 last:mb-0">
                              <h4 className="text-[10px] uppercase font-bold text-[#6B7280] tracking-wider mb-2 flex items-center gap-1.5"><Icon className="w-3 h-3" /> {cat.label}</h4>
                              <div className="flex flex-wrap gap-2">
                                {categoryEntries.map(entry => {
                                  const isSelected = formData.connections.includes(entry.id);
                                  return (
                                    <button
                                      type="button" key={entry.id}
                                      onClick={() => { const newConns = isSelected ? formData.connections.filter(id => id !== entry.id) : [...formData.connections, entry.id]; setFormData({...formData, connections: newConns}); }}
                                      className={`px-3 py-1.5 text-xs rounded-lg border flex items-center gap-1.5 font-bold transition-all shadow-sm ${isSelected ? 'bg-[#DC2626] border-[#B91C1C] text-white' : 'bg-[#1F2937] border-[#4B5563] text-[#D1D5DB] hover:text-white hover:border-[#6B7280] hover:bg-[#374151]'}`}
                                    >
                                      {isSelected && <Check className="w-3 h-3 shrink-0" />} <span className="truncate">{entry.name}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {role === 'gm' && (
                    <div>
                      <label className="block text-sm font-bold text-[#FCA5A5] mb-2 flex items-center gap-2">GM Notes <span className="text-[10px] bg-[#7F1D1D]/50 text-[#FECACA] px-2 py-0.5 rounded uppercase">Hidden</span></label>
                      <textarea rows={4} value={formData.gmNotes} onChange={(e) => setFormData({...formData, gmNotes: e.target.value})} className={theme.input + " resize-none bg-[#111827] font-mono text-sm"} placeholder="Hidden motives, traps, stats..." />
                    </div>
                  )}

                  {role === 'gm' && (
                    <div className="pt-2">
                      <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg border border-[#374151] bg-[#111827] hover:bg-[#1F2937] transition-colors">
                        <input type="checkbox" checked={formData.isPublic} onChange={(e) => setFormData({...formData, isPublic: e.target.checked})} className="w-5 h-5 rounded border-[#4B5563] text-[#DC2626] focus:ring-[#DC2626] bg-[#374151]" />
                        <div className="flex-1"><span className="block text-sm font-bold text-gray-200">Make Public to Players</span><span className="block text-xs text-[#9CA3AF] mt-1">Allows players to view the description and add shared notes.</span></div>
                      </label>
                    </div>
                  )}
                </div>

              </form>
            </div>

            <div className="pt-6 mt-4 border-t border-[#374151] flex justify-end gap-3 shrink-0">
              <button type="button" onClick={resetForm} className={theme.btnSecondary}>Cancel</button>
              <button type="submit" form="gm-form" className={theme.btnPrimary}>
                <Save className="w-4 h-4" /> {editingId ? 'Update' : 'Save'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- Player/Collaborative Notes Modal --- */}
      {isNotesFormOpen && activeNotesEntry && (
        <div className={theme.modalOverlay}>
          <div className={theme.modalBox}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={theme.cardHeaderTitle + " border-none mb-0 pb-0"}>Shared Notes: {activeNotesEntry.name}</h2>
              <button onClick={() => setIsNotesFormOpen(false)} className="text-[#9CA3AF] hover:text-white p-2 bg-[#111827] rounded-lg transition-colors border border-[#374151]"><X className="w-5 h-5" /></button>
            </div>

            <div className="overflow-y-auto pr-2 custom-scrollbar space-y-6">
              {activeNotesEntry.description && (
                <div className="bg-[#111827] p-4 rounded-lg border border-[#374151]">
                  <h4 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-2">GM's Outline</h4>
                  <p className="text-sm text-[#D1D5DB] whitespace-pre-wrap">{activeNotesEntry.description}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-bold text-[#D1D5DB] mb-2 flex items-center gap-2">Player Workspace <span className="text-[10px] bg-[#374151] text-[#D1D5DB] px-2 py-0.5 rounded uppercase">Visible to everyone</span></label>
                <textarea rows={8} value={playerNotesText} onChange={(e) => setPlayerNotesText(e.target.value)} className={theme.input + " resize-none"} placeholder="Collaborate on clues, inventory lists, quest progress..." />
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-[#374151] flex justify-end gap-3 shrink-0">
              <button onClick={() => setIsNotesFormOpen(false)} className={theme.btnSecondary}>Cancel</button>
              <button onClick={savePlayerNotes} className={theme.btnPrimary}><Save className="w-4 h-4" /> Save Notes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}