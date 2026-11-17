// ============================================================================
// HIGH-DETAIL VALORANT PBR MAP TEXTURES, BUMP MAPS & ARCHITECTURAL PROPS
// ============================================================================
const ValorantArt = {
  textures: {},
  bumps: {},

  createCanvasTexture(drawFn, repeatX = 1, repeatY = 1) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    drawFn(ctx, 512, 512);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
    tex.anisotropy = 8;
    return tex;
  },

  initTextures() {
    // 1. Hand-Painted Sandstone Brick + Architectural Trim
    this.textures.sandstoneWall = this.createCanvasTexture((ctx, w, h) => {
      ctx.fillStyle = '#cfa078';
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 500; i++) {
        ctx.fillStyle = i % 2 === 0 ? 'rgba(175, 118, 72, 0.24)' : 'rgba(240, 204, 165, 0.2)';
        ctx.fillRect(Math.random() * w, Math.random() * h, 26 + Math.random() * 42, 10 + Math.random() * 16);
      }
      ctx.fillStyle = '#9c6644';
      ctx.fillRect(0, h - 48, w, 48);
      ctx.strokeStyle = 'rgba(95, 62, 38, 0.38)';
      ctx.lineWidth = 3;
      for (let y = 0; y < h; y += 32) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        const offset = (y / 32) % 2 === 0 ? 0 : 32;
        for (let x = offset; x < w; x += 64) {
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 32); ctx.stroke();
        }
      }
      ctx.fillStyle = '#186f65';
      ctx.fillRect(0, 48, w, 24);
      ctx.fillStyle = '#e0a96d';
      ctx.fillRect(0, 72, w, 8);
    }, 10, 2);

    this.bumps.stoneBump = this.createCanvasTexture((ctx, w, h) => {
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#222222';
      ctx.lineWidth = 4;
      for (let y = 0; y < h; y += 32) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
    }, 10, 2);

    // 2. Courtyard Stone Tiles
    this.textures.courtyardFloor = this.createCanvasTexture((ctx, w, h) => {
      ctx.fillStyle = '#9e9589';
      ctx.fillRect(0, 0, w, h);
      for (let y = 0; y < h; y += 64) {
        for (let x = 0; x < w; x += 64) {
          ctx.fillStyle = (x + y) % 128 === 0 ? '#b5ab9c' : '#8a8175';
          ctx.fillRect(x + 3, y + 3, 58, 58);
          ctx.strokeStyle = '#575149';
          ctx.lineWidth = 3;
          ctx.strokeRect(x + 2, y + 2, 60, 60);
        }
      }
    }, 18, 18);

    // 3. Kingdom Radianite Hazard Crate
    this.textures.radianiteCrate = this.createCanvasTexture((ctx, w, h) => {
      ctx.fillStyle = '#1e2d3b';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 28;
      ctx.strokeRect(14, 14, w - 28, h - 28);
      ctx.beginPath();
      ctx.moveTo(20, 20); ctx.lineTo(w - 20, h - 20);
      ctx.moveTo(w - 20, 20); ctx.lineTo(20, h - 20);
      ctx.stroke();
      ctx.fillStyle = '#18e0b8';
      ctx.fillRect(36, h / 2 - 14, w - 72, 28);
      ctx.fillStyle = '#0f1923';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('KINGDOM // R-04', 150, h / 2 + 8);
    }, 1, 1);

    // 4. Wooden Supply Crate
    this.textures.woodCrate = this.createCanvasTexture((ctx, w, h) => {
      ctx.fillStyle = '#d49b6a';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#6e4726';
      ctx.lineWidth = 24;
      ctx.strokeRect(12, 12, w - 24, h - 24);
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(16, 16); ctx.lineTo(w - 16, h - 16);
      ctx.moveTo(w - 16, 16); ctx.lineTo(16, h - 16);
      ctx.stroke();
    }, 1, 1);

    // 5. Icebox / Kingdom Industrial Steel Paneling
    this.textures.iceboxSteel = this.createCanvasTexture((ctx, w, h) => {
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 6;
      for (let x = 0; x < w; x += 64) ctx.strokeRect(x, 0, 64, h);
      ctx.fillStyle = '#f97316';
      ctx.fillRect(0, h - 42, w, 24);
    }, 8, 2);
  },

  buildArchway(x, y, z, width, height, depth, mat) {
    const archGroup = new THREE.Group();
    const pillarW = width * 0.24;
    const leftPillar = new THREE.Mesh(new THREE.BoxGeometry(pillarW, height, depth), mat);
    leftPillar.position.set(-width / 2 + pillarW / 2, height / 2, 0);
    const rightPillar = new THREE.Mesh(new THREE.BoxGeometry(pillarW, height, depth), mat);
    rightPillar.position.set(width / 2 - pillarW / 2, height / 2, 0);
    const lintel = new THREE.Mesh(new THREE.BoxGeometry(width, height * 0.28, depth), mat);
    lintel.position.set(0, height - (height * 0.14), 0);

    archGroup.add(leftPillar, rightPillar, lintel);
    archGroup.position.set(x, y, z);
    archGroup.traverse(m => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
    return { group: archGroup, parts: [leftPillar, rightPillar, lintel] };
  },
  buildDetailedWeapon(weaponName) {
    const root = new THREE.Group();

    const agentKey = (typeof Game !== 'undefined' && Game.selectedAgent) ? Game.selectedAgent.toUpperCase() : 'PHOENIX';
    const agentSpec = (typeof AgentModels !== 'undefined' && AgentModels.specs[agentKey])
      ? AgentModels.specs[agentKey]
      : { primary: 0x3b486b, secondary: 0x242938, accent: 0xff6b35 };

    const skinId = document.getElementById('skin-select')?.value || 'STANDARD';
    const skinData = (typeof VAL_DATA !== 'undefined' && VAL_DATA.skins.find(s => s.id === skinId))
      || { color: 0x20262e, accent: 0xff4655 };

    const gunMetal = new THREE.MeshStandardMaterial({ color: skinData.color, metalness: 0.85, roughness: 0.20 });
    const polymerDark = new THREE.MeshStandardMaterial({ color: 0x11161d, metalness: 0.35, roughness: 0.55 });
    const chromeAccent = new THREE.MeshStandardMaterial({
      color: skinData.accent,
      emissive: skinData.accent,
      emissiveIntensity: skinId === 'STANDARD' ? 0.08 : 0.65,
      metalness: 0.9,
      roughness: 0.16
    });
    const holoOrange = new THREE.MeshBasicMaterial({ color: 0xff9b21 });

    // Agent-Matched First-Person Sleeves, Tactical Cuffs & Gloves
    const gloveMat = new THREE.MeshStandardMaterial({ color: agentSpec.secondary, roughness: 0.7 });
    const sleeveMat = new THREE.MeshStandardMaterial({ color: agentSpec.primary, roughness: 0.65 });
    const cuffMat = new THREE.MeshStandardMaterial({ color: agentSpec.accent, emissive: agentSpec.accent, emissiveIntensity: 0.4 });

    const rightHand = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.14), gloveMat);
    rightHand.position.set(0.01, -0.09, 0.16);
    const rightCuff = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.04, 14), cuffMat);
    rightCuff.rotation.x = Math.PI / 2.4;
    rightCuff.position.set(0.03, -0.12, 0.24);
    const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.058, 0.42, 14), sleeveMat);
    rightArm.rotation.x = Math.PI / 2.4;
    rightArm.position.set(0.06, -0.18, 0.36);

    const leftHand = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.075, 0.13), gloveMat);
    leftHand.position.set(-0.03, -0.05, -0.18);
    const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.48, 14), sleeveMat);
    leftArm.rotation.set(Math.PI / 2.2, 0, -0.35);
    leftArm.position.set(-0.14, -0.16, 0.05);
    root.add(rightHand, rightCuff, rightArm, leftHand, leftArm);

    if (weaponName === 'KNIFE') {
      const hilt = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.04, 0.16), polymerDark);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.025, 0.007, 8, 16), chromeAccent);
      ring.position.set(0, 0, 0.09);
      const blade = new THREE.Mesh(new THREE.ConeGeometry(0.026, 0.24, 4), chromeAccent);
      blade.rotation.x = -Math.PI / 2.3;
      blade.position.set(0, 0.03, -0.16);
      root.add(hilt, ring, blade);
      return root;
    }

    if (weaponName === 'PHANTOM' || weaponName === 'SPECTRE' || weaponName === 'GHOST') {
      const receiver = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.11, 0.48), gunMetal);
      const shroud = new THREE.Mesh(new THREE.BoxGeometry(0.068, 0.085, 0.28), polymerDark);
      shroud.position.set(0, 0.01, -0.32);
      const suppressor = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.30, 18), polymerDark);
      suppressor.rotation.x = Math.PI / 2;
      suppressor.position.set(0, 0.015, -0.58);
      const trimStrip = new THREE.Mesh(new THREE.BoxGeometry(0.078, 0.015, 0.46), chromeAccent);
      trimStrip.position.set(0, 0.03, -0.02);
      root.add(receiver, shroud, suppressor, trimStrip);
    } else if (weaponName === 'OPERATOR' || weaponName === 'MARSHAL' || weaponName === 'OUTLAW') {
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.68), gunMetal);
      const longBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.58, 16), chromeAccent);
      longBarrel.rotation.x = Math.PI / 2;
      longBarrel.position.set(0, 0.02, -0.58);
      const scopeTube = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.028, 0.36, 18), polymerDark);
      scopeTube.rotation.x = Math.PI / 2;
      scopeTube.position.set(0, 0.105, -0.04);
      root.add(body, longBarrel, scopeTube);
    } else if (weaponName === 'SHERIFF' || weaponName === 'CLASSIC' || weaponName === 'FRENZY' || weaponName === 'SHORTY') {
      const slide = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.075, 0.32), chromeAccent);
      const frame = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.30), polymerDark);
      frame.position.set(0, -0.045, 0);
      const grip = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.14, 0.07), polymerDark);
      grip.position.set(0, -0.11, 0.09);
      grip.rotation.x = -0.22;
      root.add(slide, frame, grip);
    } else {
      const receiver = new THREE.Mesh(new THREE.BoxGeometry(0.078, 0.115, 0.52), gunMetal);
      const handguard = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.095, 0.34), polymerDark);
      handguard.position.set(0, 0.005, -0.36);
      for (let i = 0; i < 6; i++) {
        const railTooth = new THREE.Mesh(new THREE.BoxGeometry(0.042, 0.014, 0.022), chromeAccent);
        railTooth.position.set(0, 0.062, -0.12 - i * 0.05);
        root.add(railTooth);
      }
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.26, 14), chromeAccent);
      barrel.rotation.x = Math.PI / 2;
      barrel.position.set(0, 0.02, -0.60);
      root.add(receiver, handguard, barrel);
    }

    const magMesh = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.22, 0.09), polymerDark);
    magMesh.position.set(0, -0.14, -0.05);
    magMesh.rotation.x = 0.2;
    const boltMesh = new THREE.Mesh(new THREE.BoxGeometry(0.088, 0.024, 0.07), chromeAccent);
    boltMesh.position.set(0, 0.045, 0.08);
    root.add(magMesh, boltMesh);

    const sightFrame = new THREE.Mesh(new THREE.BoxGeometry(0.058, 0.046, 0.09), polymerDark);
    sightFrame.position.set(0, 0.082, 0.04);
    const reticle = new THREE.Mesh(new THREE.ConeGeometry(0.012, 0.018, 3), holoOrange);
    reticle.position.set(0, 0.085, 0.04);
    root.add(sightFrame, reticle);

    const muzzleFlash = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.095, 0),
      new THREE.MeshBasicMaterial({ color: skinData.accent, transparent: true, opacity: 0.92 })
    );
    muzzleFlash.position.set(0, 0.02, -0.74);
    muzzleFlash.visible = false;
    root.add(muzzleFlash);

    root.userData.muzzleFlash = muzzleFlash;
    root.userData.magazineMesh = magMesh;
    root.userData.boltMesh = boltMesh;
    return root;
  }
};
