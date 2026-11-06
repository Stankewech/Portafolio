# THE MAKER DESK — Interactive 3D Portfolio (Omar Stankewech Marta Olvera)

**"THINK. BUILD. EXPERIMENT."**

Experiencia web 3D isométrica controlada por scroll (Next.js + TypeScript + Three.js + React Three Fiber + Drei + GSAP ScrollTrigger + Tailwind CSS) bajo estética **Creative Brutalism**.

## Novedades v3.0 — Muro 3D de Omar (`Omar.tsx`) & Piñata de Skills

- **`src/components/Omar.tsx`**: Representación 3D en Pixel Art de 16 bits de Omar (4 capas extruidas, parpadeo automático, reacción de sorpresa/salto y giro al hacer clic).
- **`src/components/OmarWallPinata.tsx`**: Instalación 3D en la pared del estudio con el cuadro enmarcado de `Omar.tsx`, explosión de confeti 3D y 16 placas de skills que salen disparadas en parábola alrededor del cuadro cada vez que golpeas la piñata.
- **`src/sections/AboutMe.tsx`** (`ESCENA 04 // 04.OMAR / SKILLS`):
  - **"I am *Omar S.*"**: Biografía personal inspirada en diseño editorial y control interactivo sincronizado con el cuadro 3D de la pared.
  - **Piñata de Skills (16 Habilidades)**: Cada clic sobre `Omar.tsx` (en el muro 3D o en la tarjeta interactiva) libera una nueva skill con su nivel y aplicación real.
  - **"THIS IS ME" (Galería de Gustos)**: 6 tarjetas verticales (`3:4`) con imágenes y descripción de gustos personales (*Videojuegos & Anti-Tilt*, *Programación & QA*, *Gym & Fuerza*, *Electrónica Maker*, *IA & Redes 5G*, *Pokémon TCG & Estrategia*).
  - **Mi Trayectoria**: Recorrido detallado por **CECyT N°9 "Juan de Dios Bátiz"**, **UPIITA - IPN (Ingeniería en Telemática, Promedio 8.75)** y **Samsung Innovation Campus (Certificado 150h en IA y Liderazgo CENEVAL)**.
  - **Conocimientos Técnicos & Why You Should Hire Me**: Matriz técnica dividida en 4 dominios y los 4 diferenciadores clave para contratar a Omar.

## Estructura Modular

```
src/
  components/
    Scene.tsx
    CameraController.tsx
    FloatingCard.tsx
    ProgressHUD.tsx
    Poro.tsx
    Omar.tsx
    OmarWallPinata.tsx
    ProjectModal.tsx
  sections/
    Intro.tsx
    Hardware.tsx
    AIsoftware.tsx
    GamingQA.tsx
    AboutMe.tsx
    Contact.tsx
  animations/
    cameraTimeline.ts
  data/
    projects.ts
    scenes.ts
    aboutData.ts
  styles/
    globals.css
  app/
    page.tsx
    layout.tsx
public/
  images/
    this-is-me/
      gaming.jpg
      coding.jpg
      gym.jpg
      hardware.jpg
      ai5g.jpg
      tcg.jpg
```

## Ejecución Local

```bash
npm install
npm run dev
```
