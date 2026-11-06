'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Scene from '@/components/Scene';
import ProgressHUD from '@/components/ProgressHUD';
import ProjectModal from '@/components/ProjectModal';
import Intro from '@/sections/Intro';
import Hardware from '@/sections/Hardware';
import AIsoftware from '@/sections/AIsoftware';
import GamingQA from '@/sections/GamingQA';
import AboutMe from '@/sections/AboutMe';
import Contact from '@/sections/Contact';
import { createCameraScrollTimeline, CameraTimelineState } from '@/animations/cameraTimeline';
import { SCENES } from '@/data/scenes';
import { ProjectCaseStudy } from '@/data/projects';
import { PINATA_SKILLS, PinataSkill } from '@/data/aboutData';

const PORO_TIPS = [
  '¡Dato curioso! En TRAZITOS Omar validó una red Siamese CNN (MobileNet) con FastAPI y PostgreSQL.',
  'En la estación de Hardware, el STM32F446RE procesa señales analógicas y actualiza la pantalla E-Paper por SPI.',
  '¿Sabías que Omar cuenta con el Certificado en IA y Liderazgo (150h) de Samsung Innovation Campus?',
  'El módulo NFC valida bloques cifrados con AES-128 sobre etiquetas NTAG213 evitando corrupción por corte RF.',
  '¡En la Escena 04 puedes golpear el cuadro 3D de Omar.tsx como una piñata para liberar sus 16 skills!',
];

