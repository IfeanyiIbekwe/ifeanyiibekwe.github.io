/* ============================================================
   Brain Quest Jr. — a gamified adaptive learning adventure
   Vanilla JS, no dependencies. Progress saved in localStorage.
   ============================================================ */
"use strict";

/* ------------------------------------------------------------
   Small utilities
------------------------------------------------------------ */
const $ = (sel) => document.querySelector(sel);
const rand = (n) => Math.floor(Math.random() * n);
const randInt = (min, max) => min + rand(max - min + 1); // inclusive
const pick = (arr) => arr[rand(arr.length)];
const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const pickN = (arr, n) => shuffle(arr).slice(0, n);
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const dateHash = (s) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ------------------------------------------------------------
   Content banks
------------------------------------------------------------ */

const AVATARS = ["🦊", "🐼", "🦁", "🐸", "🦄", "🐯", "🐙", "🦖", "🐧", "🐵", "🦋", "🚀"];

const LEVEL_TITLES = [
  "Curious Chick 🐣", "Busy Bee 🐝", "Smart Cookie 🍪", "Bright Bunny 🐰",
  "Clever Cat 🐱", "Wise Owl 🦉", "Puzzle Puppy 🐶", "Number Ninja 🥷",
  "Word Wizard 🧙", "Super Star ⭐", "Brainy Bear 🐻", "Rocket Reader 🚀",
  "Math Machine 🤖", "Pattern Pro 🚂", "Memory Master 🧠", "Quiz Champ 🏆",
  "Galaxy Genius 🌌", "Dino Brain 🦕", "Lightning Learner ⚡", "Mega Mind 💫",
  "Grand Explorer 🗺️", "Brain Legend 👑", "Ultimate Genius 🌟", "Infinity Brain ♾️",
];

const PHONICS = [
  { l: "A", w: "Apple", e: "🍎" }, { l: "B", w: "Ball", e: "⚽" }, { l: "C", w: "Cat", e: "🐱" },
  { l: "D", w: "Dog", e: "🐶" }, { l: "E", w: "Egg", e: "🥚" }, { l: "F", w: "Fish", e: "🐟" },
  { l: "G", w: "Goat", e: "🐐" }, { l: "H", w: "Hat", e: "🎩" }, { l: "I", w: "Ice", e: "🧊" },
  { l: "J", w: "Juice", e: "🧃" }, { l: "K", w: "Kite", e: "🪁" }, { l: "L", w: "Lion", e: "🦁" },
  { l: "M", w: "Moon", e: "🌙" }, { l: "N", w: "Nose", e: "👃" }, { l: "O", w: "Orange", e: "🍊" },
  { l: "P", w: "Pig", e: "🐷" }, { l: "Q", w: "Queen", e: "👑" }, { l: "R", w: "Rain", e: "🌧️" },
  { l: "S", w: "Sun", e: "☀️" }, { l: "T", w: "Tree", e: "🌳" }, { l: "U", w: "Umbrella", e: "☂️" },
  { l: "V", w: "Van", e: "🚐" }, { l: "W", w: "Whale", e: "🐳" }, { l: "Y", w: "Yo-yo", e: "🪀" },
  { l: "Z", w: "Zebra", e: "🦓" },
];
const VOWELS = ["A", "E", "I", "O", "U"];

const SIGHT_WORDS = {
  1: ["a", "I", "at", "in", "it", "up", "go", "me", "we", "no", "on", "my"],
  2: ["the", "and", "see", "can", "you", "dog", "cat", "run", "big", "red", "yes", "mom", "dad"],
  3: ["play", "like", "said", "here", "come", "jump", "help", "look", "this", "with", "they", "have"],
  4: ["where", "there", "little", "funny", "friend", "school", "happy", "again", "under", "every"],
  5: ["together", "beautiful", "different", "surprise", "adventure", "important", "favorite", "wonderful"],
};

const SPELL_WORDS = [
  // 3 letters
  { w: "cat", e: "🐱" }, { w: "dog", e: "🐶" }, { w: "sun", e: "☀️" }, { w: "hat", e: "🎩" },
  { w: "bed", e: "🛏️" }, { w: "bus", e: "🚌" }, { w: "pig", e: "🐷" }, { w: "cup", e: "☕" },
  { w: "key", e: "🔑" }, { w: "bee", e: "🐝" }, { w: "car", e: "🚗" }, { w: "egg", e: "🥚" },
  { w: "owl", e: "🦉" }, { w: "ant", e: "🐜" }, { w: "fox", e: "🦊" },
  // 4 letters
  { w: "fish", e: "🐟" }, { w: "frog", e: "🐸" }, { w: "star", e: "⭐" }, { w: "cake", e: "🎂" },
  { w: "ship", e: "🚢" }, { w: "bear", e: "🐻" }, { w: "lion", e: "🦁" }, { w: "duck", e: "🦆" },
  { w: "corn", e: "🌽" }, { w: "moon", e: "🌙" }, { w: "tree", e: "🌳" }, { w: "ring", e: "💍" },
  { w: "sock", e: "🧦" }, { w: "kite", e: "🪁" }, { w: "drum", e: "🥁" },
  // 5 letters
  { w: "apple", e: "🍎" }, { w: "train", e: "🚂" }, { w: "tiger", e: "🐯" }, { w: "horse", e: "🐴" },
  { w: "mouse", e: "🐭" }, { w: "zebra", e: "🦓" }, { w: "pizza", e: "🍕" }, { w: "snake", e: "🐍" },
  { w: "whale", e: "🐳" }, { w: "bread", e: "🍞" }, { w: "sheep", e: "🐑" }, { w: "clock", e: "⏰" },
  // 6+ letters
  { w: "flower", e: "🌸" }, { w: "rocket", e: "🚀" }, { w: "banana", e: "🍌" }, { w: "monkey", e: "🐵" },
  { w: "rabbit", e: "🐰" }, { w: "dragon", e: "🐉" }, { w: "turtle", e: "🐢" }, { w: "castle", e: "🏰" },
  { w: "orange", e: "🍊" }, { w: "pencil", e: "✏️" }, { w: "spider", e: "🕷️" }, { w: "guitar", e: "🎸" },
];
const spellPool = (diff) => {
  const len = { 1: [3, 3], 2: [3, 4], 3: [4, 4], 4: [5, 5], 5: [6, 9] }[diff];
  return SPELL_WORDS.filter((x) => x.w.length >= len[0] && x.w.length <= len[1]);
};

const CRITTERS = ["🐞", "🦋", "🐠", "🐥", "🐸", "🐰", "🐢", "⭐", "🍓", "🎈", "🐝", "🦀"];

const SHAPES = {
  circle:    { sides: 0 }, square:   { sides: 4 }, triangle: { sides: 3 },
  star:      { sides: 0 }, heart:    { sides: 0 }, rectangle:{ sides: 4 },
  diamond:   { sides: 4 }, oval:     { sides: 0 }, pentagon: { sides: 5 },
  hexagon:   { sides: 6 }, octagon:  { sides: 8 },
};
const SHAPES_BY_DIFF = {
  1: ["circle", "square", "triangle"],
  2: ["circle", "square", "triangle", "star", "heart"],
  3: ["circle", "square", "triangle", "star", "heart", "rectangle", "diamond", "oval"],
  4: ["square", "triangle", "star", "heart", "rectangle", "diamond", "oval", "pentagon", "hexagon"],
  5: ["triangle", "rectangle", "diamond", "pentagon", "hexagon", "octagon", "star", "oval"],
};
const SHAPE_COLORS = ["#3fa7ff", "#ff6b6b", "#3ec96f", "#f7b500", "#8f6bff", "#ff7ab8", "#ff9f43"];

function polyPoints(n, r = 45, cx = 55, cy = 55, rot = -Math.PI / 2) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = rot + (i * 2 * Math.PI) / n;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(" ");
}
function starPoints(cx = 55, cy = 57, outer = 48, inner = 20) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(" ");
}
function shapeSVG(shape, color, size = 110) {
  let inner = "";
  switch (shape) {
    case "circle":    inner = `<circle cx="55" cy="55" r="45" fill="${color}"/>`; break;
    case "oval":      inner = `<ellipse cx="55" cy="55" rx="50" ry="30" fill="${color}"/>`; break;
    case "square":    inner = `<rect x="15" y="15" width="80" height="80" rx="8" fill="${color}"/>`; break;
    case "rectangle": inner = `<rect x="6" y="30" width="98" height="50" rx="6" fill="${color}"/>`; break;
    case "triangle":  inner = `<polygon points="55,10 102,96 8,96" fill="${color}"/>`; break;
    case "diamond":   inner = `<polygon points="55,6 102,55 55,104 8,55" fill="${color}"/>`; break;
    case "pentagon":  inner = `<polygon points="${polyPoints(5)}" fill="${color}"/>`; break;
    case "hexagon":   inner = `<polygon points="${polyPoints(6)}" fill="${color}"/>`; break;
    case "octagon":   inner = `<polygon points="${polyPoints(8, 45, 55, 55, -Math.PI / 8)}" fill="${color}"/>`; break;
    case "star":      inner = `<polygon points="${starPoints()}" fill="${color}"/>`; break;
    case "heart":     inner = `<path d="M55 96 C25 71 8 51 14 31 C19 15 42 13 55 32 C68 13 91 15 96 31 C102 51 85 71 55 96 Z" fill="${color}"/>`; break;
  }
  return `<svg width="${size}" height="${size}" viewBox="0 0 110 110" aria-hidden="true">${inner}</svg>`;
}

const COLOR_DEFS = {
  red: "#e74c3c", blue: "#3498db", yellow: "#f1c40f", green: "#2ecc71",
  orange: "#e67e22", purple: "#9b59b6", pink: "#ff7ab8", brown: "#8d5a2b",
  black: "#333333", white: "#ffffff", gray: "#95a5a6",
};
const COLOR_THINGS = [
  { t: "a banana", e: "🍌", c: "yellow" }, { t: "a frog", e: "🐸", c: "green" },
  { t: "a strawberry", e: "🍓", c: "red" }, { t: "a carrot", e: "🥕", c: "orange" },
  { t: "grapes", e: "🍇", c: "purple" }, { t: "a pig", e: "🐷", c: "pink" },
  { t: "snow", e: "☃️", c: "white" }, { t: "chocolate", e: "🍫", c: "brown" },
  { t: "the ocean", e: "🌊", c: "blue" }, { t: "a fire truck", e: "🚒", c: "red" },
  { t: "the sun", e: "☀️", c: "yellow" }, { t: "grass", e: "🌱", c: "green" },
];
const COLOR_MIXES = [
  { a: "red", b: "yellow", out: "orange" },
  { a: "blue", b: "yellow", out: "green" },
  { a: "red", b: "blue", out: "purple" },
  { a: "red", b: "white", out: "pink" },
  { a: "black", b: "white", out: "gray" },
];
const swatch = (name, size = 54) =>
  `<span style="display:inline-block;width:${size}px;height:${size}px;border-radius:14px;background:${COLOR_DEFS[name]};border:3px solid #dfe5f0;vertical-align:middle;"></span>`;

