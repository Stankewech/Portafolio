export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectCaseStudy {
  id: string;
  sceneIndex: 1 | 2 | 3;
  code: string;
  title: string;
  subtitle: string;
  period: string;
  role: string;
  accent: 'acid' | 'coral' | 'violet' | 'cyber';
  technologies: string[];
  metrics: ProjectMetric[];
  architectureNodes: string[];
  description: string;
  problem: string;
  solution: string;
  results: string;
  images: string[];
}

export const PERSONAL_LINKS = {
  name: 'Omar Stankewech Marta Olvera',
  headline: 'Ingeniería en Telemática (UPIITA - IPN) | QA, AI & Embedded Systems',
  emailPrimary: 'omarstankewech.67@outlook.com',
  emailInstitutional: 'omartao1800@alumno.ipn.mx',
  phone: '+52 56 23368582',
  linkedin: 'https://www.linkedin.com/in/omar-stankewech-marta-olvera',
  github: 'https://github.com/Stankewech',
  cvUrl: 'https://drive.google.com/file/d/1E5NaK1H2N1FEWzhFD6Kmif00PhUUkOV9/view?usp=drivesdk',
};

export const PROJECTS: ProjectCaseStudy[] = [
  {
    id: 'nfc-security',
    sceneIndex: 1,
    code: 'HW-01 // NFC-AES',
    title: 'SECURE NFC PAYLOAD MANAGER',
    subtitle: 'Lectura y escritura cifrada con AES-128 para etiquetas NTAG213',
    period: 'Mayo 2026',
    role: 'Mobile Developer & Security QA',
    accent: 'coral',
    technologies: ['Flutter', 'Dart', 'C', 'AES-128 Cipher', 'NTAG213 NFC', 'Security QA'],
    metrics: [
      { label: 'Cifrado', value: 'AES-128' },
      { label: 'Tag Estándar', value: 'NTAG213 (144B)' },
      { label: 'Integridad RF', value: '100% Validada' },
    ],
    architectureNodes: ['Flutter UI', 'AES-128 Engine', 'ISO 14443-A RF', 'NTAG213 EEPROM'],
    description:
      'Aplicación móvil y utilidad de validación para lectura y escritura segura de cargas de texto cifradas mediante AES en etiquetas NTAG213.',
    problem:
      'Las operaciones de lectura/escritura sobre etiquetas NFC NTAG213 requieren proteger la confidencialidad del payload y evitar corrupción de bloques cuando se interrumpe el acoplamiento RF.',
    solution:
      'Se implementaron rutinas de validación de entrada, manejo de casos borde y pruebas funcionales/de seguridad sobre algoritmos de cifrado AES en la comunicación hardware-software.',
    results:
      'Validación de integridad de datos y prevención de vulnerabilidades y cierres inesperados durante la escritura física de tags NTAG213.',
    images: ['/images/nfc-architecture.svg'],
  },
  {
    id: 'stm32-epaper',
    sceneIndex: 1,
    code: 'HW-02 // STM32-DSP',
    title: 'E-PAPER & STM32 TELEMATICS LAB',
    subtitle: 'Sistemas digitales, protoboard, pantallas E-Paper y DSP en STM32',
    period: '2025 – 2026',
    role: 'Embedded Systems & Telematics (UPIITA - IPN)',
    accent: 'acid',
    technologies: ['STM32F446RE', 'C / C++', 'MikroC', 'E-Paper SPI', 'ADC / DAC / Timers'],
    metrics: [
      { label: 'MCU Core', value: 'ARM Cortex-M4' },
      { label: 'Frecuencia', value: '180 MHz DSP' },
      { label: 'Interfaz', value: 'SPI E-Ink + DAC' },
    ],
    architectureNodes: ['Sensores Analógicos', 'STM32 ADC/Timers', 'Filtro DSP C/C++', 'E-Paper SPI + DAC'],
    description:
      'Desarrollo de prototipos electrónicos sobre protoboard integrando microcontroladores STM32, procesamiento digital de señales y módulos de visualización E-Paper.',
    problem:
      'Visualizar telemetría de bajo consumo y sintetizar/procesar señales en tiempo real demanda control preciso de periféricos de hardware e interrupciones.',
    solution:
      'Programación de microcontroladores STM32 en C/C++ empleando conversores ADC/DAC y Timers junto con pantallas E-Paper y displays electrónicos.',
    results:
      'Prototipos verificados en laboratorio con despliegue persistente en tinta electrónica y generación controlada de formas de onda.',
    images: ['/images/stm32-epaper.svg'],
  },
  {
    id: 'trazitos',
    sceneIndex: 2,
    code: 'AI-01 // TRAZITOS',
    title: 'TRAZITOS — SIAMESE CNN',
    subtitle: 'Plataforma educativa con Siamese CNN (TensorFlow/MobileNet), FastAPI y PostgreSQL',
    period: 'Sept 2025 – Mayo 2026',
    role: 'Full-Stack Developer & System Validation Lead',
    accent: 'acid',
    technologies: ['TensorFlow', 'Siamese CNN (MobileNet)', 'Flutter', 'FastAPI', 'PostgreSQL'],
    metrics: [
      { label: 'Arquitectura IA', value: 'Siamese MobileNet' },
      { label: 'Base de Datos', value: 'PostgreSQL' },
      { label: 'Latencia API', value: '< 45 ms REST' },
    ],
    architectureNodes: ['Flutter Lienzo', 'FastAPI REST', 'Siamese CNN', 'PostgreSQL'],
    description:
      'Aplicación móvil educativa para evaluación de trazos infantiles en tiempo real mediante visión por computadora y arquitectura REST.',
    problem:
      'Garantizar una comunicación libre de defectos entre la app móvil, la API REST en FastAPI, la base de datos PostgreSQL y el modelo Siamese CNN.',
    solution:
      'Diseño y ejecución de pruebas funcionales y de integración sobre endpoints FastAPI, definición de criterios de aceptación/rechazo para integridad en PostgreSQL y preparación de entornos para evaluar la red Siamese CNN.',
    results:
      'Resolución temprana de defectos, consultas relacionales validadas y documentación detallada del desempeño del modelo neuronal.',
    images: ['/images/trazitos-cnn.svg'],
  },
  {
    id: '5g-traffic-prediction',
    sceneIndex: 2,
    code: 'AI-02 // 5G-PRB',
    title: '5G TRAFFIC PREDICTION',
    subtitle: 'Pronóstico de carga PRB con modelos XGBoost, MLP y LSTM',
    period: 'Abril – Mayo 2026 (Samsung Innovation Campus)',
    role: 'Data Evaluation & Performance Analysis',
    accent: 'violet',
    technologies: ['Python', 'XGBoost', 'LSTM', 'MLP', '5G PRB Telemetry'],
    metrics: [
      { label: 'Modelos', value: 'XGBoost · LSTM · MLP' },
      { label: 'Certificación', value: 'Samsung SIC (150h)' },
      { label: 'Target', value: '5G PRB Load' },
    ],
    architectureNodes: ['Dataset 5G PRB', 'Limpieza & Outliers', 'XGBoost / LSTM / MLP', 'Evaluación RMSE/MAE'],
    description:
      'Análisis y evaluación de desempeño de modelos predictivos sobre datos de carga PRB para pronóstico de tráfico en redes 5G.',
    problem:
      'La predicción confiable del tráfico en celdas 5G exige validar grandes volúmenes de datos PRB y filtrar anomalías antes del modelado.',
    solution:
      'Validación de datasets bajo estrictos criterios de aprobación en Python y evaluación comparativa de arquitecturas XGBoost, MLP y LSTM.',
    results:
      'Documentación técnica de resultados de pronóstico en redes 5G, respaldada por el Certificado en IA y Liderazgo (150h) de Samsung Innovation Campus 2025.',
    images: ['/images/5g-forecast.svg'],
  },
  {
    id: 'lol-anti-tilt',
    sceneIndex: 3,
    code: 'GM-01 // ANTI-TILT',
    title: 'LEAGUE OF LEGENDS ANTI-TILT',
    subtitle: 'Sistema heurístico de prevención de fatiga cognitiva y tilt competitivo',
    period: 'Proyecto Interactivo',
    role: 'Creator & System Designer',
    accent: 'cyber',
    technologies: ['Python', 'JavaScript', 'Session Telemetry', 'Behavioral Heuristics'],
    metrics: [
      { label: 'Monitoreo', value: 'Tiempo Real' },
      { label: 'Heurística', value: 'Racha + Duración' },
      { label: 'Alerta', value: 'Cooldown Activo' },
    ],
    architectureNodes: ['Telemetría de Sesión', 'Motor Heurístico', 'Índice de Fatiga', 'Alerta Cooldown'],
    description:
      'Herramienta enfocada en monitorear indicadores de sesión de juego y prevenir el deterioro en la toma de decisiones por tilt.',
    problem:
      'Las rachas negativas y sesiones extensas generan fatiga cognitiva y frustración en jugadores competitivos sin alertas preventivas.',
    solution:
      'Sistema de seguimiento de rachas, tiempo de sesión y alertas de enfriamiento para recomendar pausas estratégicas antes de iniciar otra partida.',
    results:
      'Flujo interactivo de prevención de tilt con umbrales configurables por el jugador.',
    images: ['/images/lol-antitilt.svg'],
  },
  {
    id: 'selenium-automation',
    sceneIndex: 3,
    code: 'QA-02 // SELENIUM',
    title: 'SELENIUM QA AUTOMATION SUITE',
    subtitle: 'Automatización de pruebas E2E, Quality Assurance y validación de APIs',
    period: '2025 – 2026',
    role: 'QA & Test Automation Engineer',
    accent: 'coral',
    technologies: ['Selenium WebDriver', 'Python', 'Java', 'Postman', 'QA Matrix'],
    metrics: [
      { label: 'Cobertura', value: 'E2E + REST API' },
      { label: 'Stack', value: 'Selenium · Postman' },
      { label: 'Trazabilidad', value: '100% Documentada' },
    ],
    architectureNodes: ['Test Plan & Matriz', 'Selenium WebDriver', 'Postman API Checks', 'Reporte de Defectos'],
    description:
      'Suite de pruebas automatizadas y aseguramiento de calidad para validar flujos críticos de interfaz y servicios.',
    problem:
      'Las pruebas manuales repetitivas ralentizan la detección de regresiones y dificultan mantener criterios de aceptación consistentes.',
    solution:
      'Automatización de casos de prueba con Selenium, preparación de ambientes de validación y documentación estructurada de ejecución y defectos.',
    results:
      'Optimización de los procesos de testing funcional y de integración a lo largo del ciclo de vida de software.',
    images: ['/images/selenium-qa.svg'],
  },
];
