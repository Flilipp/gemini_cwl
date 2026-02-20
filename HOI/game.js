// ============================================================
// HOI-Inspired Grand Strategy Game — GAME ENGINE v2
// ============================================================

class GameEngine {
    constructor() {
        this.state = null;
        this.playerCountry = null;
        this.week = 1;
        this.year = 1936;
        this.paused = true;
        this.tickInterval = null;
        this.speedIndex = 2; // default x1
        this.ui = null;
        this.map = null;
    }

    init(playerCountryId) {
        this.playerCountry = playerCountryId;
        this.state = {
            countries: {},
            territories: JSON.parse(JSON.stringify(GAME_DATA.territories)),
            alliances: JSON.parse(JSON.stringify(GAME_DATA.alliances)),
            week: 1, year: 1936,
            log: [],
        };
        for (const [id, data] of Object.entries(GAME_DATA.countries)) {
            this.state.countries[id] = JSON.parse(JSON.stringify(data));
        }
        // Territory owners already set in data.js, sync to state
        for (const [tid, t] of Object.entries(this.state.territories)) {
            // owner already in territory definition
        }
        this.ui = new UIController(this);
        this.map = new MapController(this);
        this.ui.showMainGame();
        this.map.render();
        this.ui.update();
        this.addLog(`🌍 Rok ${this.year} — Gra rozpoczęta! Grasz jako ${this.state.countries[this.playerCountry].name}.`);
        this.resume();
    }

    pause() {
        this.paused = true;
        clearInterval(this.tickInterval);
        if (this.ui) this.ui.updatePauseButton();
    }

    resume() {
        this.paused = false;
        const ms = GAME_DATA.settings.speedOptions[this.speedIndex];
        this.tickInterval = setInterval(() => this.tick(), ms);
        if (this.ui) this.ui.updatePauseButton();
    }

    togglePause() {
        if (this.paused) this.resume(); else this.pause();
    }

    setSpeed(idx) {
        this.speedIndex = idx;
        if (!this.paused) {
            clearInterval(this.tickInterval);
            const ms = GAME_DATA.settings.speedOptions[idx];
            this.tickInterval = setInterval(() => this.tick(), ms);
        }
        if (this.ui) this.ui.updateSpeedButtons();
    }

    tick() {
        this.week++;
        if (this.week > 52) { this.week = 1; this.year++; }
        this.state.week = this.week;
        this.state.year = this.year;

        for (const countryId of Object.keys(this.state.countries)) {
            this.processResources(countryId);
            this.processFocus(countryId);
            this.processProduction(countryId);
            this.processResearch(countryId);
            this.processCasusBelli(countryId);
            if (countryId !== this.playerCountry) this.processAI(countryId);
        }

        for (const [attacker, defenders] of Object.entries(this.getActiveWars())) {
            for (const defender of defenders) this.processCombat(attacker, defender);
        }

        this.checkVictory();
        this.ui.update();
        if (this.week % 2 === 0) this.map.render();
    }

    // ── RESOURCES ────────────────────────────────────────────
    processResources(countryId) {
        const c = this.state.countries[countryId];
        const territories = this.getCountryTerritories(countryId);
        const terrBonus = territories.length * 2;
        const ic = c.resources.ic;
        c.resources.steel = Math.min(300, c.resources.steel + 3 + Math.floor(ic * 0.3));
        c.resources.oil = Math.min(200, c.resources.oil + 2 + Math.floor(ic * 0.1));
        c.resources.aluminum = Math.min(200, c.resources.aluminum + 1 + Math.floor(ic * 0.15));
        c.resources.food = Math.min(400, c.resources.food + 4 + terrBonus);
    }

    // ── FOCUS ─────────────────────────────────────────────────
    processFocus(countryId) {
        const c = this.state.countries[countryId];
        if (!c.activeFocus) return;
        c.focusProgress++;
        const focusDef = GAME_DATA.focusTrees[c.focusTree]?.find(f => f.id === c.activeFocus);
        if (!focusDef) return;
        if (c.focusProgress >= focusDef.weeksToComplete) {
            this.completeFocus(countryId, focusDef);
            c.activeFocus = null;
            c.focusProgress = 0;
        }
    }

    completeFocus(countryId, focusDef) {
        const c = this.state.countries[countryId];
        c.completedFocuses.push(focusDef.id);
        const fx = focusDef.effects;
        if (fx.military) for (const [u, a] of Object.entries(fx.military)) c.military[u] = Math.max(0, (c.military[u] || 0) + a);
        if (fx.resources) for (const [r, a] of Object.entries(fx.resources)) c.resources[r] = Math.max(0, (c.resources[r] || 0) + a);
        if (fx.statBonus) for (const [s, a] of Object.entries(fx.statBonus)) c.stats[s] = Math.max(0, Math.min(100, (c.stats[s] || 0) + a));
        if (fx.territory) this.annexTerritory(countryId, fx.territory, 'diplomatic');
        if (fx.alliance) this.joinAlliance(countryId, fx.alliance);
        if (fx.casusBelli) c.casusBelli[fx.casusBelli] = 12;
        if (fx.defenseBonus) c.defenseBonus = (c.defenseBonus || 0) + fx.defenseBonus;
        if (fx.researchBonus) c.research[fx.researchBonus] = (c.research[fx.researchBonus] || 0) + 1;
        if (fx.nonAggressionWith) {
            delete c.casusBelli[fx.nonAggressionWith];
            const other = this.state.countries[fx.nonAggressionWith];
            if (other) delete other.casusBelli[countryId];
        }
        const name = c.name;
        const isPlayer = countryId === this.playerCountry;
        this.addLog(`${isPlayer ? '✅' : '🔔'} ${name}: ukończono fokus "${focusDef.name}".`);
        if (isPlayer) this.ui.showEvent(`Fokus ukończony!`, `${focusDef.icon} "${focusDef.name}" — ${focusDef.description}`);
    }

