// ============================================================================
// AAA PHYSICS COLLIDERS, PARTICLE VFX ENGINE, DEPLOYABLE ABILITIES & ANTI-CHEAT
// ============================================================================
const PhysicsVFX = {
  colliders: [],
  particles: [],
  decals: [],
  turrets: [],
  reconArrows: [],

  reset() {
    this.colliders = [];
    this.turrets.forEach(t => Game.scene.remove(t.mesh));
    this.turrets = [];
    this.reconArrows.forEach(a => Game.scene.remove(a.mesh));
    this.reconArrows = [];
    this.decals.forEach(d => Game.scene.remove(d));
    this.decals = [];
  },

  registerCollider(mesh, isPlatform = true) {
    mesh.updateMatrixWorld();
    const box = new THREE.Box3().setFromObject(mesh);
    this.colliders.push({ box, mesh, isPlatform });
  },

  resolvePlayerPhysics(pos, radius = 0.45, eyeHeight = 1.75) {
    let groundY = 0;

    for (const col of this.colliders) {
      const b = col.box;
      const feetY = pos.y - eyeHeight;

      const overlapX = pos.x + radius > b.min.x && pos.x - radius < b.max.x;
      const overlapZ = pos.z + radius > b.min.z && pos.z - radius < b.max.z;

      if (overlapX && overlapZ) {
        if (col.isPlatform && feetY >= b.max.y - 0.35) {
          groundY = Math.max(groundY, b.max.y);
          continue;
        }

        if (feetY < b.max.y - 0.15 && pos.y > b.min.y) {
          const penLeft = (pos.x + radius) - b.min.x;
          const penRight = b.max.x - (pos.x - radius);
          const penFront = (pos.z + radius) - b.min.z;
          const penBack = b.max.z - (pos.z - radius);
          const minPen = Math.min(penLeft, penRight, penFront, penBack);

          if (minPen === penLeft) pos.x = b.min.x - radius;
          else if (minPen === penRight) pos.x = b.max.x + radius;
          else if (minPen === penFront) pos.z = b.min.z - radius;
          else if (minPen === penBack) pos.z = b.max.z + radius;
        }
      }
    }
    return groundY;
  },

  spawnImpactParticles(point, normal, type = 'SPARK') {
    const colorMap = {
      SPARK: 0xffb703,
      BLOOD: 0xd90429,
      SHIELD: 0x18e0b8,
      EXPLOSION: 0xff6b35
    };
    const count = type === 'EXPLOSION' ? 28 : 10;
    const mat = new THREE.MeshBasicMaterial({ color: colorMap[type] || 0xffb703 });

    for (let i = 0; i < count; i++) {
      const size = type === 'EXPLOSION' ? 0.14 : 0.045;
      const p = new THREE.Mesh(new THREE.BoxGeometry(size, size, size), mat);
      p.position.copy(point);
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * (type === 'EXPLOSION' ? 14 : 5),
        Math.random() * (type === 'EXPLOSION' ? 10 : 4) + 1,
        (Math.random() - 0.5) * (type === 'EXPLOSION' ? 14 : 5)
      );
      if (normal) vel.addScaledVector(normal, 3);
      Game.scene.add(p);
      this.particles.push({ mesh: p, vel, life: type === 'EXPLOSION' ? 0.65 : 0.35 });
    }

    if (type === 'SPARK' && normal) {
      const decal = new THREE.Mesh(
        new THREE.CircleGeometry(0.055, 8),
        new THREE.MeshBasicMaterial({ color: 0x111111, polygonOffset: true, polygonOffsetFactor: -1 })
      );
      decal.position.copy(point).addScaledVector(normal, 0.015);
      decal.lookAt(point.clone().add(normal));
      Game.scene.add(decal);
      this.decals.push(decal);
      if (this.decals.length > 60) Game.scene.remove(this.decals.shift());
    }
  },

  deployKilljoyTurret(pos, yaw) {
    const group = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 0.45, 12), new THREE.MeshStandardMaterial({ color: 0xfacc15 }));
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.22, 0.45), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
    head.position.y = 0.35;
    group.add(base, head);
    group.position.set(pos.x, 0.22, pos.z);
    group.rotation.y = yaw;
    Game.scene.add(group);
    this.turrets.push({ mesh: group, head, cooldown: 0.5, life: 25 });
  },

  fireSovaReconArrow(origin, dir) {
    const arrow = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.7, 8),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    arrow.position.copy(origin);
    arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    Game.scene.add(arrow);
    this.reconArrows.push({ mesh: arrow, vel: dir.clone().multiplyScalar(38), stuck: false, pulses: 3, timer: 0.6 });
  },

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      p.vel.y -= 16 * dt;
      p.mesh.position.addScaledVector(p.vel, dt);
      p.mesh.scale.setScalar(Math.max(0.01, p.life * 2.5));
      if (p.life <= 0) {
        Game.scene.remove(p.mesh);
        this.particles.splice(i, 1);
      }
    }

    for (let i = this.turrets.length - 1; i >= 0; i--) {
      const t = this.turrets[i];
      t.life -= dt;
      t.cooldown -= dt;
      if (t.life <= 0) {
        Game.scene.remove(t.mesh);
        this.turrets.splice(i, 1);
        continue;
      }

      const target = Game.enemies.find(e => e.alive && e.mesh.position.distanceTo(t.mesh.position) < 24);
      if (target) {
        t.head.lookAt(target.mesh.position.x, 1.2, target.mesh.position.z);
        if (t.cooldown <= 0) {
          t.cooldown = 0.85;
          target.hp -= 12;
          this.spawnImpactParticles(target.mesh.position.clone().add(new THREE.Vector3(0, 1.2, 0)), null, 'BLOOD');
          if (target.hp <= 0) {
            target.alive = false;
            target.mesh.visible = false;
            Game.kills++;
            Game.updateEnemyPips();
            Game.logKill(`KILLJOY TURRET eliminated ${target.name}`);
            Game.checkRoundEnd();
          }
        }
      }
    }

    for (let i = this.reconArrows.length - 1; i >= 0; i--) {
      const a = this.reconArrows[i];
      if (!a.stuck) {
        a.vel.y -= 9.8 * dt;
        a.mesh.position.addScaledVector(a.vel, dt);
        if (a.mesh.position.y <= 0.2 || a.mesh.position.z < -54 || Math.abs(a.mesh.position.x) > 54) {
          a.stuck = true;
        }
      } else {
        a.timer -= dt;
        if (a.timer <= 0) {
          a.timer = 1.6;
          a.pulses--;
          AudioEngine.play('BEEP', 0.4);

          const sonar = new THREE.Mesh(
            new THREE.RingGeometry(0.5, 1.0, 32),
            new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.8 })
          );
          sonar.rotation.x = -Math.PI / 2;
          sonar.position.set(a.mesh.position.x, 0.1, a.mesh.position.z);
          Game.scene.add(sonar);
          let sScale = 1;
          const expand = setInterval(() => {
            sScale += 2.2;
            sonar.scale.setScalar(sScale);
            sonar.material.opacity -= 0.08;
            if (sonar.material.opacity <= 0) {
              clearInterval(expand);
              Game.scene.remove(sonar);
            }
          }, 40);

          Game.enemies.forEach(e => {
            if (e.alive && e.mesh.position.distanceTo(a.mesh.position) < 28 && e.body?.material) {
              e.body.material.emissive = new THREE.Color(0xffb703);
              e.body.material.emissiveIntensity = 1.0;
              setTimeout(() => {
                if (e.body?.material) e.body.material.emissiveIntensity = 0;
              }, 1400);
            }
          });

          if (a.pulses <= 0) {
            Game.scene.remove(a.mesh);
            this.reconArrows.splice(i, 1);
          }
        }
      }
    }
  }
};

// ============================================================================
// CLIENT-SIDE VANGUARD ANTI-CHEAT VALIDATOR
// ============================================================================
const VanguardAC = {
  lastPos: new THREE.Vector3(),
  violations: 0,

  validateFrame(pos, dt, weapon) {
    if (dt <= 0) return;
    const dist = pos.distanceTo(this.lastPos);
    const speed = dist / dt;
    if (this.lastPos.lengthSq() > 0 && speed > 36 && dt < 0.2) {
      this.violations++;
      pos.copy(this.lastPos);
    } else {
      this.lastPos.copy(pos);
    }

    if (weapon.mag > weapon.maxMag) weapon.mag = weapon.maxMag;
    if (weapon.mag < 0) weapon.mag = 0;
  }
};
