export interface PinataSkill {
  id: string;
  name: string;
  shortTag: string;
  category: 'QA & Testing' | 'Programación' | 'IA & Datos' | 'Redes & Embebidos' | 'Liderazgo';
  level: string;
  color: string;
  detail: string;
  // Wall offset [horizontal, vertical] around the 3D portrait frame on the wall
  wallOffset: [number, number];
}

export interface TrajectoryMilestone {
  id: string;
  code: string;
  institution: string;
  shortName: string;
  roleOrDegree: string;
  period: string;
  highlightBadge: string;
  accent: 'acid' | 'coral' | 'violet' | 'cyber';
  summary: string;
  achievements: string[];
  tags: string[];
}

export interface PersonalTasteCard {
  id: string;
  labelPrefix: string;
  labelName: string;
  title: string;
  category: string;
  image: string;
  accent: string;
  description: string;
}

export interface WhyHireMePillar {
  id: string;
  code: string;
  title: string;
  metric: string;
  accent: 'acid' | 'coral' | 'violet' | 'cyber';
  description: string;
  proof: string;
}

export interface TechnicalCategory {
  id: string;
  code: string;
  title: string;
  accent: string;
  description: string;
  items: string[];
}

// 16 Skills that burst out of Omar.tsx like a Piñata and mount around the Wall Frame!
export const PINATA_SKILLS: PinataSkill[] = [
  {
    id: 'python',
    name: 'Python 3',
    shortTag: 'PYTHON // AI & QA',
    category: 'Programación',
    level: 'Avanzado',
    color: '#C4FF36',
    detail: 'Automatización QA con Selenium, FastAPI REST y modelos de IA (XGBoost, LSTM, TensorFlow).',
    wallOffset: [-1.42, 1.05],
  },
  {
    id: 'qa-testing',
    name: 'QA & Testing E2E',
    shortTag: 'QA // SELENIUM E2E',
    category: 'QA & Testing',
    level: 'Core Lead',
    color: '#FF5B42',
    detail: 'Pruebas funcionales, no funcionales y de integración, criterios de aceptación y Selenium WebDriver.',
    wallOffset: [1.42, 1.05],
  },
  {
    id: 'fastapi',
    name: 'FastAPI & REST',
    shortTag: 'FASTAPI // <45ms',
    category: 'Programación',
    level: 'Avanzado',
    color: '#725BFF',
    detail: 'Diseño y validación de endpoints REST de baja latencia (<45 ms) para la plataforma educativa TRAZITOS.',
    wallOffset: [-1.52, 0.52],
  },
  {
    id: 'siamese-cnn',
    name: 'Siamese CNN (TF)',
    shortTag: 'CNN // MOBILENET',
    category: 'IA & Datos',
    level: 'Aplicado',
    color: '#C4FF36',
    detail: 'Evaluación de modelos de visión por computadora en TensorFlow/MobileNet para trazos infantiles.',
    wallOffset: [1.52, 0.52],
  },
  {
    id: 'stm32-c',
    name: 'STM32 & C/C++',
    shortTag: 'STM32 // CORTEX-M4',
    category: 'Redes & Embebidos',
    level: 'Hardware Lab',
    color: '#FFDA35',
    detail: 'Programación de microcontroladores ARM Cortex-M4 (ADC, DAC, Timers, SPI E-Paper y DSP a 180 MHz).',
    wallOffset: [-1.56, 0.0],
  },
  {
    id: 'flutter-dart',
    name: 'Flutter & Dart',
    shortTag: 'FLUTTER // MOBILE',
    category: 'Programación',
    level: 'Multiplataforma',
    color: '#38BDF8',
    detail: 'Desarrollo móvil interactivo para TRAZITOS (lienzo de trazos) y lector/escritor NFC NTAG213.',
    wallOffset: [1.56, 0.0],
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    shortTag: 'PGSQL // DATA',
    category: 'IA & Datos',
    level: 'Integridad SQL',
    color: '#725BFF',
    detail: 'Modelado relacional en Tercera Forma Normal (3NF), validación de integridad y MySQL.',
    wallOffset: [-1.52, -0.52],
  },
  {
    id: '5g-lstm-xgboost',
    name: '5G PRB · XGBoost/LSTM',
    shortTag: '5G AI // XGB+LSTM',
    category: 'IA & Datos',
    level: 'Samsung SIC',
    color: '#FFDA35',
    detail: 'Pronóstico de carga PRB en redes 5G con modelos XGBoost, MLP y LSTM (Certificado 150h SIC).',
    wallOffset: [1.52, -0.52],
  },
  {
    id: 'nfc-aes128',
    name: 'AES-128 & NFC RF',
    shortTag: 'AES-128 // NTAG213',
    category: 'Redes & Embebidos',
    level: 'Security QA',
    color: '#FF5B42',
    detail: 'Cifrado de payloads en etiquetas NTAG213 y pruebas de seguridad ante interrupciones RF.',
    wallOffset: [-1.42, -1.05],
  },
  {
    id: 'postman-api',
    name: 'Postman & Bug Triage',
    shortTag: 'POSTMAN // API QA',
    category: 'QA & Testing',
    level: 'Avanzado',
    color: '#C4FF36',
    detail: 'Matrices de pruebas, validación de contratos JSON, documentación de defectos y resolución temprana.',
    wallOffset: [1.42, -1.05],
  },
  {
    id: 'java-oop',
    name: 'Java & JS/TS',
    shortTag: 'JAVA · TS // OOP',
    category: 'Programación',
    level: 'Sólido',
    color: '#FFDA35',
    detail: 'Programación orientada a objetos en Java, suites de automatización y desarrollo web moderno en TypeScript.',
    wallOffset: [-0.82, 1.38],
  },
  {
    id: 'wireshark-tcpip',
    name: 'Wireshark & TCP/IP',
    shortTag: 'TCP/IP // PACKETS',
    category: 'Redes & Embebidos',
    level: 'Telemática IPN',
    color: '#38BDF8',
    detail: 'Análisis profundo de paquetes, seguridad en redes, protocolos de ruteo y Cisco Packet Tracer.',
    wallOffset: [0.0, 1.46],
  },
  {
    id: 'linux-admin',
    name: 'Linux (Ubuntu/Kali)',
    shortTag: 'LINUX // SYSADMIN',
    category: 'Redes & Embebidos',
    level: 'SysAdmin',
    color: '#C4FF36',
    detail: 'Administración de sistemas operativos en Ubuntu, Fedora y Kali Linux para entornos de prueba y despliegue.',
    wallOffset: [0.82, 1.38],
  },
  {
    id: 'matlab-mikroc',
    name: 'MATLAB, MikroC & LaTeX',
    shortTag: 'DSP // MATLAB+C',
    category: 'Redes & Embebidos',
    level: 'Científico',
    color: '#FF5B42',
    detail: 'Procesamiento digital de señales, simulación matemática, firmware en MikroC y documentación en LaTeX.',
    wallOffset: [-0.82, -1.38],
  },
  {
    id: 'git-github',
    name: 'Git & Entornos QA',
    shortTag: 'GITHUB // CI/QA',
    category: 'QA & Testing',
    level: 'Workflow',
    color: '#725BFF',
    detail: 'Control de versiones colaborativo, preparación de ambientes de validación y trazabilidad de releases.',
    wallOffset: [0.0, -1.46],
  },
  {
    id: 'ceneval-leadership',
    name: 'Liderazgo CENEVAL SIC',
    shortTag: 'LIDERAZGO // SIC',
    category: 'Liderazgo',
    level: 'Certificado',
    color: '#FFDA35',
    detail: 'Certificación LIDERAZGO SIC - Avanzado por CENEVAL: gestión de equipos, comunicación y manejo de conflictos.',
    wallOffset: [0.82, -1.38],
  },
];

