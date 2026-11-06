'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import CameraController from './CameraController';
import Poro from './Poro';
import OmarWallPinata from './OmarWallPinata';
import { CameraTimelineState } from '@/animations/cameraTimeline';
import { SCENES } from '@/data/scenes';
import { PinataSkill } from '@/data/aboutData';

interface SceneProps {
  camState: React.MutableRefObject<CameraTimelineState>;
  activeSceneIndex: number;
  unlockedSkillsCount: number;
  pinataHitTrigger: number;
  activeSkillId: string | null;
  onPokePoro: () => void;
  onHitPinata: () => void;
  onSelectSkill: (skill: PinataSkill) => void;
  onSelectStation: (sceneIndex: number) => void;
}

function StudioEnvironment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    return () => {
      envTex.dispose();
      pmremGenerator.dispose();
    };
  }, [gl, scene]);
  return null;
}

function MakerRoomMesh({
  activeSceneIndex,
  unlockedSkillsCount,
  pinataHitTrigger,
  activeSkillId,
  onPokePoro,
  onHitPinata,
  onSelectSkill,
  onSelectStation,
}: {
  activeSceneIndex: number;
  unlockedSkillsCount: number;
  pinataHitTrigger: number;
  activeSkillId: string | null;
  onPokePoro: () => void;
  onHitPinata: () => void;
  onSelectSkill: (skill: PinataSkill) => void;
  onSelectStation: (sceneIndex: number) => void;
}) {
  const activeScene = SCENES[activeSceneIndex] || SCENES[0];
  const nfcRingRef = useRef<THREE.Mesh>(null);
  const xboxLightRef = useRef<THREE.PointLight>(null);

  // Low-profile breadboard jumper wires
  const jumperWires = useMemo(() => {
    const definitions = [
      {
        pts: [
          new THREE.Vector3(-0.28, 0.06, -0.08),
          new THREE.Vector3(-0.12, 0.11, -0.08),
          new THREE.Vector3(0.08, 0.06, -0.08),
        ],
        color: '#EF4444',
      },
      {
        pts: [
          new THREE.Vector3(-0.28, 0.06, 0.04),
          new THREE.Vector3(-0.08, 0.11, 0.04),
          new THREE.Vector3(0.14, 0.06, 0.04),
        ],
        color: '#3B82F6',
      },
      {
        pts: [
          new THREE.Vector3(-0.22, 0.06, 0.14),
          new THREE.Vector3(0.05, 0.1, 0.14),
          new THREE.Vector3(0.28, 0.06, 0.14),
        ],
        color: '#C4FF36',
      },
      {
        pts: [
          new THREE.Vector3(-0.34, 0.06, -0.15),
          new THREE.Vector3(-0.56, 0.11, -0.12),
          new THREE.Vector3(-0.74, 0.08, -0.08),
        ],
        color: '#FFDA35',
      },
    ];
    return definitions.map((d) => {
      const curve = new THREE.CatmullRomCurve3(d.pts);
      const geo = new THREE.TubeGeometry(curve, 20, 0.007, 8, false);
      return { geo, color: d.color };
    });
  }, []);

  // Static Architectural Canvas Texture for the Left Wall Cyber-Pegboard & Telemetry Panel
  const wallBoardTex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext('2d')!;

    ctx.fillStyle = '#141926';
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = '#C4FF36';
    ctx.lineWidth = 6;
    ctx.strokeRect(10, 10, 492, 492);

    ctx.fillStyle = '#2A334B';
    for (let x = 36; x < 480; x += 24) {
      for (let y = 80; y < 480; y += 24) {
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.fillStyle = '#C4FF36';
    ctx.fillRect(10, 10, 492, 52);
    ctx.fillStyle = '#0B0C10';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('UPIITA - IPN // TELEMATICS LAB', 28, 44);

    ctx.fillStyle = '#0D111A';
    ctx.fillRect(32, 88, 210, 210);
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 3;
    ctx.strokeRect(32, 88, 210, 210);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.beginPath();
    ctx.arc(137, 193, 72, 0, Math.PI * 2);
    ctx.moveTo(32, 193);
    ctx.lineTo(242, 193);
    ctx.moveTo(137, 88);
    ctx.lineTo(137, 298);
    ctx.stroke();
    ctx.fillStyle = '#C4FF36';
    const qamPts = [-42, 42];
    qamPts.forEach((qx) =>
      qamPts.forEach((qy) => {
        ctx.beginPath();
        ctx.arc(137 + qx, 193 + qy, 6, 0, Math.PI * 2);
        ctx.fill();
      })
    );
    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('5G QAM CONSTELLATION', 46, 110);

    ctx.fillStyle = '#0D111A';
    ctx.fillRect(268, 88, 212, 210);
    ctx.strokeStyle = '#FF5B42';
    ctx.lineWidth = 3;
    ctx.strokeRect(268, 88, 212, 210);
    ctx.fillStyle = '#FF5B42';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('STM32F446RE PINOUT', 284, 114);
    ctx.fillStyle = '#E2E8F0';
    ctx.font = '13px monospace';
    ctx.fillText('PA0 -> ADC1_IN0 (DSP)', 284, 148);
    ctx.fillText('PA4 -> DAC_OUT1', 284, 178);
    ctx.fillText('PA5 -> SPI1_SCK (E-INK)', 284, 208);
    ctx.fillText('PB6 -> I2C1_SCL (NFC)', 284, 238);
    ctx.fillStyle = '#C4FF36';
    ctx.fillText('AES-128: HARDWARE OK', 284, 272);

    ctx.fillStyle = '#0D111A';
    ctx.fillRect(32, 322, 448, 152);
    ctx.strokeStyle = '#725BFF';
    ctx.strokeRect(32, 322, 448, 152);
    ctx.fillStyle = '#FFDA35';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('THINK. BUILD. EXPERIMENT.', 48, 360);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '14px monospace';
    ctx.fillText('• QA Automation: Selenium + Postman', 48, 396);
    ctx.fillText('• AI Vision: Siamese CNN MobileNet', 48, 424);
    ctx.fillText('• 5G Forecast: Samsung SIC (150h)', 48, 452);

    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 4;
    return tex;
  }, []);

  // Dynamic Canvas Textures for the 6 Active Displays
  const {
    mainTex,
    mainCtx,
    sideTex,
    sideCtx,
    laptopTex,
    laptopCtx,
    epaperTex,
    epaperCtx,
    scopeTex,
    scopeCtx,
    holoTex,
    holoCtx,
  } = useMemo(() => {
    const createCanvas = (w: number, h: number) => {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d')!;
      const tex = new THREE.CanvasTexture(c);
      tex.anisotropy = 4;
      return { tex, ctx };
    };

    const main = createCanvas(1024, 576);
    const side = createCanvas(512, 768);
    const laptop = createCanvas(512, 320);
    const epaper = createCanvas(512, 320);
    const scope = createCanvas(256, 160);
    const holo = createCanvas(512, 320);

    return {
      mainTex: main.tex,
      mainCtx: main.ctx,
      sideTex: side.tex,
      sideCtx: side.ctx,
      laptopTex: laptop.tex,
      laptopCtx: laptop.ctx,
      epaperTex: epaper.tex,
      epaperCtx: epaper.ctx,
      scopeTex: scope.tex,
      scopeCtx: scope.ctx,
      holoTex: holo.tex,
      holoCtx: holo.ctx,
    };
  }, []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // 1. Main Ultrawide Monitor (1024x576)
    if (mainCtx) {
      mainCtx.fillStyle = '#0F1420';
      mainCtx.fillRect(0, 0, 1024, 576);

      mainCtx.strokeStyle = 'rgba(196, 255, 54, 0.06)';
      mainCtx.lineWidth = 1;
      for (let gx = 0; gx < 1024; gx += 32) {
        mainCtx.beginPath();
        mainCtx.moveTo(gx, 0);
        mainCtx.lineTo(gx, 576);
        mainCtx.stroke();
      }
      for (let gy = 0; gy < 576; gy += 32) {
        mainCtx.beginPath();
        mainCtx.moveTo(0, gy);
        mainCtx.lineTo(1024, gy);
        mainCtx.stroke();
      }

      mainCtx.fillStyle = '#C4FF36';
      mainCtx.fillRect(0, 0, 1024, 38);
      mainCtx.fillStyle = '#0B0C10';
      mainCtx.font = 'bold 18px monospace';
      mainCtx.fillText('OMAR_LAB_OS v2.5 // UPIITA-IPN TELEMATICS & AI WORKSTATION', 18, 25);
      mainCtx.font = 'bold 15px monospace';
      mainCtx.fillText('FASTAPI: 200 OK | PGSQL', 745, 25);

      if (activeSceneIndex === 5) {
        mainCtx.strokeStyle = '#FF5B42';
        mainCtx.lineWidth = 5;
        mainCtx.strokeRect(36, 66, 952, 474);
        mainCtx.fillStyle = 'rgba(255, 91, 66, 0.1)';
        mainCtx.fillRect(36, 66, 952, 474);

        mainCtx.fillStyle = '#C4FF36';
        mainCtx.font = 'bold 54px sans-serif';
        mainCtx.fillText('THINK. BUILD. EXPERIMENT.', 86, 210);

        mainCtx.fillStyle = '#FFFFFF';
        mainCtx.font = 'bold 38px monospace';
        mainCtx.fillText("Let's build something together.", 86, 285);

        mainCtx.fillStyle = '#FFDA35';
        mainCtx.font = 'bold 24px monospace';
        mainCtx.fillText('OMAR STANKEWECH MARTA OLVERA // ING. TELEMÁTICA', 86, 368);

        mainCtx.fillStyle = '#725BFF';
        mainCtx.fillRect(86, 410, 420, 56);
        mainCtx.fillStyle = '#FFFFFF';
        mainCtx.font = 'bold 22px monospace';
        mainCtx.fillText('GITHUB: /Stankewech | UPIITA-IPN', 106, 446);
      } else {
        // Left Window: TRAZITOS Siamese CNN
        mainCtx.fillStyle = '#161C2E';
        mainCtx.fillRect(24, 58, 476, 492);
        mainCtx.strokeStyle = '#C4FF36';
        mainCtx.lineWidth = 3;
        mainCtx.strokeRect(24, 58, 476, 492);

        mainCtx.fillStyle = '#C4FF36';
        mainCtx.fillRect(24, 58, 476, 32);
        mainCtx.fillStyle = '#0B0C10';
        mainCtx.font = 'bold 16px monospace';
        mainCtx.fillText('TRAZITOS // SIAMESE CNN (MOBILENET)', 38, 80);

        const layers = [4, 5, 5, 3];
        const layerX = [85, 200, 315, 430];
        const nodes: { x: number; y: number }[][] = [];
        for (let l = 0; l < layers.length; l++) {
          nodes[l] = [];
          const count = layers[l];
          const span = (count - 1) * 58;
          const startY = 255 - span / 2;
          for (let n = 0; n < count; n++) {
            nodes[l].push({ x: layerX[l], y: startY + n * 58 });
          }
        }
        for (let l = 0; l < layers.length - 1; l++) {
          for (const a of nodes[l]) {
            for (const b of nodes[l + 1]) {
              const pulse = 0.5 + 0.5 * Math.sin(time * 3.5 + a.y * 0.05 + b.x * 0.04);
              mainCtx.strokeStyle = pulse > 0.68 ? '#C4FF36' : 'rgba(114, 91, 255, 0.5)';
              mainCtx.lineWidth = pulse > 0.68 ? 2.8 : 1.3;
              mainCtx.beginPath();
              mainCtx.moveTo(a.x, a.y);
              mainCtx.lineTo(b.x, b.y);
              mainCtx.stroke();
            }
          }
        }
        for (let l = 0; l < layers.length; l++) {
          for (const pt of nodes[l]) {
            mainCtx.fillStyle = l === layers.length - 1 ? '#C4FF36' : '#FF5B42';
            mainCtx.beginPath();
            mainCtx.arc(pt.x, pt.y, 11, 0, Math.PI * 2);
            mainCtx.fill();
            mainCtx.strokeStyle = '#FFFFFF';
            mainCtx.lineWidth = 2;
            mainCtx.stroke();
          }
        }

        mainCtx.fillStyle = '#0F1320';
        mainCtx.fillRect(42, 430, 440, 100);
        mainCtx.strokeStyle = '#725BFF';
        mainCtx.lineWidth = 2;
        mainCtx.strokeRect(42, 430, 440, 100);
        const sim = (97.8 + Math.sin(time * 1.4) * 1.1).toFixed(1);
        mainCtx.fillStyle = '#C4FF36';
        mainCtx.font = 'bold 20px monospace';
        mainCtx.fillText(`COSINE SIMILARITY: ${sim}% [MATCH]`, 58, 466);
        mainCtx.fillStyle = '#FFFFFF';
        mainCtx.font = '15px monospace';
        mainCtx.fillText('LATENCY: 38ms | POSTGRESQL: SYNCED', 58, 504);

        // Right Window: 5G PRB Traffic Prediction
        mainCtx.fillStyle = '#161C2E';
        mainCtx.fillRect(524, 58, 476, 492);
        mainCtx.strokeStyle = '#725BFF';
        mainCtx.lineWidth = 3;
        mainCtx.strokeRect(524, 58, 476, 492);

        mainCtx.fillStyle = '#725BFF';
        mainCtx.fillRect(524, 58, 476, 32);
        mainCtx.fillStyle = '#FFFFFF';
        mainCtx.font = 'bold 16px monospace';
        mainCtx.fillText('5G PRB TRAFFIC LOAD // XGBOOST + LSTM', 538, 80);

        mainCtx.strokeStyle = 'rgba(255,255,255,0.12)';
        mainCtx.lineWidth = 1;
        for (let row = 0; row < 5; row++) {
          const ry = 135 + row * 62;
          mainCtx.beginPath();
          mainCtx.moveTo(548, ry);
          mainCtx.lineTo(976, ry);
          mainCtx.stroke();
        }

        mainCtx.strokeStyle = '#FFDA35';
        mainCtx.lineWidth = 3.5;
        mainCtx.beginPath();
        for (let i = 0; i <= 28; i++) {
          const px = 548 + i * 15.2;
          const py = 255 + Math.sin(time * 2.1 + i * 0.38) * 68 + Math.cos(i * 0.7) * 24;
          if (i === 0) mainCtx.moveTo(px, py);
          else mainCtx.lineTo(px, py);
        }
        mainCtx.stroke();

        mainCtx.strokeStyle = '#C4FF36';
        mainCtx.lineWidth = 4;
        mainCtx.beginPath();
        for (let i = 0; i <= 28; i++) {
          const px = 548 + i * 15.2;
          const py = 255 + Math.sin(time * 2.1 + i * 0.38 - 0.15) * 64 + Math.cos(i * 0.7) * 21;
          if (i === 0) mainCtx.moveTo(px, py);
          else mainCtx.lineTo(px, py);
        }
        mainCtx.stroke();

        mainCtx.fillStyle = '#0F1320';
        mainCtx.fillRect(544, 430, 436, 100);
        mainCtx.strokeStyle = '#FFDA35';
        mainCtx.lineWidth = 2;
        mainCtx.strokeRect(544, 430, 436, 100);
        mainCtx.fillStyle = '#FFDA35';
        mainCtx.font = 'bold 18px monospace';
        mainCtx.fillText('SAMSUNG INNOVATION CAMPUS // AI & 5G', 560, 464);
        mainCtx.fillStyle = '#C4FF36';
        mainCtx.font = '15px monospace';
        mainCtx.fillText('MODEL: LSTM + XGBOOST | ANOMALY FILTER: ON', 560, 502);
      }

      mainTex.needsUpdate = true;
    }

    // 2. Vertical Coding & QA Monitor (512x768)
    if (sideCtx) {
      sideCtx.fillStyle = '#0F131F';
      sideCtx.fillRect(0, 0, 512, 768);
      sideCtx.fillStyle = '#725BFF';
      sideCtx.fillRect(0, 0, 512, 38);
      sideCtx.fillStyle = '#FFFFFF';
      sideCtx.font = 'bold 17px monospace';
      sideCtx.fillText('QA_RUNNER // SELENIUM + PYTEST E2E', 16, 25);

      sideCtx.fillStyle = '#161C2E';
      sideCtx.fillRect(16, 54, 480, 290);
      sideCtx.strokeStyle = '#3B4666';
      sideCtx.lineWidth = 2;
      sideCtx.strokeRect(16, 54, 480, 290);

      const codeLines = [
        'def test_trazitos_stroke_pipeline(driver):',
        '    payload = encrypt_aes128(ntag_uid)',
        '    res = api.post("/v1/strokes", payload)',
        '    assert res.status_code == 200',
        '    assert res.json()["_valid"] is True',
        '    score = cnn_model.evaluate_stroke()',
        '    assert score >= 0.95  # QA Gate Pass',
      ];
      sideCtx.font = '15px monospace';
      codeLines.forEach((ln, idx) => {
        sideCtx.fillStyle = idx === 0 ? '#FF5B42' : idx % 2 === 0 ? '#C4FF36' : '#E2E8F0';
        sideCtx.fillText(ln, 28, 92 + idx * 36);
      });

      sideCtx.fillStyle = '#111624';
      sideCtx.fillRect(16, 364, 480, 384);
      sideCtx.strokeStyle = '#C4FF36';
      sideCtx.strokeRect(16, 364, 480, 384);

      const logLines = [
        '[PASS] POST /api/v1/strokes (34ms)',
        '[PASS] SiameseCNN MobileNet < 45ms',
        '[PASS] PostgreSQL FK integrity',
        '[PASS] NTAG213 AES-128 cipher block',
        '[PASS] 5G PRB outlier rejection',
        '[PASS] Selenium E2E auth flow',
        '[PASS] LoL Anti-Tilt cooldown trigger',
        '[INFO] STM32F446RE DMA + DAC ready',
      ];
      sideCtx.font = 'bold 16px monospace';
      const offset = Math.floor(time * 1.6) % logLines.length;
      for (let i = 0; i < 9; i++) {
        const line = logLines[(i + offset) % logLines.length];
        sideCtx.fillStyle = line.startsWith('[PASS]') ? '#C4FF36' : '#FFDA35';
        sideCtx.fillText(line, 28, 406 + i * 38);
      }
      sideTex.needsUpdate = true;
    }

    // 3. Dell G15 Laptop Screen (512x320)
    if (laptopCtx) {
      laptopCtx.fillStyle = '#111624';
      laptopCtx.fillRect(0, 0, 512, 320);
      laptopCtx.fillStyle = '#FF5B42';
      laptopCtx.fillRect(0, 0, 512, 28);
      laptopCtx.fillStyle = '#FFFFFF';
      laptopCtx.font = 'bold 13px monospace';
      laptopCtx.fillText('FLUTTER ANDROID EMULATOR // NFC + TRAZITOS', 14, 19);

      laptopCtx.strokeStyle = '#C4FF36';
      laptopCtx.lineWidth = 3;
      laptopCtx.strokeRect(28, 44, 160, 256);
      laptopCtx.fillStyle = '#192136';
      laptopCtx.fillRect(30, 46, 156, 252);
      laptopCtx.fillStyle = '#C4FF36';
      laptopCtx.font = 'bold 12px monospace';
      laptopCtx.fillText('NTAG213 AES-128', 46, 72);
      laptopCtx.strokeStyle = '#FFDA35';
      laptopCtx.beginPath();
      laptopCtx.arc(108, 155, 36 + Math.sin(time * 4) * 6, 0, Math.PI * 2);
      laptopCtx.stroke();
      laptopCtx.fillStyle = '#FFFFFF';
      laptopCtx.fillText('STATUS: VERIFIED', 46, 250);

      laptopCtx.fillStyle = '#161D30';
      laptopCtx.fillRect(212, 44, 276, 256);
      laptopCtx.strokeStyle = '#725BFF';
      laptopCtx.strokeRect(212, 44, 276, 256);
      laptopCtx.fillStyle = '#FFDA35';
      laptopCtx.font = 'bold 13px monospace';
      laptopCtx.fillText('DELL G15 // CUDA + DART VM', 226, 74);
      laptopCtx.fillStyle = '#C4FF36';
      laptopCtx.font = '12px monospace';
      laptopCtx.fillText('> Hot Reload: 142ms', 226, 114);
      laptopCtx.fillText('> AES-128 Block: VALID', 226, 146);
      laptopCtx.fillText('> FastAPI Sync: CONNECTED', 226, 178);
      laptopCtx.fillText('> GPU Temp: 61°C [OPTIMAL]', 226, 210);
      laptopTex.needsUpdate = true;
    }

    // 4. High-Contrast E-Paper SPI Display (512x320)
    if (epaperCtx) {
      epaperCtx.fillStyle = '#D8D4C8';
      epaperCtx.fillRect(0, 0, 512, 320);
      epaperCtx.strokeStyle = '#111215';
      epaperCtx.lineWidth = 8;
      epaperCtx.strokeRect(8, 8, 496, 304);

      epaperCtx.fillStyle = '#111215';
      epaperCtx.fillRect(8, 8, 496, 52);
      epaperCtx.fillStyle = '#C4FF36';
      epaperCtx.font = 'bold 21px monospace';
      epaperCtx.fillText('STM32F446RE // E-PAPER SPI', 22, 42);

      epaperCtx.fillStyle = '#B91C1C';
      epaperCtx.font = 'bold 20px monospace';
      epaperCtx.fillText('NTAG213 AES-128: LOCKED', 24, 96);

      epaperCtx.fillStyle = '#111215';
      epaperCtx.font = 'bold 18px monospace';
      epaperCtx.fillText('ADC1: 3.29V | DSP: 180MHz', 24, 132);

      epaperCtx.strokeStyle = '#111215';
      epaperCtx.lineWidth = 6;
      epaperCtx.beginPath();
      for (let i = 0; i <= 24; i++) {
        const x = 28 + i * 19;
        const y = 225 + Math.round(Math.sin(time * 2 + i * 0.5) * 2.2) * 20;
        if (i === 0) epaperCtx.moveTo(x, y);
        else epaperCtx.lineTo(x, y);
      }
      epaperCtx.stroke();
      epaperTex.needsUpdate = true;
    }

    // 5. Digital Oscilloscope Screen (256x160)
    if (scopeCtx) {
      scopeCtx.fillStyle = '#071318';
      scopeCtx.fillRect(0, 0, 256, 160);
      scopeCtx.strokeStyle = 'rgba(0, 255, 180, 0.18)';
      scopeCtx.lineWidth = 1;
      for (let x = 0; x < 256; x += 32) {
        scopeCtx.beginPath();
        scopeCtx.moveTo(x, 0);
        scopeCtx.lineTo(x, 160);
        scopeCtx.stroke();
      }
      scopeCtx.strokeStyle = '#C4FF36';
      scopeCtx.lineWidth = 2.5;
      scopeCtx.beginPath();
      for (let x = 0; x < 256; x += 4) {
        const y = 52 + Math.sin(time * 6 + x * 0.08) * 24;
        if (x === 0) scopeCtx.moveTo(x, y);
        else scopeCtx.lineTo(x, y);
      }
      scopeCtx.stroke();

      scopeCtx.strokeStyle = '#38BDF8';
      scopeCtx.lineWidth = 2;
      scopeCtx.beginPath();
      for (let x = 0; x < 256; x += 4) {
        const high = Math.sin(time * 4 + x * 0.12) > 0;
        const y = high ? 102 : 136;
        if (x === 0) scopeCtx.moveTo(x, y);
        else scopeCtx.lineTo(x, y);
      }
      scopeCtx.stroke();
      scopeTex.needsUpdate = true;
    }

    // 6. Desktop StreamDeck / Telemetry Console for LoL Anti-Tilt & QA (512x320)
    if (holoCtx) {
      holoCtx.fillStyle = '#101422';
      holoCtx.fillRect(0, 0, 512, 320);
      holoCtx.strokeStyle = '#FFDA35';
      holoCtx.lineWidth = 5;
      holoCtx.strokeRect(4, 4, 504, 312);

      holoCtx.fillStyle = '#FFDA35';
      holoCtx.fillRect(4, 4, 504, 36);
      holoCtx.fillStyle = '#0B0C10';
      holoCtx.font = 'bold 17px monospace';
      holoCtx.fillText('LOL ANTI-TILT // SESSION HEURISTICS', 18, 28);

      holoCtx.fillStyle = '#FFFFFF';
      holoCtx.font = 'bold 16px monospace';
      holoCtx.fillText('COGNITIVE FATIGUE INDEX: 14% [LOW]', 24, 82);

      holoCtx.fillStyle = '#1E2436';
      holoCtx.fillRect(24, 100, 464, 30);
      const barW = 110 + Math.sin(time * 1.8) * 25;
      holoCtx.fillStyle = '#C4FF36';
      holoCtx.fillRect(24, 100, barW, 30);

      holoCtx.fillStyle = '#C4FF36';
      holoCtx.font = 'bold 18px monospace';
      holoCtx.fillText('STREAK: +3 WINS | COOLDOWN: OPTIMAL', 24, 178);
      holoCtx.fillStyle = '#38BDF8';
      holoCtx.font = '15px monospace';
      holoCtx.fillText('SELENIUM QA SUITE: 42/42 PASSED (100%)', 24, 222);
      holoCtx.fillStyle = '#FF5B42';
      holoCtx.fillText('QUEUE RECOMMENDATION: CLEARED TO PLAY', 24, 264);
      holoTex.needsUpdate = true;
    }

    if (nfcRingRef.current) {
      const p = (time * 0.85) % 1;
      nfcRingRef.current.scale.setScalar(0.85 + p * 0.55);
      (nfcRingRef.current.material as THREE.MeshBasicMaterial).opacity = (1 - p) * 0.75;
    }

    if (xboxLightRef.current) {
      const hue = (time * 0.14) % 1;
      if (activeSceneIndex === 3) {
        xboxLightRef.current.color.setHSL(hue, 0.85, 0.6);
      } else {
        xboxLightRef.current.color.set('#725BFF');
      }
    }
  });

  const handleWallHit = () => {
    if (activeSceneIndex !== 4) {
      onSelectStation(4);
    }
    onHitPinata();
  };

  return (
    <group>
      {/* CALIBRATED STUDIO LIGHTING */}
      <ambientLight intensity={1.35} />
      <hemisphereLight args={['#F8FAFC', '#1E293B', 1.1]} />
      <directionalLight
        position={[7, 13, 9]}
        intensity={2.4}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0005}
      />
      <pointLight position={[0, 3.8, -0.4]} intensity={1.8} decay={0} distance={10} color="#F8FAFC" />
      <pointLight position={[-3.5, 4.5, 2.5]} intensity={1.2} decay={0} distance={14} color={activeScene.accentColor} />
      <pointLight position={[-2.6, 2.2, 0.8]} intensity={1.1} decay={0} distance={6} color="#FF5B42" />
      <pointLight ref={xboxLightRef} position={[2.8, 2.2, 0.8]} intensity={1.2} decay={0} distance={7} color="#725BFF" />

      {/* ISOMETRIC CUTAWAY DIORAMA ARCHITECTURE */}
      <RoundedBox args={[12.8, 0.36, 9.2]} radius={0.06} smoothness={4} position={[0, -0.22, -0.2]} receiveShadow>
        <meshStandardMaterial color="#1E2436" roughness={0.7} metalness={0.15} />
      </RoundedBox>
      <mesh position={[0.15, -0.02, -0.05]} receiveShadow>
        <boxGeometry args={[12.2, 0.06, 8.7]} />
        <meshStandardMaterial color="#283044" roughness={0.65} metalness={0.1} />
      </mesh>
      <gridHelper args={[12.0, 12, '#475569', '#333D54']} position={[0.15, 0.015, -0.05]} />

      {/* Under-Desk Woven Studio Rug */}
      <RoundedBox args={[7.4, 0.02, 3.6]} radius={0.01} position={[0.1, 0.02, 0.1]} receiveShadow>
        <meshStandardMaterial color="#1B2030" roughness={0.9} />
      </RoundedBox>
      <mesh position={[0.1, 0.032, 1.88]}>
        <boxGeometry args={[7.36, 0.005, 0.04]} />
        <meshBasicMaterial color={activeScene.accentColor} />
      </mesh>

      {/* Back Cutaway Wall */}
      <RoundedBox args={[12.6, 6.4, 0.38]} radius={0.04} position={[0, 3.0, -4.55]} receiveShadow castShadow>
        <meshStandardMaterial color="#242B3D" roughness={0.72} />
      </RoundedBox>
      <mesh position={[0.18, 0.18, -4.33]}>
        <boxGeometry args={[12.1, 0.32, 0.06]} />
        <meshStandardMaterial color="#1A202E" roughness={0.5} />
      </mesh>
      {/* Warm Wood Acoustic Slat Panels on Back Wall */}
      {[-4.8, -4.3, -3.8, -3.3, -2.8, 2.8, 3.3, 3.8, 4.3, 4.8].map((wx) => (
        <mesh key={wx} position={[wx, 3.1, -4.31]} castShadow receiveShadow>
          <boxGeometry args={[0.28, 5.4, 0.07]} />
          <meshStandardMaterial color="#5C4033" roughness={0.55} />
        </mesh>
      ))}
      <mesh position={[0.15, 5.95, -4.32]}>
        <boxGeometry args={[11.6, 0.07, 0.06]} />
        <meshBasicMaterial color="#C4FF36" />
      </mesh>
      <mesh position={[0, 3.4, -4.34]}>
        <boxGeometry args={[4.8, 2.8, 0.04]} />
        <meshStandardMaterial color="#1B2030" roughness={0.6} />
      </mesh>
      <mesh position={[0, 4.82, -4.32]}>
        <boxGeometry args={[4.84, 0.04, 0.05]} />
        <meshBasicMaterial color="#725BFF" />
      </mesh>

      {/* Left Cutaway Wall */}
      <RoundedBox args={[0.38, 6.4, 9.2]} radius={0.04} position={[-6.15, 3.0, -0.2]} receiveShadow castShadow>
        <meshStandardMaterial color="#2A3246" roughness={0.72} />
      </RoundedBox>

      {/* ================= STATION 04: THE OMAR WALL PORTRAIT & SKILL PIÑATA ================= */}
      <group position={[-5.9, 3.28, -1.78]} rotation={[0, Math.PI / 2, 0]}>
        <OmarWallPinata
          unlockedCount={unlockedSkillsCount}
          hitTrigger={pinataHitTrigger}
          activeSkillId={activeSkillId}
          onHitPinata={handleWallHit}
          onSelectSkill={(sk) => {
            if (activeSceneIndex !== 4) onSelectStation(4);
            onSelectSkill(sk);
          }}
        />
      </group>

      {/* Framed Cyber-Lab Telemetry Pegboard on Front Section of Left Wall */}
      <group position={[-5.9, 3.15, 2.25]} scale={0.78}>
        <RoundedBox args={[0.08, 2.75, 2.75]} radius={0.02} castShadow receiveShadow>
          <meshStandardMaterial color="#1E293B" roughness={0.4} metalness={0.4} />
        </RoundedBox>
        <mesh position={[0.045, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[2.58, 2.58]} />
          <meshBasicMaterial map={wallBoardTex} />
        </mesh>
      </group>

      {/* Back Wall Floating Shelf */}
      <group position={[-3.6, 4.25, -4.02]}>
        <RoundedBox args={[2.3, 0.09, 0.52]} radius={0.02} castShadow receiveShadow>
          <meshStandardMaterial color="#94A3B8" roughness={0.3} metalness={0.5} />
        </RoundedBox>
        <mesh position={[0, -0.05, 0.15]}>
          <boxGeometry args={[2.1, 0.015, 0.04]} />
          <meshBasicMaterial color="#FFDA35" />
        </mesh>
        <mesh position={[-0.75, 0.25, 0]} castShadow>
          <boxGeometry args={[0.13, 0.4, 0.34]} />
          <meshStandardMaterial color="#FF5B42" roughness={0.4} />
        </mesh>
        <mesh position={[-0.59, 0.23, 0]} castShadow>
          <boxGeometry args={[0.12, 0.36, 0.34]} />
          <meshStandardMaterial color="#C4FF36" roughness={0.4} />
        </mesh>
        <mesh position={[-0.43, 0.26, 0]} castShadow>
          <boxGeometry args={[0.14, 0.42, 0.34]} />
          <meshStandardMaterial color="#725BFF" roughness={0.4} />
        </mesh>
        <mesh position={[0.65, 0.14, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.09, 0.18, 16]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.3} />
        </mesh>
        <mesh position={[0.65, 0.27, 0]} castShadow>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color="#22C55E" roughness={0.6} />
        </mesh>
      </group>

      {/* MAIN ERGONOMIC MAKER DESK + DESK RISER SHELF */}
      <group>
        <RoundedBox args={[8.4, 0.18, 3.6]} radius={0.04} smoothness={4} position={[0, 0.92, -0.35]} receiveShadow castShadow>
          <meshStandardMaterial color="#363E52" roughness={0.45} metalness={0.18} />
        </RoundedBox>
        <mesh position={[0, 0.92, 1.46]}>
          <boxGeometry args={[8.32, 0.04, 0.025]} />
          <meshBasicMaterial color={activeScene.accentColor} />
        </mesh>

        <RoundedBox args={[4.4, 0.06, 0.92]} radius={0.02} position={[0.35, 1.16, -1.25]} receiveShadow castShadow>
          <meshStandardMaterial color="#475569" roughness={0.35} metalness={0.35} />
        </RoundedBox>
        <mesh position={[-1.45, 1.06, -1.25]} castShadow>
          <boxGeometry args={[0.08, 0.16, 0.78]} />
          <meshStandardMaterial color="#1E293B" metalness={0.5} />
        </mesh>
        <mesh position={[2.15, 1.06, -1.25]} castShadow>
          <boxGeometry args={[0.08, 0.16, 0.78]} />
          <meshStandardMaterial color="#1E293B" metalness={0.5} />
        </mesh>

        <RoundedBox args={[3.4, 0.016, 1.45]} radius={0.01} position={[0.05, 1.015, 0.35]} receiveShadow>
          <meshStandardMaterial color="#171B26" roughness={0.85} />
        </RoundedBox>

        <RoundedBox args={[0.22, 0.9, 3.2]} radius={0.03} position={[-3.85, 0.45, -0.35]} castShadow receiveShadow>
          <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.35} />
        </RoundedBox>
        <RoundedBox args={[0.22, 0.9, 3.2]} radius={0.03} position={[3.85, 0.45, -0.35]} castShadow receiveShadow>
          <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.35} />
        </RoundedBox>
      </group>

      {/* OVERHEAD ARCHITECTURAL LED TASK BAR */}
      <group position={[0, 3.95, -1.15]}>
        <mesh position={[0, -1.35, -0.35]}>
          <cylinderGeometry args={[0.035, 0.04, 2.7, 16]} />
          <meshStandardMaterial color="#64748B" metalness={0.75} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0, -0.18]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.4, 12]} />
          <meshStandardMaterial color="#64748B" metalness={0.75} roughness={0.25} />
        </mesh>
        <RoundedBox args={[3.1, 0.055, 0.1]} radius={0.015} position={[0, 0, 0.02]}>
          <meshStandardMaterial color="#CBD5E1" metalness={0.65} roughness={0.25} />
        </RoundedBox>
        <mesh position={[0, -0.03, 0.02]}>
          <boxGeometry args={[3.0, 0.012, 0.07]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </group>

      {/* STATION 02: AI & SOFTWARE */}
      <group onClick={() => onSelectStation(2)}>
        <group position={[-0.05, 2.28, -1.22]}>
          <mesh position={[0, -0.78, -0.12]} castShadow>
            <cylinderGeometry args={[0.08, 0.1, 0.65, 20]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.75} roughness={0.25} />
          </mesh>
          <RoundedBox args={[0.68, 0.03, 0.42]} radius={0.01} position={[0, -1.08, -0.05]} castShadow>
            <meshStandardMaterial color="#64748B" metalness={0.7} roughness={0.3} />
          </RoundedBox>

          <RoundedBox args={[2.86, 1.66, 0.09]} radius={0.03} smoothness={4} castShadow>
            <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.6} />
          </RoundedBox>
          <mesh position={[0, 0.01, 0.042]}>
            <planeGeometry args={[2.78, 1.58]} />
            <meshBasicMaterial color="#0B0C10" />
          </mesh>
          <mesh position={[0, 0.01, 0.048]}>
            <planeGeometry args={[2.7, 1.5]} />
            <meshBasicMaterial map={mainTex} />
          </mesh>
          <mesh position={[0, -0.79, 0.048]}>
            <boxGeometry args={[2.8, 0.025, 0.01]} />
            <meshBasicMaterial color="#C4FF36" />
          </mesh>
          <RoundedBox args={[0.24, 0.06, 0.08]} radius={0.015} position={[0, 0.86, 0.03]}>
            <meshStandardMaterial color="#1E293B" roughness={0.3} />
          </RoundedBox>
          <mesh position={[0, 0.86, 0.075]}>
            <circleGeometry args={[0.018, 16]} />
            <meshBasicMaterial color="#C4FF36" />
          </mesh>
        </group>

        <group position={[1.95, 2.22, -1.08]} rotation={[0, -0.28, 0]}>
          <RoundedBox args={[1.16, 1.84, 0.08]} radius={0.025} smoothness={4} castShadow>
            <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.6} />
          </RoundedBox>
          <mesh position={[0, 0, 0.044]}>
            <planeGeometry args={[1.04, 1.72]} />
            <meshBasicMaterial map={sideTex} />
          </mesh>
        </group>

        <group position={[-1.58, 1.06, -0.48]} rotation={[0, 0.34, 0]}>
          <RoundedBox args={[1.05, 0.04, 0.72]} radius={0.01} position={[0, -0.02, 0]} castShadow>
            <meshStandardMaterial color="#94A3B8" metalness={0.75} roughness={0.25} />
          </RoundedBox>
          <RoundedBox args={[1.28, 0.065, 0.88]} radius={0.02} position={[0, 0.035, 0]} castShadow>
            <meshStandardMaterial color="#475569" roughness={0.35} metalness={0.45} />
          </RoundedBox>
          <RoundedBox args={[1.3, 0.075, 0.15]} radius={0.015} position={[0, 0.042, -0.39]} castShadow>
            <meshStandardMaterial color="#FF5B42" roughness={0.3} />
          </RoundedBox>
          <mesh position={[0, 0.07, -0.04]}>
            <boxGeometry args={[1.08, 0.01, 0.4]} />
            <meshStandardMaterial color="#1E293B" emissive="#FF5B42" emissiveIntensity={0.28} />
          </mesh>
          <mesh position={[0, 0.07, 0.27]}>
            <boxGeometry args={[0.34, 0.008, 0.2]} />
            <meshStandardMaterial color="#334155" roughness={0.3} />
          </mesh>
          <group position={[0, 0.07, -0.34]} rotation={[-0.3, 0, 0]}>
            <RoundedBox args={[1.28, 0.84, 0.045]} radius={0.02} position={[0, 0.42, 0]} castShadow>
              <meshStandardMaterial color="#334155" roughness={0.35} metalness={0.5} />
            </RoundedBox>
            <mesh position={[0, 0.42, 0.025]}>
              <planeGeometry args={[1.18, 0.74]} />
              <meshBasicMaterial map={laptopTex} />
            </mesh>
          </group>
        </group>

        <group position={[-0.1, 1.03, 0.38]}>
          <RoundedBox args={[1.36, 0.06, 0.48]} radius={0.02} position={[0, 0.025, 0]} castShadow receiveShadow>
            <meshStandardMaterial color="#CBD5E1" roughness={0.28} metalness={0.65} />
          </RoundedBox>
          {[-0.15, -0.07, 0.01, 0.09, 0.16].map((kz, rIdx) => (
            <mesh key={rIdx} position={[-0.04, 0.065, kz]} castShadow>
              <boxGeometry args={[1.16, 0.032, 0.058]} />
              <meshStandardMaterial
                color={rIdx === 0 || rIdx === 4 ? '#475569' : '#F1F5F9'}
                roughness={0.4}
              />
            </mesh>
          ))}
          <mesh position={[-0.56, 0.072, -0.15]}>
            <boxGeometry args={[0.085, 0.035, 0.058]} />
            <meshStandardMaterial color="#FF5B42" roughness={0.3} />
          </mesh>
          <mesh position={[0.52, 0.072, 0.01]}>
            <boxGeometry args={[0.13, 0.035, 0.058]} />
            <meshStandardMaterial color="#C4FF36" roughness={0.3} />
          </mesh>
          <mesh position={[-0.04, 0.072, 0.16]}>
            <boxGeometry args={[0.44, 0.035, 0.058]} />
            <meshStandardMaterial color="#FFDA35" roughness={0.3} />
          </mesh>
          <mesh position={[0.58, 0.075, -0.15]}>
            <cylinderGeometry args={[0.035, 0.035, 0.04, 16]} />
            <meshStandardMaterial color="#EAB308" metalness={0.85} roughness={0.2} />
          </mesh>

          <group position={[0.98, 0.025, 0.02]}>
            <mesh scale={[1, 0.62, 1.42]} castShadow>
              <sphereGeometry args={[0.13, 20, 20]} />
              <meshStandardMaterial color="#F8FAFC" roughness={0.3} metalness={0.1} />
            </mesh>
            <mesh position={[0, 0.07, -0.06]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.024, 0.024, 0.022, 16]} />
              <meshStandardMaterial color="#FF5B42" />
            </mesh>
          </group>
        </group>

        <group position={[-0.95, 1.11, 0.54]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.1, 0.09, 0.2, 20]} />
            <meshStandardMaterial color="#F8FAFC" roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.102, 0.095, 0.08, 20]} />
            <meshStandardMaterial color="#FF5B42" roughness={0.35} />
          </mesh>
        </group>
      </group>

      {/* STATION 01: HARDWARE & TELEMATICS */}
      <group position={[-2.75, 1.02, 0.25]} onClick={() => onSelectStation(1)}>
        <RoundedBox args={[2.35, 0.018, 1.85]} radius={0.01} position={[0, -0.005, 0]} receiveShadow>
          <meshStandardMaterial color="#154E63" roughness={0.7} />
        </RoundedBox>
        <mesh position={[0, 0.006, 0.9]}>
          <boxGeometry args={[2.3, 0.006, 0.025]} />
          <meshBasicMaterial color="#38BDF8" />
        </mesh>

        <group position={[-0.18, 0.26, -0.64]} rotation={[0, 0.12, 0]}>
          <RoundedBox args={[0.96, 0.5, 0.36]} radius={0.03} castShadow receiveShadow>
            <meshStandardMaterial color="#E2E8F0" roughness={0.35} metalness={0.2} />
          </RoundedBox>
          <mesh position={[-0.12, 0.02, 0.182]}>
            <planeGeometry args={[0.6, 0.38]} />
            <meshBasicMaterial map={scopeTex} />
          </mesh>
          {[0.11, 0, -0.11].map((ky, i) => (
            <mesh key={i} position={[0.32, ky, 0.19]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.038, 0.038, 0.035, 16]} />
              <meshStandardMaterial color={i === 0 ? '#C4FF36' : i === 1 ? '#38BDF8' : '#FF5B42'} roughness={0.3} />
            </mesh>
          ))}
        </group>

        <group position={[-0.04, 0.035, 0.28]}>
          <RoundedBox args={[1.26, 0.055, 0.76]} radius={0.015} castShadow receiveShadow>
            <meshStandardMaterial color="#F8FAFC" roughness={0.35} />
          </RoundedBox>
          <mesh position={[0, 0.029, -0.31]}>
            <boxGeometry args={[1.16, 0.004, 0.02]} />
            <meshBasicMaterial color="#EF4444" />
          </mesh>
          <mesh position={[0, 0.029, 0.31]}>
            <boxGeometry args={[1.16, 0.004, 0.02]} />
            <meshBasicMaterial color="#3B82F6" />
          </mesh>

          <group position={[-0.14, 0.045, 0]}>
            <RoundedBox args={[0.64, 0.035, 0.42]} radius={0.01} castShadow>
              <meshStandardMaterial color="#0284C7" roughness={0.35} metalness={0.25} />
            </RoundedBox>
            <mesh position={[0.02, 0.024, 0]} rotation={[0, Math.PI / 4, 0]}>
              <boxGeometry args={[0.16, 0.02, 0.16]} />
              <meshStandardMaterial color="#1E293B" roughness={0.25} metalness={0.6} />
            </mesh>
            <mesh position={[0, 0.022, -0.17]}>
              <boxGeometry args={[0.56, 0.02, 0.03]} />
              <meshStandardMaterial color="#EAB308" metalness={0.85} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.022, 0.17]}>
              <boxGeometry args={[0.56, 0.02, 0.03]} />
              <meshStandardMaterial color="#EAB308" metalness={0.85} roughness={0.2} />
            </mesh>
          </group>

          {jumperWires.map((w, idx) => (
            <mesh key={idx} geometry={w.geo} castShadow>
              <meshStandardMaterial color={w.color} roughness={0.3} />
            </mesh>
          ))}
        </group>

        <group position={[-0.92, 0.2, 0.34]} rotation={[-0.26, 0.42, 0]}>
          <RoundedBox args={[0.74, 0.5, 0.05]} radius={0.015} castShadow>
            <meshStandardMaterial color="#334155" roughness={0.35} />
          </RoundedBox>
          <mesh position={[0, 0, 0.028]}>
            <planeGeometry args={[0.66, 0.42]} />
            <meshBasicMaterial map={epaperTex} />
          </mesh>
        </group>

        <group position={[0.82, 0.025, 0.3]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.26, 0.28, 0.03, 32]} />
            <meshStandardMaterial color="#1E293B" metalness={0.4} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.018, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.16, 0.22, 32]} />
            <meshBasicMaterial color="#FFDA35" side={THREE.DoubleSide} />
          </mesh>
          <mesh ref={nfcRingRef} position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.18, 0.23, 32]} />
            <meshBasicMaterial color="#C4FF36" side={THREE.DoubleSide} transparent opacity={0.75} />
          </mesh>
          <RoundedBox args={[0.32, 0.012, 0.2]} radius={0.005} position={[0.04, 0.04, -0.02]} rotation={[0.08, 0.25, 0]} castShadow>
            <meshStandardMaterial color="#FFFFFF" roughness={0.25} />
          </RoundedBox>
        </group>
      </group>

      {/* STATION 03: GAMING & QA */}
      <group position={[2.65, 1.02, 0.35]} onClick={() => onSelectStation(3)}>
        <group position={[-0.68, 0.18, 0.18]} rotation={[-0.38, -0.24, 0]}>
          <RoundedBox args={[0.82, 0.52, 0.06]} radius={0.02} castShadow receiveShadow>
            <meshStandardMaterial color="#334155" roughness={0.35} metalness={0.5} />
          </RoundedBox>
          <mesh position={[0, 0, 0.034]}>
            <planeGeometry args={[0.74, 0.44]} />
            <meshBasicMaterial map={holoTex} />
          </mesh>
        </group>

        <group position={[0.18, 0, 0.16]} rotation={[0, -0.38, 0]}>
          <mesh position={[0, 0.025, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.46, 0.52, 0.06, 32]} />
            <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.5} />
          </mesh>
          <mesh position={[0, 0.002, 0]}>
            <cylinderGeometry args={[0.54, 0.54, 0.018, 32]} />
            <meshBasicMaterial color="#FFDA35" />
          </mesh>
          <mesh position={[0, 0.058, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.36, 0.43, 32]} />
            <meshBasicMaterial color="#725BFF" side={THREE.DoubleSide} />
          </mesh>

          <group position={[0, 0.16, 0.02]} rotation={[0.26, 0, 0]}>
            <RoundedBox args={[0.52, 0.12, 0.34]} radius={0.04} castShadow>
              <meshStandardMaterial color="#F1F5F9" roughness={0.28} metalness={0.1} />
            </RoundedBox>
            <mesh position={[-0.25, -0.015, 0.13]} rotation={[0.18, 0.25, 0]} castShadow>
              <capsuleGeometry args={[0.095, 0.3, 12, 16]} />
              <meshStandardMaterial color="#E2E8F0" roughness={0.32} />
            </mesh>
            <mesh position={[0.25, -0.015, 0.13]} rotation={[0.18, -0.25, 0]} castShadow>
              <capsuleGeometry args={[0.095, 0.3, 12, 16]} />
              <meshStandardMaterial color="#E2E8F0" roughness={0.32} />
            </mesh>
            <mesh position={[-0.15, 0.08, -0.02]}>
              <cylinderGeometry args={[0.046, 0.032, 0.05, 16]} />
              <meshStandardMaterial color="#1E293B" roughness={0.5} />
            </mesh>
            <mesh position={[0.07, 0.08, 0.07]}>
              <cylinderGeometry args={[0.046, 0.032, 0.05, 16]} />
              <meshStandardMaterial color="#1E293B" roughness={0.5} />
            </mesh>
            <mesh position={[-0.07, 0.068, 0.08]}>
              <cylinderGeometry args={[0.048, 0.048, 0.018, 8]} />
              <meshStandardMaterial color="#EAB308" metalness={0.85} roughness={0.2} />
            </mesh>
            <mesh position={[0.17, 0.07, 0.01]}>
              <sphereGeometry args={[0.022, 12, 12]} />
              <meshBasicMaterial color="#22C55E" />
            </mesh>
            <mesh position={[0.22, 0.07, -0.035]}>
              <sphereGeometry args={[0.022, 12, 12]} />
              <meshBasicMaterial color="#EF4444" />
            </mesh>
            <mesh position={[0.12, 0.07, -0.035]}>
              <sphereGeometry args={[0.022, 12, 12]} />
              <meshBasicMaterial color="#3B82F6" />
            </mesh>
            <mesh position={[0.17, 0.07, -0.08]}>
              <sphereGeometry args={[0.022, 12, 12]} />
              <meshBasicMaterial color="#EAB308" />
            </mesh>
          </group>
        </group>

        <group position={[0.72, 0, -0.42]} rotation={[0, -0.45, 0]}>
          <mesh position={[0, 0.02, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.22, 0.04, 24]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.7} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.026, 0.026, 0.76, 16]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.74, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.18, 0.03, 12, 24, Math.PI]} />
            <meshStandardMaterial color="#F1F5F9" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.55, 0.18]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.12, 0.08, 20]} />
            <meshStandardMaterial color="#F1F5F9" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.55, 0.225]}>
            <ringGeometry args={[0.075, 0.105, 20]} />
            <meshBasicMaterial color="#725BFF" side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0.55, -0.18]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.12, 0.08, 20]} />
            <meshStandardMaterial color="#F1F5F9" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.55, -0.225]}>
            <ringGeometry args={[0.075, 0.105, 20]} />
            <meshBasicMaterial color="#725BFF" side={THREE.DoubleSide} />
          </mesh>
        </group>
      </group>

      {/* PORO THE CYBER-TEPORINGO MASCOT */}
      <Poro
        position={activeScene.poroPosition}
        rotationY={activeScene.poroRotationY}
        accentColor={activeScene.accentColor}
        onPoke={onPokePoro}
      />

      <ContactShadows position={[0, 1.02, 0]} opacity={0.45} scale={10} blur={1.8} far={2.5} />
    </group>
  );
}

export default function Scene({
  camState,
  activeSceneIndex,
  unlockedSkillsCount,
  pinataHitTrigger,
  activeSkillId,
  onPokePoro,
  onHitPinata,
  onSelectSkill,
  onSelectStation,
}: SceneProps) {
  return (
    <div
      id="webgl-fixed-canvas"
      style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', zIndex: 1 }}
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [9.8, 7.6, 10.6], fov: 38 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.25,
        }}
      >
        <color attach="background" args={['#121624']} />
        <fogExp2 attach="fog" args={['#121624', 0.016]} />
        <StudioEnvironment />
        <CameraController camState={camState} />
        <MakerRoomMesh
          activeSceneIndex={activeSceneIndex}
          unlockedSkillsCount={unlockedSkillsCount}
          pinataHitTrigger={pinataHitTrigger}
          activeSkillId={activeSkillId}
          onPokePoro={onPokePoro}
          onHitPinata={onHitPinata}
          onSelectSkill={onSelectSkill}
          onSelectStation={onSelectStation}
        />
      </Canvas>
    </div>
  );
}
