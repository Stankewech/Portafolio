'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface OmarProps {
  position: [number, number, number];
  rotationY: number;
  accentColor?: string;
  onPoke: () => void;
  scale?: number;
  wallMounted?: boolean;
  hitTrigger?: number;
}

/* ============================================================
   PIXEL ART: configuración
   ============================================================ */

type Px = string | null;
type Grid = Px[][];
type Shader = (x: number, y: number, u: number, v: number) => string;

const W = 32; // ancho del sprite en píxeles
const H = 44; // alto del sprite en píxeles

// Tamaño del sprite en el mundo 3D (el origen del grupo son los pies)
const PH = 1.25;
const PW = (PH * W) / H;
const PX = PH / H; // tamaño de 1 píxel en unidades 3D

// Paleta 16-bit (cambia estos colores a tu gusto)
const C = {
  outline: '#0B0A12',

  skin: '#D29A6C',
  skinHi: '#E3B087',
  skinLo: '#B07A52',

  hair: '#1F1826',
  hairHi: '#3D3050',
  hairLo: '#100B16',

  frame: '#8F8A92',
  frameLo: '#6F6A74',
  lensHi: '#F7EDE3',

  eye: '#14101A',
  mouth: '#8F3B3B',
  tongue: '#F58BA0',

  // Capucha / playera oscura
  navy: '#1A1D2F',
  navyHi: '#2E3350',
  navyLo: '#0F111C',

  // Chamarra blanca
  jacket: '#F5F0E8',
  jacketHi: '#FFFFFF',
  jacketLo: '#B7B2AD',

  // Jeans
  jeans: '#3F5E8F',
  jeansHi: '#5A7DB3',
  jeansLo: '#2B4268',

  // Tenis
  shoe: '#1A1722',
  shoeHi: '#3A3548',
  shoeSole: '#2B2838',
};

/* ============================================================
   PIXEL ART: helpers de dibujo
   ============================================================ */

const makeGrid = (): Grid =>
  Array.from({ length: H }, () => Array<Px>(W).fill(null));

const put = (g: Grid, x: number, y: number, c: Px) => {
  const ix = Math.round(x);
  const iy = Math.round(y);
  if (ix >= 0 && ix < W && iy >= 0 && iy < H) g[iy][ix] = c;
};

// Sombreado suave para elipses (luz desde arriba-izquierda, con dithering)
const soft =
  (base: string, hi: string, lo: string) =>
  (x: number, y: number, nx: number, ny: number) => {
    const d = nx * 0.55 + ny * 0.85;
    if (d > 0.5) return lo;
    if (d > 0.32) return (x + y) % 2 === 0 ? lo : base;
    if (d < -0.55) return hi;
    return base;
  };

// Sombreado tipo tela para bloques (u, v van de 0 a 1)
const fabric =
  (base: string, hi: string, lo: string): Shader =>
  (x, y, u, v) => {
    const d = u * 0.8 + v * 0.45 - 0.6;
    if (d > 0.28) return lo;
    if (d > 0.14) return (x + y) % 2 === 0 ? lo : base;
    if (d < -0.42) return hi;
    if (d < -0.3 && (x + y) % 2 === 0) return hi;
    return base;
  };

function ellipse(
  g: Grid,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  shader: (x: number, y: number, nx: number, ny: number) => string
) {
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
    for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
      const nx = (x - cx) / rx;
      const ny = (y - cy) / ry;
      if (nx * nx + ny * ny <= 1) put(g, x, y, shader(x, y, nx, ny));
    }
  }
}

function rows(
  g: Grid,
  y0: number,
  y1: number,
  left: (y: number) => number,
  right: (y: number) => number,
  shader: Shader
) {
  for (let y = y0; y <= y1; y++) {
    const l = Math.round(left(y));
    const r = Math.round(right(y));
    for (let x = l; x <= r; x++) {
      put(g, x, y, shader(x, y, (x - l) / (r - l || 1), (y - y0) / (y1 - y0 || 1)));
    }
  }
}

// Contorno oscuro alrededor de la silueta (clásico de 16 bits)
function addOutline(g: Grid): Grid {
  const o = g.map((r) => [...r]);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (g[y][x] !== null) continue;
      const near =
        (y > 0 && g[y - 1][x] !== null) ||
        (y < H - 1 && g[y + 1][x] !== null) ||
        (x > 0 && g[y][x - 1] !== null) ||
        (x < W - 1 && g[y][x + 1] !== null);
      if (near) o[y][x] = C.outline;
    }
  }
  return o;
}