    // ── PRODUCTION ────────────────────────────────────────────
    processProduction(countryId) {
        const c = this.state.countries[countryId];
        if (!c.productionQueue || c.productionQueue.length === 0) return;
        const item = c.productionQueue[0];
        item.progress = (item.progress || 0) + 1;
        if (item.progress >= item.weeksTotal) {
            c.productionQueue.shift();
            const eqDef = GAME_DATA.equipment[item.equipmentId];
            if (eqDef) c.military[eqDef.unitType] = (c.military[eqDef.unitType] || 0) + item.quantity;
            if (countryId === this.playerCountry)
                this.addLog(`🏭 Produkcja gotowa: +${item.quantity} ${eqDef ? eqDef.name : item.equipmentId}.`);
        }
    }

    // ── RESEARCH ──────────────────────────────────────────────
    processResearch(countryId) {
        const c = this.state.countries[countryId];
        if (!c.activeResearch) return;
        c.researchProgress = (c.researchProgress || 0) + 1;
        const techDef = GAME_DATA.technologies[c.activeResearch];
        if (!techDef) return;
        const speed = 1 + (c.research[techDef.category] || 0) * 0.2;
        const needed = Math.ceil(techDef.weeksToResearch / speed);
        if (c.researchProgress >= needed) {
            this.completeTech(countryId, c.activeResearch);
            c.activeResearch = null;
            c.researchProgress = 0;
        }
    }

    completeTech(countryId, techId) {
        const c = this.state.countries[countryId];
        c.technologies.push(techId);
        const tech = GAME_DATA.technologies[techId];
        if (tech.bonus) {
            if (tech.bonus.ic) c.resources.ic += tech.bonus.ic;
            if (tech.bonus.oilProduction) c.resources.oil += tech.bonus.oilProduction;
            if (tech.bonus.defenseBonus) c.defenseBonus = (c.defenseBonus || 0) + tech.bonus.defenseBonus;
        }
        this.addLog(`🔬 ${c.name}: zbadano "${tech.name}".`);
        if (countryId === this.playerCountry) this.ui.showEvent('Badania ukończone!', `🔬 "${tech.name}" — efekty przyznane!`);
    }

    // ── CASUS BELLI ───────────────────────────────────────────
    processCasusBelli(countryId) {
        const c = this.state.countries[countryId];
        for (const target of Object.keys(c.casusBelli)) {
            c.casusBelli[target]--;
            if (c.casusBelli[target] <= 0) {
                delete c.casusBelli[target];
                if (!c.atWarWith.includes(target)) this.declareWar(countryId, target);
            }
        }
    }

    // ── AI ────────────────────────────────────────────────────
    processAI(countryId) {
        const c = this.state.countries[countryId];
        const profile = GAME_DATA.aiProfiles[c.aiPersonality] || GAME_DATA.aiProfiles.defender;
        const myIdx = Object.keys(GAME_DATA.countries).indexOf(countryId);
        if (this.week % (2 + myIdx % 3) !== 0) return;

        // 1. Focus
        if (!c.activeFocus) {
            const tree = GAME_DATA.focusTrees[c.focusTree] || [];
            const avail = tree.filter(f =>
                !c.completedFocuses.includes(f.id) &&
                (f.requires || []).every(r => c.completedFocuses.includes(r))
            );
            if (avail.length > 0) {
                let chosen = avail[0];
                if (c.aiPersonality === 'expansionist')
                    chosen = avail.find(f => f.effects.casusBelli || f.effects.military || f.effects.alliance) || avail[0];
                else if (c.aiPersonality === 'defender')
                    chosen = avail.find(f => f.effects.alliance || f.effects.defenseBonus || f.effects.military) || avail[0];
                else
                    chosen = avail.find(f => f.effects.resources) || avail[0];
                c.activeFocus = chosen.id;
                c.focusProgress = 0;
            }
        }

        // 2. Research
        if (!c.activeResearch) {
            const avail = Object.entries(GAME_DATA.technologies).filter(([id, tech]) =>
                !c.technologies.includes(id) &&
                (tech.requires || []).every(r => c.technologies.includes(r))
            );
            const catPref = c.aiPersonality === 'industrialist' ? 'industry' : 'land';
            const chosen = avail.find(([, t]) => t.category === catPref) || avail[0];
            if (chosen) { c.activeResearch = chosen[0]; c.researchProgress = 0; }
        }

        // 3. Production
        if (c.productionQueue.length < 2 && c.resources.steel > 20) {
            const eq = c.aiPersonality === 'expansionist' ? 'light_tank' : 'rifles';
            const eqDef = GAME_DATA.equipment[eq];
            if (eqDef && c.resources.steel >= eqDef.cost) {
                c.resources.steel -= eqDef.cost;
                c.productionQueue.push({ equipmentId: eq, quantity: 2, progress: 0, weeksTotal: eqDef.prodWeeks });
            }
        }

        // 4. Alliance
        const inAny = Object.values(this.state.alliances).some(a => a.members.includes(countryId));
        if (!inAny) {
            const pref = profile.alliancePreference;
            if (pref && this.state.alliances[pref] && !this.state.alliances[pref].members.includes(countryId))
                this.joinAlliance(countryId, pref);
        }

        // 5. War
        if (c.aiPersonality === 'expansionist' && this.week % 10 === 0) {
            const myStr = this.getMilitaryStrength(countryId);
            const neigh = (GAME_DATA.neighbors[countryId] || []);
            for (const target of neigh) {
                if (!this.state.countries[target]) continue;
                if (c.atWarWith.includes(target) || this.areAllied(countryId, target)) continue;
                const tStr = this.getMilitaryStrength(target);
                if (myStr > tStr * profile.warThreshold) {
                    this.declareCasusBelli(countryId, target);
                    break;
                }
            }
        }
    }

