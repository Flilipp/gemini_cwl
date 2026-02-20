const state = {
  hour: 0,
  mapNodes: ["Warszawa", "Lodz", "Krakow", "Lwow"],
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

function logEvent(message) {
  const li = document.createElement("li");
  li.textContent = `[h${state.hour}] ${message}`;
  byId("event-log").prepend(li);
}

function renderNodes() {
  const nodesEl = byId("nodes");
  nodesEl.innerHTML = "";
  state.mapNodes.forEach((name, index) => {
    const span = document.createElement("span");
    span.className = `node ${index === state.divisionNodeIndex ? "active" : ""}`;
    span.textContent = name;
    nodesEl.appendChild(span);
  });
  byId("division-position").textContent = state.mapNodes[state.divisionNodeIndex];
}

function render() {
  byId("hour").textContent = state.hour;
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
    state.divisionNodeIndex = (state.divisionNodeIndex + 1) % state.mapNodes.length;
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

byId("next-tick").addEventListener("click", advanceTick);
byId("combat-round").addEventListener("click", runCombatRound);
byId("focus-button").addEventListener("click", runFocusScript);

render();
logEvent("MVP uruchomione.");
