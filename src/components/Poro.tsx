'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PoroProps {
  position: [number, number, number];
  rotationY: number;
  accentColor?: string;
  onPoke: () => void;
}

// Paleta cartoon: crema + caramelo + café
const CREAM = '#F6E7C8';
const CREAM_LIGHT = '#FFF4DC';
const CARAMEL = '#C9803F';
const BROWN = '#6E3F23';
const DARK = '#1F1612';
const PINK = '#F58BA0';
const BLUSH = '#F7A58F';
const WHITE = '#FFFFFF';

// Material cartoon reutilizable
function Mat({
  color,
  roughness = 0.75,
  metalness = 0,
}: {
  color: string;
  roughness?: number;
  metalness?: number;
}) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={roughness}
      metalness={metalness}
    />
  );
}

// Ojo grande con brillo (el grupo se escala en Y para parpadear)
function Eye({
  position,
  eyeRef,
}: {
  position: [number, number, number];
  eyeRef: React.RefObject<THREE.Group | null>;
}) {
  return (
    <group ref={eyeRef} position={position}>
      {/* Esclera */}
      <mesh scale={[1, 1.15, 0.6]} castShadow>
        <sphereGeometry args={[0.04, 32, 24]} />
        <Mat color={WHITE} roughness={0.3} />
      </mesh>
      {/* Pupila */}
      <mesh position={[0, -0.002, 0.016]} scale={[1, 1.15, 0.5]}>
        <sphereGeometry args={[0.026, 24, 24]} />
        <Mat color={DARK} roughness={0.2} />
      </mesh>
      {/* Brillo grande */}
      <mesh position={[-0.009, 0.014, 0.026]}>
        <sphereGeometry args={[0.009, 12, 12]} />
        <meshBasicMaterial color={WHITE} />
      </mesh>
      {/* Brillo pequeño */}
      <mesh position={[0.008, -0.01, 0.025]}>
        <sphereGeometry args={[0.004, 10, 10]} />
        <meshBasicMaterial color={WHITE} />
      </mesh>
    </group>
  );
}