    // ── DIPLOMACY ─────────────────────────────────────────────
    joinAlliance(countryId, allianceId) {
        const alliance = this.state.alliances[allianceId];
        if (!alliance) return;
        for (const al of Object.values(this.state.alliances))
            al.members = al.members.filter(m => m !== countryId);
        if (!alliance.members.includes(countryId)) alliance.members.push(countryId);
        const name = this.state.countries[countryId]?.name || countryId;
        this.addLog(`🤝 ${name} dołączyło do ${alliance.name}.`);
        if (countryId === this.playerCountry) this.ui.showEvent('Sojusz!', `${name} dołączyło do ${alliance.name}!`);
    }

    declareCasusBelli(attackerId, targetId) {
        const c = this.state.countries[attackerId];
        if (!c || !this.state.countries[targetId]) return;
        if (!c.casusBelli[targetId]) {
            c.casusBelli[targetId] = 8;
            const tname = this.state.countries[targetId]?.name || targetId;
            this.addLog(`⚠️ ${c.name} uzasadnia wojnę z ${tname} (8 tyg).`);
            if (attackerId === this.playerCountry || targetId === this.playerCountry)
                this.ui.showEvent('Casus Belli!', `${c.name} przygotowuje wojnę z ${tname}!`);
        }
    }

    declareWar(attackerId, targetId) {
        const atk = this.state.countries[attackerId];
        const def = this.state.countries[targetId];
        if (!atk || !def) return;
        if (atk.atWarWith.includes(targetId)) return;

        atk.atWarWith.push(targetId);
        def.atWarWith.push(attackerId);

        // Pull alliance members
        const atkAl = this.getAllianceOf(attackerId);
        const defAl = this.getAllianceOf(targetId);
        if (atkAl) atkAl.members.forEach(m => {
            if (m !== attackerId && !this.state.countries[m]?.atWarWith.includes(targetId)) {
                this.state.countries[m]?.atWarWith.push(targetId);
                def.atWarWith.push(m);
            }
        });
        if (defAl) defAl.members.forEach(m => {
            if (m !== targetId && !this.state.countries[m]?.atWarWith.includes(attackerId)) {
                this.state.countries[m]?.atWarWith.push(attackerId);
                atk.atWarWith.push(m);
            }
        });

        this.addLog(`💥 WOJNA! ${atk.name} vs ${def.name}!`);
        this.ui.showEvent('WYPOWIEDZENIE WOJNY!', `⚔️ ${atk.name} vs ${def.name}!`, 'war');
        atk.stats.warSupport = Math.min(100, atk.stats.warSupport + 10);
        this.map.render();
    }

    // ── COMBAT ────────────────────────────────────────────────
    processCombat(attackerId, defenderId) {
        if (this.week % 4 !== 0) return;
        const atk = this.state.countries[attackerId];
        const def = this.state.countries[defenderId];
        if (!atk || !def) return;

        const atkStr = this.getMilitaryStrength(attackerId);
        const defStr = this.getMilitaryStrength(defenderId) * (1 + (def.defenseBonus || 0) / 100);
        const atkRoll = atkStr * (0.8 + Math.random() * 0.4);
        const defRoll = defStr * (0.8 + Math.random() * 0.4);

        if (atkRoll > defRoll * 1.3) {
            const defTerrs = this.getCountryTerritories(defenderId);
            if (defTerrs.length > 0) {
                const taken = defTerrs[Math.floor(Math.random() * defTerrs.length)];
                this.annexTerritory(attackerId, taken, 'war');
                this.inflictCasualties(defenderId, 0.2);
                this.inflictCasualties(attackerId, 0.1);
            } else {
                this.conquestCountry(attackerId, defenderId);
            }
        } else if (defRoll > atkRoll * 1.3) {
            this.inflictCasualties(attackerId, 0.15);
            this.inflictCasualties(defenderId, 0.06);
        } else {
            this.inflictCasualties(attackerId, 0.07);
            this.inflictCasualties(defenderId, 0.07);
        }
    }

    inflictCasualties(countryId, factor) {
        const c = this.state.countries[countryId];
        c.military.infantry = Math.max(0, Math.floor(c.military.infantry * (1 - factor)));
        c.military.tanks = Math.max(0, Math.floor(c.military.tanks * (1 - factor * 0.5)));
        c.military.planes = Math.max(0, Math.floor(c.military.planes * (1 - factor * 0.3)));
        c.stats.manpower = Math.max(0, Math.floor(c.stats.manpower * (1 - factor * 0.15)));
    }

    annexTerritory(countryId, territoryId, method) {
        const territory = this.state.territories[territoryId];
        if (!territory) return;
        const prevOwner = territory.owner;
        if (prevOwner === countryId) return;
        territory.owner = countryId;
        const cname = this.state.countries[countryId]?.name || countryId;
        const tname = territory.name;
        const icon = method === 'diplomatic' ? '📜' : '⚔️';
        this.addLog(`${icon} ${cname} przejął ${tname}.`);
        if (this.playerCountry === countryId || this.playerCountry === prevOwner)
            this.ui.showEvent(method === 'war' ? 'Terytorium zdobyte!' : 'Aneksja!', `${icon} ${cname} przejął ${tname}.`);
        this.map.render();
    }

    conquestCountry(winnerId, loserId) {
        for (const t of Object.values(this.state.territories)) if (t.owner === loserId) t.owner = winnerId;
        for (const c of Object.values(this.state.countries)) c.atWarWith = c.atWarWith.filter(id => id !== loserId);
        for (const al of Object.values(this.state.alliances)) al.members = al.members.filter(m => m !== loserId);
        const winner = this.state.countries[winnerId];
        const loser = this.state.countries[loserId];
        this.addLog(`🏴 ${winner.name} pokonał ${loser.name}!`);
        this.ui.showEvent('KRAJ POKONANY!', `🏴 ${winner.name} zajął ${loser.name}!`, 'victory');
        if (loserId === this.playerCountry) setTimeout(() => this.endGame('defeat'), 1000);
        this.map.render();
    }