const PATTERN_THEMES = [
  ["🍎", "🍌", "🍇", "🍊"], ["🐶", "🐱", "🐭", "🐸"], ["⭐", "🌙", "☀️", "☁️"],
  ["🚗", "🚌", "🚲", "🚁"], ["❤️", "💛", "💙", "💚"], ["⚽", "🏀", "🎾", "🏈"],
];
const PATTERNS_BY_DIFF = {
  1: ["ABAB", "ABABA"],
  2: ["AABB", "AABBA", "ABBABB"],
  3: ["ABC", "ABCAB", "ABCABC"],
  4: ["AAB", "ABB", "AABAAB", "ABBA"],
  5: ["ABCD", "ABAC", "ABCDAB", "AABC"],
};

const ODD_GROUPS = {
  fruits:   { name: "fruits", items: ["🍎", "🍌", "🍇", "🍓", "🍊", "🍉", "🍐"] },
  veggies:  { name: "vegetables", items: ["🥕", "🥦", "🌽", "🥔", "🍅", "🥒"] },
  animals:  { name: "land animals", items: ["🐶", "🐱", "🐭", "🐷", "🦁", "🐸", "🐰"] },
  sea:      { name: "sea creatures", items: ["🐟", "🐙", "🦀", "🐬", "🐳", "🦈"] },
  birds:    { name: "birds", items: ["🦉", "🦅", "🦜", "🐧", "🦆", "🐔"] },
  bugs:     { name: "bugs", items: ["🐝", "🐞", "🦋", "🐜", "🐛", "🦗"] },
  vehicles: { name: "things that go", items: ["🚗", "🚌", "🚒", "🚕", "🚲", "✈️", "🚂"] },
  clothes:  { name: "clothes", items: ["👕", "👗", "🧦", "👟", "🧢", "🧥"] },
  food:     { name: "yummy food", items: ["🍕", "🍔", "🌭", "🍝", "🥪", "🍩"] },
  sports:   { name: "sports balls", items: ["⚽", "🏀", "🎾", "⚾", "🏈", "🏐"] },
  space:    { name: "space things", items: ["🚀", "🛸", "🌙", "⭐", "🪐", "☄️"] },
  music:    { name: "instruments", items: ["🎸", "🥁", "🎹", "🎺", "🎻", "🪕"] },
};
// pairs that are tricky (same broad family) for higher difficulties
const ODD_NEAR = [
  ["fruits", "veggies"], ["animals", "sea"], ["animals", "birds"], ["birds", "bugs"],
  ["fruits", "food"], ["sea", "bugs"], ["vehicles", "space"],
];

const SCIENCE_BANK = [
  // d1 — animal sounds & basics
  { d: 1, q: "Which animal says MOO?", a: "🐮", wrong: ["🐱", "🐶", "🐔"], big: true },
  { d: 1, q: "Which animal says WOOF?", a: "🐶", wrong: ["🐮", "🐷", "🦆"], big: true },
  { d: 1, q: "Which animal says MEOW?", a: "🐱", wrong: ["🐶", "🐮", "🐸"], big: true },
  { d: 1, q: "Which animal says OINK?", a: "🐷", wrong: ["🐱", "🦁", "🐔"], big: true },
  { d: 1, q: "Which animal says QUACK?", a: "🦆", wrong: ["🐶", "🐮", "🐱"], big: true },
  { d: 1, q: "Which one can fly?", a: "🦅", wrong: ["🐟", "🐘", "🐢"], big: true },
  { d: 1, q: "Which one lives in water?", a: "🐟", wrong: ["🐶", "🐔", "🐰"], big: true },
  // d2 — habitats & homes
  { d: 2, q: "Where does a fish live?", a: "Water 🌊", wrong: ["A nest 🪺", "A cave 🕳️", "A tree 🌳"] },
  { d: 2, q: "Where does a bird lay its eggs?", a: "A nest 🪺", wrong: ["The ocean 🌊", "A car 🚗", "A shoe 👟"] },
  { d: 2, q: "Which animal loves to eat bananas?", a: "🐵", wrong: ["🐟", "🐮", "🐍"], big: true },
  { d: 2, q: "Which animal has a very long neck?", a: "🦒", wrong: ["🐭", "🐷", "🐸"], big: true },
  { d: 2, q: "Which one is a baby dog?", a: "Puppy 🐶", wrong: ["Kitten 🐱", "Chick 🐥", "Calf 🐮"] },
  { d: 2, q: "Which one is a baby cat?", a: "Kitten 🐱", wrong: ["Puppy 🐶", "Duckling 🦆", "Cub 🐻"] },
  { d: 2, q: "What do bees make?", a: "Honey 🍯", wrong: ["Milk 🥛", "Bread 🍞", "Juice 🧃"] },
  // d3 — nature & weather
  { d: 3, q: "What do plants need to grow?", a: "Sun and water ☀️💧", wrong: ["Candy 🍬", "Toys 🧸", "TV 📺"] },
  { d: 3, q: "What does a caterpillar turn into?", a: "A butterfly 🦋", wrong: ["A bird 🐦", "A frog 🐸", "A bee 🐝"] },
  { d: 3, q: "When it rains and the sun shines, you might see a...", a: "Rainbow 🌈", wrong: ["Snowman ☃️", "Tornado 🌪️", "Moon 🌙"] },
  { d: 3, q: "What season is the coldest?", a: "Winter ❄️", wrong: ["Summer ☀️", "Spring 🌸", "Fall 🍂"] },
  { d: 3, q: "Which one grows from a tiny seed?", a: "🌳", wrong: ["🚗", "🪨", "👟"], big: true },
  { d: 3, q: "What do cows give us to drink?", a: "Milk 🥛", wrong: ["Juice 🧃", "Soda 🥤", "Tea 🍵"] },
  { d: 3, q: "Frogs start life as...", a: "Tadpoles 🐸", wrong: ["Puppies 🐶", "Chicks 🐥", "Cubs 🐻"] },
  // d4 — body & food
  { d: 4, q: "What pumps blood around your body?", a: "Your heart ❤️", wrong: ["Your ears 👂", "Your hair 💇", "Your toes 🦶"] },
  { d: 4, q: "What do you use to smell?", a: "Your nose 👃", wrong: ["Your eyes 👀", "Your feet 🦶", "Your hands 🙌"] },
  { d: 4, q: "How many legs does a spider have?", a: "8", wrong: ["4", "6", "2"] },
  { d: 4, q: "How many legs does an insect have?", a: "6", wrong: ["8", "4", "10"] },
  { d: 4, q: "Which food helps make your bones strong?", a: "Milk 🥛", wrong: ["Candy 🍬", "Chips 🍟", "Soda 🥤"] },
  { d: 4, q: "What do you call an animal that only eats plants?", a: "A herbivore 🌿", wrong: ["A carnivore 🍖", "A robot 🤖", "A pilot ✈️"] },
  { d: 4, q: "Which body part helps you hear?", a: "Ears 👂", wrong: ["Nose 👃", "Knees 🦵", "Teeth 🦷"] },
  // d5 — space & big ideas
  { d: 5, q: "What is the closest star to Earth?", a: "The Sun ☀️", wrong: ["The Moon 🌙", "Mars 🔴", "A comet ☄️"] },
  { d: 5, q: "How many planets are in our solar system?", a: "8", wrong: ["5", "12", "3"] },
  { d: 5, q: "Which planet do we live on?", a: "Earth 🌍", wrong: ["Mars 🔴", "Jupiter 🟠", "The Moon 🌙"] },
  { d: 5, q: "Dinosaurs lived...", a: "A very, very long time ago 🦕", wrong: ["Last week 📅", "In the ocean today 🌊", "On the Moon 🌙"] },
  { d: 5, q: "What melts ice into water?", a: "Heat 🔥", wrong: ["Cold ❄️", "Music 🎵", "Wind 💨"] },
  { d: 5, q: "The biggest animal in the whole world is the...", a: "Blue whale 🐳", wrong: ["Elephant 🐘", "Giraffe 🦒", "T-Rex 🦖"] },
  { d: 5, q: "What do astronauts ride to space?", a: "A rocket 🚀", wrong: ["A bus 🚌", "A boat ⛵", "A bike 🚲"] },
];

const CLOCK_OCLOCK = ["🕛", "🕐", "🕑", "🕒", "🕓", "🕔", "🕕", "🕖", "🕗", "🕘", "🕙", "🕚"]; // index = hour % 12
const CLOCK_HALF = ["🕧", "🕜", "🕝", "🕞", "🕟", "🕠", "🕡", "🕢", "🕣", "🕤", "🕥", "🕦"];
const clockEmoji = (h, half) => (half ? CLOCK_HALF : CLOCK_OCLOCK)[h % 12];
const clockLabel = (h, half) => (half ? `half past ${h}` : `${h} o'clock`);

const MEMORY_POOL = ["🐶", "🐱", "🦊", "🐼", "🐸", "🦁", "🐷", "🐵", "🦄", "🐙", "🦋", "🐞", "⭐", "🌈", "🍎", "🍌", "🍕", "🎈", "🚗", "🚀", "⚽", "🎁", "👑", "🐳"];

/* ------------------------------------------------------------
   Games registry
------------------------------------------------------------ */
const GAMES = [
  { id: "math",     name: "Math Blast",      icon: "➕", tag: "MATH",    tagColor: "#3fa7ff" },
  { id: "counting", name: "Count Critters",  icon: "🔢", tag: "MATH",    tagColor: "#3fa7ff" },
  { id: "letters",  name: "Letter Land",     icon: "🔤", tag: "READ",    tagColor: "#8f6bff" },
  { id: "words",    name: "Word Wizard",     icon: "📖", tag: "READ",    tagColor: "#8f6bff" },
  { id: "spelling", name: "Spelling Bee",    icon: "🐝", tag: "READ",    tagColor: "#8f6bff" },
  { id: "shapes",   name: "Shape Detective", icon: "🔷", tag: "LOGIC",   tagColor: "#ff9f43" },
  { id: "patterns", name: "Pattern Train",   icon: "🚂", tag: "LOGIC",   tagColor: "#ff9f43" },
  { id: "memory",   name: "Memory Match",    icon: "🃏", tag: "BRAIN",   tagColor: "#3ec96f" },
  { id: "colors",   name: "Color Lab",       icon: "🎨", tag: "ART",     tagColor: "#ff7ab8" },
  { id: "logic",    name: "Odd One Out",     icon: "🦉", tag: "LOGIC",   tagColor: "#ff9f43" },
  { id: "time",     name: "Clock Town",      icon: "🕐", tag: "MATH",    tagColor: "#3fa7ff" },
  { id: "science",  name: "Wonder World",    icon: "🌍", tag: "SCIENCE", tagColor: "#3ec96f" },
];
const gameById = (id) => GAMES.find((g) => g.id === id);

