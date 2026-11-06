'use client';

import FloatingCard from '@/components/FloatingCard';
import { PROJECTS, ProjectCaseStudy } from '@/data/projects';

export default function GamingQA({ onSelect }: { onSelect: (p: ProjectCaseStudy) => void }) {
  const items = PROJECTS.filter((p) => p.sceneIndex === 3);
  return (
    <div className="w-full max-w-2xl space-y-3 interactive-panel">
      <div className="brutal-card-yellow cyber-corner p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-pixel text-[8px] bg-cyber text-carbon px-2.5 py-1 border border-carbon font-bold">
            ESCENA 03 // 75% — ESTACIÓN GAMING &amp; QA
          </span>
          <span className="font-mono text-[11px] text-cyber">SELENIUM E2E · ANTI-TILT HUD</span>
        </div>
        <h2 className="font-display text-xl sm:text-2xl md:text-3xl text-paper uppercase mt-2 leading-none">
          GAMING &amp; <span className="text-cyber">QUALITY ASSURANCE</span>
        </h2>
        <p className="text-xs text-neutral-300 mt-1.5 leading-relaxed">
          Base magnética RGB, control inalámbrico y monitor holográfico: heurísticas de sesión para League
          of Legends Anti-Tilt y automatización de pruebas E2E con Selenium.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((proj) => (
          <FloatingCard key={proj.id} project={proj} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}