/* ============================================================
   PIXEL ART: dibujo del personaje (proporciones chibi)
   El sprite es simétrico respecto a x = 15.5, por eso los
   espejos usan 31 - x.
   ============================================================ */

export type Eyes = 'open' | 'blink' | 'wide';
export type Mouth = 'smirk' | 'open';

const mirror = (x: number) => 31 - x;

export function buildGrid(accent: string, eyes: Eyes, mouth: Mouth): Grid {
  const g = makeGrid();

  /* ---------- JEANS ---------- */
  rows(g, 31, 39, () => 10, () => 21, fabric(C.jeans, C.jeansHi, C.jeansLo));
  // Separación de piernas
  for (let y = 35; y <= 39; y++) {
    g[y][15] = null;
    g[y][16] = null;
  }
  // Dobladillo
  for (let x = 10; x <= 21; x++) {
    if (x !== 15 && x !== 16) put(g, x, 39, C.jeansLo);
  }
  // Arrugas de los jeans
  [
    [12, 37],
    [12, 38],
    [19, 36],
    [19, 37],
  ].forEach(([x, y]) => put(g, x, y, C.jeansLo));
  [
    [11, 33],
    [11, 34],
    [18, 33],
  ].forEach(([x, y]) => put(g, x, y, C.jeansHi));

  /* ---------- TENIS ---------- */
  const shoe = (x0: number, x1: number, side: 'l' | 'r') => {
    for (let x = x0; x <= x1; x++) {
      put(g, x, 40, C.shoeHi);
      put(g, x, 41, C.shoe);
      put(g, x, 42, C.shoeSole);
    }
    // Detalle del color de acento
    put(g, side === 'l' ? x0 + 1 : x1 - 1, 41, accent);
    put(g, side === 'l' ? x0 + 2 : x1 - 2, 41, accent);
  };
  shoe(8, 14, 'l');
  shoe(17, 23, 'r');

  /* ---------- TORSO (chamarra blanca + panel oscuro) ---------- */
  rows(g, 20, 30, () => 8, () => 23, fabric(C.jacket, C.jacketHi, C.jacketLo));
  // Dobladillo de la chamarra
  for (let x = 8; x <= 23; x++) {
    if (x % 2 === 0) put(g, x, 30, C.jacketLo);
  }
  // Panel oscuro del centro
  rows(g, 20, 30, () => 11, () => 20, fabric(C.navy, C.navyHi, C.navyLo));
  [
    [15, 24],
    [16, 26],
    [15, 28],
    [13, 22],
  ].forEach(([x, y]) => put(g, x, y, C.navyHi));

  /* ---------- MANGAS ---------- */
  const sleeveLeft = (y: number) => 5 - (y - 20) * 0.25;
  const jacketShader = fabric(C.jacket, C.jacketHi, C.jacketLo);
  // Manga izquierda
  rows(g, 20, 28, sleeveLeft, (y) => sleeveLeft(y) + 4, jacketShader);
  // Manga derecha (espejo, luz invertida para que sea simétrica)
  rows(
    g,
    20,
    28,
    (y) => mirror(Math.round(sleeveLeft(y) + 4)),
    (y) => mirror(Math.round(sleeveLeft(y))),
    (x, y, u, v) => jacketShader(x, y, 1 - u, v)
  );
  // Puños y arrugas de las mangas
  for (let x = 3; x <= 7; x++) {
    put(g, x, 28, C.jacketLo);
    put(g, mirror(x), 28, C.jacketLo);
  }
  [
    [4, 23],
    [5, 24],
    [4, 25],
    [6, 26],
    [5, 27],
  ].forEach(([x, y]) => {
    put(g, x, y, C.jacketLo);
    put(g, mirror(x), y, C.jacketLo);
  });

  /* ---------- MANOS (puños) ---------- */
  for (let y = 29; y <= 31; y++) {
    for (let x = 3; x <= 6; x++) {
      if (y === 31 && (x === 3 || x === 6)) continue;
      const c = y === 31 ? C.skinLo : x === 3 ? C.skinHi : C.skin;
      put(g, x, y, c);
      put(g, mirror(x), y, c);
    }
  }

  /* ---------- CAPUCHA ---------- */
  const hoodLeft = (y: number) => Math.round(10 - (y - 17) * 0.9);
  rows(
    g,
    17,
    21,
    hoodLeft,
    (y) => mirror(hoodLeft(y)),
    fabric(C.navy, C.navyHi, C.navyLo)
  );
  // Borde iluminado de la capucha
  for (let y = 17; y <= 21; y++) {
    put(g, hoodLeft(y), y, C.navyHi);
    put(g, mirror(hoodLeft(y)), y, C.navyHi);
  }

  /* ---------- OREJAS ---------- */
  for (let y = 12; y <= 14; y++) {
    put(g, 7, y, C.skin);
    put(g, 6, y, C.skin);
    put(g, 24, y, C.skin);
    put(g, 25, y, C.skin);
  }
  put(g, 6, 13, C.skinLo);
  put(g, 25, 13, C.skinLo);

  /* ---------- CARA ---------- */
  const faceLeft = (y: number) =>
    y <= 13 ? 8 : y === 14 ? 9 : y === 15 ? 10 : y === 16 ? 11 : 12;
  rows(
    g,
    8,
    17,
    faceLeft,
    (y) => mirror(faceLeft(y)),
    fabric(C.skin, C.skinHi, C.skinLo)
  );
  // Nariz
  put(g, 16, 15, C.skinLo);

  /* ---------- CABELLO ---------- */
  const hairShader = soft(C.hair, C.hairHi, C.hairLo);
  // Borde inferior del fleco por columna (forma de cortina)
  const fringe: Record<number, number> = {
    9: 9,
    10: 9,
    11: 8,
    12: 8,
    13: 7,
    14: 7,
    15: 7,
    16: 7,
    17: 7,
    18: 8,
    19: 9,
    20: 10,
    21: 10,
    22: 9,
  };

  // Casquete (recortado por el fleco para dejar ver la frente)
  for (let y = 1; y <= 11; y++) {
    for (let x = 7; x <= 24; x++) {
      const nx = (x - 15.5) / 8.5;
      const ny = (y - 6) / 5.5;
      if (nx * nx + ny * ny > 1) continue;
      const inFace = x >= 9 && x <= 22;
      if (inFace && y > fringe[x]) continue;
      put(g, x, y, hairShader(x, y, nx, ny));
    }
  }
  // Dos lóbulos de volumen arriba
  ellipse(g, 13.5, 3.5, 6.5, 3, hairShader);
  ellipse(g, 18, 3.2, 5.5, 2.8, hairShader);
  // Patillas y cabello sobre las orejas
  for (let y = 7; y <= 11; y++) {
    put(g, 7, y, C.hair);
    put(g, 8, y, C.hair);
    put(g, 23, y, C.hair);
    put(g, 24, y, C.hair);
  }
  // Raya del pelo
  [
    [15, 1],
    [15, 2],
    [15, 3],
    [16, 3],
    [16, 4],
    [16, 5],
  ].forEach(([x, y]) => put(g, x, y, C.hairLo));
  // Brillos
  [
    [10, 4],
    [11, 3],
    [12, 2],
    [13, 2],
    [18, 2],
    [19, 3],
    [20, 4],
    [21, 5],
  ].forEach(([x, y]) => put(g, x, y, C.hairHi));
  // Mechones oscuros
  [
    [11, 8],
    [13, 6],
    [19, 9],
    [21, 7],
    [8, 9],
    [23, 9],
  ].forEach(([x, y]) => put(g, x, y, C.hairLo));

  /* ---------- CEJAS (una más levantada) ---------- */
  const lift = eyes === 'wide' ? 1 : 0;
  [10, 11, 12, 13].forEach((x) => put(g, x, 10 - lift, C.hairLo));
  [18, 19, 20, 21].forEach((x) => put(g, x, 9 - lift, C.hairLo));

  /* ---------- LENTES ---------- */
  const ring = (cx: number, cy: number) => {
    for (let y = 10; y <= 16; y++) {
      for (let x = 8; x <= 23; x++) {
        const nx = (x - cx) / 3.2;
        const ny = (y - cy) / 2.7;
        const r2 = nx * nx + ny * ny;
        if (r2 <= 1 && r2 > 0.45) {
          put(g, x, y, ny > 0.3 ? C.frameLo : C.frame);
        }
      }
    }
  };
  ring(11.8, 13);
  ring(19.2, 13);
  // Patas que van a las orejas
  put(g, 8, 12, C.frame);
  put(g, 23, 12, C.frame);
  // Reflejos
  put(g, 10, 13, C.lensHi);
  put(g, 18, 13, C.lensHi);

  /* ---------- OJOS ---------- */
  if (eyes === 'open') {
    [11, 12, 19, 20].forEach((x) => {
      put(g, x, 13, C.eye);
      put(g, x, 14, C.eye);
    });
  } else if (eyes === 'blink') {
    [11, 12, 19, 20].forEach((x) => put(g, x, 14, C.eye));
  } else {
    // Sorprendido: ojos más altos
    [11, 12, 19, 20].forEach((x) => {
      put(g, x, 12, C.eye);
      put(g, x, 13, C.eye);
      put(g, x, 14, C.eye);
    });
  }

  /* ---------- BOCA ---------- */
  if (mouth === 'smirk') {
    [14, 15, 16].forEach((x) => put(g, x, 16, C.mouth));
    put(g, 17, 15, C.mouth);
  } else {
    put(g, 15, 16, C.eye);
    put(g, 16, 16, C.eye);
    put(g, 15, 17, C.tongue);
    put(g, 16, 17, C.tongue);
  }

  return addOutline(g);
}