/* ------------------------------------------------------------
   Stickers & badges
------------------------------------------------------------ */
const RARITIES = {
  cool:  { label: "COOL",  color: "#3ec96f" },
  rare:  { label: "RARE",  color: "#3fa7ff" },
  super: { label: "SUPER", color: "#8f6bff" },
  epic:  { label: "EPIC",  color: "#f7b500" },
};
const STICKERS = [
  { id: "lolly",    e: "🍭", name: "Lolly",       cost: 20,  r: "cool" },
  { id: "balloon",  e: "🎈", name: "Balloon",     cost: 25,  r: "cool" },
  { id: "teddy",    e: "🧸", name: "Teddy",       cost: 30,  r: "cool" },
  { id: "icecream", e: "🍦", name: "Ice Cream",   cost: 35,  r: "cool" },
  { id: "ball",     e: "⚽", name: "Super Ball",  cost: 40,  r: "cool" },
  { id: "kite",     e: "🪁", name: "Sky Kite",    cost: 45,  r: "cool" },
  { id: "turtle",   e: "🐢", name: "Turbo Turtle",cost: 60,  r: "rare" },
  { id: "parrot",   e: "🦜", name: "Pirate Parrot",cost: 70, r: "rare" },
  { id: "scooter",  e: "🛴", name: "Scooter",     cost: 80,  r: "rare" },
  { id: "guitar",   e: "🎸", name: "Rock Guitar", cost: 95,  r: "rare" },
  { id: "dolphin",  e: "🐬", name: "Dolphin",     cost: 110, r: "rare" },
  { id: "castle",   e: "🏰", name: "Castle",      cost: 120, r: "rare" },
  { id: "trex",     e: "🦖", name: "T-Rex",       cost: 150, r: "super" },
  { id: "heli",     e: "🚁", name: "Helicopter",  cost: 170, r: "super" },
  { id: "mermaid",  e: "🧜", name: "Mermaid",     cost: 190, r: "super" },
  { id: "peacock",  e: "🦚", name: "Peacock",     cost: 210, r: "super" },
  { id: "ufo",      e: "🛸", name: "UFO",         cost: 230, r: "super" },
  { id: "rainbow",  e: "🌈", name: "Rainbow",     cost: 250, r: "super" },
  { id: "rocket",   e: "🚀", name: "Mega Rocket", cost: 300, r: "epic" },
  { id: "unicorn",  e: "🦄", name: "Unicorn",     cost: 350, r: "epic" },
  { id: "dragon",   e: "🐉", name: "Dragon",      cost: 400, r: "epic" },
  { id: "crown",    e: "👑", name: "Royal Crown", cost: 450, r: "epic" },
  { id: "trophy",   e: "🏆", name: "Gold Trophy", cost: 500, r: "epic" },
  { id: "megastar", e: "🌟", name: "Mega Star",   cost: 600, r: "epic" },
];

const BADGES = [
  { id: "first",     e: "🌱", name: "First Steps",    desc: "Get your very first answer right",  check: (s) => s.stats.totalCorrect >= 1 },
  { id: "c25",       e: "🎈", name: "Rising Star",    desc: "25 correct answers",                check: (s) => s.stats.totalCorrect >= 25 },
  { id: "c100",      e: "💯", name: "Century Club",   desc: "100 correct answers",               check: (s) => s.stats.totalCorrect >= 100 },
  { id: "c500",      e: "🌟", name: "Super Scholar",  desc: "500 correct answers",               check: (s) => s.stats.totalCorrect >= 500 },
  { id: "c1000",     e: "🏵️", name: "Brain-a-thon",   desc: "1000 correct answers",              check: (s) => s.stats.totalCorrect >= 1000 },
  { id: "streak5",   e: "🔥", name: "On Fire",        desc: "5 right in a row",                  check: (s) => s.stats.bestStreak >= 5 },
  { id: "streak10",  e: "⚡", name: "Unstoppable",    desc: "10 right in a row",                 check: (s) => s.stats.bestStreak >= 10 },
  { id: "streak20",  e: "🌋", name: "Volcano Brain",  desc: "20 right in a row",                 check: (s) => s.stats.bestStreak >= 20 },
  { id: "lvl5",      e: "🎒", name: "Level 5",        desc: "Reach level 5",                     check: (s) => levelFromXp(s.xp).level >= 5 },
  { id: "lvl10",     e: "🚀", name: "Level 10",       desc: "Reach level 10",                    check: (s) => levelFromXp(s.xp).level >= 10 },
  { id: "lvl20",     e: "👑", name: "Level 20",       desc: "Reach level 20",                    check: (s) => levelFromXp(s.xp).level >= 20 },
  { id: "allgames",  e: "🎪", name: "Tried It All",   desc: "Play every single game",            check: (s) => GAMES.every((g) => (s.stats.gamesPlayed[g.id] || 0) > 0) },
  { id: "master1",   e: "🎓", name: "Skill Master",   desc: "Max out one skill (5 stars)",       check: (s) => Object.values(s.skills).some((k) => k.diff >= 5) },
  { id: "master5",   e: "🧠", name: "Mega Mind",      desc: "Max out five skills",               check: (s) => Object.values(s.skills).filter((k) => k.diff >= 5).length >= 5 },
  { id: "rich",      e: "💰", name: "Coin Collector", desc: "Earn 300 coins in total",           check: (s) => s.stats.coinsEarned >= 300 },
  { id: "shop1",     e: "🛍️", name: "First Prize",    desc: "Buy your first sticker",            check: (s) => s.stickers.length >= 1 },
  { id: "shop10",    e: "🎁", name: "Collector",      desc: "Own 10 stickers",                   check: (s) => s.stickers.length >= 10 },
  { id: "shopall",   e: "🗃️", name: "Museum Curator", desc: "Own every sticker",                 check: (s) => s.stickers.length >= STICKERS.length },
  { id: "days3",     e: "📅", name: "3-Day Streak",   desc: "Play 3 days in a row",              check: (s) => s.dayStreak >= 3 },
  { id: "days7",     e: "🗓️", name: "Week Warrior",   desc: "Play 7 days in a row",              check: (s) => s.dayStreak >= 7 },
  { id: "quest1",    e: "📜", name: "Quest Starter",  desc: "Complete your first daily quest",   check: (s) => s.stats.questsClaimed >= 1 },
  { id: "quest10",   e: "🏅", name: "Quest Hero",     desc: "Complete 10 daily quests",          check: (s) => s.stats.questsClaimed >= 10 },
  { id: "memperfect",e: "🃏", name: "Photo Memory",   desc: "Perfect Memory Match, no mistakes", check: (s) => s.stats.memoryPerfect >= 1 },
];

/* ------------------------------------------------------------
   Daily quests
------------------------------------------------------------ */
const QUEST_TEMPLATES = [
  { tid: "correct15", icon: "✅", desc: "Get 15 answers right",       target: 15,  counter: "correct",     reward: 30 },
  { tid: "games3",    icon: "🎮", desc: "Play 3 different games",     target: 3,   counter: "modes",       reward: 25 },
  { tid: "streak5",   icon: "🔥", desc: "Get 5 right in a row",       target: 5,   counter: "maxStreak",   reward: 30 },
  { tid: "coins40",   icon: "🪙", desc: "Earn 40 coins",              target: 40,  counter: "coins",       reward: 25 },
  { tid: "math10",    icon: "➕", desc: "Get 10 math answers right",  target: 10,  counter: "mathCorrect", reward: 30 },
  { tid: "read8",     icon: "📖", desc: "Get 8 reading answers right",target: 8,   counter: "readCorrect", reward: 30 },
  { tid: "memory1",   icon: "🃏", desc: "Finish a Memory Match board",target: 1,   counter: "memoryDone",  reward: 25 },
  { tid: "xp150",     icon: "💜", desc: "Earn 150 XP",                target: 150, counter: "xp",          reward: 35 },
];

/* ------------------------------------------------------------
   Sparky the robot tutor — voice lines
------------------------------------------------------------ */
const SPARKY = {
  praise: [
    "Awesome job! 🎉", "You're a superstar! ⭐", "Wowee! Big brain! 🧠", "High five! ✋",
    "That was amazing! 🚀", "You got it! 💪", "Super duper! 🌈", "Beep boop — CORRECT! 🤖",
  ],
  encourage: [
    "Good try! You'll get the next one! 💪", "Almost! Keep going! 🌱", "Oops! Everyone makes mistakes — even robots! 🤖",
    "Don't give up! You're learning! 🌟", "Try again, champ! 🎈",
  ],
  harder: [
    "You're SO good — let's make it trickier! 🔼⭐", "Level up! Harder questions coming! 🚀", "Challenge mode: ON! 💪",
  ],
  easier: [
    "Let's practice this one a bit more! 🌱", "No worries — we'll take it step by step! 🐾",
  ],
  welcome: [
    "Ready to play and learn? 🎮", "What shall we explore today? 🗺️", "Beep boop! Let's power up that brain! 🧠",
    "Hello, friend! Pick a game! 🌟",
  ],
};

/* ------------------------------------------------------------
   State
------------------------------------------------------------ */
const SAVE_KEY = "brainquest.v1";

function freshSkills() {
  const sk = {};
  GAMES.forEach((g) => { sk[g.id] = { diff: 1, streak: 0, wrongStreak: 0, correct: 0, answered: 0 }; });
  return sk;
}
function freshDaily(dateStr) {
  const seed = dateHash(dateStr);
  const idxs = [];
  let i = 0;
  while (idxs.length < 3) {
    const idx = (seed + i * 7 + Math.floor(seed / (idxs.length + 3))) % QUEST_TEMPLATES.length;
    if (!idxs.includes(idx)) idxs.push(idx);
    i++;
  }
  return {
    date: dateStr,
    quests: idxs.map((x) => ({ tid: QUEST_TEMPLATES[x].tid, claimed: false })),
    counters: { correct: 0, coins: 0, xp: 0, maxStreak: 0, mathCorrect: 0, readCorrect: 0, memoryDone: 0, modesList: [] },
  };
}
function defaultState() {
  return {
    onboarded: false,
    name: "Explorer",
    avatar: "🦊",
    xp: 0,
    coins: 0,
    stickers: [],
    badges: {},
    skills: freshSkills(),
    daily: freshDaily(todayStr()),
    dayStreak: 0,
    lastDay: null,
    stats: {
      totalCorrect: 0, totalAnswered: 0, bestStreak: 0, coinsEarned: 0,
      questsClaimed: 0, memoryPerfect: 0, playSeconds: 0, gamesPlayed: {},
    },
    settings: { sound: true, speech: true, breakEvery: 20, minDiff: 1 },
  };
}
let state = defaultState();

function save() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) { /* storage full/blocked */ }
}
function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    state = Object.assign(defaultState(), data);
    state.stats = Object.assign(defaultState().stats, data.stats || {});
    state.settings = Object.assign(defaultState().settings, data.settings || {});
    state.skills = Object.assign(freshSkills(), data.skills || {});
  } catch (e) { state = defaultState(); }
}

/* Level math: XP needed to go from level L to L+1 grows gently. */
function xpToNext(level) { return 100 + (level - 1) * 50; }
function levelFromXp(xp) {
  let level = 1, rem = xp;
  while (rem >= xpToNext(level) && level < 60) { rem -= xpToNext(level); level++; }
  return { level, into: rem, need: xpToNext(level) };
}
const levelTitle = (level) => LEVEL_TITLES[Math.min(LEVEL_TITLES.length - 1, Math.floor((level - 1) / 2))];

