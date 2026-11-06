'use client';

import FloatingCard from '@/components/FloatingCard';
import { PROJECTS, ProjectCaseStudy } from '@/data/projects';

export default function AIsoftware({ onSelect }: { onSelect: (p: ProjectCaseStudy) => void }) {
  const items = PROJECTS.filter((p) => p.sceneIndex === 2);
  return (
    <div className="w-full max-w-2xl space-y-3 interactive-panel">
      <div className="brutal-card-violet cyber-corner p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-pixel text-[8px] bg-violet text-paper px-2.5 py-1 border border-carbon font-bold">
            ESCENA 02 // 50% — WORKSTATION IA &amp; REDES
          </span>
          <span className="font-mono text-[11px] text-acid">TENSORFLOW · FASTAPI · 5G PRB</span>
        </div>
        <h2 className="font-display text-xl sm:text-2xl md:text-3xl text-paper uppercase mt-2 leading-none">
          AI &amp; <span className="text-acid">SOFTWARE ENGINEERING</span>
        </h2>
        <p className="text-xs text-neutral-300 mt-1.5 leading-relaxed">
          Monitores principales y laptop Dell G15: evaluación neuronal de trazos en tiempo real con
          TRAZITOS (Siamese CNN + FastAPI + PostgreSQL y predicción de tráfico 5G (XGBoost / LSTM).
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