export default function MakerDeskPage() {
  const camState = useRef<CameraTimelineState>({
    posX: SCENES[0].cameraPosition[0],
    posY: SCENES[0].cameraPosition[1],
    posZ: SCENES[0].cameraPosition[2],
    lookX: SCENES[0].lookAt[0],
    lookY: SCENES[0].lookAt[1],
    lookZ: SCENES[0].lookAt[2],
    fov: SCENES[0].fov,
  });

  const [progress, setProgress] = useState(0);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<ProjectCaseStudy | null>(null);
  const [poroDialogue, setPoroDialogue] = useState(SCENES[0].poroDialogue);
  const [hudHidden, setHudHidden] = useState(false);
  const tipIndexRef = useRef(0);

  // Omar.tsx Wall Piñata State (starts with 2 skills popped on the wall so the user sees the halo effect immediately)
  const [unlockedSkillsCount, setUnlockedSkillsCount] = useState<number>(2);
  const [pinataHitTrigger, setPinataHitTrigger] = useState<number>(0);
  const [activeSkill, setActiveSkill] = useState<PinataSkill | null>(PINATA_SKILLS[1]);

  useEffect(() => {
    const tl = createCameraScrollTimeline(camState.current, '#scroll-stage', (prog, idx) => {
      setProgress(prog);
      setActiveSceneIndex(idx);
      setPoroDialogue(SCENES[idx]?.poroDialogue || SCENES[0].poroDialogue);
    });
    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const jumpToScene = useCallback((idx: number) => {
    const el = document.getElementById(`scene-0${idx}`);
    el?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handlePokePoro = useCallback(() => {
    const nextTip = PORO_TIPS[tipIndexRef.current % PORO_TIPS.length];
    tipIndexRef.current += 1;
    setPoroDialogue(nextTip);
  }, []);

  const handleHitPinata = useCallback(() => {
    setPinataHitTrigger((prev) => prev + 1);
    setUnlockedSkillsCount((prev) => {
      const nextCount = Math.min(PINATA_SKILLS.length, prev + 1);
      const newlyUnlocked = PINATA_SKILLS[nextCount - 1];
      if (newlyUnlocked) {
        setActiveSkill(newlyUnlocked);
        setPoroDialogue(
          `🎉 ¡PIÑATA HIT (${nextCount}/${PINATA_SKILLS.length})! Salió [${newlyUnlocked.name}]: ${newlyUnlocked.detail}`
        );
      }
      return nextCount;
    });
  }, []);

  const handleUnlockAllSkills = useCallback(() => {
    setPinataHitTrigger((prev) => prev + 1);
    setUnlockedSkillsCount(PINATA_SKILLS.length);
    setActiveSkill(PINATA_SKILLS[PINATA_SKILLS.length - 1]);
    setPoroDialogue(
      `💥 ¡PIÑATA ROTA AL 100%! Las ${PINATA_SKILLS.length} skills de Omar rodean su cuadro 3D en la pared.`
    );
  }, []);

  const handleResetPinata = useCallback(() => {
    setUnlockedSkillsCount(0);
    setActiveSkill(null);
    setPoroDialogue('↺ Piñata reiniciada. ¡Haz clic sobre Omar.tsx para que vuelvan a salir sus skills!');
  }, []);

  const activeScene = SCENES[activeSceneIndex] || SCENES[0];
  const alignRight = activeScene.hudAlign === 'right';

  return (
    <div className="relative bg-carbon text-paper min-h-screen select-none">
      {/* Fixed 3D WebGL Viewport */}
      <Scene
        camState={camState}
        activeSceneIndex={activeSceneIndex}
        unlockedSkillsCount={unlockedSkillsCount}
        pinataHitTrigger={pinataHitTrigger}
        activeSkillId={activeSkill?.id || null}
        onPokePoro={handlePokePoro}
        onHitPinata={handleHitPinata}
        onSelectSkill={(sk) => {
          setActiveSkill(sk);
          setPoroDialogue(`★ [${sk.name} — ${sk.category}]: ${sk.detail}`);
        }}
        onSelectStation={jumpToScene}
      />
      <div className="scanline-overlay" />

      {/* Top & Bottom Fixed Telemetry HUD */}
      <ProgressHUD
        progress={progress}
        activeSceneIndex={activeSceneIndex}
        poroDialogue={poroDialogue}
        hudHidden={hudHidden}
        onToggleHud={() => setHudHidden((prev) => !prev)}
        onJumpToScene={jumpToScene}
        onPokePoro={handlePokePoro}
      />

      {/* SAFE-ZONE VIEWPORT STAGE — Strictly bounded between Top Bar (68px) and Bottom Dock (78px) */}
      {!hudHidden && (
        <div className="hud-safe-stage fixed top-[68px] bottom-[78px] left-0 right-0 z-30 px-4 sm:px-6 pointer-events-none flex items-center">
          <div
            className={`max-w-[1600px] mx-auto w-full max-h-full overflow-y-auto py-2 flex ${
              alignRight ? 'justify-end' : 'justify-start'
            }`}
          >
            {activeSceneIndex === 0 && (
              <Intro
                onStart={() => jumpToScene(1)}
                onJumpToOmarWall={() => jumpToScene(4)}
              />
            )}
            {activeSceneIndex === 1 && <Hardware onSelect={setSelectedProject} />}
            {activeSceneIndex === 2 && <AIsoftware onSelect={setSelectedProject} />}
            {activeSceneIndex === 3 && <GamingQA onSelect={setSelectedProject} />}
            {activeSceneIndex === 4 && (
              <AboutMe
                unlockedCount={unlockedSkillsCount}
                hitTrigger={pinataHitTrigger}
                activeSkill={activeSkill}
                onHitPinata={handleHitPinata}
                onUnlockAllSkills={handleUnlockAllSkills}
                onResetPinata={handleResetPinata}
                onSelectSkill={(sk) => {
                  setActiveSkill(sk);
                  setPoroDialogue(`★ [${sk.name} — ${sk.category}]: ${sk.detail}`);
                }}
                onJumpToContact={() => jumpToScene(5)}
              />
            )}
            {activeSceneIndex === 5 && <Contact onViewProjects={() => jumpToScene(1)} />}
          </div>
        </div>
      )}

      {/* Invisible Scroll Trigger Waypoints that drive the smooth GSAP Camera Timeline */}
      <main id="scroll-stage" className="relative z-10 pointer-events-none">
        {SCENES.map((s) => (
          <section key={s.id} id={s.id} className="scene-waypoint" aria-label={s.title} />
        ))}
      </main>

      {/* Case Study Detail Modal */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}