export const TECHNICAL_CATEGORIES: TechnicalCategory[] = [
  {
    id: 'cat-qa',
    code: '01 // QUALITY ASSURANCE',
    title: 'Testing & Aseguramiento de Calidad',
    accent: '#FF5B42',
    description:
      'Diseño de estrategias de validación de extremo a extremo para prevenir defectos antes de producción.',
    items: [
      'Pruebas Funcionales, No Funcionales y de Integración',
      'Definición de Criterios de Aceptación y Rechazo',
      'Preparación de Ambientes de Prueba (Test Environments)',
      'Automatización E2E con Selenium WebDriver',
      'Validación de APIs REST con Postman',
      'Documentación Técnica y Triage de Bugs',
    ],
  },
  {
    id: 'cat-prog',
    code: '02 // SOFTWARE & CODE',
    title: 'Lenguajes & Desarrollo Full-Stack',
    accent: '#C4FF36',
    description:
      'Dominio de lenguajes de alto y bajo nivel para construir desde firmware hasta APIs y apps móviles.',
    items: [
      'Python (FastAPI, Scripting, Data Science, PyTest)',
      'Java & Programación Orientada a Objetos',
      'C / C++ & MikroC para Sistemas Embebidos',
      'Flutter & Dart (Aplicaciones Móviles Multiplataforma)',
      'JavaScript / TypeScript & React / Next.js',
      'MATLAB & Documentación Científica en LaTeX',
    ],
  },
  {
    id: 'cat-ai-data',
    code: '03 // AI & DATABASES',
    title: 'Inteligencia Artificial & Bases de Datos',
    accent: '#725BFF',
    description:
      'Modelado relacional estricto y evaluación rigurosa de arquitecturas de Machine Learning y Deep Learning.',
    items: [
      'TensorFlow & Evaluación de Redes Siamesas CNN (MobileNet)',
      'Modelos Predictivos: XGBoost, LSTM y MLP',
      'Limpieza de Datasets Masivos y Detección de Anomalías',
      'PostgreSQL (Diseño e Integridad en)',
      'MySQL & Bases de Datos Distribuidas',
      'Métricas de Desempeño (RMSE, MAE, Cosine Similarity)',
    ],
  },
  {
    id: 'cat-net-hw',
    code: '04 // TELEMATICS & EMBEDDED',
    title: 'Redes, Seguridad & Hardware',
    accent: '#FFDA35',
    description:
      'Convergencia telemática entre telecomunicaciones 5G, protocolos TCP/IP y electrónica digital.',
    items: [
      'Pronóstico de Tráfico en Redes 5G (Carga PRB)',
      'Microcontroladores STM32F446RE (ADC, DAC, SPI, Timers)',
      'Seguridad NFC NTAG213 con Cifrado AES-128',
      'Análisis de Paquetes con Wireshark & TCP/IP',
      'Cisco Packet Tracer & Seguridad en Redes',
      'Administración Linux (Ubuntu, Fedora, Kali Linux)',
    ],
  },
];

