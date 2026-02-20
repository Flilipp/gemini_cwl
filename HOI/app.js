const state = {
  hour: 0,
  mapMode: "europe",
  maps: {
    europe: [
      { name: "Warszawa", x: 290, y: 90 },
      { name: "Berlin", x: 250, y: 92 },
      { name: "Paryz", x: 195, y: 102 },
      { name: "Rzym", x: 245, y: 145 },
      { name: "Londyn", x: 165, y: 75 },
      { name: "Moskwa", x: 355, y: 82 },
    ],
    world: [
      { name: "Nowy Jork", x: 130, y: 105 },
      { name: "Londyn", x: 245, y: 95 },
      { name: "Warszawa", x: 285, y: 100 },
      { name: "Kair", x: 300, y: 140 },
      { name: "Delhi", x: 380, y: 130 },
      { name: "Tokio", x: 470, y: 115 },
    ],
  },
  divisionNodeIndex: 0,
  economy: {
    factories: 5,
    resources: 8,
    efficiency: 0,
    progress: 0,
    target: 100,
    stockpile: 0,
  },
  combat: {
    our: { softAttack: 24, breakthrough: 18, org: 100, str: 100 },
    enemy: { defense: 20, hardAttack: 16, org: 100, str: 100 },
  },
  script: {
    politicalPower: 120,
  },
};

function byId(id) {
  return document.getElementById(id);
}

function getCurrentMapNodes() {
  return state.maps[state.mapMode];
}

function logEvent(message) {
  const li = document.createElement("li");
  li.textContent = `[h${state.hour}] ${message}`;
  byId("event-log").prepend(li);
}

function updateMapButtons() {
  byId("map-europe").classList.toggle("active", state.mapMode === "europe");
  byId("map-world").classList.toggle("active", state.mapMode === "world");
}

function renderStrategicMap() {
  const svg = byId("strategic-map");
  const nodes = getCurrentMapNodes();

  const background = state.mapMode === "europe"
    ? `<path d="M120 50 L390 45 L420 140 L310 180 L180 165 L130 110 Z" class="landmass"></path>
       <path d="M150 185 L270 185 L235 240 L130 225 Z" class="landmass secondary"></path>`
    : `<path d="M45 60 L160 50 L170 160 L70 185 L40 140 Z" class="landmass"></path>
       <path d="M210 55 L325 48 L355 180 L225 190 L185 130 Z" class="landmass"></path>
       <path d="M350 70 L520 60 L520 185 L380 190 L340 130 Z" class="landmass secondary"></path>`;

  const links = nodes
    .map((node, index) => {
      const next = nodes[(index + 1) % nodes.length];
      return `<line x1="${node.x}" y1="${node.y}" x2="${next.x}" y2="${next.y}" class="route"></line>`;
    })
    .join("");

  const points = nodes
    .map((node, index) => {
      const active = index === state.divisionNodeIndex ? "active" : "";
      return `
        <g class="map-node ${active}">
          <circle cx="${node.x}" cy="${node.y}" r="7"></circle>
          <text x="${node.x + 10}" y="${node.y - 10}">${node.name}</text>
        </g>
      `;
    })
    .join("");

  svg.innerHTML = `
    <rect x="0" y="0" width="560" height="300" class="ocean"></rect>
    ${background}
    ${links}
    ${points}
  `;
}

function renderNodes() {
  const nodes = getCurrentMapNodes();
  const nodesEl = byId("nodes");
  nodesEl.innerHTML = "";
  nodes.forEach((node, index) => {
    const span = document.createElement("span");
    span.className = `node ${index === state.divisionNodeIndex ? "active" : ""}`;
    span.textContent = node.name;
    nodesEl.appendChild(span);
  });

  byId("division-position").textContent = nodes[state.divisionNodeIndex].name;
  renderStrategicMap();
}

