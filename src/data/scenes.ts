export interface SceneKeyframe {
  id: string;
  index: number;
  code: string;
  shortLabel: string;
  title: string;
  subtitle: string;
  scrollPercent: number;
  hudAlign: 'left' | 'right';
  cameraPosition: [number, number, number];
  lookAt: [number, number, number];
  fov: number;
  accentColor: string;
  poroPosition: [number, number, number];
  poroRotationY: number;
  poroDialogue: string;
}

export const SCENES: SceneKeyframe[] = [
  {
    id: 'scene-00',
    index: 0,
    code: 'ESCENA 00',
    shortLabel: '00.LAB',
    title: 'THE CREATOR LAB',
    subtitle: 'Isometric Cyber-Lab Overview',
    scrollPercent: 0,
    hudAlign: 'left',
    cameraPosition: [9.8, 7.6, 10.6],
    lookAt: [-1.1, 1.35, -0.2],
    fov: 38,
    accentColor: '#C4FF36',
    poroPosition: [1.15, 1.04, 0.48],
    poroRotationY: 0.45,
    poroDialogue:
      '¡Bienvenido al laboratorio 3D de Omar! Explora las estaciones del escritorio o visita el nuevo Muro de Omar (04.OMAR) para golpear la piñata de skills.',
  },
  {
    id: 'scene-01',
    index: 1,
    code: 'ESCENA 01',
    shortLabel: '01.HARDWARE',
    title: 'HARDWARE & TELEMATICS',
    subtitle: 'STM32F446RE · NFC AES-128 · E-Paper · DSP',
    scrollPercent: 20,
    hudAlign: 'right',
    cameraPosition: [-3.3, 3.45, 3.65],
    lookAt: [-1.45, 1.18, 0.05],
    fov: 32,
    accentColor: '#FF5B42',
    poroPosition: [-1.25, 1.04, 0.55],
    poroRotationY: -0.35,
    poroDialogue:
      'Estación de Sistemas Embebidos: microcontrolador STM32F446RE, cifrado AES-128 sobre tags NFC NTAG213, pantalla E-Paper y osciloscopio DSP.',
  },
  {
    id: 'scene-02',
    index: 2,
    code: 'ESCENA 02',
    shortLabel: '02.AI & SW',
    title: 'AI & SOFTWARE ENGINEERING',
    subtitle: 'Siamese CNN · 5G PRB Forecast · FastAPI',
    scrollPercent: 40,
    hudAlign: 'left',
    cameraPosition: [-0.4, 3.05, 4.35],
    lookAt: [-0.85, 2.05, -1.05],
    fov: 35,
    accentColor: '#725BFF',
    poroPosition: [1.05, 1.04, 0.25],
    poroRotationY: 0.15,
    poroDialogue:
      'En los monitores corren TRAZITOS (Siamese CNN MobileNet + FastAPI + PostgreSQL) y el pronóstico de tráfico 5G con XGBoost y LSTM.',
  },
  {
    id: 'scene-03',
    index: 3,
    code: 'ESCENA 03',
    shortLabel: '03.GAMING/QA',
    title: 'GAMING & QUALITY ASSURANCE',
    subtitle: 'Selenium E2E · LoL Anti-Tilt · RGB Dock',
    scrollPercent: 60,
    hudAlign: 'left',
    cameraPosition: [2.6, 3.2, 3.85],
    lookAt: [1.45, 1.35, 0.1],
    fov: 32,
    accentColor: '#FFDA35',
    poroPosition: [1.42, 1.04, 0.55],
    poroRotationY: 0.35,
    poroDialogue:
      'Estación Gaming & QA: monitoreo heurístico League of Legends Anti-Tilt y suite de pruebas automatizadas E2E con Selenium y Python.',
  },
  {
    id: 'scene-04',
    index: 4,
    code: 'ESCENA 04',
    shortLabel: '04.OMAR / SKILLS',
    title: 'I AM OMAR // SKILL PIÑATA WALL',
    subtitle: 'Omar.tsx Wall Frame · Trayectoria IPN/SIC · This Is Me · Why Hire Me',
    scrollPercent: 80,
    hudAlign: 'left',
    // Frames the Left Wall Portrait & Piñata Shrine on the right side of the viewport while AboutMe panel sits on the left
    cameraPosition: [0.55, 3.32, -0.62],
    lookAt: [-5.9, 3.28, -0.62],
    fov: 38,
    accentColor: '#C4FF36',
    poroPosition: [-2.1, 1.04, -0.45],
    poroRotationY: -1.2,
    poroDialogue:
      '¡Haz clic sobre el cuadro 3D de Omar.tsx en la pared! Como si fuera una piñata, cada golpe libera sus skills técnicas alrededor del marco.',
  },
  {
    id: 'scene-05',
    index: 5,
    code: 'ESCENA 05',
    shortLabel: '05.CONTACT',
    title: 'CONTACT & COLLABORATION',
    subtitle: 'Let’s Build Something Together',
    scrollPercent: 100,
    hudAlign: 'left',
    cameraPosition: [0.8, 5.8, 9.6],
    lookAt: [-1.15, 1.65, -0.3],
    fov: 38,
    accentColor: '#C4FF36',
    poroPosition: [0.25, 1.04, 0.62],
    poroRotationY: 0.1,
    poroDialogue:
      'THINK. BUILD. EXPERIMENT. Descarga el CV de Omar o contáctalo directamente por correo, LinkedIn o GitHub.',
  },
];