export const TRAJECTORY_MILESTONES: TrajectoryMilestone[] = [
  {
    id: 'upiita-ipn',
    code: 'ETAPA 02 // UNIVERSIDAD (ACTUAL)',
    institution: 'UPIITA — Instituto Politécnico Nacional (IPN)',
    shortName: 'UPIITA - IPN',
    roleOrDegree: 'Ingeniería en Telemática',
    period: 'Egreso: Octubre 2026',
    highlightBadge: 'PROMEDIO: 8.78 / 10',
    accent: 'acid',
summary:
      'Formación universitaria de alto rigor técnico en la intersección de las redes de telecomunicaciones, la ingeniería de software, la ciencia de datos y la infraestructura distribuida.',
    achievements: [
      'Proyecto de Titulación (TRAZITOS): Investigación y desarrollo de una app móvil educativa utilizando Inteligencia Artificial (Siamese CNN MobileNet) para evaluación de trazos, con arquitectura cliente-servidor en Flutter, FastAPI y PostgreSQL.',
      'Ingeniería de Software y Programación Avanzada: Aplicación práctica de estructuras de datos, POO, patrones de diseño (SOLID) y desarrollo de sistemas completos utilizando Python, C, C++, Java y SQL.',
      'Redes y Telecomunicaciones: Diseño, simulación y análisis de tráfico en redes móviles (5G), junto con la implementación práctica de protocolos de enrutamiento, arquitectura TCP/IP y ciberseguridad.',
      'Infraestructura y Sistemas Distribuidos: Formación sólida en administración de sistemas operativos (Linux), bases de datos distribuidas, cómputo en la nube y gestión de proyectos tecnológicos.',
    ],
    tags: ['Ing. en Telemática', 'GPA: 8.78/10', 'Telecomunicaciones & 5G', 'Ingeniería de Software', 'Redes TCP/IP', 'Proyecto de Titulación'],
  },
  {
    id: 'samsung-sic',
    code: 'ETAPA 03 // CERTIFICACIÓN DE ESPECIALIDAD',
    institution: 'Samsung Innovation Campus 2025 (Samsung & UDEM)',
    shortName: 'Samsung Innovation Campus (SIC)',
    roleOrDegree: 'Certificado en Inteligencia Artificial & Liderazgo (150 Horas)',
    period: 'Culminado: Mayo 2026',
    highlightBadge: '150 HORAS · CENEVAL AVANZADO',
    accent: 'violet',
    summary:
      'Programa de alta especialización tecnológica que integra 130 horas de Ciencia de Datos e Inteligencia Artificial con 20 horas en gestión y liderazgo de equipos.',
    achievements: [
      'Fundamentos de IA y Ciencia de Datos (130h): Formación integral en el ciclo de vida del dato en Python, abarcando estadística avanzada, modelos estocásticos, preprocesamiento, limpieza y análisis exploratorio (EDA).',
      'Machine Learning y Deep Learning: Estudio y entrenamiento de múltiples arquitecturas (aprendizaje supervisado, no supervisado, ensambles y redes neuronales profundas) para clasificación, clustering y series de tiempo.',
      'Proyecto (Telecom & 5G): Aplicación de lo aprendido mediante el modelado predictivo de tráfico de red (carga PRB en entornos ns-3), evaluando arquitecturas como MLP, XGBoost y LSTM.',
      'Módulo de Liderazgo (20h): Certificación "LIDERAZGO SIC - Avanzado" avalada por CENEVAL en dirección de equipos técnicos, toma de decisiones y resolución de conflictos.',
    ],
    tags: ['Data Science & IA (130h)', 'Machine Learning & Deep Learning', 'Modelos Estocásticos', 'Python', 'Proyecto 5G', 'Liderazgo CENEVAL'],
  },
  {
    id: 'cecyt9-batiz',
    code: 'ETAPA 01 // CIMIENTOS TÉCNICOS',
    institution: 'CECyT N°9 "Juan de Dios Bátiz" — IPN',
    shortName: 'CECyT 9 "Juan de Dios Bátiz"',
    roleOrDegree: 'Técnico en Sistemas Digitales',
    period: 'Graduado: 2021',
    highlightBadge: 'VOCACIONAL N°9 · IPN',
    accent: 'coral',
    summary:
      'El punto de partida en una de las escuelas técnicas más exigentes de México, donde forjé la mentalidad de entender la tecnología desde los circuitos y la lógica binaria.',
    achievements: [
      'Diseño, armado y depuración de circuitos digitales secuenciales y combinacionales en laboratorio e instrumentación con osciloscopio.',
      'Programación de microcontroladores en lenguaje C / MikroC y acoplamiento de sensores, actuadores y displays electrónicos.',
      'Desarrollo de disciplina analítica para diagnosticar fallas físicas y lógicas en sistemas hardware-software.',
    ],
    tags: ['Sistemas Digitales', 'Electrónica Digital', 'Microcontroladores', 'C / MikroC', 'Instrumentación'],
  },
];

