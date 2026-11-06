'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import Omar from './Omar';
import { PINATA_SKILLS, PinataSkill } from '@/data/aboutData';

interface OmarWallPinataProps {
  unlockedCount: number;
  hitTrigger: number;
  activeSkillId: string | null;
  onHitPinata: () => void;
  onSelectSkill: (skill: PinataSkill) => void;
}

interface ConfettiParticle {
  vx: number;
  vy: number;
  vz: number;
  rx: number;
  ry: number;
  color: string;
}

const CONFETTI_COLORS = ['#C4FF36', '#FF5B42', '#FFDA35', '#725BFF', '#38BDF8', '#FFFFFF'];

function buildSkillBadgeTexture(skill: PinataSkill, index: number): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 320;
  c.height = 144;
  const ctx = c.getContext('2d')!;

  // Dark Neo-Brutalist Badge Background
  ctx.fillStyle = '#0D111C';
  ctx.fillRect(0, 0, 320, 144);

  // Colored Top Bar
  ctx.fillStyle = skill.color;
  ctx.fillRect(0, 0, 320, 32);

  // Outer Neon Border
  ctx.strokeStyle = skill.color;
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, 314, 138);

  // Header Code
  ctx.fillStyle = '#0B0C10';
  ctx.font = 'bold 15px monospace';
  const num = String(index + 1).padStart(2, '0');
  ctx.fillText(`SKILL #${num} // ${skill.level.toUpperCase()}`, 12, 22);

  // Main Skill Name
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 25px sans-serif';
  ctx.fillText(skill.name, 14, 74);

  // Category Pill
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.fillRect(14, 92, 292, 34);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 2;
  ctx.strokeRect(14, 92, 292, 34);

  ctx.fillStyle = skill.color;
  ctx.font = 'bold 15px monospace';
  ctx.fillText(skill.shortTag, 24, 114);

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function buildLockedSlotTexture(index: number): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 112;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#101522';
  ctx.fillRect(0, 0, 256, 112);

  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 4;
  ctx.setLineDash([10, 8]);
  ctx.strokeRect(6, 6, 244, 100);
  ctx.setLineDash([]);

  ctx.fillStyle = '#64748B';
  ctx.font = 'bold 16px monospace';
  const num = String(index + 1).padStart(2, '0');
  ctx.fillText(`SLOT #${num} [LOCKED]`, 36, 48);

  ctx.fillStyle = '#C4FF36';
  ctx.font = 'bold 14px monospace';
  ctx.fillText('★ CLICK OMAR TO POP ★', 32, 78);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export default function OmarWallPinata({
  unlockedCount,
  hitTrigger,
  activeSkillId,
  onHitPinata,
  onSelectSkill,
}: OmarWallPinataProps) {
  const badgeGroupRefs = useRef<(THREE.Group | null)[]>([]);
  const unlockTimesRef = useRef<number[]>(Array(PINATA_SKILLS.length).fill(-1));
  const prevUnlockedRef = useRef(0);

  const confettiRefs = useRef<(THREE.Mesh | null)[]>([]);
  const confettiStartRef = useRef(-10);
  const lastHitRef = useRef(hitTrigger);

  // Pre-build confetti particle trajectories
  const confettiData = useMemo<ConfettiParticle[]>(() => {
    return Array.from({ length: 28 }).map((_, i) => {
      const angle = (i / 28) * Math.PI * 2 + (i % 3) * 0.2;
      const speed = 1.4 + (i % 5) * 0.45;
      return {
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed + 1.2,
        vz: 1.1 + (i % 4) * 0.45,
        rx: 4 + (i % 5) * 2,
        ry: 5 + (i % 4) * 2,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      };
    });
  }, []);

  // Build textures for the 16 skill badges + locked slots + portrait backdrop
  const { skillTextures, lockedTextures, frameCanvas, frameTex } = useMemo(() => {
    if (typeof document === 'undefined') {
      return {
        skillTextures: [],
        lockedTextures: [],
        frameCanvas: null,
        frameTex: null,
      };
    }
    const sTex = PINATA_SKILLS.map((sk, idx) => buildSkillBadgeTexture(sk, idx));
    const lTex = PINATA_SKILLS.map((_, idx) => buildLockedSlotTexture(idx));

    const fc = document.createElement('canvas');
    fc.width = 512;
    fc.height = 680;
    const fTex = new THREE.CanvasTexture(fc);
    fTex.anisotropy = 4;
    fTex.colorSpace = THREE.SRGBColorSpace;

    return {
      skillTextures: sTex,
      lockedTextures: lTex,
      frameCanvas: fc,
      frameTex: fTex,
    };
  }, []);

  // Redraw portrait frame canvas when unlockedCount changes
  useEffect(() => {
    if (!frameCanvas || !frameTex) return;
    const ctx = frameCanvas.getContext('2d')!;
    ctx.fillStyle = '#0A0D14';
    ctx.fillRect(0, 0, 512, 680);

    // Subtle geometric constellation lines inspired by reference image_20bec1.jpg
    ctx.strokeStyle = 'rgba(255, 218, 53, 0.16)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 120);
    ctx.lineTo(512, 40);
    ctx.moveTo(60, 0);
    ctx.lineTo(180, 680);
    ctx.moveTo(460, 0);
    ctx.lineTo(310, 680);
    ctx.moveTo(0, 540);
    ctx.lineTo(512, 610);
    ctx.stroke();

    // Radial glow behind Omar.tsx
    const grad = ctx.createRadialGradient(256, 360, 20, 256, 360, 220);
    grad.addColorStop(0, 'rgba(196, 255, 54, 0.24)');
    grad.addColorStop(0.55, 'rgba(114, 91, 255, 0.10)');
    grad.addColorStop(1, 'rgba(10, 13, 20, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 680);

    // Inner gold/lime gallery frame border
    ctx.strokeStyle = '#C4FF36';
    ctx.lineWidth = 4;
    ctx.strokeRect(18, 18, 476, 644);

    // Editorial Top Header inside portrait frame
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('I am', 38, 66);
    ctx.fillStyle = '#C4FF36';
    ctx.font = 'italic bold 36px Georgia, serif';
    ctx.fillText('Omar S.', 112, 66);

    ctx.fillStyle = '#FFDA35';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('PIÑATA 3D // CLICK OMAR TO POP SKILLS', 38, 96);

    // Bottom status bar inside frame
    ctx.fillStyle = '#131826';
    ctx.fillRect(28, 588, 456, 58);
    ctx.strokeStyle = unlockedCount >= PINATA_SKILLS.length ? '#C4FF36' : '#FF5B42';
    ctx.lineWidth = 3;
    ctx.strokeRect(28, 588, 456, 58);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(
      `SKILLS UNLOCKED: ${unlockedCount} / ${PINATA_SKILLS.length}`,
      48,
      623
    );

    ctx.fillStyle = '#C4FF36';
    ctx.font = 'bold 15px monospace';
    ctx.fillText(
      unlockedCount >= PINATA_SKILLS.length ? '[MAX COMBO!]' : '[GOLPEAR ↗]',
      345,
      623
    );

    frameTex.needsUpdate = true;
  }, [unlockedCount, frameCanvas, frameTex]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Detect new hit for confetti burst
    if (hitTrigger !== lastHitRef.current) {
      lastHitRef.current = hitTrigger;
      confettiStartRef.current = t;
    }

    // Record unlock timestamps for newly popped skills
    if (unlockedCount > prevUnlockedRef.current) {
      for (let i = prevUnlockedRef.current; i < unlockedCount; i++) {
        if (unlockTimesRef.current[i] < 0) {
          // Stagger slightly if multiple skills popped at once
          unlockTimesRef.current[i] = t + (i - prevUnlockedRef.current) * 0.06;
        }
      }
      prevUnlockedRef.current = unlockedCount;
    } else if (unlockedCount < prevUnlockedRef.current) {
      for (let i = unlockedCount; i < PINATA_SKILLS.length; i++) {
        unlockTimesRef.current[i] = -1;
      }
      prevUnlockedRef.current = unlockedCount;
    }

    // Animate 3D Confetti Particles
    const dtConfetti = t - confettiStartRef.current;
    confettiRefs.current.forEach((mesh, idx) => {
      if (!mesh) return;
      if (dtConfetti >= 0 && dtConfetti < 1.35) {
        mesh.visible = true;
        const p = confettiData[idx];
        mesh.position.x = p.vx * dtConfetti;
        mesh.position.y = 0.05 + p.vy * dtConfetti - 2.6 * dtConfetti * dtConfetti;
        mesh.position.z = 0.16 + p.vz * dtConfetti * 0.65;
        mesh.rotation.x = dtConfetti * p.rx;
        mesh.rotation.y = dtConfetti * p.ry;
        const fade = Math.max(0.001, 1 - dtConfetti / 1.35);
        mesh.scale.setScalar(fade);
      } else {
        mesh.visible = false;
      }
    });

    // Animate 16 Skill Badges around the Wall Portrait Frame
    const comboElapsed = t - confettiStartRef.current;
    const isComboWave = comboElapsed >= 0 && comboElapsed < 0.75;

    badgeGroupRefs.current.forEach((grp, idx) => {
      if (!grp) return;
      const skill = PINATA_SKILLS[idx];
      const [tx, ty] = skill.wallOffset;
      const isUnlocked = idx < unlockedCount;

      if (!isUnlocked) {
        // Locked placeholder subtly sits on the wall
        grp.position.set(tx, ty, 0.025);
        grp.rotation.set(0, 0, 0);
        grp.scale.setScalar(0.84);
        return;
      }

      const uTime = unlockTimesRef.current[idx];
      const elapsed = uTime >= 0 ? Math.max(0, t - uTime) : 10;
      const duration = 0.68;

      if (elapsed < duration) {
        // Parabolic Piñata Pop Trajectory from center of Omar.tsx [0, 0.05, 0.22] out to [tx, ty, 0.07]
        const u = elapsed / duration;
        const ease = 1 - Math.pow(1 - u, 3);
        const backOvershoot = 1 + Math.sin(u * Math.PI) * 0.22;

        grp.position.x = THREE.MathUtils.lerp(0, tx, ease) * backOvershoot;
        grp.position.y = THREE.MathUtils.lerp(0.05, ty, ease) + Math.sin(u * Math.PI) * 0.35;
        grp.position.z = 0.07 + Math.sin(u * Math.PI) * 0.85;

        grp.rotation.y = (1 - ease) * Math.PI * 2;
        grp.rotation.z = Math.sin(u * Math.PI * 2) * 0.25;
        grp.scale.setScalar(THREE.MathUtils.lerp(0.2, 1.0, ease));
      } else {
        // Settled on the wall around Omar's portrait frame with gentle float
        const floatY = Math.sin(t * 2.2 + idx * 0.7) * 0.022;
        const comboJump = isComboWave ? Math.sin(comboElapsed * Math.PI * 2) * 0.08 : 0;
        const isSelected = activeSkillId === skill.id;

        grp.position.x = THREE.MathUtils.lerp(grp.position.x, tx, 0.15);
        grp.position.y = THREE.MathUtils.lerp(grp.position.y, ty + floatY, 0.15);
        grp.position.z = THREE.MathUtils.lerp(
          grp.position.z,
          (isSelected ? 0.16 : 0.07) + comboJump,
          0.15
        );
        grp.rotation.y = THREE.MathUtils.lerp(grp.rotation.y, 0, 0.15);
        grp.rotation.z = Math.sin(t * 1.5 + idx) * 0.02;
        grp.scale.setScalar(
          THREE.MathUtils.lerp(grp.scale.x, isSelected ? 1.12 : 1.0, 0.15)
        );
      }
    });
  });

  return (
    <group>
      {/* Dedicated Gallery Spotlight illuminating the Omar Portrait & Skill Wall */}
      <pointLight position={[0, 1.55, 1.6]} intensity={2.2} distance={6} decay={0} color="#FFFFFF" />
      <pointLight position={[0, 0.2, 1.2]} intensity={1.4} distance={4.5} decay={0} color="#C4FF36" />

      {/* Architectural Dark Feature Wall Backdrop for the Shrine */}
      <RoundedBox args={[4.15, 3.65, 0.04]} radius={0.02} position={[0, 0, -0.02]} receiveShadow>
        <meshStandardMaterial color="#0D1018" roughness={0.75} metalness={0.2} />
      </RoundedBox>
      {/* Outer Neon Accent Border around the entire Skill Wall */}
      <mesh position={[0, 1.81, 0.005]}>
        <boxGeometry args={[4.12, 0.035, 0.02]} />
        <meshBasicMaterial color="#C4FF36" />
      </mesh>
      <mesh position={[0, -1.81, 0.005]}>
        <boxGeometry args={[4.12, 0.035, 0.02]} />
        <meshBasicMaterial color="#725BFF" />
      </mesh>

      {/* Top Museum Gallery Lamp Bar above the Portrait Frame */}
      <group position={[0, 1.12, 0.14]}>
        <RoundedBox args={[1.1, 0.05, 0.12]} radius={0.01} castShadow>
          <meshStandardMaterial color="#1E293B" metalness={0.7} roughness={0.3} />
        </RoundedBox>
        <mesh position={[0, -0.028, 0.02]}>
          <boxGeometry args={[1.02, 0.015, 0.05]} />
          <meshBasicMaterial color="#FFDA35" />
        </mesh>
      </group>

      {/* ================= CENTRAL PORTRAIT FRAME ("CUADRO DE OMAR") ================= */}
      <group
        position={[0, -0.02, 0.04]}
        onClick={(e) => {
          e.stopPropagation();
          onHitPinata();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (typeof document !== 'undefined') document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          if (typeof document !== 'undefined') document.body.style.cursor = 'auto';
        }}
      >
        {/* Heavy Brutalist Outer Frame */}
        <RoundedBox args={[1.56, 2.02, 0.08]} radius={0.025} castShadow receiveShadow>
          <meshStandardMaterial color="#1E2436" roughness={0.35} metalness={0.55} />
        </RoundedBox>

        {/* Neon Frame Inner Bezel */}
        <mesh position={[0, 0, 0.042]}>
          <planeGeometry args={[1.44, 1.9]} />
          <meshBasicMaterial color="#C4FF36" />
        </mesh>

        {/* Portrait Canvas Background ("I am Omar S.") */}
        {frameTex && (
          <mesh position={[0, 0, 0.046]}>
            <planeGeometry args={[1.38, 1.84]} />
            <meshBasicMaterial map={frameTex} />
          </mesh>
        )}

        {/* Piñata Hanging Rope at Top of Portrait */}
        <mesh position={[0, 0.68, 0.09]}>
          <cylinderGeometry args={[0.012, 0.012, 0.42, 8]} />
          <meshStandardMaterial color="#FFDA35" roughness={0.4} />
        </mesh>

        {/* 3D Representation of Omar (Omar.tsx) Mounted Inside the Wall Frame! */}
        <Omar
          position={[0, -0.68, 0.11]}
          rotationY={0}
          accentColor="#C4FF36"
          scale={1.14}
          wallMounted={true}
          hitTrigger={hitTrigger}
          onPoke={onHitPinata}
        />
      </group>

      {/* ================= 3D CONFETTI BURST PARTICLES ================= */}
      <group position={[0, 0, 0.1]}>
        {confettiData.map((p, i) => (
          <mesh
            key={i}
            ref={(m) => {
              confettiRefs.current[i] = m;
            }}
            visible={false}
          >
            <boxGeometry args={[0.065, 0.065, 0.02]} />
            <meshBasicMaterial color={p.color} />
          </mesh>
        ))}
      </group>

      {/* ================= 16 SKILL BADGES AROUND THE PORTRAIT FRAME ================= */}
      {PINATA_SKILLS.map((skill, idx) => {
        const isUnlocked = idx < unlockedCount;
        const isSelected = activeSkillId === skill.id;
        return (
          <group
            key={skill.id}
            ref={(g) => {
              badgeGroupRefs.current[idx] = g;
            }}
            position={[skill.wallOffset[0], skill.wallOffset[1], 0.05]}
            onClick={(e) => {
              e.stopPropagation();
              if (isUnlocked) {
                onSelectSkill(skill);
              } else {
                onHitPinata();
              }
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              if (typeof document !== 'undefined') document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              if (typeof document !== 'undefined') document.body.style.cursor = 'auto';
            }}
          >
            <RoundedBox
              args={[0.72, 0.33, 0.036]}
              radius={0.012}
              castShadow={isUnlocked}
              receiveShadow
            >
              <meshStandardMaterial
                color={isUnlocked ? (isSelected ? skill.color : '#1E293B') : '#0F1420'}
                roughness={0.35}
                metalness={0.4}
              />
            </RoundedBox>
            {skillTextures[idx] && lockedTextures[idx] && (
              <mesh position={[0, 0, 0.02]}>
                <planeGeometry args={[0.69, 0.305]} />
                <meshBasicMaterial
                  map={isUnlocked ? skillTextures[idx] : lockedTextures[idx]}
                />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}