/* ============================================================
   TEXTURAS (canvas -> THREE.Texture con filtro nearest)
   ============================================================ */

function gridToTexture(g: Grid, w: number, h: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const c = g[y][x];
      if (c) {
        ctx.fillStyle = c;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function buildOmarDataUrl(
  accent = '#C4FF36',
  eyes: Eyes = 'open',
  mouth: Mouth = 'smirk',
  pixelScale = 6
): string {
  if (typeof document === 'undefined') return '';
  const g = buildGrid(accent, eyes, mouth);
  const canvas = document.createElement('canvas');
  canvas.width = W * pixelScale;
  canvas.height = H * pixelScale;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const c = g[y][x];
      if (c) {
        ctx.fillStyle = c;
        ctx.fillRect(x * pixelScale, y * pixelScale, pixelScale, pixelScale);
      }
    }
  }
  return canvas.toDataURL('image/png');
}

function buildSparkle(accent: string): THREE.CanvasTexture {
  const pattern = [
    '...a...',
    '...a...',
    '..aoa..',
    'aaoooaa',
    '..aoa..',
    '...a...',
    '...a...',
  ];
  const g: Grid = pattern.map((row) =>
    row.split('').map((ch) => (ch === 'a' ? accent : ch === 'o' ? '#FFFFFF' : null))
  );
  return gridToTexture(g, 7, 7);
}