export const PERSONAL_TASTES: PersonalTasteCard[] = [
  {
    id: 'taste-gaming',
    labelPrefix: 'Gamer',
    labelName: 'Omar',
    title: 'Videojuegos',
    category: 'GAMING · LOL · BRAWL STARS',
    image: '/images/this-is-me/gaming.jpg',
    accent: '#C4FF36',
    description:
      'Me encantan los juegos competitivos y de estrategia como League of Legends, Brawl Stars y Pokémon GO. Mi gusto por analizar el rendimiento me llevó a programar mi propio sistema Anti-Tilt.',
  },
  {
    id: 'taste-coding',
    labelPrefix: 'Builder',
    labelName: 'Omar',
    title: 'Programación',
    category: 'PYTHON · FASTAPI · FLUTTER · QA',
    image: '/images/this-is-me/coding.jpg',
    accent: '#725BFF',
    description:
      'Disfruto transformar ideas complejas en software funcional y blindado: desde diseñar APIs en FastAPI hasta automatizar suites de prueba en Selenium con una buena taza de café.',
  },
  {
    id: 'taste-gym',
    labelPrefix: 'Athletic',
    labelName: 'Omar',
    title: 'GYM',
    category: 'STRENGTH TRAINING · NUTRICIÓN',
    image: '/images/this-is-me/gym.jpg',
    accent: '#FF5B42',
    description:
      'El entrenamiento de fuerza y el acondicionamiento físico son parte esencial de mi rutina. La sobrecarga progresiva, la constancia y el enfoque del gimnasio impulsan mi rendimiento diario.',
  },
  {
    id: 'taste-hardware',
    labelPrefix: 'Maker',
    labelName: 'Omar',
    title: 'Electrónica',
    category: 'HARDWARE · NFC AES-128 · E-PAPER',
    image: '/images/this-is-me/hardware.jpg',
    accent: '#FFDA35',
    description:
      'Desde mi etapa en el CECyT 9 hasta los laboratorios de UPIITA, me apasiona conectar el mundo físico con el digital usando microcontroladores, señales DSP y etiquetas inteligentes NFC.',
  },
  {
    id: 'taste-ai5g',
    labelPrefix: 'Explorer',
    labelName: 'Omar',
    title: 'Inteligencia Artificial',
    category: 'SIAMESE CNN · 5G PRB FORECAST',
    image: '/images/this-is-me/ai5g.jpg',
    accent: '#38BDF8',
    description:
      'Explorar cómo las redes neuronales resuelven problemas reales: desde evaluar trazos infantiles en TRAZITOS hasta predecir la congestión de celdas 5G en el Samsung Innovation Campus.',
  },
  {
    id: 'taste-tcg',
    labelPrefix: 'Strategist',
    labelName: 'Omar',
    title: 'Musica',
    category: 'YOUTUBE MUSIC · SHUFFLE EXTREMO',
    image: '/images/this-is-me/music.jpg',
    accent: '#E3FF37', 
    description:
      'Mi playlist no tiene reglas. Puedo estar levantando pesas con hardbass ruso y  Álvaro Díaz, para luego tirar código escuchando cloud rap o indie latino de la nada, pero es el flow que me funciona.',
  }
];