function render() {
  byId("hour").textContent = state.hour;
  updateMapButtons();
  renderNodes();

  byId("factories").textContent = state.economy.factories;
  byId("resources").textContent = state.economy.resources;
  byId("efficiency").textContent = `${Math.round(state.economy.efficiency * 100)}%`;
  byId("production-progress").textContent = Math.floor(state.economy.progress);
  byId("production-target").textContent = state.economy.target;
  byId("stockpile").textContent = state.economy.stockpile;

  byId("our-soft").textContent = state.combat.our.softAttack;
  byId("our-break").textContent = state.combat.our.breakthrough;
  byId("our-org").textContent = Math.max(0, Math.floor(state.combat.our.org));
  byId("our-str").textContent = Math.max(0, Math.floor(state.combat.our.str));

  byId("enemy-def").textContent = state.combat.enemy.defense;
  byId("enemy-hard").textContent = state.combat.enemy.hardAttack;
  byId("enemy-org").textContent = Math.max(0, Math.floor(state.combat.enemy.org));
  byId("enemy-str").textContent = Math.max(0, Math.floor(state.combat.enemy.str));

  byId("pp").textContent = state.script.politicalPower;
}

function runEconomyTick() {
  const e = state.economy;
  e.efficiency = Math.min(1, e.efficiency + 0.02);

  const inputPower = Math.min(e.factories, e.resources) * 2;
  e.progress += inputPower * (0.4 + e.efficiency);

  if (e.progress >= e.target) {
    e.progress -= e.target;
    e.stockpile += 1;
    logEvent("Wyprodukowano 1 szt. ekwipunku.");
  }
}

function advanceTick() {
  state.hour += 1;
  runEconomyTick();

  if (state.hour % 4 === 0) {
    const nodes = getCurrentMapNodes();
    state.divisionNodeIndex = (state.divisionNodeIndex + 1) % nodes.length;
  }

  render();
}

function runCombatRound() {
  const weatherModifier = Math.random() * 0.2 + 0.9;
  const terrainModifier = Math.random() * 0.2 + 0.9;

  const ourHit = (state.combat.our.softAttack - state.combat.enemy.defense * 0.5) * weatherModifier;
  const enemyHit = (state.combat.enemy.hardAttack - state.combat.our.breakthrough * 0.4) * terrainModifier;

  state.combat.enemy.org -= Math.max(1, ourHit);
  state.combat.enemy.str -= Math.max(0.5, ourHit * 0.5);

  state.combat.our.org -= Math.max(1, enemyHit);
  state.combat.our.str -= Math.max(0.5, enemyHit * 0.5);

  if (state.combat.enemy.org <= 0) {
    logEvent("Wróg stracił Organization -> odwrót z prowincji.");
    state.combat.enemy.org = 40;
    state.combat.enemy.str = Math.max(10, state.combat.enemy.str);
  }

  if (state.combat.our.org <= 0) {
    state.divisionNodeIndex = Math.max(0, state.divisionNodeIndex - 1);
    state.combat.our.org = 45;
    logEvent("Nasza dywizja bez Organization -> odwrót o 1 węzeł.");
  }

  render();
}

function runFocusScript() {
  if (state.script.politicalPower < 75) {
    logEvent("Brak PP na focus.");
    return;
  }

  state.script.politicalPower -= 75;
  state.economy.factories += 1;
  logEvent("Focus ukończony: -75 PP, +1 fabryka, event_id=102.");
  render();
}

function switchMap(mode) {
  state.mapMode = mode;
  state.divisionNodeIndex = 0;
  logEvent(`Przełączono mapę na: ${mode === "europe" ? "Europę" : "Świat"}.`);
  render();
}

byId("next-tick").addEventListener("click", advanceTick);
byId("combat-round").addEventListener("click", runCombatRound);
byId("focus-button").addEventListener("click", runFocusScript);
byId("map-europe").addEventListener("click", () => switchMap("europe"));
byId("map-world").addEventListener("click", () => switchMap("world"));

render();
logEvent("MVP uruchomione.");