    // ── HELPERS ───────────────────────────────────────────────
    getMilitaryStrength(countryId) {
        const c = this.state.countries[countryId];
        if (!c) return 0;
        return c.military.infantry * 1 + c.military.tanks * 3 + c.military.planes * 2 + c.military.ships * 1.5;
    }

    getCountryTerritories(countryId) {
        return Object.keys(this.state.territories).filter(tid => this.state.territories[tid].owner === countryId);
    }

    getCountryVP(countryId) {
        return this.getCountryTerritories(countryId).reduce((sum, tid) => sum + (this.state.territories[tid].vp || 0), 0);
    }

    getAllianceOf(countryId) {
        return Object.values(this.state.alliances).find(a => a.members.includes(countryId) || a.leader === countryId);
    }

    areAllied(a, b) {
        const a1 = this.getAllianceOf(a);
        const a2 = this.getAllianceOf(b);
        return a1 && a2 && a1 === a2;
    }

    getActiveWars() {
        const processed = new Set();
        const wars = {};
        for (const [id, c] of Object.entries(this.state.countries)) {
            for (const enemy of c.atWarWith) {
                const key = [id, enemy].sort().join('|');
                if (!processed.has(key)) {
                    processed.add(key);
                    if (!wars[id]) wars[id] = [];
                    wars[id].push(enemy);
                }
            }
        }
        return wars;
    }

    addLog(msg) {
        const entry = `<span class="log-time">[${this.year} W${this.week}]</span> ${msg}`;
        this.state.log.unshift(entry);
        if (this.state.log.length > 60) this.state.log.pop();
        if (this.ui) this.ui.updateLog();
    }

    checkVictory() {
        const playerVP = this.getCountryVP(this.playerCountry);
        if (playerVP >= GAME_DATA.settings.victoryVP) {
            this.pause();
            setTimeout(() => this.endGame('victory'), 500);
            return;
        }
        if (this.year >= 1945 && this.week >= 50) {
            const maxAIVP = Math.max(...Object.keys(this.state.countries)
                .filter(id => id !== this.playerCountry)
                .map(id => this.getCountryVP(id)));
            this.endGame(playerVP > maxAIVP ? 'victory' : 'defeat');
        }
    }

    endGame(result) {
        this.pause();
        this.ui.showEndScreen(result);
    }

    // ── PLAYER ACTIONS ────────────────────────────────────────
    playerSelectFocus(focusId) {
        const c = this.state.countries[this.playerCountry];
        if (c.activeFocus) return;
        const tree = GAME_DATA.focusTrees[c.focusTree] || [];
        const focus = tree.find(f => f.id === focusId);
        if (!focus) return;
        if (!(focus.requires || []).every(r => c.completedFocuses.includes(r))) {
            this.ui.showToast('Wymagania nie spełnione!'); return;
        }
        c.activeFocus = focusId;
        c.focusProgress = 0;
        this.addLog(`🎯 Fokus: "${focus.name}" (${focus.weeksToComplete} tyg).`);
        this.ui.update();
    }

    playerStartResearch(techId) {
        const c = this.state.countries[this.playerCountry];
        if (c.activeResearch) { this.ui.showToast('Już trwają badania!'); return; }
        if (c.technologies.includes(techId)) { this.ui.showToast('Już zbadano!'); return; }
        const tech = GAME_DATA.technologies[techId];
        if (!(tech.requires || []).every(r => c.technologies.includes(r))) {
            this.ui.showToast('Wymagania technologiczne nie spełnione!'); return;
        }
        c.activeResearch = techId;
        c.researchProgress = 0;
        this.addLog(`🔬 Badania: "${tech.name}".`);
        this.ui.update();
    }

    playerProduceEquipment(equipmentId, quantity) {
        const c = this.state.countries[this.playerCountry];
        const eq = GAME_DATA.equipment[equipmentId];
        if (!eq) return;
        const totalCost = eq.cost * quantity;
        if (c.resources.steel < totalCost) { this.ui.showToast(`Za mało stali! Potrzebujesz ${totalCost}.`); return; }
        c.resources.steel -= totalCost;
        c.productionQueue.push({ equipmentId, quantity, progress: 0, weeksTotal: eq.prodWeeks });
        this.addLog(`🏭 Zamówiono: ${quantity}x ${eq.name}.`);
        this.ui.update();
    }

    playerDeclareWar(targetId) {
        const c = this.state.countries[this.playerCountry];
        if (c.atWarWith.includes(targetId)) { this.ui.showToast('Już jesteś w stanie wojny!'); return; }
        if (this.areAllied(this.playerCountry, targetId)) { this.ui.showToast('Nie możesz atakować sojusznika!'); return; }
        this.declareCasusBelli(this.playerCountry, targetId);
        this.ui.update();
    }

    playerJoinAlliance(allianceId) {
        this.joinAlliance(this.playerCountry, allianceId);
        this.ui.update();
    }
}

// ══════════════════════════════════════════════════════════════
// UI CONTROLLER
// ══════════════════════════════════════════════════════════════
class UIController {
    constructor(engine) {
        this.engine = engine;
        this.currentPanel = 'overview';
        this.eventQueue = [];
        this.showingEvent = false;
    }