/* Daily rollover + day streak */
function ensureDaily() {
  const t = todayStr();
  if (state.daily.date !== t) state.daily = freshDaily(t);
  if (state.lastDay !== t) {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    const yStr = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, "0")}-${String(y.getDate()).padStart(2, "0")}`;
    state.dayStreak = state.lastDay === yStr ? state.dayStreak + 1 : 1;
    state.lastDay = t;
    save();
  }
}

/* ------------------------------------------------------------
   Audio: tiny synth SFX + speech
------------------------------------------------------------ */
let audioCtx = null;
function ac() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; }
  }
  if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}
function tone(freq, start, dur, type = "sine", vol = 0.18) {
  const ctx = ac();
  if (!ctx || !state.settings.sound) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, ctx.currentTime + start);
  g.gain.exponentialRampToValueAtTime(vol, ctx.currentTime + start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
  o.connect(g).connect(ctx.destination);
  o.start(ctx.currentTime + start);
  o.stop(ctx.currentTime + start + dur + 0.05);
}
const sfx = {
  correct: () => { tone(523, 0, 0.12, "triangle"); tone(659, 0.1, 0.12, "triangle"); tone(784, 0.2, 0.2, "triangle"); },
  wrong:   () => { tone(220, 0, 0.18, "sawtooth", 0.08); tone(180, 0.15, 0.25, "sawtooth", 0.08); },
  coin:    () => { tone(988, 0, 0.08, "square", 0.08); tone(1319, 0.07, 0.15, "square", 0.08); },
  click:   () => { tone(600, 0, 0.05, "triangle", 0.1); },
  flip:    () => { tone(440, 0, 0.06, "triangle", 0.1); },
  level:   () => { [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.12, 0.25, "triangle")); },
  quest:   () => { tone(659, 0, 0.12, "triangle"); tone(880, 0.12, 0.2, "triangle"); },
};

function speak(text, force = false) {
  if (!state.settings.speech && !force) return;
  if (!("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, ""));
    u.rate = 0.92;
    u.pitch = 1.15;
    u.lang = "en-US";
    window.speechSynthesis.speak(u);
  } catch (e) { /* no speech available */ }
}

/* ------------------------------------------------------------
   Sparky
------------------------------------------------------------ */
let sparkyTimer = null;
function sparkySay(text, sayAloud = false) {
  const bubble = $("#sparky-bubble");
  bubble.textContent = text;
  bubble.classList.add("show");
  if (sayAloud) speak(text);
  clearTimeout(sparkyTimer);
  sparkyTimer = setTimeout(() => bubble.classList.remove("show"), 5000);
}

/* ------------------------------------------------------------
   Confetti
------------------------------------------------------------ */
function confettiBurst(count = 120) {
  const canvas = $("#confetti");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const colors = ["#ff6b6b", "#f7b500", "#3ec96f", "#3fa7ff", "#8f6bff", "#ff7ab8"];
  const parts = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height * 0.4,
    w: 6 + Math.random() * 8,
    h: 8 + Math.random() * 8,
    c: pick(colors),
    vy: 2.5 + Math.random() * 3.5,
    vx: -1.5 + Math.random() * 3,
    rot: Math.random() * Math.PI,
    vr: -0.12 + Math.random() * 0.24,
  }));
  const t0 = performance.now();
  function frame(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    parts.forEach((p) => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    if (t - t0 < 2800) requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  requestAnimationFrame(frame);
}

function floatUp(text, x, y, color) {
  const el = document.createElement("div");
  el.className = "floatup";
  el.textContent = text;
  if (color) el.style.color = color;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1100);
}

/* ------------------------------------------------------------
   HUD + navigation
------------------------------------------------------------ */
const SCREENS = ["onboarding", "home", "game", "shop", "collection", "quests", "parent"];
let currentScreen = "onboarding";

function showScreen(id) {
  SCREENS.forEach((s) => $(`#screen-${s}`).classList.toggle("hidden", s !== id));
  currentScreen = id;
  ["home", "quests", "shop", "collection", "parent"].forEach((s) => {
    const btn = $(`#nav-${s}`);
    if (btn) btn.classList.toggle("active", s === id);
  });
  window.scrollTo({ top: 0 });
}

function renderHUD() {
  const lv = levelFromXp(state.xp);
  $("#hud-avatar").textContent = state.avatar;
  $("#hud-name").textContent = state.name;
  $("#hud-title").textContent = levelTitle(lv.level);
  $("#hud-level").textContent = `Lv ${lv.level}`;
  $("#hud-xpfill").style.width = `${Math.round((lv.into / lv.need) * 100)}%`;
  $("#hud-coin-count").textContent = state.coins;
  $("#hud-streak-count").textContent = state.dayStreak;
}

/* ------------------------------------------------------------
   Rewards engine
------------------------------------------------------------ */
let answerStreak = 0; // session-wide answer streak

function grantXpCoins(xpGain, coinGain, anchorEl) {
  const before = levelFromXp(state.xp).level;
  state.xp += xpGain;
  state.coins += coinGain;
  state.stats.coinsEarned += coinGain;
  state.daily.counters.xp += xpGain;
  state.daily.counters.coins += coinGain;

  if (anchorEl) {
    const r = anchorEl.getBoundingClientRect();
    floatUp(`+${xpGain} XP`, r.left + r.width / 2 - 30, r.top - 8);
    setTimeout(() => floatUp(`+${coinGain} 🪙`, r.left + r.width / 2 + 10, r.top - 8, "#c98f00"), 180);
  }
  const after = levelFromXp(state.xp).level;
  renderHUD();
  if (after > before) {
    setTimeout(() => showLevelUp(after), 650);
  }
  checkBadges();
  save();
}

function checkBadges() {
  const newly = [];
  BADGES.forEach((b) => {
    if (!state.badges[b.id] && b.check(state)) {
      state.badges[b.id] = true;
      newly.push(b);
    }
  });
  if (newly.length) {
    save();
    // celebrate the first new badge (queue-free simplicity)
    const b = newly[0];
    setTimeout(() => {
      sfx.quest();
      sparkySay(`New badge: ${b.name}! ${b.e}`, true);
    }, 1200);
  }
}

function showLevelUp(level) {
  sfx.level();
  confettiBurst(160);
  const box = document.createElement("div");
  box.className = "overlay";
  box.innerHTML = `
    <div class="box">
      <div class="huge">🎉</div>
      <h2>LEVEL UP!</h2>
      <p style="font-size:1.3rem;font-weight:800;margin:6px 0;">You reached <span style="color:var(--purple)">Level ${level}</span></p>
      <p style="font-weight:700;color:var(--ink-soft);">You are now a<br><span style="font-size:1.25rem;color:var(--ink)">${levelTitle(level)}</span></p>
      <button class="bigbtn" id="lvl-ok">Keep Going! 🚀</button>
    </div>`;
  $("#overlays").appendChild(box);
  speak(`Level up! You reached level ${level}!`);
  box.querySelector("#lvl-ok").addEventListener("click", () => box.remove());
}

/* Quest counters ------------------------------------------------ */
function questCounterValue(q) {
  const c = state.daily.counters;
  if (q.counter === "modes") return c.modesList.length;
  return c[q.counter] || 0;
}
function bumpQuestCounters(mode, wasCorrect, xpGain, coinGain) {
  const c = state.daily.counters;
  if (wasCorrect) {
    c.correct++;
    if (mode === "math" || mode === "counting" || mode === "time") c.mathCorrect++;
    if (mode === "letters" || mode === "words" || mode === "spelling") c.readCorrect++;
  }
  if (!c.modesList.includes(mode)) c.modesList.push(mode);
  c.maxStreak = Math.max(c.maxStreak, answerStreak);
}

/* ------------------------------------------------------------
   Adaptive difficulty — the "AI tutor" brain
------------------------------------------------------------ */
const diffFloor = () => Math.max(1, state.settings.minDiff || 1);
function applyMinDiff() {
  GAMES.forEach((g) => { state.skills[g.id].diff = Math.max(state.skills[g.id].diff, diffFloor()); });
}

function adaptSkill(mode, wasCorrect) {
  const sk = state.skills[mode];
  sk.answered++;
  if (wasCorrect) {
    sk.correct++;
    sk.streak++;
    sk.wrongStreak = 0;
    if (sk.streak >= 3 && sk.diff < 5) {
      sk.diff++;
      sk.streak = 0;
      sparkySay(pick(SPARKY.harder), true);
    }
  } else {
    sk.streak = 0;
    sk.wrongStreak++;
    if (sk.wrongStreak >= 2 && sk.diff > diffFloor()) {
      sk.diff--;
      sk.wrongStreak = 0;
      sparkySay(pick(SPARKY.easier));
    }
  }
}

/* ------------------------------------------------------------
   Question generators (multiple choice)
   Each returns: { prompt, spoken, visual, choices[], answerIndex,
                   big (large emoji choices), key (repeat-guard) }
------------------------------------------------------------ */

function numberChoices(answer, spread, count) {
  const set = new Set([answer]);
  let guard = 0;
  while (set.size < count && guard++ < 60) {
    const delta = randInt(1, spread);
    const v = Math.random() < 0.5 ? answer - delta : answer + delta;
    if (v >= 0) set.add(v);
  }
  const choices = shuffle([...set]);
  return { choices: choices.map(String), answerIndex: choices.indexOf(answer) };
}

function genMath(diff) {
  let a, b, op, answer, prompt, visual = "", spoken;
  const type = (() => {
    if (diff === 1) return "add";
    if (diff === 2) return pick(["add", "add", "sub"]);
    if (diff === 3) return pick(["add", "sub", "missing"]);
    if (diff === 4) return pick(["add", "sub", "missing", "mult"]);
    return pick(["add", "sub", "missing", "double", "mult", "mult"]);
  })();

  if (type === "add") {
    const max = { 1: 5, 2: 10, 3: 20, 4: 50, 5: 100 }[diff];
    a = randInt(1, Math.max(1, max - 2)); b = randInt(1, max - a);
    answer = a + b;
    prompt = `${a} + ${b} = ?`;
    spoken = `What is ${a} plus ${b}?`;
    if (diff <= 2) {
      const em = pick(CRITTERS);
      visual = `<div class="q-visual small">${em.repeat(a)} &nbsp;➕&nbsp; ${em.repeat(b)}</div>`;
    }
  } else if (type === "sub") {
    const max = { 2: 5, 3: 10, 4: 20, 5: 50 }[diff] || 10;
    a = randInt(2, max); b = randInt(1, a - 1);
    answer = a - b;
    prompt = `${a} − ${b} = ?`;
    spoken = `What is ${a} minus ${b}?`;
    if (diff <= 3) {
      const em = pick(CRITTERS);
      visual = `<div class="q-visual small">${em.repeat(a)}<br><span style="font-size:0.8em;color:var(--ink-soft)">take away ${b}</span></div>`;
    }
  } else if (type === "missing") {
    const max = { 3: 8, 4: 12, 5: 20 }[diff] || 10;
    a = randInt(1, max - 1); answer = randInt(1, max - a);
    prompt = `${a} + ❓ = ${a + answer}`;
    spoken = `${a} plus what makes ${a + answer}?`;
  } else if (type === "mult") {
    if (diff === 4) { b = pick([2, 5, 10]); a = randInt(1, 5); }
    else { b = randInt(2, 10); a = randInt(2, 10); }
    answer = a * b;
    prompt = `${a} × ${b} = ?`;
    spoken = `What is ${a} times ${b}?`;
    if (diff === 4) {
      const em = pick(CRITTERS);
      visual = `<div class="q-visual small">${Array.from({ length: a }, () => em.repeat(b)).join("<br>")}</div>`;
    }
  } else { // double
    a = randInt(2, 12);
    answer = a * 2;
    prompt = `Double ${a} = ?`;
    spoken = `What is double ${a}?`;
  }
  const spread = diff <= 2 ? 2 : diff === 3 ? 3 : 6;
  const mc = numberChoices(answer, spread, diff === 1 ? 3 : 4);
  return { prompt, spoken, visual, choices: mc.choices, answerIndex: mc.answerIndex, key: `math:${prompt}` };
}

