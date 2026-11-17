// ============================================================================
// 1. SPATIAL HRTF AUDIO ENGINE
// ============================================================================
const AudioEngine = {
  ctx: null,
  buffers: {},
  files: {
    VANDAL: 'assets/audio/vandal_shot.mp3',
    PHANTOM: 'assets/audio/phantom_shot.mp3',
    OPERATOR: 'assets/audio/operator_shot.mp3',
    CLASSIC: 'assets/audio/classic_shot.mp3',
    RELOAD: 'assets/audio/reload.mp3',
    HEADSHOT: 'assets/audio/headshot_ding.mp3',
    ABILITY: 'assets/audio/ability_cast.mp3',
    PLANT: 'assets/audio/spike_plant.mp3',
    BEEP: 'assets/audio/spike_beep.mp3',
    BUY: 'assets/audio/buy_click.mp3',
    ROUND_START: 'assets/audio/round_start.mp3'
  },

  async init() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (this.ctx.state === 'suspended') await this.ctx.resume();
    for (const [key, url] of Object.entries(this.files)) {
      if (this.buffers[key]) continue;
      try {
        const res = await fetch(url);
        if (res.ok) this.buffers[key] = await this.ctx.decodeAudioData(await res.arrayBuffer());
      } catch (e) {}
    }
  },

  play(key, volume = 0.8, pitchVar = 0.04) {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    if (this.buffers[key]) {
      const src = this.ctx.createBufferSource();
      const gain = this.ctx.createGain();
      src.buffer = this.buffers[key];
      src.playbackRate.value = 1 + (Math.random() - 0.5) * pitchVar;
      gain.gain.value = volume;
      src.connect(gain);
      gain.connect(this.ctx.destination);
      src.start(0);
    } else if (this.ctx) {
      this.playSynth(key);
    }
  },

  play3D(key, sourcePos, listenerPos, listenerYaw, volume = 0.7) {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    const panner = this.ctx.createPanner();
    panner.panningModel = 'HRTF';
    panner.distanceModel = 'inverse';
    panner.refDistance = 4;
    panner.maxDistance = 75;
    panner.setPosition(sourcePos.x, sourcePos.y, sourcePos.z);

    const listener = this.ctx.listener;
    if (listener.positionX) {
      listener.positionX.value = listenerPos.x;
      listener.positionY.value = listenerPos.y;
      listener.positionZ.value = listenerPos.z;
      listener.forwardX.value = -Math.sin(listenerYaw);
      listener.forwardZ.value = -Math.cos(listenerYaw);
    }

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(165, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.13);
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.14);

    osc.connect(gain);
    gain.connect(panner);
    panner.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.14);
  },

  playSynth(key) {
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    if (key === 'HEADSHOT') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1560, now);
      osc.frequency.exponentialRampToValueAtTime(2380, now + 0.14);
      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.start(now); osc.stop(now + 0.18);
    } else if (key === 'RELOAD') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.setValueAtTime(680, now + 0.12);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.start(now); osc.stop(now + 0.22);
    } else if (key === 'BEEP') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1980, now);
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.start(now); osc.stop(now + 0.09);
    } else if (key === 'ROUND_START') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.linearRampToValueAtTime(165, now + 0.45);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc.start(now); osc.stop(now + 0.55);
    } else if (key === 'ABILITY') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.exponentialRampToValueAtTime(760, now + 0.25);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
      osc.start(now); osc.stop(now + 0.26);
    } else if (key === 'BUY') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now); osc.stop(now + 0.06);
    } else {
      const baseFreq = key === 'OPERATOR' ? 95 : (key === 'VANDAL' ? 155 : (key === 'PHANTOM' ? 210 : 240));
      osc.type = key === 'PHANTOM' ? 'triangle' : 'sawtooth';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(28, now + 0.14);
      gain.gain.setValueAtTime(0.42, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now); osc.stop(now + 0.15);
    }
  }
};