export const WHY_HIRE_ME_PILLARS: WhyHireMePillar[] = [
  {
    id: 'hire-01',
    code: 'VALOR 01 // FULL-SPECTRUM TELEMATICS',
    title: 'Puente Real entre Hardware, Software, Redes e IA',
    metric: 'Silicio → API → IA',
    accent: 'acid',
    description:
      'Pocos perfiles pueden depurar un bus SPI/NFC con cifrado AES-128 en C, validar una base de datos PostgreSQL con FastAPI y evaluar modelos Siamese CNN o LSTM en Python dentro del mismo proyecto.',
    proof: 'Demostrado en TRAZITOS, Secure NFC Payload Manager y el laboratorio STM32 en UPIITA - IPN.',
  },
  {
    id: 'hire-02',
    code: 'VALOR 02 // MENTALIDAD QA-FIRST',
    title: 'Prevención Temprana de Defectos y Automatización',
    metric: '100% Trazabilidad QA',
    accent: 'coral',
    description:
      'No espero a que el software falle en producción: defino criterios claros de aceptación/rechazo desde el diseño, preparo entornos de prueba controlados y automatizo flujos críticos con Selenium y Postman.',
    proof: 'Reducción de regresiones y detección temprana de bugs de integración en arquitecturas REST + IA.',
  },
  {
    id: 'hire-03',
    code: 'VALOR 03 // RIGOR EN DATOS & 5G AI',
    title: 'Modelado Predictivo Validado por Samsung SIC',
    metric: '150h Samsung SIC · 8.75 GPA',
    accent: 'violet',
    description:
      'Sé que un modelo de IA es tan bueno como los datos que lo alimentan. Aplico validación estricta de datasets, filtrado de anomalías y benchmarking cuantitativo (XGBoost, MLP y LSTM).',
    proof: 'Respaldado por el Certificado en IA (130h) de Samsung Innovation Campus 2025 y promedio de 8.75 en el IPN.',
  },
  {
    id: 'hire-04',
    code: 'VALOR 04 // LIDERAZGO & DISCIPLINA',
    title: 'Comunicación Efectiva y Ejecución Constante',
    metric: 'CENEVAL Liderazgo Avanzado',
    accent: 'cyber',
    description:
      'Combino la certificación avanzada en Liderazgo y Manejo de Conflictos por CENEVAL con la disciplina diaria del entrenamiento de fuerza: constancia, adaptabilidad y trabajo en equipo bajo presión.',
    proof: 'Liderazgo técnico en proyectos multidisciplinarios y documentación clara para ingeniería y negocio.',
  },
];