function genCounting(diff) {
  const max = { 1: 5, 2: 10, 3: 15, 4: 20, 5: 25 }[diff];
  const n = randInt(Math.max(1, max - 7), max);
  const mixed = diff >= 3;
  let items = "";
  if (mixed) {
    const kinds = pickN(CRITTERS, 2);
    for (let i = 0; i < n; i++) items += pick(kinds);
  } else {
    items = pick(CRITTERS).repeat(n);
  }
  const mc = numberChoices(n, diff <= 2 ? 2 : 1, diff === 1 ? 3 : 4);
  return {
    prompt: "How many can you count?",
    spoken: "How many can you count?",
    visual: `<div class="q-visual ${n > 12 ? "small" : ""}">${items}</div>`,
    choices: mc.choices, answerIndex: mc.answerIndex, key: `count:${n}:${items[0] || ""}`,
  };
}

function genLetters(diff) {
  const item = pick(PHONICS);
  let prompt, spoken, visual = "", choices, answer, big = true;
  if (diff === 1) {
    prompt = `Find the letter ${item.l}`;
    spoken = `Find the letter ${item.l}`;
    answer = item.l;
    choices = shuffle([item.l, ...pickN(PHONICS.filter((p) => p.l !== item.l), 2).map((p) => p.l)]);
  } else if (diff === 2) {
    prompt = `Which is the little (lowercase) "${item.l.toLowerCase()}"?`;
    spoken = `Find the lowercase letter ${item.l}`;
    visual = `<div class="q-visual">${item.l}</div>`;
    answer = item.l.toLowerCase();
    choices = shuffle([answer, ...pickN(PHONICS.filter((p) => p.l !== item.l), 3).map((p) => p.l.toLowerCase())]);
  } else if (diff === 3) {
    prompt = `What letter does "${item.w}" start with?`;
    spoken = `What letter does ${item.w} start with?`;
    visual = `<div class="q-visual">${item.e}</div>`;
    answer = item.l;
    choices = shuffle([answer, ...pickN(PHONICS.filter((p) => p.l !== item.l), 3).map((p) => p.l)]);
  } else if (diff === 4) {
    const w = item.w;
    const last = w[w.length - 1].toUpperCase();
    prompt = `What letter does "${w}" END with?`;
    spoken = `What letter does ${w} end with?`;
    visual = `<div class="q-visual">${item.e}</div>`;
    answer = last;
    const others = pickN([..."ABCDEFGHIJKLMNOPRSTUW"].filter((l) => l !== last), 3);
    choices = shuffle([answer, ...others]);
  } else {
    const isVowelQ = Math.random() < 0.6;
    if (isVowelQ) {
      prompt = "Which letter is a VOWEL?";
      spoken = "Which of these letters is a vowel? A, E, I, O and U are vowels.";
      answer = pick(VOWELS);
      const cons = pickN([..."BCDFGHJKLMNPRSTVWZ"], 3);
      choices = shuffle([answer, ...cons]);
    } else {
      prompt = "Which letter is NOT a vowel?";
      spoken = "Which of these letters is not a vowel?";
      answer = pick([..."BCDFGHJKLMNPRSTVWZ"]);
      choices = shuffle([answer, ...pickN(VOWELS, 3)]);
    }
  }
  return { prompt, spoken, visual, choices, answerIndex: choices.indexOf(answer), big, key: `let:${prompt}` };
}

function genWords(diff) {
  const useList = SIGHT_WORDS[diff];
  if (diff >= 2 && Math.random() < 0.45) {
    // picture → word
    const pool = spellPool(Math.min(diff, 4));
    const item = pick(pool);
    const others = pickN(pool.filter((x) => x.w !== item.w), 3).map((x) => x.w);
    const choices = shuffle([item.w, ...others]);
    return {
      prompt: "Which word matches the picture?",
      spoken: `Which word says ${item.w}?`,
      visual: `<div class="q-visual">${item.e}</div>`,
      choices, answerIndex: choices.indexOf(item.w), key: `word:pic:${item.w}`,
    };
  }
  const target = pick(useList);
  const others = pickN(useList.filter((w) => w !== target), Math.min(3, useList.length - 1));
  const choices = shuffle([target, ...others]);
  return {
    prompt: `Find the word: 🔊 "${target}"`,
    spoken: `Find the word: ${target}. ${target}!`,
    visual: "",
    choices, answerIndex: choices.indexOf(target), key: `word:${target}`,
  };
}

function genShapes(diff) {
  if (diff === 5 && Math.random() < 0.4) {
    const withSides = SHAPES_BY_DIFF[5].filter((s) => SHAPES[s].sides > 0);
    const shape = pick(withSides);
    const answer = SHAPES[shape].sides;
    const mc = numberChoices(answer, 2, 4);
    return {
      prompt: `How many sides does a ${shape} have?`,
      spoken: `How many sides does a ${shape} have?`,
      visual: `<div class="q-visual">${shapeSVG(shape, pick(SHAPE_COLORS))}</div>`,
      choices: mc.choices, answerIndex: mc.answerIndex, key: `shape:sides:${shape}`,
    };
  }
  const pool = SHAPES_BY_DIFF[diff];
  const shape = pick(pool);
  const others = pickN(pool.filter((s) => s !== shape), Math.min(3, pool.length - 1));
  const choices = shuffle([shape, ...others]);
  return {
    prompt: "What shape is this?",
    spoken: "What shape is this?",
    visual: `<div class="q-visual">${shapeSVG(shape, pick(SHAPE_COLORS))}</div>`,
    choices, answerIndex: choices.indexOf(shape), key: `shape:${shape}`,
  };
}

function genPatterns(diff) {
  const tpl = pick(PATTERNS_BY_DIFF[diff]);
  const theme = pick(PATTERN_THEMES);
  const letters = [...new Set(tpl.split(""))];
  const map = {};
  const picked = pickN(theme, letters.length);
  letters.forEach((l, i) => { map[l] = picked[i]; });
  // repeat the template so the visible run is at least 5 long, then hide the next one
  let seq = tpl;
  while (seq.length < 6) seq += tpl;
  const shown = seq.slice(0, 5).split("").map((l) => map[l]);
  const nextEmoji = map[seq[5]];
  const distractors = picked.filter((e) => e !== nextEmoji);
  while (distractors.length < 3) {
    const extra = pick(theme.concat(pick(PATTERN_THEMES)));
    if (extra !== nextEmoji && !distractors.includes(extra)) distractors.push(extra);
  }
  const choices = shuffle([nextEmoji, ...distractors.slice(0, 3)]);
  return {
    prompt: "What comes next?",
    spoken: "Look at the pattern. What comes next?",
    visual: `<div class="q-visual">${shown.join(" ")} <span style="opacity:.45">❓</span></div>`,
    choices, answerIndex: choices.indexOf(nextEmoji), big: true, key: `pat:${tpl}:${picked.join("")}`,
  };
}

function genColors(diff) {
  if (diff === 1 || (diff === 2 && Math.random() < 0.4)) {
    const names = diff === 1 ? ["red", "blue", "yellow", "green"] : Object.keys(COLOR_DEFS);
    const color = pick(names);
    const others = pickN(names.filter((c) => c !== color), 3);
    const choices = shuffle([color, ...others]);
    return {
      prompt: "What color is this?",
      spoken: "What color is this?",
      visual: `<div class="q-visual">${swatch(color, 84)}</div>`,
      choices, answerIndex: choices.indexOf(color), key: `col:${color}`,
    };
  }
  if (diff === 2 || (diff === 3 && Math.random() < 0.4)) {
    const item = pick(COLOR_THINGS);
    const others = pickN(Object.keys(COLOR_DEFS).filter((c) => c !== item.c), 3);
    const choices = shuffle([item.c, ...others]);
    return {
      prompt: `What color is ${item.t}?`,
      spoken: `What color is ${item.t}?`,
      visual: `<div class="q-visual">${item.e}</div>`,
      choices, answerIndex: choices.indexOf(item.c), key: `col:thing:${item.t}`,
    };
  }
  if (diff <= 4 ? Math.random() < 0.65 : Math.random() < 0.4) {
    const mix = pick(COLOR_MIXES);
    const others = pickN(Object.keys(COLOR_DEFS).filter((c) => c !== mix.out), 3);
    const choices = shuffle([mix.out, ...others]);
    return {
      prompt: `${mix.a} + ${mix.b} makes...?`,
      spoken: `What color do you get when you mix ${mix.a} and ${mix.b}?`,
      visual: `<div class="q-visual">${swatch(mix.a, 64)} ➕ ${swatch(mix.b, 64)} = ❓</div>`,
      choices, answerIndex: choices.indexOf(mix.out), key: `mix:${mix.a}${mix.b}`,
    };
  }
  // reverse mixing
  const mix = pick(COLOR_MIXES);
  const answerLabel = `${mix.a} + ${mix.b}`;
  const wrongPairs = [];
  const names = Object.keys(COLOR_DEFS);
  let guard = 0;
  while (wrongPairs.length < 3 && guard++ < 60) {
    const p = `${pick(names)} + ${pick(names)}`;
    if (p !== answerLabel && !wrongPairs.includes(p)) wrongPairs.push(p);
  }
  const choices = shuffle([answerLabel, ...wrongPairs]);
  return {
    prompt: `Which two colors make ${mix.out}?`,
    spoken: `Which two colors mix together to make ${mix.out}?`,
    visual: `<div class="q-visual">${swatch(mix.out, 84)}</div>`,
    choices, answerIndex: choices.indexOf(answerLabel), key: `unmix:${mix.out}`,
  };
}

function genLogic(diff) {
  const keys = Object.keys(ODD_GROUPS);
  let mainKey, oddKey;
  if (diff >= 4 && Math.random() < 0.7) {
    const pair = pick(ODD_NEAR);
    [mainKey, oddKey] = shuffle(pair);
  } else {
    mainKey = pick(keys);
    oddKey = pick(keys.filter((k) => k !== mainKey && !ODD_NEAR.some((p) => p.includes(k) && p.includes(mainKey) && diff < 3)));
  }
  const main = ODD_GROUPS[mainKey];
  const odd = ODD_GROUPS[oddKey];
  const items = pickN(main.items, 3);
  const oddItem = pick(odd.items);
  const choices = shuffle([...items, oddItem]);
  return {
    prompt: "Which one does NOT belong?",
    spoken: "Look carefully. Which one does not belong with the others?",
    visual: "",
    choices, answerIndex: choices.indexOf(oddItem), big: true,
    explain: `${oddItem} is not one of the ${main.name}!`,
    key: `odd:${mainKey}:${oddItem}`,
  };
}