    showMainGame() {
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('game-ui').style.display = 'grid';
        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('btn-pause').addEventListener('click', () => this.engine.togglePause());
        document.querySelectorAll('.panel-tab').forEach(btn => {
            btn.addEventListener('click', e => {
                this.currentPanel = e.currentTarget.dataset.panel;
                document.querySelectorAll('.panel-tab').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.renderPanel();
            });
        });
        // Speed buttons
        document.querySelectorAll('.speed-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                const idx = parseInt(e.currentTarget.dataset.idx);
                this.engine.setSpeed(idx);
            });
        });
    }

    update() {
        this.updateHeader();
        this.renderPanel();
    }

    updateHeader() {
        const c = this.engine.state.countries[this.engine.playerCountry];
        const vp = this.engine.getCountryVP(this.engine.playerCountry);
        document.getElementById('hdr-date').textContent = `${this.engine.year} • W${this.engine.week}`;
        document.getElementById('hdr-country').textContent = `${c.flag} ${c.name}`;
        document.getElementById('hdr-vp').textContent = `${vp}`;
        document.getElementById('hdr-steel').textContent = c.resources.steel;
        document.getElementById('hdr-oil').textContent = c.resources.oil;
        document.getElementById('hdr-ic').textContent = c.resources.ic;
        document.getElementById('hdr-military').textContent = `👥${c.military.infantry} 🚀${c.military.tanks} ✈️${c.military.planes} ⚓${c.military.ships}`;
        document.getElementById('hdr-stability').textContent = c.stats.stability;
    }

    updatePauseButton() {
        const btn = document.getElementById('btn-pause');
        btn.textContent = this.engine.paused ? '▶ GRAJ' : '⏸ PAUZA';
        btn.classList.toggle('paused', this.engine.paused);
    }

    updateSpeedButtons() {
        document.querySelectorAll('.speed-btn').forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.idx) === this.engine.speedIndex);
        });
    }

    updateLog() {
        const el = document.getElementById('event-log');
        if (!el) return;
        el.innerHTML = this.engine.state.log.map(e => `<div class="log-entry">${e}</div>`).join('');
    }

    renderPanel() {
        const map = { overview: this.renderOverview, focus: this.renderFocus, tech: this.renderTech, production: this.renderProduction, diplomacy: this.renderDiplomacy };
        const fn = map[this.currentPanel];
        if (fn) fn.call(this);
    }

    renderOverview() {
        const c = this.engine.state.countries[this.engine.playerCountry];
        const territories = this.engine.getCountryTerritories(this.engine.playerCountry);
        const vp = this.engine.getCountryVP(this.engine.playerCountry);
        const strength = Math.round(this.engine.getMilitaryStrength(this.engine.playerCountry));
        const atWar = c.atWarWith.map(id => this.engine.state.countries[id]?.name || id).join(', ') || 'Brak';
        const allianceName = this.engine.getAllianceOf(this.engine.playerCountry)?.name || 'Brak';

        document.getElementById('panel-content').innerHTML = `
      <div class="overview-grid">
        <div class="stat-card">
          <div class="stat-label">🏆 Victory Points</div>
          <div class="stat-value big">${vp} / ${GAME_DATA.settings.victoryVP}</div>
          <div class="progress-bar"><div class="progress-fill" style="width:${Math.min(100, vp / GAME_DATA.settings.victoryVP * 100)}%"></div></div>
        </div>
        <div class="stat-card">
          <div class="stat-label">⚔️ Siła militarna</div>
          <div class="stat-value big">${strength}</div>
          <div class="stat-detail">👥 ${c.military.infantry} 🚀 ${c.military.tanks} ✈️ ${c.military.planes} ⚓ ${c.military.ships}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">🏭 Zasoby</div>
          <div class="stat-detail">⚙️ ${c.resources.steel} | 🛢️ ${c.resources.oil} | 🔩 ${c.resources.aluminum}</div>
          <div class="stat-detail">IC: ${c.resources.ic} | 👨 ${c.stats.manpower}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">📊 Stabilność / Morale</div>
          <div class="progress-bar"><div class="progress-fill" style="width:${c.stats.stability}%;background:var(--green-light)"></div></div>
          <div class="stat-detail">${c.stats.stability}% stabilność | ${c.stats.warSupport}% morale</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">🌍 Terytoria (${territories.length})</div>
          <div class="stat-detail">${territories.map(t => this.engine.state.territories[t].name).join(', ')}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">🤝 ${allianceName} | ⚔️ ${c.atWarWith.length ? 'W WOJNIE' : 'Pokój'}</div>
          <div class="stat-detail ${c.atWarWith.length ? 'war-status' : ''}">${c.atWarWith.length ? 'W wojnie z: ' + atWar : 'Brak działań wojennych'}</div>
        </div>
        ${c.activeFocus ? `<div class="stat-card focus-active"><div class="stat-label">🎯 Aktywny fokus</div><div class="stat-value">${GAME_DATA.focusTrees[c.focusTree]?.find(f => f.id === c.activeFocus)?.name || ''}</div><div class="progress-bar"><div class="progress-fill" style="width:${Math.round(c.focusProgress / (GAME_DATA.focusTrees[c.focusTree]?.find(f => f.id === c.activeFocus)?.weeksToComplete || 1) * 100)}%"></div></div><div class="stat-detail">${c.focusProgress}/${GAME_DATA.focusTrees[c.focusTree]?.find(f => f.id === c.activeFocus)?.weeksToComplete} tyg</div></div>` : ''}
        ${c.activeResearch ? `<div class="stat-card"><div class="stat-label">🔬 Badania</div><div class="stat-value">${GAME_DATA.technologies[c.activeResearch]?.name || ''}</div><div class="progress-bar"><div class="progress-fill research" style="width:${Math.round(c.researchProgress / (GAME_DATA.technologies[c.activeResearch]?.weeksToResearch || 1) * 100)}%"></div></div></div>` : ''}
      </div>`;
    }

    renderFocus() {
        const c = this.engine.state.countries[this.engine.playerCountry];
        const tree = GAME_DATA.focusTrees[c.focusTree] || [];

        const html = tree.map(f => {
            const done = c.completedFocuses.includes(f.id);
            const active = c.activeFocus === f.id;
            const prereqs = (f.requires || []).every(r => c.completedFocuses.includes(r));
            const avail = !done && !active && prereqs && !c.activeFocus;
            let cls = 'focus-node';
            if (done) cls += ' done';
            else if (active) cls += ' active';
            else if (!prereqs) cls += ' locked';
            else if (avail) cls += ' available';

            const progress = active ? `<div class="focus-progress"><div style="width:${Math.round(c.focusProgress / f.weeksToComplete * 100)}%"></div></div>` : '';
            const reqTxt = f.requires?.length ? `<div class="focus-requires">⛓ ${f.requires.map(r => tree.find(x => x.id === r)?.name || r).join(', ')}</div>` : '';

            return `<div class="${cls}" onclick="${avail ? `engine.playerSelectFocus('${f.id}')` : ''}" title="${f.description}">
              <div class="focus-icon">${f.icon}</div>
              <div class="focus-name">${f.name}</div>
              <div class="focus-weeks">${done ? '✅' : active ? `${c.focusProgress}/${f.weeksToComplete}t` : f.weeksToComplete + 't'}</div>
              ${progress}${reqTxt}
            </div>`;
        }).join('');

        document.getElementById('panel-content').innerHTML = `
      <div class="focus-header">
        <h3>🌲 Fokusy — ${c.name}</h3>
        <div class="active-focus-info">${c.activeFocus ? 'Aktywny: ' + tree.find(f => f.id === c.activeFocus)?.name : 'Wybierz fokus!'}</div>
      </div>
      <div class="focus-grid">${html}</div>`;
    }

    renderTech() {
        const c = this.engine.state.countries[this.engine.playerCountry];
        const cats = ['land', 'air', 'sea', 'industry'];
        const catNames = { land: '⚔️ Lądowe', air: '✈️ Lotnicze', sea: '⚓ Morskie', industry: '🏭 Przemysłowe' };

        const html = cats.map(cat => {
            const techs = Object.entries(GAME_DATA.technologies).filter(([, t]) => t.category === cat);
            const techHTML = techs.map(([id, tech]) => {
                const done = c.technologies.includes(id);
                const active = c.activeResearch === id;
                const prereqs = (tech.requires || []).every(r => c.technologies.includes(r));
                let cls = 'tech-node';
                if (done) cls += ' done';
                else if (active) cls += ' active';
                else if (!prereqs) cls += ' locked';
                const bonus = tech.bonus ? Object.entries(tech.bonus).map(([k, v]) => `+${v} ${k}`).join(', ') : '';
                const progress = active ? `<div class="focus-progress"><div style="width:${Math.round(c.researchProgress / tech.weeksToResearch * 100)}%"></div></div>` : '';
                const canClick = !done && !active && prereqs && !c.activeResearch;
                return `<div class="${cls}" onclick="${canClick ? `engine.playerStartResearch('${id}')` : ''}" title="${tech.name}: ${bonus}">
                  <div class="tech-name">${tech.name}</div>
                  <div class="tech-weeks">${done ? '✅' : active ? `${c.researchProgress}/${tech.weeksToResearch}t` : tech.weeksToResearch + 't'}</div>
                  <div class="tech-bonus">${bonus}</div>${progress}
                </div>`;
            }).join('');
            return `<div class="tech-category"><div class="tech-cat-header">${catNames[cat]}</div><div class="tech-list">${techHTML}</div></div>`;
        }).join('');

        document.getElementById('panel-content').innerHTML = `
      <div class="focus-header">
        <h3>🔬 Badania</h3>
        <div class="active-focus-info">${c.activeResearch ? 'Badane: ' + GAME_DATA.technologies[c.activeResearch]?.name : 'Kliknij technologię.'}</div>
      </div>
      <div class="tech-grid">${html}</div>`;
    }

    renderProduction() {
        const c = this.engine.state.countries[this.engine.playerCountry];
        const eqHTML = Object.entries(GAME_DATA.equipment).map(([id, eq]) => `
      <div class="prod-item">
        <div class="prod-name">${eq.name}</div>
        <div class="prod-detail">Koszt: ${eq.cost}⚙️ | ${eq.prodWeeks} tygodni | ${eq.unitType}</div>
        <div class="prod-buttons">
          <button onclick="engine.playerProduceEquipment('${id}',1)">+1 (${eq.cost}⚙️)</button>
          <button onclick="engine.playerProduceEquipment('${id}',3)">+3 (${eq.cost * 3}⚙️)</button>
          <button onclick="engine.playerProduceEquipment('${id}',5)">+5 (${eq.cost * 5}⚙️)</button>
        </div>
      </div>`).join('');

        const qHTML = c.productionQueue.length === 0
            ? '<div class="empty-queue">Kolejka pusta.</div>'
            : c.productionQueue.map(item => {
                const eq = GAME_DATA.equipment[item.equipmentId];
                return `<div class="queue-item">
                  <span>${eq?.name || item.equipmentId} x${item.quantity}</span>
                  <div class="focus-progress"><div style="width:${Math.round((item.progress || 0) / (item.weeksTotal || 1) * 100)}%"></div></div>
                  <span>${item.progress || 0}/${item.weeksTotal}t</span>
                </div>`;
            }).join('');

        document.getElementById('panel-content').innerHTML = `
      <div class="focus-header">
        <h3>🏭 Produkcja</h3>
        <div class="active-focus-info">Stal: <b>${c.resources.steel}</b> ⚙️</div>
      </div>
      <div class="prod-grid">${eqHTML}</div>
      <h4 style="margin:14px 0 8px;color:var(--gold)">📋 Kolejka</h4>
      <div class="prod-queue">${qHTML}</div>`;
    }

    renderDiplomacy() {
        const c = this.engine.state.countries[this.engine.playerCountry];
        const myAl = this.engine.getAllianceOf(this.engine.playerCountry);
        const alHTML = Object.entries(this.engine.state.alliances).map(([id, al]) => {
            const isMine = myAl === al;
            const memberNames = al.members.map(m => this.engine.state.countries[m]?.name || m).join(', ') || 'Brak';
            return `<div class="alliance-card ${isMine ? 'my-alliance' : ''}">
              <div class="alliance-name">${al.name} ${isMine ? '✅' : ''}</div>
              <div class="alliance-members">👥 ${memberNames}</div>
              ${!isMine ? `<button onclick="engine.playerJoinAlliance('${id}')">Dołącz</button>` : '<div style="color:var(--gold-light);font-size:12px;margin-top:4px">Twój sojusz</div>'}
            </div>`;
        }).join('');

        const countryHTML = Object.entries(this.engine.state.countries)
            .filter(([id]) => id !== this.engine.playerCountry)
            .map(([id, co]) => {
                const str = Math.round(this.engine.getMilitaryStrength(id));
                const vp = this.engine.getCountryVP(id);
                const atWar = c.atWarWith.includes(id);
                const allied = this.engine.areAllied(this.engine.playerCountry, id);
                const alName = this.engine.getAllianceOf(id)?.name || '-';
                let statusTxt = '😐 Neutralny';
                if (atWar) statusTxt = '⚔️ W STANIE WOJNY';
                else if (allied) statusTxt = '🤝 Sojusznik';
                const cbLeft = c.casusBelli[id] ? `⏳ CB: ${c.casusBelli[id]} tyg` : '';
                return `<div class="country-dip-card">
                  <div class="country-dip-header">${co.flag} ${co.name}</div>
                  <div class="country-dip-detail">Siła: ${str} | VP: ${vp} | Sojusz: ${alName} | Ideologia: ${co.ideology}</div>
                  <div class="country-dip-detail ${atWar ? 'war-status' : allied ? 'ally-status' : ''}">${statusTxt} ${cbLeft}</div>
                  ${!atWar && !allied ? `<button class="war-btn" onclick="engine.playerDeclareWar('${id}')">⚠️ Uzasadnij wojnę</button>` : ''}
                </div>`;
            }).join('');

        document.getElementById('panel-content').innerHTML = `
      <div class="focus-header">
        <h3>🌍 Dyplomacja</h3>
        <div class="active-focus-info">Twój sojusz: <b>${myAl?.name || 'Brak'}</b></div>
      </div>
      <h4 style="margin:0 0 8px;color:var(--gold)">Sojusze</h4>
      <div class="alliance-grid">${alHTML}</div>
      <h4 style="margin:14px 0 8px;color:var(--gold)">Kraje</h4>
      <div class="countries-grid">${countryHTML}</div>`;
    }

    showEvent(title, msg, type = '') {
        this.eventQueue.push({ title, msg, type });
        if (!this.showingEvent) this.showNextEvent();
    }

    showNextEvent() {
        if (this.eventQueue.length === 0) { this.showingEvent = false; return; }
        this.showingEvent = true;
        const { title, msg, type } = this.eventQueue.shift();
        const overlay = document.getElementById('event-overlay');
        overlay.className = `event-overlay show ${type}`;
        document.getElementById('event-title').textContent = title;
        document.getElementById('event-msg').textContent = msg;
        setTimeout(() => {
            overlay.className = 'event-overlay';
            setTimeout(() => this.showNextEvent(), 300);
        }, 3500);
    }

    showToast(msg) {
        const t = document.getElementById('toast');
        t.textContent = msg;
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 2500);
    }

    showEndScreen(result) {
        const vp = this.engine.getCountryVP(this.engine.playerCountry);
        const terr = this.engine.getCountryTerritories(this.engine.playerCountry).length;
        const wins = result === 'victory';
        document.getElementById('game-ui').insertAdjacentHTML('afterend', `
      <div class="end-screen">
        <div class="end-card ${result}">
          <div class="end-icon">${wins ? '🏆' : '💀'}</div>
          <h1>${wins ? 'ZWYCIĘSTWO!' : 'KLĘSKA!'}</h1>
          <p>${wins ? `Zdobyłeś ${vp} VP i opanowałeś Europę!` : `Twój kraj upadł. Zebrano ${vp} VP.`}</p>
          <div class="end-stats">Rok: ${this.engine.year} • Tydzień: ${this.engine.week}<br>Terytoria: ${terr} • Victory Points: ${vp}</div>
          <button onclick="location.reload()">🔄 NOWA GRA</button>
        </div>
      </div>`);
    }
}