// Pata con deditos
function Paw({
  position,
  rotationY = 0,
  color = CREAM,
}: {
  position: [number, number, number];
  rotationY?: number;
  color?: string;
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh scale={[1.1, 0.7, 1.45]} castShadow>
        <sphereGeometry args={[0.065, 28, 22]} />
        <Mat color={color} roughness={0.8} />
      </mesh>
      {[-0.032, 0, 0.032].map((x, i) => (
        <mesh
          key={i}
          position={[x, -0.004, 0.082 - Math.abs(x) * 0.5]}
          scale={[1, 0.8, 1.1]}
          castShadow
        >
          <sphereGeometry args={[0.02, 16, 16]} />
          <Mat color={color} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

export default function Poro({
  position,
  rotationY,
  accentColor = '#C4FF36',
  onPoke,
}: PoroProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  const leftEarRef = useRef<THREE.Group>(null);
  const rightEarRef = useRef<THREE.Group>(null);

  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  const leftEyeRef = useRef<THREE.Group>(null);
  const rightEyeRef = useRef<THREE.Group>(null);
  const leftBrowRef = useRef<THREE.Mesh>(null);
  const rightBrowRef = useRef<THREE.Mesh>(null);

  const tailRef = useRef<THREE.Group>(null);
  const tongueRef = useRef<THREE.Group>(null);
  const noseRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const tagRef = useRef<THREE.Group>(null);

  // Refs en vez de state: evita re-renders en cada frame
  const pokeRef = useRef(0);
  const blinkRef = useRef({ next: 2.5, start: -1 });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    pokeRef.current = 1;
    blinkRef.current.start = -1;
    onPoke();
  };

  useFrame(({ clock, camera }, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const t = clock.getElapsedTime();

    // Decaimiento del poke
    if (pokeRef.current > 0) {
      pokeRef.current = Math.max(0, pokeRef.current - delta * 1.8);
    }
    const poke = pokeRef.current;
    const pokeWave = Math.sin(poke * Math.PI); // 0 -> 1 -> 0

    // ===== POSICIÓN + SALTITO =====
    group.position.x = THREE.MathUtils.lerp(group.position.x, position[0], 0.08);
    group.position.z = THREE.MathUtils.lerp(group.position.z, position[2], 0.08);

    // Saltito idle suave cada ~3.5 s
    const hopPhase = (t % 3.5) / 3.5;
    const idleHop = hopPhase < 0.18 ? Math.sin((hopPhase / 0.18) * Math.PI) * 0.035 : 0;

    group.position.y =
      position[1] + Math.sin(t * 2.4) * 0.008 + idleHop + pokeWave * 0.28;

    // ===== MIRAR A LA CÁMARA =====
    const dx = camera.position.x - group.position.x;
    const dz = camera.position.z - group.position.z;
    const angleToCam = Math.atan2(dx, dz);

    const targetRotY =
      THREE.MathUtils.lerp(rotationY, angleToCam, 0.82) +
      Math.sin(poke * Math.PI * 2) * 0.35;

    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, targetRotY, 0.1);

    // ===== SQUASH & STRETCH =====
    if (bodyRef.current) {
      const breathe = Math.sin(t * 2.4) * 0.015;
      // Estira al subir, aplasta al caer
      const stretch = pokeWave * 0.12 - (poke > 0 && poke < 0.15 ? 0.1 : 0);
      const sy = 1 + breathe + stretch + (idleHop > 0 ? 0.03 : 0);
      bodyRef.current.scale.set(1 / Math.sqrt(sy), sy, 1 / Math.sqrt(sy));
    }

    // ===== CABEZA =====
    if (headRef.current) {
      headRef.current.rotation.x = -0.05 + Math.sin(t * 2.2) * 0.02 - pokeWave * 0.15;
      headRef.current.rotation.z = Math.sin(t * 1.3) * 0.06 + Math.sin(poke * Math.PI * 3) * 0.08;
      headRef.current.rotation.y = Math.sin(t * 0.9) * 0.08;
    }

    // ===== OREJAS (con retraso entre ellas) =====
    if (leftEarRef.current && rightEarRef.current) {
      const flap = Math.sin(poke * Math.PI * 3) * 0.35;

      leftEarRef.current.rotation.z =
        0.22 + Math.sin(t * 2.8) * 0.05 + flap + idleHop * 6;
      rightEarRef.current.rotation.z =
        -0.22 - Math.sin(t * 2.8 + 0.7) * 0.05 - flap - idleHop * 6;

      leftEarRef.current.rotation.x = Math.sin(t * 2.2) * 0.04 - pokeWave * 0.2;
      rightEarRef.current.rotation.x = Math.sin(t * 2.2 + 0.7) * 0.04 - pokeWave * 0.2;
    }

    // ===== BRAZOS =====
    if (leftArmRef.current && rightArmRef.current) {
      const wave = pokeWave * 0.6;
      leftArmRef.current.rotation.z = 0.05 + Math.sin(t * 2) * 0.03 - wave;
      rightArmRef.current.rotation.z = -0.05 - Math.sin(t * 2) * 0.03 + wave;
    }

    // ===== COLA (se agita más rápido al poke) =====
    if (tailRef.current) {
      const speed = 8 + poke * 14;
      tailRef.current.rotation.y = Math.sin(t * speed) * (0.45 + poke * 0.3);
      tailRef.current.rotation.x = -0.5 + Math.sin(t * 3) * 0.05;
    }

    // ===== PARPADEO =====
    const blink = blinkRef.current;
    if (blink.start < 0 && t > blink.next) {
      blink.start = t;
    }
    let eyeOpen = 1;
    if (blink.start >= 0) {
      const p = (t - blink.start) / 0.16;
      if (p >= 1) {
        blink.start = -1;
        blink.next = t + 2 + Math.random() * 3;
      } else {
        eyeOpen = 1 - Math.sin(p * Math.PI) * 0.92;
      }
    }
    // Ojos más abiertos (sorpresa) al poke
    const surprise = 1 + pokeWave * 0.25;
    leftEyeRef.current?.scale.set(1, eyeOpen * surprise, 1);
    rightEyeRef.current?.scale.set(1, eyeOpen * surprise, 1);

    // ===== CEJAS =====
    if (leftBrowRef.current && rightBrowRef.current) {
      const lift = pokeWave * 0.025;
      leftBrowRef.current.position.y = 0.112 + lift;
      rightBrowRef.current.position.y = 0.112 + lift + Math.sin(t * 1.5) * 0.003;
      leftBrowRef.current.rotation.z = 0.2 + pokeWave * 0.2;
      rightBrowRef.current.rotation.z = -0.35 - pokeWave * 0.2; // ceja traviesa
    }

    // ===== LENGUA =====
    if (tongueRef.current) {
      const idleTongue = (Math.sin(t * 1.1) + 1) * 0.12; // asoma un poquito
      const amt = Math.min(1, idleTongue + pokeWave);
      tongueRef.current.scale.set(1, 0.2 + amt * 1.1, 1);
      tongueRef.current.rotation.x = Math.sin(t * 6) * 0.08 * amt;
    }

    // ===== NARIZ =====
    if (noseRef.current) {
      const s = 1 + Math.sin(t * 3) * 0.04;
      noseRef.current.scale.set(1.2 * s, 0.85 * s, 0.9 * s);
    }

    // ===== PLACA DEL COLLAR =====
    if (tagRef.current) {
      tagRef.current.rotation.z = Math.sin(t * 3.2) * 0.12 + pokeWave * 0.4;
    }

    // ===== ANILLO DEL PEDESTAL =====
    if (ringRef.current) {
      const s = 1 + Math.sin(t * 3) * 0.04 + pokeWave * 0.15;
      ringRef.current.scale.set(s, s, 1);
    }
  });

  return (
    <group ref={groupRef} position={position} onClick={handleClick}>
      {/* ================= PEDESTAL ================= */}
      <mesh position={[0, 0.015, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.26, 0.29, 0.03, 40]} />
        <meshStandardMaterial color="#1E2436" metalness={0.5} roughness={0.35} />
      </mesh>

      <mesh ref={ringRef} position={[0, 0.032, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.23, 0.27, 40]} />
        <meshBasicMaterial color={accentColor} side={THREE.DoubleSide} />
      </mesh>

      {/* Sombra blanda bajo el perro */}
      <mesh position={[0, 0.034, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.17, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.25} />
      </mesh>

      {/* Todo lo que se aplasta/estira */}
      <group ref={bodyRef} position={[0, 0.03, 0]}>
        {/* ================= PIES ================= */}
        <Paw position={[-0.1, 0.045, 0.06]} rotationY={-0.15} />
        <Paw position={[0.1, 0.045, 0.06]} rotationY={0.15} />

        {/* ================= CUERPO ================= */}
        {/* Cuerpo principal en forma de pera */}
        <mesh position={[0, 0.2, -0.01]} scale={[0.95, 1.1, 0.88]} castShadow receiveShadow>
          <sphereGeometry args={[0.18, 40, 32]} />
          <Mat color={CREAM} roughness={0.8} />
        </mesh>

        {/* Barriga clara */}
        <mesh position={[0, 0.18, 0.08]} scale={[0.75, 0.9, 0.45]} castShadow>
          <sphereGeometry args={[0.15, 32, 24]} />
          <Mat color={CREAM_LIGHT} roughness={0.85} />
        </mesh>

        {/* Mancha caramelo en el lomo */}
        <mesh position={[-0.07, 0.27, -0.12]} scale={[1, 0.9, 0.35]} rotation={[0, -0.4, 0.3]}>
          <sphereGeometry args={[0.08, 24, 20]} />
          <Mat color={CARAMEL} roughness={0.85} />
        </mesh>

        {/* Manchitas pequeñas */}
        <mesh position={[0.1, 0.2, -0.12]} scale={[1, 1, 0.3]} rotation={[0, 0.5, 0]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <Mat color={CARAMEL} roughness={0.85} />
        </mesh>
        <mesh position={[0.06, 0.12, -0.15]} scale={[1, 1, 0.3]} rotation={[0, 0.3, 0]}>
          <sphereGeometry args={[0.022, 12, 12]} />
          <Mat color={CARAMEL} roughness={0.85} />
        </mesh>

        {/* ================= COLA ================= */}
        <group ref={tailRef} position={[0, 0.14, -0.15]}>
          <mesh position={[0, 0.05, -0.04]} rotation={[0.5, 0, 0]} castShadow>
            <capsuleGeometry args={[0.022, 0.1, 8, 16]} />
            <Mat color={CREAM} roughness={0.8} />
          </mesh>
          {/* Punta caramelo */}
          <mesh position={[0, 0.115, -0.085]} scale={[1, 1, 1.1]} castShadow>
            <sphereGeometry args={[0.03, 16, 16]} />
            <Mat color={CARAMEL} roughness={0.8} />
          </mesh>
        </group>

        {/* ================= BRAZOS ================= */}
        <group ref={leftArmRef} position={[-0.15, 0.27, 0.03]}>
          <mesh position={[-0.02, -0.05, 0.03]} rotation={[0.2, 0, 0.35]} castShadow>
            <capsuleGeometry args={[0.032, 0.09, 8, 16]} />
            <Mat color={CREAM} roughness={0.8} />
          </mesh>
          <mesh position={[-0.05, -0.12, 0.05]} scale={[1, 0.85, 1.15]} castShadow>
            <sphereGeometry args={[0.042, 24, 20]} />
            <Mat color={CREAM_LIGHT} roughness={0.8} />
          </mesh>
        </group>

        <group ref={rightArmRef} position={[0.15, 0.27, 0.03]}>
          <mesh position={[0.02, -0.05, 0.03]} rotation={[0.2, 0, -0.35]} castShadow>
            <capsuleGeometry args={[0.032, 0.09, 8, 16]} />
            <Mat color={CREAM} roughness={0.8} />
          </mesh>
          <mesh position={[0.05, -0.12, 0.05]} scale={[1, 0.85, 1.15]} castShadow>
            <sphereGeometry args={[0.042, 24, 20]} />
            <Mat color={CREAM_LIGHT} roughness={0.8} />
          </mesh>
        </group>

        {/* ================= PAÑUELO (accentColor) ================= */}
        <mesh position={[0, 0.375, 0.01]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.12, 0.026, 16, 48]} />
          <Mat color={accentColor} roughness={0.5} />
        </mesh>

        {/* Triángulo del pañuelo */}
        <mesh
          position={[0, 0.335, 0.115]}
          rotation={[0.25, 0, Math.PI]}
          scale={[1, 1, 0.3]}
          castShadow
        >
          <coneGeometry args={[0.07, 0.11, 3]} />
          <Mat color={accentColor} roughness={0.5} />
        </mesh>

        {/* Placa dorada */}
        <group ref={tagRef} position={[0, 0.3, 0.135]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.026, 0.026, 0.01, 24]} />
            <Mat color="#E8B923" roughness={0.25} metalness={0.9} />
          </mesh>
          <mesh position={[0, 0, 0.007]}>
            <sphereGeometry args={[0.009, 12, 12]} />
            <meshBasicMaterial color="#FFF1B8" />
          </mesh>
        </group>

        {/* ================= CABEZA ================= */}
        <group ref={headRef} position={[0, 0.54, 0.02]}>
          {/* Cráneo grande y redondo */}
          <mesh scale={[1.08, 1, 0.95]} castShadow receiveShadow>
            <sphereGeometry args={[0.19, 48, 40]} />
            <Mat color={CREAM} roughness={0.72} />
          </mesh>

          {/* Mancha caramelo sobre el ojo derecho */}
          <mesh
            position={[0.075, 0.065, 0.125]}
            scale={[1, 1.1, 0.5]}
            rotation={[0, 0.3, 0.2]}
          >
            <sphereGeometry args={[0.08, 28, 24]} />
            <Mat color={CARAMEL} roughness={0.8} />
          </mesh>

          {/* Mechón de pelo en la frente */}
          <mesh position={[0.005, 0.195, 0.02]} rotation={[0, 0, 0.3]} scale={[0.5, 1, 0.5]}>
            <coneGeometry args={[0.03, 0.07, 12]} />
            <Mat color={CARAMEL} roughness={0.85} />
          </mesh>
          <mesh position={[-0.025, 0.19, 0.02]} rotation={[0, 0, -0.35]} scale={[0.45, 0.8, 0.45]}>
            <coneGeometry args={[0.03, 0.06, 12]} />
            <Mat color={CARAMEL} roughness={0.85} />
          </mesh>

          {/* ---------- HOCICO ---------- */}
          {/* Hocico corto y redondo */}
          <mesh position={[0, -0.05, 0.14]} scale={[1.05, 0.82, 1.1]} castShadow>
            <sphereGeometry args={[0.088, 40, 32]} />
            <Mat color={CREAM_LIGHT} roughness={0.8} />
          </mesh>

          {/* Mejillas infladas */}
          <mesh position={[-0.075, -0.06, 0.12]} scale={[1, 0.85, 0.9]}>
            <sphereGeometry args={[0.058, 24, 24]} />
            <Mat color={CREAM_LIGHT} roughness={0.8} />
          </mesh>
          <mesh position={[0.075, -0.06, 0.12]} scale={[1, 0.85, 0.9]}>
            <sphereGeometry args={[0.058, 24, 24]} />
            <Mat color={CREAM_LIGHT} roughness={0.8} />
          </mesh>

          {/* Nariz grande y brillante */}
          <mesh ref={noseRef} position={[0, -0.012, 0.228]} castShadow>
            <sphereGeometry args={[0.03, 32, 24]} />
            <Mat color={DARK} roughness={0.15} metalness={0.05} />
          </mesh>
          <mesh position={[-0.009, -0.001, 0.253]} scale={[1, 0.7, 0.4]}>
            <sphereGeometry args={[0.011, 12, 12]} />
            <meshBasicMaterial color={WHITE} />
          </mesh>

          {/* Línea del filtro (nariz a boca) */}
          <mesh position={[0, -0.045, 0.232]} scale={[0.25, 1, 0.25]}>
            <capsuleGeometry args={[0.006, 0.02, 4, 8]} />
            <Mat color={DARK} roughness={0.6} />
          </mesh>

          {/* Sonrisa: dos arcos (forma de "w" suave) */}
          <mesh position={[-0.026, -0.058, 0.228]} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[0.026, 0.0045, 8, 24, Math.PI]} />
            <Mat color={DARK} roughness={0.6} />
          </mesh>
          <mesh position={[0.026, -0.058, 0.228]} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[0.026, 0.0045, 8, 24, Math.PI]} />
            <Mat color={DARK} roughness={0.6} />
          </mesh>

          {/* Interior de la boca */}
          <mesh position={[0, -0.095, 0.205]} scale={[1, 0.5, 0.6]}>
            <sphereGeometry args={[0.03, 20, 16]} />
            <Mat color="#4A1F2A" roughness={0.6} />
          </mesh>

          {/* Lengua (pivote arriba para que crezca hacia abajo) */}
          <group ref={tongueRef} position={[0, -0.09, 0.215]}>
            <mesh position={[0, -0.02, 0]} scale={[1, 1.5, 0.45]} castShadow>
              <sphereGeometry args={[0.022, 20, 20]} />
              <Mat color={PINK} roughness={0.5} />
            </mesh>
            <mesh position={[0, -0.02, 0.01]} scale={[0.12, 1, 0.1]}>
              <capsuleGeometry args={[0.006, 0.03, 4, 8]} />
              <Mat color="#D9607A" roughness={0.5} />
            </mesh>
          </group>

          {/* Rubor de mejillas */}
          <mesh position={[-0.115, -0.025, 0.12]} scale={[1, 0.6, 0.2]} rotation={[0, -0.5, 0]}>
            <sphereGeometry args={[0.028, 16, 16]} />
            <meshBasicMaterial color={BLUSH} transparent opacity={0.55} />
          </mesh>
          <mesh position={[0.115, -0.025, 0.12]} scale={[1, 0.6, 0.2]} rotation={[0, 0.5, 0]}>
            <sphereGeometry args={[0.028, 16, 16]} />
            <meshBasicMaterial color={BLUSH} transparent opacity={0.55} />
          </mesh>

          {/* ---------- OJOS ---------- */}
          <Eye position={[-0.075, 0.045, 0.148]} eyeRef={leftEyeRef} />
          <Eye position={[0.075, 0.045, 0.148]} eyeRef={rightEyeRef} />

          {/* ---------- CEJAS ---------- */}
          <mesh
            ref={leftBrowRef}
            position={[-0.075, 0.112, 0.148]}
            rotation={[0, 0, 0.2]}
            scale={[1, 0.22, 0.3]}
          >
            <sphereGeometry args={[0.028, 16, 16]} />
            <Mat color={BROWN} />
          </mesh>
          <mesh
            ref={rightBrowRef}
            position={[0.075, 0.112, 0.148]}
            rotation={[0, 0, -0.35]}
            scale={[1, 0.22, 0.3]}
          >
            <sphereGeometry args={[0.028, 16, 16]} />
            <Mat color={BROWN} />
          </mesh>

          {/* ---------- OREJAS LARGAS Y CAÍDAS ---------- */}
          <group ref={leftEarRef} position={[-0.17, 0.09, -0.01]} rotation={[0, 0, 0.22]}>
            <mesh position={[-0.015, -0.09, 0]} scale={[1, 1, 0.45]} castShadow>
              <capsuleGeometry args={[0.05, 0.12, 10, 20]} />
              <Mat color={BROWN} roughness={0.85} />
            </mesh>
            {/* Interior más claro */}
            <mesh position={[-0.005, -0.09, 0.012]} scale={[0.6, 0.8, 0.2]}>
              <capsuleGeometry args={[0.04, 0.1, 8, 16]} />
              <Mat color="#8B5330" roughness={0.9} />
            </mesh>
          </group>

          <group ref={rightEarRef} position={[0.17, 0.09, -0.01]} rotation={[0, 0, -0.22]}>
            <mesh position={[0.015, -0.09, 0]} scale={[1, 1, 0.45]} castShadow>
              <capsuleGeometry args={[0.05, 0.12, 10, 20]} />
              <Mat color={BROWN} roughness={0.85} />
            </mesh>
            <mesh position={[0.005, -0.09, 0.012]} scale={[0.6, 0.8, 0.2]}>
              <capsuleGeometry args={[0.04, 0.1, 8, 16]} />
              <Mat color="#8B5330" roughness={0.9} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}