function genTime(diff) {
  const h = randInt(1, 12);
  const half = diff >= 3 && Math.random() < (diff >= 4 ? 0.55 : 0.4);
  if (diff === 5 && Math.random() < 0.45) {
    const later = (h % 12) + 1;
    const choices = shuffle([later, ...pickN([1,2,3,4,5,6,7,8,9,10,11,12].filter((x) => x !== later), 3)]).map((x) => `${x} o'clock`);
    return {
      prompt: `It is ${h} o'clock. What time will it be in 1 hour?`,
      spoken: `It is ${h} o'clock. What time will it be in one hour?`,
      visual: `<div class="q-visual">${clockEmoji(h, false)}</div>`,
      choices, answerIndex: choices.indexOf(`${later} o'clock`), key: `time:later:${h}`,
    };
  }
  const answer = clockLabel(h, half);
  const wrongs = new Set();
  let guard = 0;
  while (wrongs.size < 3 && guard++ < 40) {
    const wh = randInt(1, 12);
    const whalf = diff >= 3 ? Math.random() < 0.5 : false;
    const label = clockLabel(wh, whalf);
    if (label !== answer) wrongs.add(label);
  }
  const choices = shuffle([answer, ...wrongs]);
  return {
    prompt: "What time is it?",
    spoken: "Look at the clock. What time is it?",
    visual: `<div class="q-visual">${clockEmoji(h, half)}</div>`,
    choices, answerIndex: choices.indexOf(answer), key: `time:${h}:${half}`,
  };
}

function genScience(diff) {
  const pool = SCIENCE_BANK.filter((q) => q.d === diff);
  const item = pick(pool.length ? pool : SCIENCE_BANK);
  const choices = shuffle([item.a, ...item.wrong]);
  return {
    prompt: item.q,
    spoken: item.q,
    visual: item.v ? `<div class="q-visual">${item.v}</div>` : "",
    choices, answerIndex: choices.indexOf(item.a), big: !!item.big, key: `sci:${item.q}`,
  };
}

const GENERATORS = {
  math: genMath, counting: genCounting, letters: genLetters, words: genWords,
  shapes: genShapes, patterns: genPatterns, colors: genColors, logic: genLogic,
  time: genTime, science: genScience,
};

/* ------------------------------------------------------------
   Game screen — shared flow
------------------------------------------------------------ */
let gameMode = null;
let currentQ = null;
let lastQKey = "";
let locked = false;
let sessionCorrect = 0;

function starsFor(diff) { return "★".repeat(diff) + "☆".repeat(5 - diff); }

function openGame(mode) {
  gameMode = mode;
  sessionCorrect = 0;
  answerStreak = 0;
  state.stats.gamesPlayed[mode] = (state.stats.gamesPlayed[mode] || 0) + 1;
  if (!state.daily.counters.modesList.includes(mode)) state.daily.counters.modesList.push(mode);
  save();
  showScreen("game");
  renderGameShell();
  if (mode === "memory") startMemory();
  else if (mode === "spelling") nextSpelling();
  else nextQuestion();
}

function renderGameShell() {
  const g = gameById(gameMode);
  const sk = state.skills[gameMode];
  $("#screen-game").innerHTML = `
    <div class="game-head">
      <button class="backbtn" id="game-back">⬅ Back</button>
      <div class="gname">${g.icon} ${g.name}</div>
      <div class="gstars" id="game-stars" title="Difficulty">${starsFor(sk.diff)}</div>
      <div class="streak-flames" id="game-streak">🔥 0</div>
    </div>
    <div id="game-body"></div>`;
  $("#game-back").addEventListener("click", () => { sfx.click(); goHome(); });
}

function updateGameHeader() {
  const sk = state.skills[gameMode];
  const stars = $("#game-stars");
  const streakEl = $("#game-streak");
  if (stars) stars.textContent = starsFor(sk.diff);
  if (streakEl) streakEl.textContent = `🔥 ${answerStreak}`;
}

function rewardCorrect(anchorEl) {
  const sk = state.skills[gameMode];
  answerStreak++;
  state.stats.totalCorrect++;
  state.stats.totalAnswered++;
  state.stats.bestStreak = Math.max(state.stats.bestStreak, answerStreak);
  sessionCorrect++;
  let xpGain = 8 * sk.diff;
  let coinGain = 2 + sk.diff;
  if (answerStreak > 0 && answerStreak % 5 === 0) {
    coinGain += 10;
    sparkySay(`🔥 ${answerStreak} in a row! Bonus coins!`, false);
    sfx.coin();
  }
  bumpQuestCounters(gameMode, true, xpGain, coinGain);
  adaptSkill(gameMode, true);
  grantXpCoins(xpGain, coinGain, anchorEl);
  updateGameHeader();
}

function penalizeWrong() {
  answerStreak = 0;
  state.stats.totalAnswered++;
  bumpQuestCounters(gameMode, false, 0, 0);
  adaptSkill(gameMode, false);
  save();
  renderHUD();
  updateGameHeader();
}

/* Multiple-choice flow */
function nextQuestion() {
  const sk = state.skills[gameMode];
  let q = null;
  for (let i = 0; i < 6; i++) {
    q = GENERATORS[gameMode](sk.diff);
    if (q.key !== lastQKey) break;
  }
  lastQKey = q.key;
  currentQ = q;
  locked = false;

  $("#game-body").innerHTML = `
    <div class="question-card">
      <div class="q-prompt">${q.prompt} <button class="speakbtn" id="q-speak" title="Read it to me">🔊</button></div>
      ${q.visual || ""}
    </div>
    <div class="choices" id="choices">
      ${q.choices.map((c, i) => `<button class="choice ${q.big ? "big" : ""}" data-i="${i}">${esc(c)}</button>`).join("")}
    </div>`;

  $("#q-speak").addEventListener("click", () => speak(q.spoken, true));
  document.querySelectorAll("#choices .choice").forEach((btn) => {
    btn.addEventListener("click", () => answerMC(parseInt(btn.dataset.i, 10), btn));
  });
  speak(q.spoken);
}

function answerMC(i, btn) {
  if (locked) return;
  locked = true;
  const correct = i === currentQ.answerIndex;
  const buttons = document.querySelectorAll("#choices .choice");
  buttons.forEach((b) => (b.disabled = true));
  if (correct) {
    btn.classList.add("correct");
    sfx.correct();
    if (Math.random() < 0.35) sparkySay(pick(SPARKY.praise));
    rewardCorrect(btn);
    setTimeout(nextQuestion, 1200);
  } else {
    btn.classList.add("wrong");
    sfx.wrong();
    const correctBtn = buttons[currentQ.answerIndex];
    setTimeout(() => correctBtn.classList.add("reveal"), 350);
    sparkySay(currentQ.explain || pick(SPARKY.encourage));
    penalizeWrong();
    setTimeout(nextQuestion, 2100);
  }
}

/* ------------------------------------------------------------
   Spelling Bee (custom UI)
------------------------------------------------------------ */
let spellWord = null;
let spellSlots = [];
let spellFails = 0;

function nextSpelling() {
  const sk = state.skills.spelling;
  const pool = spellPool(sk.diff);
  let item = pick(pool);
  for (let i = 0; i < 5 && `sp:${item.w}` === lastQKey; i++) item = pick(pool);
  lastQKey = `sp:${item.w}`;
  spellWord = item;
  spellFails = 0;
  spellSlots = new Array(item.w.length).fill(null); // each: {letter, tileIdx}
  const letters = shuffle(item.w.split("").map((ch, idx) => ({ ch, idx })));

  $("#game-body").innerHTML = `
    <div class="question-card">
      <div class="q-prompt">Spell the word! <button class="speakbtn" id="q-speak">🔊</button></div>
      <div class="q-visual">${spellWord.e}</div>
      <div class="spell-slots" id="spell-slots">
        ${spellSlots.map((_, i) => `<div class="slot" data-slot="${i}"></div>`).join("")}
      </div>
      <div class="spell-bank" id="spell-bank">
        ${letters.map((L, i) => `<button class="ltile" data-tile="${i}" data-ch="${L.ch}">${L.ch}</button>`).join("")}
      </div>
    </div>`;

  $("#q-speak").addEventListener("click", () => speak(spellSpoken(), true));
  document.querySelectorAll("#spell-bank .ltile").forEach((tile) => {
    tile.addEventListener("click", () => placeTile(tile));
  });
  document.querySelectorAll("#spell-slots .slot").forEach((slot) => {
    slot.addEventListener("click", () => clearSlot(parseInt(slot.dataset.slot, 10)));
  });
  speak(spellSpoken());
}
const spellSpoken = () => `Can you spell ${spellWord.w}? ${spellWord.w}!`;

function placeTile(tile) {
  if (tile.classList.contains("used") || locked) return;
  const slotIdx = spellSlots.findIndex((s) => s === null);
  if (slotIdx === -1) return;
  sfx.click();
  spellSlots[slotIdx] = { letter: tile.dataset.ch, tileIdx: tile.dataset.tile };
  tile.classList.add("used");
  const slotEl = document.querySelector(`.slot[data-slot="${slotIdx}"]`);
  slotEl.textContent = tile.dataset.ch;
  slotEl.classList.add("filled");
  if (spellSlots.every((s) => s !== null)) checkSpelling();
}
function clearSlot(i) {
  if (locked || !spellSlots[i]) return;
  sfx.click();
  const tile = document.querySelector(`.ltile[data-tile="${spellSlots[i].tileIdx}"]`);
  if (tile) tile.classList.remove("used");
  spellSlots[i] = null;
  const slotEl = document.querySelector(`.slot[data-slot="${i}"]`);
  slotEl.textContent = "";
  slotEl.classList.remove("filled");
}
function checkSpelling() {
  const attempt = spellSlots.map((s) => s.letter).join("");
  if (attempt === spellWord.w) {
    locked = true;
    sfx.correct();
    document.querySelectorAll(".slot").forEach((s) => s.classList.add("filled"));
    sparkySay(pick(SPARKY.praise));
    rewardCorrect($("#spell-slots"));
    setTimeout(nextSpelling, 1400);
  } else {
    spellFails++;
    sfx.wrong();
    const slotsEl = $("#spell-slots");
    slotsEl.style.animation = "shake 0.4s";
    setTimeout(() => (slotsEl.style.animation = ""), 450);
    if (spellFails >= 2) {
      // reveal the correct spelling, count as wrong, move on
      locked = true;
      penalizeWrong();
      sparkySay(`It's spelled: ${spellWord.w.toUpperCase()} — you'll get it next time! 💪`);
      spellWord.w.split("").forEach((ch, i) => {
        const slotEl = document.querySelector(`.slot[data-slot="${i}"]`);
        slotEl.textContent = ch;
        slotEl.classList.add("filled");
      });
      speak(`${spellWord.w} is spelled ${spellWord.w.split("").join(", ")}.`);
      setTimeout(nextSpelling, 2600);
    } else {
      sparkySay(pick(SPARKY.encourage));
      setTimeout(() => {
        for (let i = 0; i < spellSlots.length; i++) clearSlot(i);
      }, 500);
    }
  }
}

/* ------------------------------------------------------------
   Memory Match (custom UI)
------------------------------------------------------------ */
let memFirst = null;
let memLock = false;
let memMatched = 0;
let memMistakes = 0;
let memPairs = 0;

function startMemory() {
  const sk = state.skills.memory;
  memPairs = { 1: 3, 2: 4, 3: 6, 4: 8, 5: 10 }[sk.diff];
  memFirst = null;
  memLock = false;
  memMatched = 0;
  memMistakes = 0;
  const emojis = pickN(MEMORY_POOL, memPairs);
  const cards = shuffle([...emojis, ...emojis]);
  const cols = memPairs <= 3 ? 3 : memPairs <= 8 ? 4 : 5;

  $("#game-body").innerHTML = `
    <div class="question-card">
      <div class="q-prompt">Find all the matching pairs! 🔎</div>
      <div class="memory-grid" style="grid-template-columns:repeat(${cols}, auto);" id="memory-grid">
        ${cards.map((e, i) => `
          <button class="mcard" data-e="${e}" data-i="${i}">
            <div class="inner">
              <div class="face back">❓</div>
              <div class="face front">${e}</div>
            </div>
          </button>`).join("")}
      </div>
    </div>`;
  document.querySelectorAll(".mcard").forEach((c) => c.addEventListener("click", () => flipCard(c)));
  speak("Find all the matching pairs!");
}