// ══════════════════════════════════════════════════════════════
// MAP CONTROLLER
// ══════════════════════════════════════════════════════════════
class MapController {
    constructor(engine) {
        this.engine = engine;
        this.selectedTid = null;
        this.width = 1000;
        this.height = 700;
        this.svg = null;
        this.g = null;
        this.projection = null;
        this.pathGenerator = null;

        // War Room muted color palette
        this.ideologyColors = {
            germany: '#4a4d52', // Slate Grey
            poland: '#6a1b1b', // Muted Deep Red
            france: '#3a4d6a', // Muted Blue
            uk: '#5a543a', // Muted Khaki/Olive
            ussr: '#7a1a1a', // Soviet Red
            italy: '#2a4a2a', // Italian Green
            neutral: '#f5f1e6', // Default cream
        };

        this.initMap();
    }

    async initMap() {
        const container = d3.select('#europe-map');
        this.svg = container.append('svg')
            .attr('viewBox', `0 0 ${this.width} ${this.height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet');

        this.g = this.svg.append('g');

        // Zoom & Pan
        const zoom = d3.zoom()
            .scaleExtent([1, 8])
            .on('zoom', (event) => {
                this.g.attr('transform', event.transform);
            });
        this.svg.call(zoom);

        // Projection focused on Europe
        this.projection = d3.geoAzimuthalEqualArea()
            .rotate([-15, -52])
            .scale(1200)
            .translate([this.width / 2, this.height / 2]);

        this.pathGenerator = d3.geoPath().projection(this.projection);

        try {
            // High fidelity Europe map with countries/regions
            const response = await fetch('https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/TopoJSON/europe.topojson');
            const data = await response.json();
            const nations = topojson.feature(data, data.objects.europe);

            document.getElementById('loading-overlay').style.display = 'none';

            this.g.selectAll('.territory')
                .data(nations.features)
                .enter()
                .append('path')
                .attr('class', 'territory')
                .attr('d', this.pathGenerator)
                .attr('data-id', d => this.mapFeatureToTid(d))
                .on('click', (event, d) => {
                    const tid = this.mapFeatureToTid(d);
                    if (tid) this.handleClick(tid);
                })
                .append('title')
                .text(d => d.properties.NAME || d.properties.NAME_EN);

            this.render();
        } catch (error) {
            console.error('Map loading failed:', error);
            document.getElementById('loading-overlay').textContent = 'Error loading map data.';
        }
    }

    // Maps TopoJSON features to our GAME_DATA territory IDs
    mapFeatureToTid(feature) {
        const name = (feature.properties.NAME || feature.properties.NAME_EN || "").toLowerCase();
        const iso = (feature.properties.ISO_A2 || feature.properties.AD0_A3 || "").toUpperCase();

        // Simple heuristic mapping
        if (iso === 'DE' || name.includes('germany')) return 'ger_center';
        if (iso === 'PL' || name.includes('poland')) return 'pol_center';
        if (iso === 'FR' || name.includes('france')) return 'fra_north';
        if (iso === 'GB' || name.includes('united kingdom')) return 'england';
        if (iso === 'RU' || name.includes('russia')) return 'ussr_moscow';
        if (iso === 'IT' || name.includes('italy')) return 'italy_north';
        if (iso === 'IE' || name.includes('ireland')) return 'ireland';
        if (iso === 'NO' || name.includes('norway')) return 'nor_south';
        if (iso === 'SE' || name.includes('sweden')) return 'swe_south';
        if (iso === 'FI' || name.includes('finland')) return 'finland';
        if (iso === 'DK' || name.includes('denmark')) return 'denmark';
        if (iso === 'NL' || name.includes('netherlands')) return 'netherlands';
        if (iso === 'BE' || name.includes('belgium')) return 'belgium';
        if (iso === 'ES' || name.includes('spain')) return 'spa_north';
        if (iso === 'PT' || name.includes('portugal')) return 'portugal';
        if (iso === 'CH' || name.includes('switzerland')) return 'switzerland';
        if (iso === 'AT' || name.includes('austria')) return 'austria';
        if (iso === 'CZ' || name.includes('czech')) return 'czechia';
        if (iso === 'HU' || name.includes('hungary')) return 'hungary';
        if (iso === 'RO' || name.includes('romania')) return 'romania';
        if (iso === 'YU' || name.includes('yugoslavia')) return 'yugoslavia';
        if (iso === 'BG' || name.includes('bulgaria')) return 'bulgaria';
        if (iso === 'GR' || name.includes('greece')) return 'greece';
        if (iso === 'AL' || name.includes('albania')) return 'albania';
        if (iso === 'TR' || name.includes('turkey')) return 'turkey';

        return null;
    }

    getOwnerColor(owner) {
        if (!owner || owner === 'neutral') return '#f5f1e6';
        return this.ideologyColors[owner] || '#f5f1e6';
    }

    render() {
        if (!this.g) return;

        this.g.selectAll('.territory').each((d, i, nodes) => {
            const tid = this.mapFeatureToTid(d);
            const el = d3.select(nodes[i]);

            if (tid && this.engine.state.territories[tid]) {
                const territory = this.engine.state.territories[tid];
                const owner = territory.owner;
                const color = this.getOwnerColor(owner);
                const isAtWar = owner && this.engine.state.countries[owner]?.atWarWith.length > 0;
                const isPlayer = owner === this.engine.playerCountry;

                el.style('fill', color)
                    .style('stroke', isAtWar ? '#ff4444' : (isPlayer ? '#d4af37' : '#666e7a'))
                    .style('stroke-width', isAtWar ? '1px' : (isPlayer ? '0.8px' : '0.3px'))
                    .classed('at-war', isAtWar)
                    .classed('selected', tid === this.selectedTid);
            }
        });
    }

    handleClick(tid) {
        this.selectedTid = tid;
        this.render();
        const t = this.engine.state.territories[tid];
        const pc = this.engine.playerCountry;
        const infoBox = document.getElementById('map-info');
        const nameEl = document.getElementById('map-info-name');
        const bodyEl = document.getElementById('map-info-body');
        const warBtn = document.getElementById('miniwar-btn');

        if (!t) { infoBox.style.display = 'none'; return; }

        const owner = t.owner;
        nameEl.textContent = `${t.name} (${t.vp} VP)`;
        const ownerData = owner && this.engine.state.countries[owner];
        const ownerStr = ownerData ? `${ownerData.flag} ${ownerData.name}` : 'Neutralny';
        const strength = ownerData ? Math.round(this.engine.getMilitaryStrength(owner)) : 0;
        const atWar = ownerData?.atWarWith.length > 0 ? `⚔️ W wojnie` : '🕊️ W pokoju';

        bodyEl.innerHTML = `<b>Właściciel:</b> ${ownerStr}<br><b>Siła:</b> ${strength}<br><b>Status:</b> ${atWar}`;

        const showWarBtn = owner && owner !== pc && !this.engine.state.countries[pc]?.atWarWith.includes(owner) && !this.engine.areAllied(pc, owner);
        warBtn.style.display = showWarBtn ? 'block' : 'none';
        warBtn.onclick = () => this.engine.playerDeclareWar(owner);

        infoBox.style.display = 'block';
    }
}