/* ============================================================
   COMPONENTE
   ============================================================ */

const LAYERS = 4; // 1 frontal + 3 capas traseras = efecto "recorte grueso"

export default function Omar({
  position,
  rotationY,
  accentColor = '#C4FF36',
  onPoke,
  scale = 1,
  wallMounted = false,
  hitTrigger = 0,
}: OmarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const spriteRef = useRef<THREE.Group>(null);
  const mats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const sparkleRefs = useRef<(THREE.Mesh | null)[]>([]);

  const pokeRef = useRef(0);
  const lastHitTrigger = useRef(hitTrigger);
  const blinkRef = useRef({ next: 2.5, until: -1 });

  useEffect(() => {
    if (hitTrigger !== lastHitTrigger.current) {
      lastHitTrigger.current = hitTrigger;
      pokeRef.current = 1;
    }
  }, [hitTrigger]);

  const textures = useMemo(() => {
    if (typeof document === 'undefined') return null;
    return {
      idle: gridToTexture(buildGrid(accentColor, 'open', 'smirk'), W, H),
      blink: gridToTexture(buildGrid(accentColor, 'blink', 'smirk'), W, H),
      poke: gridToTexture(buildGrid(accentColor, 'wide', 'open'), W, H),
      sparkle: buildSparkle(accentColor),
    };
  }, [accentColor]);

  useEffect(() => {
    return () => {
      if (!textures) return;
      Object.values(textures).forEach((t) => t.dispose());
    };
  }, [textures]);

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    pokeRef.current = 1;
    onPoke();
  };

  useFrame(({ clock, camera }, delta) => {
    const group = groupRef.current;
    const sprite = spriteRef.current;
    if (!group || !sprite || !textures) return;

    const t = clock.getElapsedTime();

    if (pokeRef.current > 0) {
      pokeRef.current = Math.max(0, pokeRef.current - delta * 1.5);
    }
    const poke = pokeRef.current;
    const pokeWave = Math.sin(poke * Math.PI);

    /* ----- Posición ----- */
    group.position.x = THREE.MathUtils.lerp(group.position.x, position[0], 0.08);
    group.position.z = THREE.MathUtils.lerp(group.position.z, position[2], 0.08);
    group.position.y = position[1];

    /* ----- Orientación ----- */
    if (wallMounted) {
      // Montado en el cuadro de la pared: balanceo de piñata al golpear
      const swingZ = Math.sin(poke * Math.PI * 3) * poke * 0.22;
      group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, rotationY, 0.12);
      group.rotation.z = swingZ;
    } else {
      const dx = camera.position.x - group.position.x;
      const dz = camera.position.z - group.position.z;
      const angleToCam = Math.atan2(dx, dz);
      const targetRotY = THREE.MathUtils.lerp(rotationY, angleToCam, 0.82);
      group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, targetRotY, 0.1);
    }

    /* ----- Bob "por pasos" (movimiento pixelado) ----- */
    const bob = Math.round(Math.sin(t * 3) * 0.8) * PX;
    const jump = Math.round((pokeWave * 0.34) / PX) * PX;
    sprite.position.y = PX + bob + jump;

    /* ----- Giro de moneda al hacer poke ----- */
    let spin = 0;
    if (poke > 0) {
      const r = 1 - poke;
      spin = (1 - Math.pow(1 - r, 3)) * Math.PI * 2;
    }
    sprite.rotation.y = spin;

    /* ----- Squash & stretch + balanceo ----- */
    const sy = 1 + pokeWave * 0.14 - (poke > 0.92 ? 0.12 : 0);
    sprite.scale.set(1 / Math.sqrt(sy), sy, 1);
    sprite.rotation.z = Math.round(Math.sin(t * 1.6) * 2) * 0.012;

    /* ----- Elegir frame de animación ----- */
    const blink = blinkRef.current;
    if (t > blink.next) {
      blink.until = t + 0.14;
      blink.next = t + 2 + Math.random() * 3;
    }
    const tex = poke > 0 ? textures.poke : t < blink.until ? textures.blink : textures.idle;
    mats.current.forEach((m) => {
      if (m && m.map !== tex) m.map = tex;
    });

    /* ----- Destellos ----- */
    sparkleRefs.current.forEach((s, i) => {
      if (!s) return;
      s.visible = poke > 0.02;
      if (poke > 0) {
        s.position.y = PH * 0.95 + (1 - poke) * PH * 0.15;
        s.scale.setScalar(Math.max(0.001, pokeWave) * (i === 0 ? 1.15 : 0.85));
      }
    });
  });

  if (!textures) return null;

  return (
    <group
      ref={groupRef}
      position={position}
      scale={scale}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (typeof document !== 'undefined') document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        if (typeof document !== 'undefined') document.body.style.cursor = 'auto';
      }}
    >
      {/* ================= SPRITE PIXEL ART ================= */}
      <group ref={spriteRef} position={[0, PX, 0]}>
        {Array.from({ length: LAYERS }).map((_, i) => (
          <mesh key={i} position={[0, PH / 2, -i * 0.008]}>
            <planeGeometry args={[PW, PH]} />
            <meshBasicMaterial
              ref={(m) => {
                mats.current[i] = m;
              }}
              map={textures.idle}
              color={i === 0 ? '#FFFFFF' : '#8D8AA0'}
              alphaTest={0.5}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {/* ================= DESTELLOS (poke) ================= */}
      {[-PW * 0.46, PW * 0.47].map((x, i) => (
        <mesh
          key={i}
          ref={(m) => {
            sparkleRefs.current[i] = m;
          }}
          position={[x, PH * 0.95, 0.03]}
          visible={false}
        >
          <planeGeometry args={[PX * 7, PX * 7]} />
          <meshBasicMaterial
            map={textures.sparkle}
            alphaTest={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}