function flipCard(card) {
  if (memLock || card.classList.contains("flipped") || card.classList.contains("matched")) return;
  sfx.flip();
  card.classList.add("flipped");
  if (!memFirst) {
    memFirst = card;
    return;
  }
  const a = memFirst, b = card;
  memFirst = null;
  if (a.dataset.e === b.dataset.e) {
    a.classList.add("matched");
    b.classList.add("matched");
    memMatched++;
    sfx.coin();
    grantXpCoins(6, 2, b);
    if (memMatched === memPairs) finishMemory();
  } else {
    memMistakes++;
    memLock = true;
    setTimeout(() => {
      a.classList.remove("flipped");
      b.classList.remove("flipped");
      memLock = false;
    }, 750);
  }
}

function finishMemory() {
  const sk = state.skills.memory;
  state.daily.counters.memoryDone++;
  state.stats.totalCorrect++;
  state.stats.totalAnswered++;
  state.daily.counters.correct++;
  if (memMistakes === 0 && memPairs >= 4) state.stats.memoryPerfect++;
  // adapt: clean rounds push difficulty up, very messy rounds ease off
  if (memMistakes <= memPairs) {
    sk.streak++;
    if (sk.streak >= 2 && sk.diff < 5) { sk.diff++; sk.streak = 0; sparkySay(pick(SPARKY.harder), true); }
  } else if (memMistakes > memPairs * 2 && sk.diff > diffFloor()) {
    sk.diff--;
    sparkySay(pick(SPARKY.easier));
  }
  confettiBurst(90);
  sfx.level();
  sparkySay(memMistakes === 0 ? "PERFECT round! Incredible memory! 🤩" : pick(SPARKY.praise), true);
  grantXpCoins(10 * memPairs, 3 * memPairs, $("#memory-grid"));
  updateGameHeader();
  checkBadges();
  save();
  setTimeout(startMemory, 2200);
}

/* ------------------------------------------------------------
   Home screen
------------------------------------------------------------ */
function goHome() {
  ensureDaily();
  renderHUD();
  renderHome();
  showScreen("home");
}

function renderHome() {
  const hour = new Date().getHours();
  const hello = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const nextQuest = state.daily.quests
    .map((q) => ({ q, t: QUEST_TEMPLATES.find((t) => t.tid === q.tid) }))
    .find(({ q, t }) => !q.claimed);

  $("#screen-home").innerHTML = `
    <div class="greeting">${hello}, ${esc(state.name)}! ${state.avatar}</div>
    ${nextQuest ? `
      <div class="quest-preview" id="quest-preview">
        <span style="font-size:1.8rem">${nextQuest.t.icon}</span>
        <div class="qp-text">Today's quest: ${nextQuest.t.desc}<br>
          <small>${Math.min(questCounterValue(nextQuest.t), nextQuest.t.target)} / ${nextQuest.t.target} — tap to see all quests 📜</small>
        </div>
        <span style="font-size:1.4rem">➡️</span>
      </div>` : `
      <div class="quest-preview" id="quest-preview">
        <span style="font-size:1.8rem">🎉</span>
        <div class="qp-text">All quests done today! Amazing!<br><small>New quests tomorrow ✨</small></div>
      </div>`}
    <div class="game-grid">
      ${GAMES.map((g) => `
        <button class="game-tile" data-game="${g.id}">
          <span class="gt-tag" style="background:${g.tagColor}">${g.tag}</span>
          <span class="gt-icon">${g.icon}</span>
          <span class="gt-name">${g.name}</span>
          <span class="gt-stars">${starsFor(state.skills[g.id].diff)}</span>
        </button>`).join("")}
      <button class="game-tile" data-game="__random" style="background:linear-gradient(135deg,#fff8e1,#ffeff8)">
        <span class="gt-icon">🎲</span>
        <span class="gt-name">Surprise Me!</span>
        <span class="gt-stars">✨✨✨</span>
      </button>
    </div>`;

  $("#quest-preview").addEventListener("click", () => { sfx.click(); openQuests(); });
  document.querySelectorAll(".game-tile").forEach((tile) => {
    tile.addEventListener("click", () => {
      sfx.click();
      const id = tile.dataset.game === "__random" ? pick(GAMES).id : tile.dataset.game;
      openGame(id);
    });
  });
}

/* ------------------------------------------------------------
   Quests screen
------------------------------------------------------------ */
function openQuests() {
  ensureDaily();
  const rows = state.daily.quests.map((q, qi) => {
    const t = QUEST_TEMPLATES.find((x) => x.tid === q.tid);
    const val = Math.min(questCounterValue(t), t.target);
    const done = val >= t.target;
    return `
      <div class="quest-row ${q.claimed ? "done-claimed" : ""}">
        <span class="q-icon">${t.icon}</span>
        <div class="q-body">
          <div class="q-desc">${t.desc}</div>
          <div class="q-bar"><div style="width:${Math.round((val / t.target) * 100)}%"></div></div>
          <div class="q-count">${val} / ${t.target}</div>
        </div>
        <button class="claimbtn" data-qi="${qi}" ${q.claimed || !done ? "disabled" : ""}>
          ${q.claimed ? "Done ✓" : done ? `Claim ${t.reward} 🪙` : `${t.reward} 🪙`}
        </button>
      </div>`;
  }).join("");

  $("#screen-quests").innerHTML = `
    <div class="card">
      <h2>📜 Daily Quests</h2>
      <p style="color:var(--ink-soft);font-weight:700;margin:0 0 12px;">New quests every day! Finish them for bonus coins.</p>
      ${rows}
    </div>`;

  document.querySelectorAll(".claimbtn:not([disabled])").forEach((btn) => {
    btn.addEventListener("click", () => {
      const qi = parseInt(btn.dataset.qi, 10);
      const q = state.daily.quests[qi];
      const t = QUEST_TEMPLATES.find((x) => x.tid === q.tid);
      if (q.claimed) return;
      q.claimed = true;
      state.stats.questsClaimed++;
      sfx.quest();
      confettiBurst(70);
      grantXpCoins(40, t.reward, btn);
      sparkySay(`Quest complete! +${t.reward} coins! 🎉`, true);
      openQuests();
    });
  });
  showScreen("quests");
}

/* ------------------------------------------------------------
   Shop & collection screens
------------------------------------------------------------ */
function openShop() {
  $("#screen-shop").innerHTML = `
    <div class="card">
      <h2>🛍️ Prize Shop</h2>
      <p style="color:var(--ink-soft);font-weight:700;margin:0 0 12px;">
        Spend your coins on stickers for your collection! You have <b>🪙 ${state.coins}</b>.
      </p>
      <div class="shop-grid">
        ${STICKERS.map((s) => {
          const owned = state.stickers.includes(s.id);
          const canBuy = !owned && state.coins >= s.cost;
          return `
            <div class="shop-item ${owned ? "owned" : ""}">
              <span class="rarity" style="background:${RARITIES[s.r].color}">${RARITIES[s.r].label}</span>
              <div class="s-icon">${s.e}</div>
              <div class="s-name">${s.name}</div>
              <button data-buy="${s.id}" ${owned || !canBuy ? "disabled" : ""}>
                ${owned ? "Owned ✓" : `${s.cost} 🪙`}
              </button>
            </div>`;
        }).join("")}
      </div>
    </div>`;

  document.querySelectorAll("[data-buy]:not([disabled])").forEach((btn) => {
    btn.addEventListener("click", () => {
      const s = STICKERS.find((x) => x.id === btn.dataset.buy);
      if (!s || state.stickers.includes(s.id) || state.coins < s.cost) return;
      state.coins -= s.cost;
      state.stickers.push(s.id);
      sfx.coin();
      confettiBurst(80);
      renderHUD();
      checkBadges();
      save();
      sparkySay(`You got the ${s.name} sticker! ${s.e}`, true);
      openShop();
    });
  });
  showScreen("shop");
}

function openCollection(tab = "stickers") {
  const stickersHtml = state.stickers.length
    ? `<div class="sticker-grid">
        ${STICKERS.filter((s) => state.stickers.includes(s.id)).map((s) => `
          <div class="sticker-item">
            <div class="s-icon">${s.e}</div>
            <div class="s-name">${s.name}</div>
          </div>`).join("")}
      </div>`
    : `<p style="text-align:center;font-weight:700;color:var(--ink-soft);padding:20px 0;">
        No stickers yet! Earn coins by playing, then visit the Prize Shop! 🛍️</p>`;

  const badgesHtml = `<div class="badge-grid">
    ${BADGES.map((b) => `
      <div class="badge-item ${state.badges[b.id] ? "earned" : ""}">
        <div class="b-icon">${b.e}</div>
        <div class="b-name">${b.name}</div>
        <div class="b-desc">${b.desc}</div>
      </div>`).join("")}
  </div>`;

  $("#screen-collection").innerHTML = `
    <div class="card">
      <div class="tabs">
        <button class="tab ${tab === "stickers" ? "active" : ""}" id="tab-stickers">🌈 Stickers (${state.stickers.length}/${STICKERS.length})</button>
        <button class="tab ${tab === "badges" ? "active" : ""}" id="tab-badges">🏆 Badges (${Object.keys(state.badges).length}/${BADGES.length})</button>
      </div>
      ${tab === "stickers" ? stickersHtml : badgesHtml}
    </div>`;
  $("#tab-stickers").addEventListener("click", () => openCollection("stickers"));
  $("#tab-badges").addEventListener("click", () => openCollection("badges"));
  showScreen("collection");
}

/* ------------------------------------------------------------
   Grown-ups (parent) area — behind a simple math gate
------------------------------------------------------------ */
function openParentGate() {
  const a = randInt(3, 9), b = randInt(4, 9);
  const box = document.createElement("div");
  box.className = "overlay";
  box.innerHTML = `
    <div class="box">
      <div class="huge">👨‍👩‍👧</div>
      <h2>Grown-ups only!</h2>
      <p style="font-weight:700;color:var(--ink-soft)">To enter, solve: <b style="color:var(--ink);font-size:1.3rem">${a} × ${b} = ?</b></p>
      <input class="gate-in" id="gate-in" type="number" inputmode="numeric" />
      <div style="margin-top:16px;display:flex;gap:10px;justify-content:center;">
        <button class="bigbtn gray" id="gate-cancel">Back</button>
        <button class="bigbtn blue" id="gate-ok">Enter</button>
      </div>
    </div>`;
  $("#overlays").appendChild(box);
  const input = box.querySelector("#gate-in");
  input.focus();
  const tryEnter = () => {
    if (parseInt(input.value, 10) === a * b) {
      box.remove();
      openParent();
    } else {
      input.value = "";
      input.placeholder = "Try again";
    }
  };
  box.querySelector("#gate-ok").addEventListener("click", tryEnter);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") tryEnter(); });
  box.querySelector("#gate-cancel").addEventListener("click", () => box.remove());
}

