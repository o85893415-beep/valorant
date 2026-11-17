// ============================================================================
// AAA STYLIZED VALORANT CHARACTER ENGINE (Layered Tactical Gear, Sculpted
// Silhouettes, Cel-Shaded Toon Ramp, Ink Outlines & Cloth Sway)
// ============================================================================
const AgentModels = {
  toonGradient: null,

  getToonGradient() {
    if (this.toonGradient) return this.toonGradient;
    const canvas = document.createElement('canvas');
    canvas.width = 4;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#484f58'; ctx.fillRect(0, 0, 1, 1);
    ctx.fillStyle = '#9aa5b1'; ctx.fillRect(1, 0, 1, 1);
    ctx.fillStyle = '#e4e7eb'; ctx.fillRect(2, 0, 1, 1);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(3, 0, 1, 1);
    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    this.toonGradient = tex;
    return tex;
  },

  addOutline(mesh, thickness = 1.04, isEnemy = true) {
    const outlineMat = new THREE.MeshBasicMaterial({
      color: isEnemy ? 0x3b0710 : 0x042f2e,
      side: THREE.BackSide
    });
    const outline = new THREE.Mesh(mesh.geometry, outlineMat);
    outline.scale.multiplyScalar(thickness);
    mesh.add(outline);
  },

  createLathe(points, segs = 22) {
    const pts = points.map(([r, y]) => new THREE.Vector2(r, y));
    const geom = new THREE.LatheGeometry(pts, segs);
    geom.computeVertexNormals();
    return geom;
  },

  specs: {
    PHOENIX:  { primary: 0xf8fafc, secondary: 0x1e293b, accent: 0xff6b35, skin: 0x5c3824, hair: 0xff7b00, gear: 'FLAME_CROWN', coat: true },
    JETT:     { primary: 0xe0f2fe, secondary: 0x1e3a8a, accent: 0x38bdf8, skin: 0xf1c27d, hair: 0xffffff, gear: 'WIND_SCARF', coat: false },
    REYNA:    { primary: 0x3b0764, secondary: 0x1e1b4b, accent: 0xe879f9, skin: 0xc68642, hair: 0x1f1235, gear: 'SOUL_EYES', coat: false },
    RAZE:     { primary: 0xf97316, secondary: 0x3f6212, accent: 0xfacc15, skin: 0x8d5524, hair: 0x1c1917, gear: 'HEADPHONES', coat: false },
    YORU:     { primary: 0x1d4ed8, secondary: 0x0f172a, accent: 0x60a5fa, skin: 0xe0ac69, hair: 0x2563eb, gear: 'ONI_MASK', coat: true },
    NEON:     { primary: 0x1e3a8a, secondary: 0x0f172a, accent: 0x22d3ee, skin: 0xc68642, hair: 0x38bdf8, gear: 'TWIN_TAILS', coat: false },
    ISO:      { primary: 0x312e81, secondary: 0x1e1b4b, accent: 0xa855f7, skin: 0xe0ac69, hair: 0x0f172a, gear: 'PRISM_SHIELD', coat: true },
    WAYLAY:   { primary: 0xfef08a, secondary: 0x1e293b, accent: 0x38bdf8, skin: 0xdba988, hair: 0xfde047, gear: 'PRISM_WINGS', coat: false },
    BRIMSTONE:{ primary: 0x334155, secondary: 0x1e293b, accent: 0xf97316, skin: 0xc68642, hair: 0x475569, gear: 'BERET_BEARD', coat: false },
    VIPER:    { primary: 0x064e3b, secondary: 0x090d16, accent: 0x10b981, skin: 0xe5b899, hair: 0x0f172a, gear: 'GAS_MASK', coat: false },
    OMEN:     { primary: 0x1e1b4b, secondary: 0x090d16, accent: 0x6366f1, skin: 0x05070a, hair: 0x05070a, gear: 'OMEN_HOOD', coat: true },
    ASTRA:    { primary: 0x4c1d95, secondary: 0x1e1b4b, accent: 0xfbbf24, skin: 0x4a2c18, hair: 0x7c3aed, gear: 'GOLD_HALO', coat: false },
    HARBOR:   { primary: 0x0f766e, secondary: 0x1e293b, accent: 0x2dd4bf, skin: 0x8d5524, hair: 0x1c1917, gear: 'RELIC_GAUNTLET', coat: true },
    CLOVE:    { primary: 0xbe185d, secondary: 0x1e293b, accent: 0xf472b6, skin: 0xf1c27d, hair: 0xf472b6, gear: 'BUTTERFLY_PINS', coat: true },
    SOVA:     { primary: 0x1e3a8a, secondary: 0x334155, accent: 0x38bdf8, skin: 0xf1c27d, hair: 0xfef08a, gear: 'FUR_CAPE', coat: true },
    BREACH:   { primary: 0x4d7c0f, secondary: 0x292524, accent: 0xf97316, skin: 0xe0ac69, hair: 0xb45309, gear: 'BIONIC_ARMS', coat: false },
    SKYE:     { primary: 0x15803d, secondary: 0x3f2e21, accent: 0x4ade80, skin: 0xf1c27d, hair: 0xd97706, gear: 'HAWK_TRINKET', coat: false },
    'KAY/O':  { primary: 0x475569, secondary: 0x1e293b, accent: 0x38bdf8, skin: 0x334155, hair: 0x1e293b, gear: 'ROBOT_VISOR', coat: false },
    FADE:     { primary: 0x1e293b, secondary: 0x0f172a, accent: 0x991b1b, skin: 0xdba988, hair: 0x0f172a, gear: 'NIGHTMARE_EYES', coat: true },
    GEKKO:    { primary: 0x65a30d, secondary: 0x1e293b, accent: 0xa3e635, skin: 0xc68642, hair: 0x84cc16, gear: 'WINGMAN_PACK', coat: false },
    TEJO:     { primary: 0x92400e, secondary: 0x1c1917, accent: 0xfbbf24, skin: 0xb47d56, hair: 0x1c1917, gear: 'TACTICAL_SHADES', coat: true },
    SAGE:     { primary: 0xf8fafc, secondary: 0x0f172a, accent: 0x14b8a6, skin: 0xf1c27d, hair: 0x0f172a, gear: 'RADIANITE_HAIR', coat: true },
    CYPHER:   { primary: 0xf8fafc, secondary: 0x334155, accent: 0x38bdf8, skin: 0x1e293b, hair: 0xf8fafc, gear: 'WHITE_HAT', coat: true },
    KILLJOY:  { primary: 0xfacc15, secondary: 0x1e293b, accent: 0xec4899, skin: 0xf1c27d, hair: 0x3f2e21, gear: 'BEANIE_GLASSES', coat: true },
    CHAMBER:  { primary: 0xf8fafc, secondary: 0x1e3a8a, accent: 0xfbbf24, skin: 0xe0ac69, hair: 0x451a03, gear: 'GOLD_GLASSES', coat: true },
    DEADLOCK: { primary: 0x64748b, secondary: 0x1e293b, accent: 0x38bdf8, skin: 0xf1c27d, hair: 0xfef9c3, gear: 'NANOWIRE_ARM', coat: false },
    VYSE:     { primary: 0x312e81, secondary: 0x0f172a, accent: 0xc084fc, skin: 0x475569, hair: 0x6366f1, gear: 'METAL_VISOR', coat: true }
  },
  build(agentName, isEnemy = true) {
    const key = agentName.toUpperCase();
    const s = this.specs[key] || this.specs.PHOENIX;
    const root = new THREE.Group();
    const grad = this.getToonGradient();

    const primaryMat = new THREE.MeshToonMaterial({ color: s.primary, gradientMap: grad });
    const secondaryMat = new THREE.MeshToonMaterial({ color: s.secondary, gradientMap: grad });
    const accentMat = new THREE.MeshStandardMaterial({ color: s.accent, emissive: s.accent, emissiveIntensity: 0.7, roughness: 0.25 });
    const skinMat = new THREE.MeshToonMaterial({ color: s.skin, gradientMap: grad });
    const hairMat = new THREE.MeshToonMaterial({ color: s.hair, gradientMap: grad });
    const bootMat = new THREE.MeshToonMaterial({ color: 0x0f172a, gradientMap: grad });

    // 1. ANATOMICAL V-TAPER TORSO, TACTICAL RIG & UTILITY BELT
    const torsoGeom = this.createLathe([
      [0.01, 0.00], [0.16, 0.03], [0.145, 0.22], [0.225, 0.45], [0.245, 0.56], [0.10, 0.62], [0.01, 0.62]
    ], 24);
    const torso = new THREE.Mesh(torsoGeom, primaryMat);
    torso.position.y = 0.88;
    torso.scale.set(1.14, 1.0, 0.76);
    this.addOutline(torso, 1.04, isEnemy);

    const chestPlate = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.28, 0.28), secondaryMat);
    chestPlate.position.set(0, 1.27, 0.02);
    this.addOutline(chestPlate, 1.04, isEnemy);

    const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.052, 0), accentMat);
    core.position.set(0, 1.32, 0.17);

    // Tactical Belt, Buckle & Side Ammo Pouches
    const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.175, 0.175, 0.07, 18), bootMat);
    belt.position.set(0, 0.90, 0);
    belt.scale.set(1.12, 1.0, 0.82);
    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.055, 0.04), accentMat);
    buckle.position.set(0, 0.90, 0.15);
    [-0.19, 0.19].forEach(px => {
      const pouch = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.11, 0.11), secondaryMat);
      pouch.position.set(px, 0.88, 0.03);
      root.add(pouch);
    });

    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.11, 18, 1, true, Math.PI * 0.25, Math.PI * 1.5), primaryMat);
    collar.material.side = THREE.DoubleSide;
    collar.position.set(0, 1.51, -0.01);

    [-0.27, 0.27].forEach(sx => {
      const pauldron = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), primaryMat);
      pauldron.scale.set(1.15, 0.85, 1.05);
      pauldron.position.set(sx, 1.42, 0);
      this.addOutline(pauldron, 1.05, isEnemy);
      root.add(pauldron);
    });

    let coatTail = null;
    if (s.coat) {
      const coatGeom = new THREE.CylinderGeometry(0.17, 0.30, 0.52, 22, 1, true, Math.PI * 0.65, Math.PI * 1.7);
      coatTail = new THREE.Mesh(coatGeom, primaryMat);
      coatTail.material.side = THREE.DoubleSide;
      coatTail.position.set(0, 0.68, -0.02);
      root.add(coatTail);
    }

    root.add(torso, chestPlate, core, belt, buckle, collar);

    // 2. ARTICULATED LEGS WITH KNEE GUARDS, HOLSTER & TACTICAL BOOTS
    const makeLeg = (xOffset) => {
      const hip = new THREE.Group();
      hip.position.set(xOffset, 0.86, 0);
      const thigh = new THREE.Mesh(this.createLathe([[0.01,0],[0.095,-0.04],[0.088,-0.22],[0.072,-0.40],[0.01,-0.42]]), secondaryMat);
      this.addOutline(thigh, 1.045, isEnemy);
      const knee = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.10, 0.12), accentMat);
      knee.position.set(0, -0.40, 0.035);
      const shin = new THREE.Mesh(this.createLathe([[0.01,-0.38],[0.074,-0.42],[0.082,-0.54],[0.062,-0.74],[0.01,-0.76]]), secondaryMat);
      this.addOutline(shin, 1.045, isEnemy);
      const boot = new THREE.Mesh(new THREE.BoxGeometry(0.125, 0.11, 0.25), bootMat);
      boot.position.set(0, -0.78, 0.045);
      this.addOutline(boot, 1.045, isEnemy);
      hip.add(thigh, knee, shin, boot);
      return hip;
    };
    const leftLeg = makeLeg(-0.115);
    const rightLeg = makeLeg(0.115);
    const holster = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.16, 0.10), bootMat);
    holster.position.set(0.08, -0.18, 0.02);
    rightLeg.add(holster);
    root.add(leftLeg, rightLeg);

    // 3. SCULPTED ARMS & DETAILED ENEMY RIFLE
    const armGeom = this.createLathe([[0.01,0],[0.072,-0.04],[0.062,-0.24],[0.052,-0.44],[0.01,-0.46]]);
    const leftArm = new THREE.Group();
    leftArm.position.set(-0.28, 1.38, 0);
    const lMesh = new THREE.Mesh(armGeom, primaryMat);
    lMesh.rotation.set(Math.PI / 2.5, 0, -0.28);
    this.addOutline(lMesh, 1.05, isEnemy);
    leftArm.add(lMesh);

    const rightArm = new THREE.Group();
    rightArm.position.set(0.28, 1.38, 0);
    const rMesh = new THREE.Mesh(armGeom, primaryMat);
    rMesh.rotation.set(Math.PI / 2.5, 0, 0.25);
    this.addOutline(rMesh, 1.05, isEnemy);

    const rifle = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.095, 0.56), bootMat);
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.28, 12), accentMat);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.02, 0.36);
    rifle.add(body, barrel);
    rifle.position.set(-0.12, -0.18, 0.36);
    rightArm.add(rMesh, rifle);
    root.add(leftArm, rightArm);
    // 4. SCULPTED HEAD, FACIAL FEATURES, HEADSET & AGENT-SPECIFIC HEADGEAR
    const headGroup = new THREE.Group();
    headGroup.position.y = 1.66;
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.078, 0.14, 14), skinMat);
    neck.position.y = -0.12;
    const headMesh = new THREE.Mesh(this.createLathe([
      [0.01,-0.14],[0.075,-0.12],[0.125,-0.05],[0.148,0.03],[0.142,0.11],[0.09,0.16],[0.01,0.17]
    ]), skinMat);
    headMesh.scale.set(0.92, 1.0, 1.04);
    this.addOutline(headMesh, 1.045, isEnemy);

    const eyeGlow = new THREE.Mesh(
      new THREE.BoxGeometry(0.145, 0.026, 0.05),
      new THREE.MeshBasicMaterial({ color: isEnemy ? 0xff4655 : s.accent })
    );
    eyeGlow.position.set(0, 0.02, 0.142);

    // Nose, Eyebrows & Tactical Comms Headset
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.05, 6), skinMat);
    nose.position.set(0, 0.0, 0.152);
    nose.rotation.x = 0.25;

    [-0.042, 0.042].forEach((bx, idx) => {
      const brow = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.012, 0.02), hairMat);
      brow.position.set(bx, 0.046, 0.146);
      brow.rotation.z = idx === 0 ? -0.18 : 0.18;
      headGroup.add(brow);
    });

    const headsetBand = new THREE.Mesh(new THREE.TorusGeometry(0.162, 0.01, 8, 20, Math.PI), bootMat);
    headsetBand.position.set(0, 0.03, 0);
    const earCupL = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.025, 12), accentMat);
    earCupL.rotation.z = Math.PI / 2;
    earCupL.position.set(-0.155, 0.01, 0);
    const micBoom = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.12, 6), bootMat);
    micBoom.rotation.x = Math.PI / 2.4;
    micBoom.position.set(-0.13, -0.04, 0.08);

    headGroup.add(neck, headMesh, eyeGlow, nose, headsetBand, earCupL, micBoom);

    if (s.gear === 'WHITE_HAT') {
      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.018, 28), primaryMat);
      brim.position.y = 0.10;
      this.addOutline(brim, 1.03, isEnemy);
      const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.14, 22), primaryMat);
      crown.position.y = 0.17;
      const band = new THREE.Mesh(new THREE.CylinderGeometry(0.162, 0.162, 0.028, 22), accentMat);
      band.position.y = 0.12;
      headGroup.add(brim, crown, band);
    } else if (s.gear === 'OMEN_HOOD') {
      const hood = new THREE.Mesh(new THREE.SphereGeometry(0.185, 20, 20), primaryMat);
      hood.position.set(0, 0.02, -0.02);
      this.addOutline(hood, 1.04, isEnemy);
      eyeGlow.visible = false;
      [-0.042, 0, 0.042].forEach(ex => {
        const slit = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.06, 0.04), accentMat);
        slit.position.set(ex, 0.02, 0.155);
        headGroup.add(slit);
      });
      headGroup.add(hood);
    } else if (s.gear === 'FLAME_CROWN') {
      for (let i = 0; i < 7; i++) {
        const spike = new THREE.Mesh(new THREE.ConeGeometry(0.042, 0.16, 8), hairMat);
        spike.position.set((i - 3) * 0.036, 0.19, -0.02);
        spike.rotation.z = (3 - i) * 0.14;
        headGroup.add(spike);
      }
    } else if (s.gear === 'WIND_SCARF') {
      const bun = new THREE.Mesh(new THREE.SphereGeometry(0.075, 14, 14), hairMat);
      bun.position.set(0, 0.20, -0.06);
      const scarf = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.035, 0.55), primaryMat);
      scarf.position.set(0.14, -0.18, -0.26);
      scarf.rotation.x = -0.35;
      headGroup.add(bun, scarf);
    } else if (s.gear === 'GAS_MASK') {
      const mask = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.085, 0.09), accentMat);
      mask.position.set(0, -0.05, 0.135);
      headGroup.add(mask);
    } else {
      const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.156, 18, 18, 0, Math.PI * 2, 0, Math.PI * 0.55), hairMat);
      hairCap.position.set(0, 0.02, -0.01);
      headGroup.add(hairCap);
    }

    root.add(headGroup);

    const headHitbox = new THREE.Mesh(new THREE.SphereGeometry(0.20, 12, 12), new THREE.MeshBasicMaterial({ visible: false }));
    headHitbox.position.y = 1.66;
    root.add(headHitbox);

    return { group: root, head: headHitbox, body: torso, leftLeg, rightLeg, rightArm, coatTail };
  }
};
