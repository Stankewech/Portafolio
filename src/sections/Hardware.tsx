'use client';

import FloatingCard from '@/components/FloatingCard';
import { PROJECTS, ProjectCaseStudy } from '@/data/projects';

export default function Hardware({ onSelect }: { onSelect: (p: ProjectCaseStudy) => void }) {
  const items = PROJECTS.filter((p) => p.sceneIndex === 1);
  return (
    <div className="w-full max-w-2xl space-y-3 interactive-panel">
      <div className="brutal-card-coral cyber-corner p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-pixel text-[8px] bg-coral text-paper px-2.5 py-1 border border-carbon font-bold">
            ESCENA 01 // 25% — ESTACIÓN DE HARDWARE
          </span>
          <span className="font-mono text-[11px] text-coral">STM32F446RE · NTAG213 · E-PAPER</span>
        </div>
        <h2 className="font-display text-xl sm:text-2xl md:text-3xl text-paper uppercase mt-2 leading-none">
          HARDWARE &amp; <span className="text-coral">TELEMATICS</span>
        </h2>
        <p className="text-xs text-neutral-300 mt-1.5 leading-relaxed">
          Inspección cercana de la protoboard: microcontrolador ARM Cortex-M4 STM32, cifrado AES-128 en
          etiquetas NFC NTAG213, pantalla E-Paper SPI y osciloscopio DSP.
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