function openParent() {
  const lv = levelFromXp(state.xp);
  const acc = state.stats.totalAnswered
    ? Math.round((state.stats.totalCorrect / state.stats.totalAnswered) * 100) : 0;
  const mins = Math.round(state.stats.playSeconds / 60);

  $("#screen-parent").innerHTML = `
    <div class="card">
      <h2>👨‍👩‍👧 Grown-ups Dashboard</h2>
      <p style="color:var(--ink-soft);font-weight:600;font-size:0.9rem;">
        Brain Quest Jr. adapts each skill's difficulty (1–5 ★) automatically based on your child's answers.
        It's designed for short, focused play sessions — the built-in stretch-break reminder below encourages
        healthy screen habits. Pediatric guidance suggests kids this age do best with plenty of off-screen play,
        so we recommend keeping breaks on. 💚
      </p>
      <div class="stat-grid">
        <div class="stat-box"><div class="v">${state.stats.totalAnswered}</div><div class="k">Questions tried</div></div>
        <div class="stat-box"><div class="v">${state.stats.totalCorrect}</div><div class="k">Correct</div></div>
        <div class="stat-box"><div class="v">${acc}%</div><div class="k">Accuracy</div></div>
        <div class="stat-box"><div class="v">${mins}</div><div class="k">Minutes played</div></div>
        <div class="stat-box"><div class="v">${lv.level}</div><div class="k">Level</div></div>
        <div class="stat-box"><div class="v">${state.dayStreak}</div><div class="k">Day streak</div></div>
      </div>
    </div>
    <div class="card">
      <h3>📈 Skill levels</h3>
      ${GAMES.map((g) => `
        <div class="skill-row">
          <span>${g.icon}</span><span class="sk-name">${g.name}</span>
          <span class="sk-stars">${starsFor(state.skills[g.id].diff)}</span>
          <span style="color:var(--ink-soft);font-size:0.8rem;">${state.skills[g.id].correct}✓ / ${state.skills[g.id].answered}</span>
        </div>`).join("")}
    </div>
    <div class="card">
      <h3>⚙️ Settings</h3>
      <div class="parent-row">
        <label>Sound effects</label>
        <div class="switch"><input type="checkbox" id="set-sound" ${state.settings.sound ? "checked" : ""}/><span class="track"></span></div>
      </div>
      <div class="parent-row">
        <label>Read questions out loud<small>Great for pre-readers</small></label>
        <div class="switch"><input type="checkbox" id="set-speech" ${state.settings.speech ? "checked" : ""}/><span class="track"></span></div>
      </div>
      <div class="parent-row">
        <label>Challenge level<small>Minimum stars for every game — raise this if it feels too easy</small></label>
        <select id="set-mindiff">
          ${[1, 2, 3, 4, 5].map((v) => `<option value="${v}" ${(state.settings.minDiff || 1) === v ? "selected" : ""}>${"★".repeat(v)}${"☆".repeat(5 - v)}</option>`).join("")}
        </select>
      </div>
      <div class="parent-row">
        <label>Stretch break reminder<small>Sparky suggests a movement break</small></label>
        <select id="set-break">
          ${[[10, "Every 10 min"], [15, "Every 15 min"], [20, "Every 20 min"], [30, "Every 30 min"], [45, "Every 45 min"], [0, "Off"]]
            .map(([v, l]) => `<option value="${v}" ${state.settings.breakEvery === v ? "selected" : ""}>${l}</option>`).join("")}
        </select>
      </div>
      <div class="parent-row">
        <label>Change player<small>Name & avatar</small></label>
        <button class="bigbtn blue" id="set-player" style="font-size:0.95rem;padding:10px 18px;">Edit ✏️</button>
      </div>
      <div class="parent-row" style="border-bottom:none;">
        <label>Reset all progress<small>Cannot be undone!</small></label>
        <button class="dangerbtn" id="set-reset">Reset</button>
      </div>
    </div>`;

  $("#set-sound").addEventListener("change", (e) => { state.settings.sound = e.target.checked; save(); });
  $("#set-speech").addEventListener("change", (e) => { state.settings.speech = e.target.checked; save(); });
  $("#set-mindiff").addEventListener("change", (e) => {
    state.settings.minDiff = parseInt(e.target.value, 10);
    applyMinDiff();
    save();
    openParent();
  });
  $("#set-break").addEventListener("change", (e) => {
    state.settings.breakEvery = parseInt(e.target.value, 10);
    playSecondsSinceBreak = 0;
    save();
  });
  $("#set-player").addEventListener("click", () => { renderOnboarding(true); showScreen("onboarding"); });
  let resetArmed = false;
  $("#set-reset").addEventListener("click", (e) => {
    if (!resetArmed) {
      resetArmed = true;
      e.target.textContent = "Tap again to confirm";
      setTimeout(() => { resetArmed = false; e.target.textContent = "Reset"; }, 3000);
    } else {
      localStorage.removeItem(SAVE_KEY);
      location.reload();
    }
  });
  showScreen("parent");
}

/* ------------------------------------------------------------
   Onboarding
------------------------------------------------------------ */
function renderOnboarding(editing = false) {
  let picked = state.avatar;
  $("#screen-onboarding").innerHTML = `
    <span class="mascot">🤖</span>
    <h1>Hi! I'm <span style="color:var(--blue)">Sparky</span>!</h1>
    <p style="font-weight:700;color:var(--ink-soft);max-width:420px;margin:0 auto;">
      I'm your robot learning buddy. We'll play games, earn coins, collect stickers and become SUPER smart! 🧠✨
    </p>
    <h3 style="margin-top:22px;">What's your name?</h3>
    <input id="ob-name" maxlength="14" placeholder="Type your name" value="${editing ? esc(state.name) : ""}" />
    <h3>Pick your hero!</h3>
    <div class="avatar-grid" id="ob-avatars">
      ${AVATARS.map((a) => `<button data-av="${a}" class="${a === picked ? "picked" : ""}">${a}</button>`).join("")}
    </div>
    <h3>How tricky should the games be?</h3>
    <div class="diff-row" id="ob-diff">
      <button data-d="1">🌱 Nice &amp; Easy<br><span class="gt-stars">★☆☆☆☆</span></button>
      <button data-d="2" class="picked">🙂 Medium<br><span class="gt-stars">★★☆☆☆</span></button>
      <button data-d="3">🚀 Big Kid Mode<br><span class="gt-stars">★★★☆☆</span></button>
    </div>
    <button class="bigbtn" id="ob-start" style="font-size:1.35rem;">${editing ? "Save ✓" : "Let's Play! 🚀"}</button>`;

  let pickedDiff = 2;
  document.querySelectorAll("#ob-avatars button").forEach((btn) => {
    btn.addEventListener("click", () => {
      sfx.click();
      picked = btn.dataset.av;
      document.querySelectorAll("#ob-avatars button").forEach((b) => b.classList.toggle("picked", b === btn));
    });
  });
  document.querySelectorAll("#ob-diff button").forEach((btn) => {
    btn.addEventListener("click", () => {
      sfx.click();
      pickedDiff = parseInt(btn.dataset.d, 10);
      document.querySelectorAll("#ob-diff button").forEach((b) => b.classList.toggle("picked", b === btn));
    });
  });
  $("#ob-start").addEventListener("click", () => {
    const name = $("#ob-name").value.trim();
    state.name = name || "Explorer";
    state.avatar = picked;
    state.onboarded = true;
    state.settings.minDiff = Math.max(state.settings.minDiff || 1, pickedDiff);
    applyMinDiff();
    save();
    $("#hud").classList.remove("hidden");
    sfx.level();
    confettiBurst(80);
    goHome();
    sparkySay(`${pick(SPARKY.welcome)}`, true);
  });
}

/* ------------------------------------------------------------
   Break reminder ("stretch time")
------------------------------------------------------------ */
let playSecondsSinceBreak = 0;
let breakActive = false;

function maybeShowBreak() {
  if (breakActive || !state.settings.breakEvery) return;
  if (playSecondsSinceBreak < state.settings.breakEvery * 60) return;
  breakActive = true;
  const box = document.createElement("div");
  box.className = "overlay";
  box.innerHTML = `
    <div class="box">
      <div class="huge">🤸</div>
      <h2>Stretch Time!</h2>
      <p style="font-weight:700;color:var(--ink-soft)">Sparky needs to recharge — and so do you!<br>
      Stand up and try these moves:</p>
      <div class="break-moves"><span>🙆</span><span>🦘</span><span>🤸</span></div>
      <p style="font-weight:700">10 big arm circles • 10 jumps • touch your toes!</p>
      <div class="break-timer" id="break-timer">30</div>
      <button class="bigbtn" id="break-done" disabled>I stretched! ▶️</button>
    </div>`;
  $("#overlays").appendChild(box);
  speak("Stretch time! Stand up, do ten big arm circles, ten jumps, and touch your toes!");
  let left = 30;
  const t = setInterval(() => {
    left--;
    const el = box.querySelector("#break-timer");
    if (el) el.textContent = left > 0 ? left : "✅";
    if (left <= 0) {
      clearInterval(t);
      box.querySelector("#break-done").disabled = false;
    }
  }, 1000);
  box.querySelector("#break-done").addEventListener("click", () => {
    box.remove();
    breakActive = false;
    playSecondsSinceBreak = 0;
    sparkySay("Wow, great stretching! Back to the fun! 🎉");
  });
}

setInterval(() => {
  if (!state.onboarded || breakActive) return;
  if (document.visibilityState !== "visible") return;
  playSecondsSinceBreak++;
  state.stats.playSeconds++;
  if (state.stats.playSeconds % 30 === 0) save();
  maybeShowBreak();
}, 1000);

/* ------------------------------------------------------------
   Clouds decoration
------------------------------------------------------------ */
function makeClouds() {
  const wrap = $("#clouds");
  for (let i = 0; i < 4; i++) {
    const c = document.createElement("div");
    c.className = "cloud";
    c.textContent = "☁️";
    c.style.top = `${5 + rand(30)}%`;
    c.style.animationDuration = `${45 + rand(50)}s`;
    c.style.animationDelay = `-${rand(40)}s`;
    c.style.fontSize = `${2 + rand(3)}rem`;
    wrap.appendChild(c);
  }
}

/* ------------------------------------------------------------
   Boot
------------------------------------------------------------ */
function init() {
  load();
  ensureDaily();
  applyMinDiff();
  makeClouds();

  $("#nav-home").addEventListener("click", () => { sfx.click(); goHome(); });
  $("#nav-quests").addEventListener("click", () => { sfx.click(); openQuests(); });
  $("#nav-shop").addEventListener("click", () => { sfx.click(); openShop(); });
  $("#nav-collection").addEventListener("click", () => { sfx.click(); openCollection(); });
  $("#nav-parent").addEventListener("click", () => { sfx.click(); openParentGate(); });
  $("#sparky-bot").addEventListener("click", () => sparkySay(pick(SPARKY.welcome), true));

  // unlock audio on first interaction
  document.addEventListener("pointerdown", () => ac(), { once: true });

  if (state.onboarded) {
    $("#hud").classList.remove("hidden");
    goHome();
    setTimeout(() => sparkySay(pick(SPARKY.welcome)), 800);
  } else {
    renderOnboarding(false);
    showScreen("onboarding");
  }
}

document.addEventListener("DOMContentLoaded", init);