// ============================================================================
// 2. MAIN GAME CONTROLLER
// ============================================================================
const Game = {
  started: false,
  selectedAgent: 'PHOENIX',
  phase: 'BUY',
  phaseTime: 15,
  round: 1,
  atkScore: 0,
  defScore: 0,
  credits: 800,
  lossStreak: 0,
  hp: 100,
  shield: 0,
  regenReserve: 0,
  lastDamageTime: 0,
  kills: 0,
  deaths: 0,
  dealtStats: { dmg: 0, head: 0, body: 0 },
  takenStats: { dmg: 0, head: 0, body: 0 },

  weapon: { name: 'CLASSIC', mag: 12, reserve: 36, maxMag: 12, dmg: 26, headDmg: 78, fireRate: 0.14, pen: 'LOW' },
  isKnifeEquipped: false,
  lastShot: 0,
  sprayIndex: 0,
  recoilPitch: 0,
  recoilYaw: 0,
  isReloading: false,
  reloadTimer: 0,
  equipTimer: 0,
  walkBobPhase: 0,

  playerPos: new THREE.Vector3(0, 1.75, 44),
  velY: 0,
  isGrounded: true,
  isCrouching: false,
  isMoving: false,
  ads: false,

  cReady: true,
  qReady: true,
  eReady: true,
  ultPoints: 0,
  ultMax: 6,
  flashBlindIntensity: 0,
  activeSmokes: [],
  teleporters: [],
  ultOrbs: [],
  droppedWeapons: [],
  spikePlanted: false,
  plantedSite: '',
  spikeTimer: 45,
  plantProgress: 0,
  defuseProgress: 0,
  defuseHalfReached: false,

  buyMenuOpen: false,
  remoteMeshes: {},
  rankIndex: 10,
  rr: 54,
  wins: 0,
  asTimerVal: 75,
  asInterval: null,
  lobbySeconds: 0,
  init() {
    if (typeof ValorantArt !== 'undefined') ValorantArt.initTextures();
    this.loadCareerData();
    this.populateAgentGrid();
    this.populateBuyMenu();

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xb8d4e3);
    this.scene.fog = new THREE.FogExp2(0xb8d4e3, 0.0048);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 260);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.12;
    document.body.appendChild(this.renderer.domElement);

    const hemi = new THREE.HemisphereLight(0xfff7eb, 0x3b4d5e, 0.9);
    this.scene.add(hemi);
    this.dirLight = new THREE.DirectionalLight(0xffeedd, 1.15);
    this.dirLight.position.set(35, 60, 28);
    this.dirLight.castShadow = true;
    this.scene.add(this.dirLight);

    this.mapObjects = [];
    this.coverNodes = [];
    this.buildMap('HAVEN');
    this.buildViewmodel('CLASSIC');
    this.enemies = [];
    this.yaw = 0;
    this.pitch = 0;
    this.keys = {};

    this.bindEvents();
    this.clock = new THREE.Clock();
    this.startTimers();
    this.animate();
  },

  loadCareerData() {
    const saved = JSON.parse(localStorage.getItem('val_career_v5') || 'null');
    if (saved) { this.rankIndex = saved.rankIndex; this.rr = saved.rr; this.wins = saved.wins; }
    this.updateRankUI();
  },

  saveCareerData() {
    localStorage.setItem('val_career_v5', JSON.stringify({ rankIndex: this.rankIndex, rr: this.rr, wins: this.wins }));
  },

  updateRankUI() {
    const r = VAL_DATA.ranks[this.rankIndex];
    document.getElementById('lobby-rank-badge').innerText = `${r.name} • ${this.rr} RR`;
    document.getElementById('card-rank-text').innerText = r.name;
    document.getElementById('rank-emblem').innerText = r.short;
    document.getElementById('rank-name-display').innerText = r.name;
    document.getElementById('rr-fill').style.width = `${this.rr}%`;
    document.getElementById('rr-text').innerHTML = `${this.rr} / 100 RR • Wins: <span id="career-wins">${this.wins}</span>`;
  },

  setGraphics(preset) {
    this.dirLight.castShadow = preset === 'high';
    this.renderer.setPixelRatio(preset === 'high' ? window.devicePixelRatio : 0.75);
  },

  applyCrosshairCode() {
    const code = document.getElementById('crosshair-code').value;
    const colorMap = { '0': '#ffffff', '1': '#00ff00', '2': '#ccff00', '4': '#00ffff', '5': '#ff4655', '6': '#ff00ff' };
    const match = code.match(/c;(\d)/);
    const hex = match && colorMap[match] ? colorMap[match] : '#00ffcc';
    document.querySelectorAll('.ch-line').forEach(el => el.style.background = hex);
    AudioEngine.play('BUY');
  },

  populateAgentGrid() {
    const grid = document.getElementById('agent-roster-grid');
    grid.innerHTML = '';
    VAL_DATA.agents.forEach((ag, idx) => {
      const tile = document.createElement('div');
      tile.className = 'as-tile' + (idx === 0 ? ' selected' : '');
      tile.innerText = ag.name;
      tile.onclick = () => {
        AudioEngine.play('BUY', 0.4);
        document.querySelectorAll('.as-tile').forEach(t => t.classList.remove('selected'));
        tile.classList.add('selected');
        this.previewAgent(ag);
      };
      grid.appendChild(tile);
    });
    this.previewAgent(VAL_DATA.agents);
  },

  previewAgent(ag) {
    this.selectedAgent = ag.name;
    this.ultMax = ag.ultCost;
    document.getElementById('as-role').innerText = ag.role;
    document.getElementById('as-agent-title').innerText = ag.name;
    document.getElementById('as-agent-desc').innerText = ag.desc;
    document.getElementById('as-my-pick').innerText = ag.name;

    const abList = document.getElementById('as-abilities-list');
    abList.innerHTML = `
      <div class="as-ab-card"><strong>[C] ${ag.abilities.c}</strong>Utility</div>
      <div class="as-ab-card"><strong>[Q] ${ag.abilities.q}</strong>Utility</div>
      <div class="as-ab-card"><strong>[E] ${ag.abilities.e}</strong>Signature</div>
      <div class="as-ab-card"><strong>[X] ${ag.abilities.x}</strong>Ultimate (${ag.ultCost} Pts)</div>
    `;
  },

  enterAgentSelect(fromNet = false) {
    AudioEngine.init();
    AudioEngine.play('BUY');
    if (!fromNet && Network.isHost) Network.broadcast({ type: 'AGENT_SELECT' });
    const tag = document.getElementById('player-name').value || 'Riot Player';
    const mapKey = document.getElementById('map-select').value;
    document.getElementById('as-my-name').innerText = tag;
    document.getElementById('as-map-name').innerText = mapKey;
    document.getElementById('lobby-screen').style.display = 'none';
    document.getElementById('agent-select-screen').style.display = 'flex';

    this.asTimerVal = 75;
    document.getElementById('as-timer').innerText = this.asTimerVal;
    if (this.asInterval) clearInterval(this.asInterval);
    this.asInterval = setInterval(() => {
      this.asTimerVal--;
      document.getElementById('as-timer').innerText = Math.max(0, this.asTimerVal);
      if (this.asTimerVal <= 0) {
        clearInterval(this.asInterval);
        this.lockInAgent();
      }
    }, 1000);
  },

  lockInAgent() {
    if (this.asInterval) clearInterval(this.asInterval);
    AudioEngine.play('ROUND_START');
    const ag = VAL_DATA.agents.find(a => a.name === this.selectedAgent) || VAL_DATA.agents;
    document.getElementById('ab-c').innerText = ag.abilities.c;
    document.getElementById('ab-q').innerText = ag.abilities.q;
    document.getElementById('ab-e').innerText = ag.abilities.e;
    document.getElementById('ab-x').innerText = `0 / ${ag.ultCost}`;
    document.getElementById('agent-select-screen').style.display = 'none';
    this.showLoadingScreen();
  },

  showLoadingScreen() {
    const mapKey = document.getElementById('map-select').value;
    const mapInfo = VAL_DATA.maps[mapKey];
    const tag = document.getElementById('player-name').value || 'Riot Player';
    const r = VAL_DATA.ranks[this.rankIndex];

    document.getElementById('load-map-title').innerText = mapKey;
    document.getElementById('load-map-coords').innerText = mapInfo.coords;

    document.getElementById('load-blue-team').innerHTML = `
      <div class="load-card"><strong>OMEN</strong><span>DIFFUSEMOOSE</span><small>PLAT 1</small></div>
      <div class="load-card" style="border-color:#18e0b8"><strong>${this.selectedAgent}</strong><span>${tag}</span><small>${r.name}</small></div>
      <div class="load-card"><strong>SAGE</strong><span>COCO ROCO</span><small>GOLD 3</small></div>
      <div class="load-card"><strong>JETT</strong><span>JETT_DIFF</span><small>GOLD 2</small></div>
      <div class="load-card"><strong>SOVA</strong><span>SOVA_LINEUPS</span><small>PLAT 1</small></div>
    `;
    document.getElementById('load-red-team').innerHTML = `
      <div class="load-card"><strong>REYNA</strong><span>ENEMY_01</span><small>GOLD 2</small></div>
      <div class="load-card"><strong>VIPER</strong><span>ENEMY_02</span><small>GOLD 3</small></div>
      <div class="load-card"><strong>KILLJOY</strong><span>ENEMY_03</span><small>PLAT 1</small></div>
      <div class="load-card"><strong>CYPHER</strong><span>ENEMY_04</span><small>GOLD 1</small></div>
      <div class="load-card"><strong>SAGE</strong><span>ENEMY_05</span><small>GOLD 2</small></div>
    `;

    const loadScreen = document.getElementById('loading-screen');
    loadScreen.style.display = 'flex';
    let pct = 0;
    const bar = document.getElementById('load-progress');
    const iv = setInterval(() => {
      pct += 25;
      bar.style.width = `${pct}%`;
      if (pct >= 100) {
        clearInterval(iv);
        setTimeout(() => {
          loadScreen.style.display = 'none';
          this.startMatch(mapKey);
        }, 350);
      }
    }, 350);
  },

  populateBuyMenu() {
    const container = document.getElementById('arsenal-container');
    const cats = ['SIDEARM', 'SMG & SHOTGUN', 'RIFLE', 'SNIPER & HEAVY'];
    container.innerHTML = '';

    cats.forEach(cat => {
      const col = document.createElement('div');
      col.className = 'shop-col';
      col.innerHTML = `<h4>${cat}</h4>`;
      VAL_DATA.weapons.filter(w => w.cat === cat).forEach(w => {
        const item = document.createElement('div');
        item.className = 'shop-item';
        item.innerHTML = `<span>${w.name}</span><span>${w.cost === 0 ? 'FREE' : '¤ ' + w.cost}</span>`;
        item.onmouseenter = () => this.inspectWeapon(w);
        item.onclick = () => this.buyWeapon(w);
        item.oncontextmenu = (e) => { e.preventDefault(); this.sellWeapon(w); };
        col.appendChild(item);
      });
      container.appendChild(col);
    });

    const armorCol = document.createElement('div');
    armorCol.className = 'shop-col';
    armorCol.innerHTML = `
      <h4>ARMOR &amp; SKILLS</h4>
      <div class="shop-item" onclick="Game.buyShield(400, 25, false)"><span>LIGHT SHIELDS</span><span>¤ 400</span></div>
      <div class="shop-item" onclick="Game.buyShield(650, 25, true)"><span>REGEN SHIELDS</span><span>¤ 650</span></div>
      <div class="shop-item" onclick="Game.buyShield(1000, 50, false)"><span>HEAVY SHIELDS</span><span>¤ 1,000</span></div>
      <div class="shop-item" onclick="Game.buyAbility(200)"><span>[Q] + [C] SKILLS</span><span>¤ 200</span></div>
    `;
    container.appendChild(armorCol);
  },

  inspectWeapon(w) {
    document.getElementById('insp-name').innerText = w.name;
    document.getElementById('insp-cat').innerText = `${w.cat} • ¤ ${w.cost}`;
    document.getElementById('insp-rate').innerText = `${(1 / w.fireRate).toFixed(2)} RDS/SEC`;
    document.getElementById('insp-mag').innerText = ${w.mag} / ${w.reserve};
    document.getElementById('insp-pen').innerText = w.pen;
    document.getElementById('insp-head').innerText = w.headDmg;
    document.getElementById('insp-body').innerText = w.dmg;
    document.getElementById('insp-legs').innerText = Math.round(w.dmg * 0.85);
  },
    buildMap(mapKey) {
    if (typeof PhysicsVFX !== 'undefined') PhysicsVFX.reset();
    this.mapObjects.forEach(o => this.scene.remove(o));
    this.mapObjects = [];
    this.coverNodes = [];
    this.teleporters = [];
    this.ultOrbs = [];

    const info = VAL_DATA.maps[mapKey];
    const isIcebox = mapKey === 'ICEBOX';
    this.scene.background = new THREE.Color(info.sky);
    this.scene.fog = new THREE.FogExp2(info.sky, 0.0048);

    const hasTex = typeof ValorantArt !== 'undefined' && ValorantArt.textures.sandstoneWall;
    const floorMat = new THREE.MeshStandardMaterial({
      map: hasTex ? (isIcebox ? ValorantArt.textures.iceboxSteel : ValorantArt.textures.courtyardFloor) : null,
      color: hasTex ? 0xffffff : info.floor, roughness: 0.78
    });
    const wallMat = new THREE.MeshStandardMaterial({
      map: hasTex ? (isIcebox ? ValorantArt.textures.iceboxSteel : ValorantArt.textures.sandstoneWall) : null,
      bumpMap: hasTex ? ValorantArt.bumps.stoneBump : null,
      bumpScale: 0.04,
      color: hasTex ? 0xffffff : info.wall, roughness: 0.72
    });
    const radCrateMat = new THREE.MeshStandardMaterial({
      map: hasTex ? ValorantArt.textures.radianiteCrate : null,
      color: hasTex ? 0xffffff : 0x2f4858, roughness: 0.4, metalness: 0.4
    });
    const woodCrateMat = new THREE.MeshStandardMaterial({
      map: hasTex ? ValorantArt.textures.woodCrate : null,
      color: hasTex ? 0xffffff : 0xd97736, roughness: 0.75
    });

    const addMesh = (w, h, d, x, y, z, mat, solid = true) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.scene.add(mesh);
      this.mapObjects.push(mesh);
      if (solid && typeof PhysicsVFX !== 'undefined') PhysicsVFX.registerCollider(mesh, true);
      return mesh;
    };

    if (mapKey !== 'ABYSS') {
      addMesh(115, 1, 115, 0, -0.5, 0, floorMat, false);
      addMesh(115, 14, 2, 0, 7, -57, wallMat, true);
      addMesh(115, 14, 2, 0, 7, 57, wallMat, true);
      addMesh(2, 14, 115, -57, 7, 0, wallMat, true);
      addMesh(2, 14, 115, 57, 7, 0, wallMat, true);
    } else {
      addMesh(92, 1, 96, 0, -0.5, 0, floorMat, false);
    }

    if (typeof ValorantArt !== 'undefined' && ValorantArt.buildArchway) {
      const midArch = ValorantArt.buildArchway(0, 0, -14, 18, 10, 4, wallMat);
      this.scene.add(midArch.group);
      this.mapObjects.push(midArch.group);
      if (typeof PhysicsVFX !== 'undefined') midArch.parts.forEach(p => PhysicsVFX.registerCollider(p, true));
    }

    // Elevated Heaven Platforms + Climbable Stair Steps
    [-34, 34].forEach((hx) => {
      addMesh(16, 0.6, 12, hx, 3.0, -48, wallMat, true);
      for (let step = 1; step <= 4; step++) {
        addMesh(4, step * 0.75, 2.2, hx > 0 ? hx - 8 : hx + 8, (step * 0.75) / 2, -48 + step * 2.2, woodCrateMat, true);
      }
    });

    // Double-Stacked Cover Crates
    const crates = [
      [-23, 1.5, -26, radCrateMat, 3.0], [-23, 4.2, -26, woodCrateMat, 2.4],
      [23, 1.5, -26, radCrateMat, 3.0],  [23, 4.2, -26, woodCrateMat, 2.4],
      [-14, 1.5, 14, woodCrateMat, 3.0], [14, 1.5, 14, radCrateMat, 3.0]
    ];
    crates.forEach(([cx, cy, cz, mat, sz]) => {
      addMesh(sz, sz, sz, cx, cy, cz, mat, true);
      this.coverNodes.push(new THREE.Vector3(cx, 0, cz - 3.6));
      this.coverNodes.push(new THREE.Vector3(cx + 3.6, 0, cz));
    });

    // Glowing Ultimate Orbs
    [[-18, 1.2, 2], [18, 1.2, 2]].forEach(([ox, oy, oz]) => {
      const orb = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.45, 1),
        new THREE.MeshBasicMaterial({ color: 0x18e0b8 })
      );
      orb.position.set(ox, oy, oz);
      this.scene.add(orb);
      this.mapObjects.push(orb);
      this.ultOrbs.push({ mesh: orb, active: true });
    });

    if (mapKey === 'HAVEN' || mapKey === 'ASCENT') {
      const pagodaMat = new THREE.MeshStandardMaterial({ color: 0x168f82, roughness: 0.5 });
      const canopyMat = new THREE.MeshStandardMaterial({ color: 0xd94848, side: THREE.DoubleSide, roughness: 0.85 });
      addMesh(116, 1.5, 5.5, 0, 14.2, -57, pagodaMat, false);
      addMesh(14, 0.2, 7, -28, 9.5, -24, canopyMat, false);
      addMesh(14, 0.2, 7, 28, 9.5, -24, canopyMat, false);
    } else if (mapKey === 'BIND') {
      const tpMat = new THREE.MeshBasicMaterial({ color: 0x18e0b8, transparent: true, opacity: 0.72 });
      const tpA = addMesh(3.5, 4.5, 1.2, -18, 2.25, -10, tpMat, false);
      const tpB = addMesh(3.5, 4.5, 1.2, 18, 2.25, -10, tpMat, false);
      this.teleporters.push(
        { mesh: tpA, dest: new THREE.Vector3(26, 1.75, 15) },
        { mesh: tpB, dest: new THREE.Vector3(-26, 1.75, 15) }
      );
    } else if (mapKey === 'ICEBOX') {
      const steelMat = new THREE.MeshStandardMaterial({ color: 0x1d2630, metalness: 0.65, roughness: 0.35 });
      addMesh(20, 24, 16, -28, 12, -38, steelMat, true);
    }

    info.sites.forEach(([sx, sz]) => {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(3.6, 4.1, 48),
        new THREE.MeshBasicMaterial({ color: 0xff4655, side: THREE.DoubleSide })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(sx, 0.05, sz);
      this.scene.add(ring);
      this.mapObjects.push(ring);
    });
  },

  buildViewmodel(weaponName) {
    if (this.gunGroup) this.camera.remove(this.gunGroup);
    this.gunGroup = new THREE.Group();

    if (typeof ValorantArt !== 'undefined') {
      const detailedGun = ValorantArt.buildDetailedWeapon(weaponName);
      this.gunGroup.add(detailedGun);
      this.gunGroup.userData.muzzleFlash = detailedGun.userData.muzzleFlash;
      this.gunGroup.userData.magazineMesh = detailedGun.userData.magazineMesh;
      this.gunGroup.userData.boltMesh = detailedGun.userData.boltMesh;
    }

    this.equipTimer = 0.35;
    this.gunGroup.position.set(0.26, -0.45, -0.48);
    this.camera.add(this.gunGroup);
    this.scene.add(this.camera);
  },

  startMatch(mapKey, fromNet = false) {
    const modeKey = document.getElementById('mode-select').value;
    const mode = VAL_DATA.modes[modeKey];
    this.credits = mode.startCreds;
    this.buildMap(mapKey);
    document.getElementById('hud').style.display = 'block';
    this.started = true;
    if (!fromNet && typeof Network !== 'undefined' && Network.isHost) {
      Network.broadcast({ type: 'START_MATCH', map: mapKey });
    }
    this.startRound();
  },

  startRound() {
    AudioEngine.play('ROUND_START');
    const modeKey = document.getElementById('mode-select').value;
    const mode = VAL_DATA.modes[modeKey];

    this.phase = (modeKey === 'DEATHMATCH' || modeKey === 'TDM') ? 'FIGHT' : 'BUY';
    this.phaseTime = this.phase === 'BUY' ? 12 : 300;
    this.hp = 100;
    this.eReady = true;
    this.isReloading = false;
    this.sprayIndex = 0;
    this.dealtStats = { dmg: 0, head: 0, body: 0 };
    this.takenStats = { dmg: 0, head: 0, body: 0 };
    this.updateCombatReport();

    document.getElementById('slot-e').classList.add('ready');
    this.spikePlanted = false;
    this.plantedSite = '';
    this.spikeTimer = 45;
    this.plantProgress = 0;
    this.defuseProgress = 0;
    this.defuseHalfReached = false;

    if (modeKey === 'SPIKE_RUSH') {
      const randGun = VAL_DATA.weapons[Math.floor(Math.random() * VAL_DATA.weapons.length)];
      this.weapon = { ...randGun, maxMag: randGun.mag };
      this.shield = 50;
      this.buildViewmodel(randGun.name);
    }

    const isDefending = this.round > mode.swapRound;
    this.playerPos.set(0, 1.75, isDefending ? -36 : 44);
    this.spawnSmartEnemies(isDefending);
    this.updateHUD();
    document.getElementById('phase-banner').innerText =
      this.phase === 'BUY' ? 'BUY PHASE — PRESS [B] TO OPEN ARMORY | CLICK SCREEN TO AIM' : `${mode.name} — FIGHT!`;
  },

  spawnSmartEnemies(enemyIsAttacking) {
    this.enemies.forEach(e => this.scene.remove(e.mesh));
    this.enemies = [];

    const positions = enemyIsAttacking
      ? [[-18, 0, 40], [-8, 0, 42],,,]
      : [[-28, 0, -25], [-33, 0, -38], [0, 0, -28], [28, 0, -25], [33, 0, -38]];

    const enemyAgents = ['REYNA', 'VIPER', 'KILLJOY', 'CYPHER', 'SAGE'];
    const targetSite = Math.random() < 0.5 ? new THREE.Vector3(-28, 0, -34) : new THREE.Vector3(28, 0, -34);

    for (let i = 0; i < positions.length; i++) {
      const agentName = enemyAgents[i];
      const built = AgentModels.build(agentName, true);
      built.group.position.set(...positions[i]);
      this.scene.add(built.group);

      this.enemies.push({
        mesh: built.group,
        head: built.head,
        body: built.body,
        leftLeg: built.leftLeg,
        rightLeg: built.rightLeg,
        rightArm: built.rightArm,
        coatTail: built.coatTail,
        hp: 100,
        alive: true,
        name: agentName,
        aiState: enemyIsAttacking ? 'EXECUTE_SITE' : 'HOLD',
        targetPos: targetSite.clone().add(new THREE.Vector3((i - 2) * 3.5, 0, 0)),
        strafeDir: i % 2 === 0 ? 1 : -1,
        strafeTimer: 1.2 + Math.random(),
        shootTimer: 1.2 + Math.random() * 0.8,
        burstCount: 0,
        walkPhase: Math.random() * Math.PI * 2,
        isCarrier: enemyIsAttacking && i === 2
      });
    }
    this.updateEnemyPips();
  },

  updateEnemyPips() {
    const pips = document.querySelectorAll('#enemy-pips .agent-pip');
    this.enemies.forEach((e, i) => {
      if (pips[i]) pips[i].classList.toggle('dead', !e.alive);
    });
  },

  syncRemotePlayer(peerId, data) {
    if (!this.remoteMeshes[peerId]) {
      const built = AgentModels.build(data.agent || 'JETT', false);
      this.scene.add(built.group);
      this.remoteMeshes[peerId] = built.group;
    }
    this.remoteMeshes[peerId].position.set(data.x, data.y - 1.75, data.z);
    this.remoteMeshes[peerId].scale.y = data.crouch ? 0.68 : 1.0;
  },

  equipKnife() {
    this.isKnifeEquipped = true;
    this.isReloading = false;
    AudioEngine.play('BUY', 0.5);
    this.buildViewmodel('KNIFE');
    document.getElementById('hud-weapon').innerText = 'TACTICAL KNIFE';
    document.getElementById('hud-ammo').innerText = '∞';
  },

  equipPrimary() {
    this.isKnifeEquipped = false;
    this.buildViewmodel(this.weapon.name);
    this.updateHUD();
  },

  dropCurrentWeapon() {
    if (this.weapon.name === 'CLASSIC' || this.isKnifeEquipped) return;
    const dropMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.14, 0.72),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0x554400 })
    );
    const dir = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);
    const dropPos = this.playerPos.clone().addScaledVector(dir, 2.2);
    dropMesh.position.set(dropPos.x, 0.12, dropPos.z);
    this.scene.add(dropMesh);

    this.droppedWeapons.push({ mesh: dropMesh, weaponData: { ...this.weapon } });
    this.logKill(`DROPPED ${this.weapon.name} (Press [E] near gun to pick up)`);

    const classic = VAL_DATA.weapons[0];
    this.weapon = { ...classic, maxMag: classic.mag };
    this.buildViewmodel('CLASSIC');
    this.updateHUD();
  },

  spawn3DPing() {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
    const hits = raycaster.intersectObjects(this.mapObjects, true);
    const pt = hits.length > 0 ? hits[0].point : raycaster.ray.at(30, new THREE.Vector3());

    const beacon = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 5, 12),
      new THREE.MeshBasicMaterial({ color: 0x18e0b8, transparent: true, opacity: 0.85 })
    );
    beacon.position.set(pt.x, pt.y + 2.5, pt.z);
    this.scene.add(beacon);
    AudioEngine.play('BUY', 0.6);
    this.logKill(`PINGED LOCATION (${Math.round(pt.x)}, ${Math.round(pt.z)})`);
    setTimeout(() => this.scene.remove(beacon), 7000);
  },
  bindEvents() {
    document.addEventListener('keydown', e => {
      this.keys[e.code] = true;
      if (e.code === 'Digit1' || e.code === 'Digit2') this.equipPrimary();
      if (e.code === 'Digit3') this.equipKnife();
      if (e.code === 'KeyG' && this.started) this.dropCurrentWeapon();
      if (e.code === 'KeyZ' && this.started) this.spawn3DPing();
      if (e.code === 'KeyB' && this.started) this.toggleBuyMenu(!this.buyMenuOpen);
      if (e.code === 'KeyR' && this.started) this.startReloadAnimation();
      if (e.code === 'KeyC' && this.started) this.castWallAbility();
      if (e.code === 'KeyQ' && this.started) this.castSmokeOrFlashAbility();
      if (e.code === 'KeyE' && this.started) this.castSignatureAbility();
      if (e.code === 'KeyX' && this.started) this.castUltimateAbility();

      if (e.code === 'Space' && this.started && this.isGrounded && !this.buyMenuOpen) {
        this.velY = 6.8;
        this.isGrounded = false;
      }
      if (e.code === 'ControlLeft' && this.started) this.isCrouching = true;

      if (e.code === 'Tab' && this.started) {
        e.preventDefault();
        this.updateScoreboard();
        document.getElementById('scoreboard').style.display = 'block';
      }
    });

    document.addEventListener('keyup', e => {
      this.keys[e.code] = false;
      if (e.code === 'ControlLeft') this.isCrouching = false;
      if (e.code === 'Tab') document.getElementById('scoreboard').style.display = 'none';
    });

    this.renderer.domElement.addEventListener('click', () => {
      if (this.started && !this.buyMenuOpen) this.renderer.domElement.requestPointerLock();
    });

    document.addEventListener('mousemove', e => {
      if (document.pointerLockElement === this.renderer.domElement) {
        const sens = parseFloat(document.getElementById('mouse-sens').value || 1.0) * 0.0022;
        this.yaw -= e.movementX * sens;
        this.pitch = Math.max(-1.4, Math.min(1.4, this.pitch - e.movementY * sens));
      }
    });

    document.addEventListener('mousedown', e => {
      if (document.pointerLockElement !== this.renderer.domElement) return;
      if (e.button === 0) this.fireWeapon(false);
      if (e.button === 2) {
        if (this.isKnifeEquipped) {
          this.fireWeapon(true);
        } else {
          this.ads = !this.ads;
          this.camera.fov = this.ads ? (this.weapon.name === 'OPERATOR' ? 24 : 48) : 75;
          this.camera.updateProjectionMatrix();
          this.gunGroup.position.set(this.ads ? 0 : 0.26, this.ads ? -0.15 : -0.22, -0.46);
        }
      }
    });
    document.addEventListener('contextmenu', e => e.preventDefault());
  },

  startReloadAnimation() {
    if (this.isKnifeEquipped || this.isReloading || this.weapon.mag === this.weapon.maxMag || this.weapon.reserve <= 0) return;
    this.isReloading = true;
    this.reloadTimer = 1.65;
    AudioEngine.play('RELOAD');
  },

  updateGunAndPlayerAnimations(dt) {
    if (!this.gunGroup) return;

    if (this.equipTimer > 0) {
      this.equipTimer = Math.max(0, this.equipTimer - dt);
      this.gunGroup.position.y = -0.22 - (this.equipTimer * 0.65);
      this.gunGroup.rotation.x = -this.equipTimer * 1.2;
      return;
    }

    if (this.isReloading) {
      this.reloadTimer -= dt;
      const progress = 1 - (this.reloadTimer / 1.65);
      this.gunGroup.rotation.z = Math.sin(progress * Math.PI) * 0.65;
      this.gunGroup.rotation.x = Math.sin(progress * Math.PI) * 0.35;

      const mag = this.gunGroup.userData.magazineMesh;
      const bolt = this.gunGroup.userData.boltMesh;
      if (mag) mag.position.y = progress < 0.5 ? (-0.14 - progress * 0.7) : (-0.14 - (1 - progress) * 0.7);
      if (bolt && progress > 0.75) bolt.position.z = 0.08 + Math.sin((progress - 0.75) * 4 * Math.PI) * 0.09;

      if (this.reloadTimer <= 0) {
        this.isReloading = false;
        this.gunGroup.rotation.set(0, 0, 0);
        if (mag) mag.position.y = -0.14;
        if (bolt) bolt.position.z = 0.08;
        const needed = this.weapon.maxMag - this.weapon.mag;
        const take = Math.min(needed, this.weapon.reserve);
        this.weapon.mag += take;
        this.weapon.reserve -= take;
        this.sprayIndex = 0;
        this.updateHUD();
      }
      return;
    }

    if (this.isMoving && this.isGrounded) {
      this.walkBobPhase += dt * 11;
      const baseX = this.ads ? 0 : 0.26;
      const baseY = this.ads ? -0.15 : -0.22;
      this.gunGroup.position.x = baseX + Math.cos(this.walkBobPhase * 0.5) * 0.012;
      this.gunGroup.position.y = baseY + Math.abs(Math.sin(this.walkBobPhase)) * 0.014;
    }
  },

  spawnBulletTracer(endPoint) {
    const start = new THREE.Vector3();
    this.gunGroup.getWorldPosition(start);
    const skinId = document.getElementById('skin-select')?.value || 'STANDARD';
    const skinData = VAL_DATA.skins.find(s => s.id === skinId) || { tracer: 0xffb74d };
    const geom = new THREE.BufferGeometry().setFromPoints([start, endPoint]);
    const line = new THREE.Line(geom, new THREE.LineBasicMaterial({ color: skinData.tracer, transparent: true, opacity: 0.9 }));
    this.scene.add(line);
    setTimeout(() => this.scene.remove(line), 65);
  },
  fireWeapon(isRightClickKnife = false) {
    if (this.isReloading || this.equipTimer > 0) return;

    if (this.isKnifeEquipped) {
      this.gunGroup.rotation.z = -0.8;
      setTimeout(() => { if (this.gunGroup) this.gunGroup.rotation.z = 0; }, 140);
      AudioEngine.play('ABILITY', 0.4);
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
      const hits = raycaster.intersectObjects(this.enemies.filter(e => e.alive).map(e => e.mesh), true);
      if (hits.length > 0 && hits[0].distance < 3.2) {
        let p = hits[0].object;
        while (p.parent && p.parent !== this.scene) p = p.parent;
        const enemy = this.enemies.find(e => e.mesh === p);
        if (enemy) this.damageEnemy(enemy, isRightClickKnife ? 150 : 75, false, hits[0].point);
      }
      return;
    }

    const now = performance.now() / 1000;
    if (now - this.lastShot < this.weapon.fireRate) return;
    if (this.weapon.mag <= 0) { this.startReloadAnimation(); return; }

    this.lastShot = now;
    this.weapon.mag--;
    this.sprayIndex++;
    this.updateHUD();

    const soundKey = ['VANDAL', 'PHANTOM', 'OPERATOR'].includes(this.weapon.name) ? this.weapon.name : 'CLASSIC';
    AudioEngine.play(soundKey);

    if (this.gunGroup.userData.muzzleFlash) {
      this.gunGroup.userData.muzzleFlash.visible = true;
      setTimeout(() => { if (this.gunGroup.userData.muzzleFlash) this.gunGroup.userData.muzzleFlash.visible = false; }, 45);
    }

    this.gunGroup.position.z += 0.085;
    setTimeout(() => { if (this.gunGroup) this.gunGroup.position.z -= 0.085; }, 55);

    if (this.sprayIndex <= 6) {
      this.recoilPitch = Math.min(0.16, this.recoilPitch + 0.019);
    } else {
      this.recoilYaw += Math.sin(this.sprayIndex * 0.85) * 0.022;
    }

    let spread = 0.001;
    if (!this.isGrounded) spread = 0.24;
    else if (this.isMoving) spread = 0.15;
    else if (this.isCrouching) spread = 0.0005;
    else if (this.sprayIndex > 1) spread = Math.min(0.06, this.sprayIndex * 0.006);

    const aimDir = new THREE.Vector2(
      (Math.random() - 0.5) * spread + this.recoilYaw * 0.35,
      (Math.random() - 0.5) * spread + this.recoilPitch * 0.35
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(aimDir, this.camera);

    const wallHits = raycaster.intersectObjects(this.mapObjects, true);
    const enemyHits = raycaster.intersectObjects(this.enemies.filter(e => e.alive).map(e => e.mesh), true);

    const endPoint = enemyHits.length > 0 ? enemyHits[0].point
      : (wallHits.length > 0 ? wallHits[0].point : raycaster.ray.at(65, new THREE.Vector3()));
    this.spawnBulletTracer(endPoint);

    if (wallHits.length > 0 && (enemyHits.length === 0 || wallHits[0].distance < enemyHits[0].distance)) {
      if (typeof PhysicsVFX !== 'undefined') {
        PhysicsVFX.spawnImpactParticles(wallHits[0].point, wallHits[0].face?.normal, 'SPARK');
      }
      if (enemyHits.length > 0 && this.weapon.pen === 'HIGH') {
        this.processEnemyHit(enemyHits[0], 0.65);
      }
      return;
    }

    if (enemyHits.length > 0) {
      this.processEnemyHit(enemyHits[0], 1.0);
    }
  },

  processEnemyHit(hitRecord, penMult) {
    const hitObj = hitRecord.object;
    let parentGroup = hitObj;
    while (parentGroup.parent && parentGroup.parent !== this.scene) parentGroup = parentGroup.parent;
    const enemy = this.enemies.find(e => e.mesh === parentGroup);
    if (!enemy || !enemy.alive) return;

    const isHeadshot = hitObj === enemy.head;
    const dist = hitRecord.distance;
    const falloff = (this.weapon.name === 'PHANTOM' && dist > 15) ? (dist > 30 ? 0.80 : 0.90) : 1.0;
    const rawDmg = isHeadshot ? this.weapon.headDmg : this.weapon.dmg;
    const finalDmg = Math.round(rawDmg * falloff * penMult);

    this.damageEnemy(enemy, finalDmg, isHeadshot, hitRecord.point);
  },

  damageEnemy(enemy, damage, isHeadshot, point) {
    if (isHeadshot) AudioEngine.play('HEADSHOT');
    if (typeof PhysicsVFX !== 'undefined') PhysicsVFX.spawnImpactParticles(point, null, 'BLOOD');

    enemy.hp -= damage;
    this.dealtStats.dmg += damage;
    if (isHeadshot) this.dealtStats.head++; else this.dealtStats.body++;
    this.updateCombatReport();

    if (enemy.hp > 0 && this.coverNodes.length > 0) {
      enemy.aiState = 'TAKE_COVER';
      enemy.targetPos = this.coverNodes[Math.floor(Math.random() * this.coverNodes.length)].clone();
    }

    if (enemy.hp <= 0) {
      enemy.alive = false;
      enemy.mesh.visible = false;
      this.kills++;
      this.credits = Math.min(9000, this.credits + 200);
      this.ultPoints = Math.min(this.ultMax, this.ultPoints + 1);
      this.updateEnemyPips();
      this.updateHUD();
      this.logKill(`YOU ${isHeadshot ? '[HEADSHOT]' : ''} eliminated ${enemy.name}`);

      const mode = VAL_DATA.modes[document.getElementById('mode-select').value];
      if (mode.winKills && this.kills >= mode.winKills) {
        this.finishMatch(true);
      } else if (mode.name === 'DEATHMATCH' || mode.name === 'TDM') {
        setTimeout(() => {
          enemy.hp = 100;
          enemy.alive = true;
          enemy.mesh.visible = true;
          enemy.mesh.position.set((Math.random() - 0.5) * 60, 0, (Math.random() - 0.5) * 60);
          this.updateEnemyPips();
        }, 2000);
      } else {
        this.checkRoundEnd();
      }
    }
  },
  castWallAbility() {
    if (!this.cReady) return;
    this.cReady = false;
    document.getElementById('slot-c').classList.remove('ready');
    AudioEngine.play('ABILITY');
    const dir = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);
    const pos = this.playerPos.clone().addScaledVector(dir, 8);
    const color = this.selectedAgent === 'VIPER' ? 0x10b981 : (this.selectedAgent === 'SAGE' ? 0x38bdf8 : 0xff6b35);
    const wall = new THREE.Mesh(
      new THREE.BoxGeometry(16, 4.5, 0.45),
      new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.4, transparent: true, opacity: 0.78 })
    );
    wall.position.set(pos.x, 2.25, pos.z);
    wall.rotation.y = this.yaw;
    this.scene.add(wall);
    setTimeout(() => this.scene.remove(wall), 12000);
  },

  castSmokeOrFlashAbility() {
    if (!this.qReady) return;
    this.qReady = false;
    document.getElementById('slot-q').classList.remove('ready');
    const dir = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);
    const targetPos = this.playerPos.clone().addScaledVector(dir, 12);

    if (this.selectedAgent === 'RAZE') {
      AudioEngine.play('ABILITY');
      if (typeof PhysicsVFX !== 'undefined') PhysicsVFX.spawnImpactParticles(this.playerPos, null, 'EXPLOSION');
      this.velY = 9.5;
      this.isGrounded = false;
      this.playerPos.addScaledVector(dir, 7);
    } else if (['PHOENIX', 'REYNA', 'OMEN', 'YORU', 'BREACH', 'SKYE', 'KAY/O'].includes(this.selectedAgent)) {
      this.triggerFlashbang(targetPos);
    } else {
      AudioEngine.play('ABILITY');
      this.spawnVolumetricSmoke(targetPos, this.selectedAgent === 'VIPER' ? 0x064e3b : 0x1e293b);
    }
  },

  castSignatureAbility() {
    if (!this.eReady) return;
    this.eReady = false;
    document.getElementById('slot-e').classList.remove('ready');
    AudioEngine.play('ABILITY');
    const dir = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);

    if (this.selectedAgent === 'SOVA' && typeof PhysicsVFX !== 'undefined') {
      PhysicsVFX.fireSovaReconArrow(this.playerPos.clone(), dir);
    } else if (this.selectedAgent === 'KILLJOY' && typeof PhysicsVFX !== 'undefined') {
      PhysicsVFX.deployKilljoyTurret(this.playerPos.clone().addScaledVector(dir, 2.5), this.yaw);
    } else if (this.selectedAgent === 'JETT' || this.selectedAgent === 'NEON') {
      this.playerPos.addScaledVector(dir, 8.5);
    } else {
      this.hp = Math.min(100, this.hp + 50);
      this.updateHUD();
    }
  },

  castUltimateAbility() {
    if (this.ultPoints < this.ultMax) return;
    this.ultPoints = 0;
    AudioEngine.play('ROUND_START');
    this.hp = 100;
    this.shield = 50;
    this.updateHUD();
    this.logKill(`ULTIMATE [X] ACTIVATED — OVERDRIVE & FULL ARMOR!`);
  },

  triggerFlashbang(worldPos) {
    AudioEngine.play('ABILITY');
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffea00 }));
    orb.position.copy(worldPos);
    this.scene.add(orb);
    setTimeout(() => {
      this.scene.remove(orb);
      const toFlash = worldPos.clone().sub(this.camera.position).normalize();
      const lookDir = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
      this.flashBlindIntensity = lookDir.dot(toFlash) > 0.25 ? 1.0 : 0.3;
      this.enemies.forEach(e => { if (e.alive && e.mesh.position.distanceTo(worldPos) < 16) e.shootTimer = 2.8; });
    }, 650);
  },

  spawnVolumetricSmoke(pos, color) {
    const outer = new THREE.Mesh(
      new THREE.SphereGeometry(4.4, 24, 24),
      new THREE.MeshStandardMaterial({ color, roughness: 0.95, transparent: true, opacity: 0.92 })
    );
    outer.position.set(pos.x, 2.2, pos.z);
    this.scene.add(outer);
    const entry = { mesh: outer, pos: outer.position.clone() };
    this.activeSmokes.push(entry);
    setTimeout(() => {
      this.scene.remove(outer);
      this.activeSmokes = this.activeSmokes.filter(s => s !== entry);
    }, 15000);
  },

  buyShield(cost, amount, isRegen = false) {
    if (this.credits < cost) return;
    AudioEngine.play('BUY');
    this.credits -= cost;
    this.shield = amount;
    this.regenReserve = isRegen ? 25 : 0;
    this.updateHUD();
  },

  applyDamage(rawDamage) {
    this.lastDamageTime = performance.now() / 1000;
    this.takenStats.dmg += rawDamage;
    this.takenStats.body++;
    this.updateCombatReport();

    if (this.shield > 0) {
      const absorb = Math.min(this.shield, Math.round(rawDamage * 0.66));
      this.shield -= absorb;
      this.hp -= (rawDamage - absorb);
    } else {
      this.hp -= rawDamage;
    }
    this.updateHUD();
    if (this.hp <= 0) {
      this.deaths++;
      this.endRound(false, 'YOU WERE ELIMINATED');
    }
  },

  updateCombatReport() {
    const dEl = document.getElementById('cr-dealt');
    const tEl = document.getElementById('cr-taken');
    if (dEl) dEl.innerText = `DEALT: ${this.dealtStats.dmg} (${this.dealtStats.head} Head • ${this.dealtStats.body} Body)`;
    if (tEl) tEl.innerText = `TAKEN: ${this.takenStats.dmg} (${this.takenStats.head} Head • ${this.takenStats.body} Body)`;
  },

  toggleBuyMenu(open) {
    if (this.phase !== 'BUY' && open) return;
    this.buyMenuOpen = open;
    document.getElementById('buy-menu').style.display = open ? 'flex' : 'none';
    if (open) document.exitPointerLock();
  },

  buyWeapon(w) {
    if (this.credits < w.cost) return;
    AudioEngine.play('BUY');
    this.credits -= w.cost;
    this.weapon = { ...w, maxMag: w.mag };
    this.isKnifeEquipped = false;
    this.buildViewmodel(w.name);
    this.updateHUD();
  },

  sellWeapon(w) {
    if (this.weapon.name === w.name && w.cost > 0) {
      AudioEngine.play('BUY');
      this.credits += w.cost;
      const classic = VAL_DATA.weapons;
      this.weapon = { ...classic, maxMag: classic.mag };
      this.buildViewmodel('CLASSIC');
      this.updateHUD();
    }
  },

  buyAbility(cost) {
    if (this.credits < cost) return;
    AudioEngine.play('BUY');
    this.credits -= cost;
    this.cReady = true;
    this.qReady = true;
    document.getElementById('slot-c').classList.add('ready');
    document.getElementById('slot-q').classList.add('ready');
    this.updateHUD();
  },
  logKill(text) {
    const feed = document.getElementById('killfeed');
    if (!feed) return;
    const div = document.createElement('div');
    div.className = 'kill-entry';
    div.innerText = text;
    feed.appendChild(div);
    setTimeout(() => div.remove(), 4000);
  },

  updateScoreboard() {
    const tbody = document.getElementById('scoreboard-body');
    const tag = document.getElementById('player-name').value || 'Riot Player';
    const r = VAL_DATA.ranks[this.rankIndex];
    let rows = `<tr><td><b>${tag} (YOU)</b></td><td>${this.selectedAgent}</td><td>${r.name}</td><td>${this.kills} / ${this.deaths}</td><td>¤ ${this.credits}</td><td>ALIVE</td></tr>`;
    this.enemies.forEach(e => {
      rows += `<tr><td>${e.name}</td><td>${e.name}</td><td>GOLD 2</td><td>0 / 1</td><td>¤ 1,900</td><td>${e.alive ? 'ALIVE' : 'DEAD'}</td></tr>`;
    });
    tbody.innerHTML = rows;
  },

  updateHUD() {
    document.getElementById('buy-credits').innerText = this.credits;
    document.getElementById('hud-hp').innerText = Math.max(0, this.hp);
    document.getElementById('hud-shield').innerText = Math.round(this.shield);
    if (!this.isKnifeEquipped) {
      document.getElementById('hud-weapon').innerText = this.weapon.name;
      document.getElementById('hud-ammo').innerText = this.weapon.mag;
      document.getElementById('hud-reserve').innerText = `/ ${this.weapon.reserve}`;
    }
    document.getElementById('ab-x').innerText = `${this.ultPoints} / ${this.ultMax}`;
    document.getElementById('score-atk').innerText = this.atkScore;
    document.getElementById('score-def').innerText = this.defScore;
    const mode = VAL_DATA.modes[document.getElementById('mode-select').value];
    document.getElementById('side-label').innerText = `${this.round > mode.swapRound ? 'DEFENDERS' : 'ATTACKERS'} • ROUND ${this.round}`;
  },

  checkRoundEnd() {
    if (this.enemies.filter(e => e.alive).length === 0 && this.phase === 'FIGHT' && !this.spikePlanted) {
      this.endRound(true, 'ENEMY TEAM ELIMINATED');
    }
  },

  endRound(atkWon, reason) {
    this.phase = 'POST';
    this.phaseTime = 4;
    const mode = VAL_DATA.modes[document.getElementById('mode-select').value];

    if (atkWon) {
      this.atkScore++;
      this.lossStreak = 0;
      this.credits = Math.min(9000, this.credits + (mode.name === 'SWIFTPLAY' ? 3200 : 3000) + (this.spikePlanted ? 300 : 0));
    } else {
      this.defScore++;
      this.lossStreak = Math.min(2, this.lossStreak + 1);
      const lossBonus = this.lossStreak === 1 ? 1900 : (this.lossStreak === 2 ? 2400 : 2900);
      this.credits = Math.min(9000, this.credits + (mode.name === 'SWIFTPLAY' ? 2400 : lossBonus));
    }

    if (mode.overtime && this.atkScore === 12 && this.defScore === 12) {
      this.credits = 5000;
      this.logKill('OVERTIME (12-12) — WIN BY 2! CREDITS SET TO ¤ 5,000');
    }

    this.updateHUD();
    document.getElementById('phase-banner').innerText = `ROUND ${this.round} OVER — ${reason}`;

    setTimeout(() => {
      const targetWins = mode.winRounds || 13;
      const winByTwo = mode.overtime && this.atkScore >= 12 && this.defScore >= 12;
      const matchDone = winByTwo
        ? Math.abs(this.atkScore - this.defScore) >= 2
        : (this.atkScore >= targetWins || this.defScore >= targetWins);

      if (matchDone) {
        this.finishMatch(this.atkScore > this.defScore);
      } else {
        this.round++;
        this.startRound();
      }
    }, 4000);
  },

  finishMatch(won) {
    document.exitPointerLock();
    document.getElementById('hud').style.display = 'none';
    const pm = document.getElementById('post-match-screen');
    pm.style.display = 'flex';
    const rrDelta = won ? 24 : -16;
    this.rr += rrDelta;
    if (won) this.wins++;
    if (this.rr >= 100 && this.rankIndex < VAL_DATA.ranks.length - 1) { this.rr -= 100; this.rankIndex++; }
    else if (this.rr < 0 && this.rankIndex > 0) { this.rr += 100; this.rankIndex--; }
    else this.rr = Math.max(0, Math.min(100, this.rr));
    this.saveCareerData();

    const r = VAL_DATA.ranks[this.rankIndex];
    document.getElementById('pm-result').innerText = won ? 'VICTORY' : 'DEFEAT';
    document.getElementById('pm-result').style.color = won ? '#18e0b8' : '#ff4655';
    document.getElementById('pm-score').innerText = `${this.atkScore} - ${this.defScore}`;
    document.getElementById('pm-rank-emblem').innerText = r.short;
    document.getElementById('pm-rank-title').innerText = r.name;
    document.getElementById('pm-rr-change').innerText = `${won ? '+' : ''}${rrDelta} RR (${this.rr} / 100 RR)`;
    document.getElementById('pm-rr-fill').style.width = `${this.rr}%`;
  },

  startTimers() {
    setInterval(() => {
      if (!this.started) {
        this.lobbySeconds++;
        const m = String(Math.floor(this.lobbySeconds / 60)).padStart(2, '0');
        const s = String(this.lobbySeconds % 60).padStart(2, '0');
        const clockEl = document.getElementById('lobby-clock');
        if (clockEl) clockEl.innerText = `${m}:${s}`;
        return;
      }
      if (this.phase === 'BUY') {
        this.phaseTime--;
        if (this.phaseTime <= 0) {
          this.phase = 'FIGHT';
          this.phaseTime = 100;
          this.toggleBuyMenu(false);
          document.getElementById('phase-banner').innerText = 'FIGHT PHASE — EXECUTE SITE OR DEFEND';
        }
      } else if (this.phase === 'FIGHT') {
        if (this.spikePlanted) {
          this.spikeTimer--;
          AudioEngine.play('BEEP', 0.35);
          document.getElementById('round-timer').innerText = `0:${String(this.spikeTimer).padStart(2, '0')}`;
          if (this.spikeTimer <= 0) this.endRound(this.round <= 12, `SPIKE DETONATED ON SITE ${this.plantedSite}`);
        } else {
          this.phaseTime--;
          const m = Math.floor(this.phaseTime / 60);
          const s = this.phaseTime % 60;
          document.getElementById('round-timer').innerText = `${m}:${String(s).padStart(2, '0')}`;
          if (this.phaseTime <= 0) this.endRound(this.round > 12, 'ROUND TIME EXPIRED');
        }
      }
      if (this.phase === 'BUY') document.getElementById('round-timer').innerText = `0:${String(this.phaseTime).padStart(2, '0')}`;
    }, 1000);
  },

  updateSmartEnemies(dt) {
    if (this.phase !== 'FIGHT') return;
    this.enemies.forEach((enemy) => {
      if (!enemy.alive) return;
      const distToPlayer = enemy.mesh.position.distanceTo(this.playerPos);
      const isPlayerInSmoke = this.activeSmokes.some(s => this.playerPos.distanceTo(s.pos) < 4.3);

      if (this.spikePlanted && this.round <= 12) {
        const siteCoords = this.plantedSite === 'A' ? new THREE.Vector3(-28, 0, -34) : new THREE.Vector3(28, 0, -34);
        enemy.targetPos.copy(siteCoords);
        enemy.aiState = 'RETAKE_DEFUSE';
      }

      let moveVec = new THREE.Vector3();
      if (enemy.aiState === 'TAKE_COVER' || enemy.aiState === 'EXECUTE_SITE' || enemy.aiState === 'RETAKE_DEFUSE') {
        const toTarget = enemy.targetPos.clone().sub(enemy.mesh.position);
        toTarget.y = 0;
        if (toTarget.length() > 1.8) {
          moveVec.add(toTarget.normalize().multiplyScalar(4.4));
        } else if (enemy.isCarrier && !this.spikePlanted) {
          this.spikePlanted = true;
          this.plantedSite = enemy.mesh.position.x < 0 ? 'A' : 'B';
          AudioEngine.play('PLANT');
          document.getElementById('phase-banner').innerText = `ENEMY PLANTED SPIKE ON SITE ${this.plantedSite}! HOLD [F] TO DEFUSE!`;
        }
      }

      if (distToPlayer < 28 && !isPlayerInSmoke) {
        enemy.strafeTimer -= dt;
        if (enemy.strafeTimer <= 0) {
          enemy.strafeDir *= -1;
          enemy.strafeTimer = 0.9 + Math.random() * 1.1;
        }
        const sideDir = new THREE.Vector3(1, 0, 0).applyQuaternion(enemy.mesh.quaternion);
        moveVec.addScaledVector(sideDir, enemy.strafeDir * 2.8);
      }

      if (moveVec.lengthSq() > 0.01) {
        enemy.mesh.position.addScaledVector(moveVec, dt);
        enemy.walkPhase += dt * 11;
        if (enemy.leftLeg && enemy.rightLeg) {
          enemy.leftLeg.rotation.x = Math.sin(enemy.walkPhase) * 0.55;
          enemy.rightLeg.rotation.x = -Math.sin(enemy.walkPhase) * 0.55;
        }
        if (enemy.coatTail) {
          enemy.coatTail.rotation.x = Math.sin(enemy.walkPhase * 0.5) * 0.12 + 0.14;
        }
      }

      enemy.mesh.lookAt(this.playerPos.x, 0, this.playerPos.z);
      if (distToPlayer < 32 && !isPlayerInSmoke) {
        enemy.shootTimer -= dt;
        if (enemy.shootTimer <= 0) {
          enemy.burstCount++;
          enemy.shootTimer = enemy.burstCount < 3 ? 0.14 : (1.3 + Math.random() * 0.7);
          if (enemy.burstCount >= 3) enemy.burstCount = 0;

          AudioEngine.play3D('VANDAL', enemy.mesh.position, this.playerPos, this.yaw, 0.45);
          if (enemy.rightArm) {
            enemy.rightArm.rotation.x = Math.PI / 2.4;
            setTimeout(() => { if (enemy.rightArm) enemy.rightArm.rotation.x = Math.PI / 3; }, 80);
          }
          if (Math.random() < (distToPlayer < 14 ? 0.32 : 0.18)) {
            this.applyDamage(22);
          }
        }
      }
    });
  },
  animate() {
    requestAnimationFrame(() => this.animate());
    const dt = this.clock.getDelta();

    this.recoilPitch = Math.max(0, this.recoilPitch - dt * 0.28);
    this.recoilYaw *= Math.pow(0.08, dt);
    if (this.recoilPitch < 0.005) this.sprayIndex = 0;

    if (this.flashBlindIntensity > 0) {
      this.flashBlindIntensity = Math.max(0, this.flashBlindIntensity - dt * 0.48);
      document.getElementById('flash-overlay').style.opacity = this.flashBlindIntensity;
    }
    const insideSmoke = this.activeSmokes.some(s => this.playerPos.distanceTo(s.pos) < 4.3);
    document.getElementById('smoke-overlay').style.opacity = insideSmoke ? '1' : '0';

    const nowSec = performance.now() / 1000;
    if (this.regenReserve > 0 && this.shield < 25 && (nowSec - this.lastDamageTime) > 4.0) {
      const step = Math.min(this.regenReserve, dt * 12);
      this.shield = Math.min(25, this.shield + step);
      this.regenReserve -= step;
      this.updateHUD();
    }

    if (this.started && !this.buyMenuOpen) {
      const knifeMult = this.isKnifeEquipped ? 1.25 : 1.0;
      const baseSpeed = (this.isCrouching ? 3.2 : (this.keys['ShiftLeft'] ? 4.2 : 8.5)) * knifeMult;
      const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);
      const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);

      let moved = false;
      if (this.keys['KeyW']) { this.playerPos.addScaledVector(forward, baseSpeed * dt); moved = true; }
      if (this.keys['KeyS']) { this.playerPos.addScaledVector(forward, -baseSpeed * dt); moved = true; }
      if (this.keys['KeyA']) { this.playerPos.addScaledVector(right, -baseSpeed * dt); moved = true; }
      if (this.keys['KeyD']) { this.playerPos.addScaledVector(right, baseSpeed * dt); moved = true; }

      const targetEyeY = this.isCrouching ? 1.15 : 1.75;
      const floorY = typeof PhysicsVFX !== 'undefined'
        ? PhysicsVFX.resolvePlayerPhysics(this.playerPos, 0.45, targetEyeY)
        : 0;

      if (!this.isGrounded) {
        this.velY -= 18.5 * dt;
        this.playerPos.y += this.velY * dt;
        if (this.playerPos.y <= floorY + targetEyeY) {
          this.playerPos.y = floorY + targetEyeY;
          this.velY = 0;
          this.isGrounded = true;
        }
      } else {
        this.playerPos.y += ((floorY + targetEyeY) - this.playerPos.y) * Math.min(1, dt * 14);
      }

      const mapKey = document.getElementById('map-select').value;
      if (mapKey === 'ABYSS' && (Math.abs(this.playerPos.x) > 46 || Math.abs(this.playerPos.z) > 48)) {
        this.applyDamage(150);
      } else {
        this.playerPos.x = Math.max(-54, Math.min(54, this.playerPos.x));
        this.playerPos.z = Math.max(-54, Math.min(54, this.playerPos.z));
      }

      if (typeof VanguardAC !== 'undefined') VanguardAC.validateFrame(this.playerPos, dt, this.weapon);
      if (typeof PhysicsVFX !== 'undefined') PhysicsVFX.update(dt);

      this.isMoving = moved && !this.keys['ShiftLeft'] && !this.isCrouching;

      if (typeof Network !== 'undefined' && Network.connections.length > 0) {
        Network.broadcast({
          type: 'POS',
          name: document.getElementById('player-name').value || 'Riot Player',
          agent: this.selectedAgent,
          x: this.playerPos.x,
          y: this.playerPos.y,
          z: this.playerPos.z,
          crouch: this.isCrouching
        });
      }

      this.ultOrbs.forEach(orb => {
        if (orb.active) {
          orb.mesh.rotation.y += dt * 2;
          if (this.playerPos.distanceTo(orb.mesh.position) < 2.2) {
            orb.active = false;
            orb.mesh.visible = false;
            this.ultPoints = Math.min(this.ultMax, this.ultPoints + 1);
            AudioEngine.play('BUY');
            this.updateHUD();
            this.logKill('COLLECTED ULTIMATE ORB (+1 ULT POINT)');
          }
        }
      });

      const interactPrompt = document.getElementById('interact-prompt');
      const nearDrop = this.droppedWeapons.find(d => this.playerPos.distanceTo(d.mesh.position) < 2.5);
      if (nearDrop) {
        interactPrompt.style.display = 'block';
        interactPrompt.innerText = `PRESS [E] TO PICK UP ${nearDrop.weaponData.name}`;
        if (this.keys['KeyE']) {
          this.weapon = { ...nearDrop.weaponData };
          this.isKnifeEquipped = false;
          this.buildViewmodel(this.weapon.name);
          this.updateHUD();
          this.scene.remove(nearDrop.mesh);
          this.droppedWeapons = this.droppedWeapons.filter(d => d !== nearDrop);
          interactPrompt.style.display = 'none';
        }
      } else {
        interactPrompt.style.display = 'none';
      }

      const gap = !this.isGrounded ? 30 : (this.isMoving ? 22 : (this.isCrouching ? 3 : 5));
      document.getElementById('ch-top').style.bottom = `${gap}px`;
      document.getElementById('ch-bot').style.top = `${gap}px`;
      document.getElementById('ch-left').style.right = `${gap}px`;
      document.getElementById('ch-right').style.left = `${gap}px`;

      this.teleporters.forEach(tp => {
        if (this.playerPos.distanceTo(tp.mesh.position) < 2.4) {
          this.playerPos.copy(tp.dest);
          AudioEngine.play('ABILITY');
        }
      });

      const sites = VAL_DATA.maps[mapKey].sites;
      let nearSite = '';
      sites.forEach(([sx, sz, label]) => {
        if (this.playerPos.distanceTo(new THREE.Vector3(sx, 1.75, sz)) < 4.5) nearSite = label;
      });

      const prompt = document.getElementById('spike-prompt');
      const defWrap = document.getElementById('defuse-bar-wrap');
      const mode = VAL_DATA.modes[document.getElementById('mode-select').value];

      if (this.phase === 'FIGHT' && !this.spikePlanted && nearSite && this.round <= mode.swapRound) {
        prompt.style.display = 'block';
        if (this.keys['Digit4'] || this.keys['KeyF']) {
          if (this.plantProgress === 0) AudioEngine.play('PLANT');
          this.plantProgress += dt;
          prompt.innerText = `PLANTING SPIKE ON SITE ${nearSite}... ${Math.min(100, Math.round((this.plantProgress / 4.0) * 100))}%`;
          if (this.plantProgress >= 4.0) {
            this.spikePlanted = true;
            this.plantedSite = nearSite;
            prompt.style.display = 'none';
            if (typeof Network !== 'undefined') Network.broadcast({ type: 'SPIKE_PLANTED', site: nearSite });
            document.getElementById('phase-banner').innerText = `SPIKE PLANTED ON SITE ${nearSite}! DEFEND FOR 45s`;
          }
        } else {
          this.plantProgress = 0;
          prompt.innerText = `HOLD OR [F] TO PLANT SPIKE ON SITE ${nearSite}`;
        }
      } else if (this.phase === 'FIGHT' && this.spikePlanted && nearSite === this.plantedSite && this.round > mode.swapRound) {
        prompt.style.display = 'block';
        prompt.innerText = `HOLD [F] TO DEFUSE SPIKE (7.0s • HALF-DEFUSE CHECKPOINT)`;
        if (this.keys['KeyF']) {
          defWrap.style.display = 'block';
          this.defuseProgress += dt;
          if (this.defuseProgress >= 3.5 && !this.defuseHalfReached) {
            this.defuseHalfReached = true;
            AudioEngine.play('BUY');
          }
          document.getElementById('defuse-fill').style.width = `${Math.min(100, (this.defuseProgress / 7.0) * 100)}%`;
          if (this.defuseProgress >= 7.0) {
            defWrap.style.display = 'none';
            this.endRound(false, 'SPIKE DEFUSED!');
          }
        } else {
          defWrap.style.display = 'none';
          this.defuseProgress = this.defuseHalfReached ? 3.5 : 0;
        }
      } else {
        prompt.style.display = 'none';
        defWrap.style.display = 'none';
      }

      this.updateGunAndPlayerAnimations(dt);
      this.updateSmartEnemies(dt);
    }

    this.camera.position.copy(this.playerPos);
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = this.yaw + this.recoilYaw;
    this.camera.rotation.x = this.pitch + this.recoilPitch;
    this.renderer.render(this.scene, this.camera);
  }
};

window.addEventListener('DOMContentLoaded', () => Game.init());
window.addEventListener('resize', () => {
  Game.camera.aspect = window.innerWidth / window.innerHeight;
  Game.camera.updateProjectionMatrix();
  Game.renderer.setSize(window.innerWidth, window.innerHeight);
});
