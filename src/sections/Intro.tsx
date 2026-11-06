'use client';

interface IntroProps {
  onStart: () => void;
  onJumpToOmarWall: () => void;
}

export default function Intro({ onStart, onJumpToOmarWall }: IntroProps) {
  return (
    <div className="w-full max-w-xl interactive-panel brutal-card cyber-corner p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="bg-acid text-carbon font-pixel text-[8px] px-2.5 py-1 border border-carbon font-bold">
            ESCENA 00 // 0%
          </span>
          <span className="bg-violet text-paper font-pixel text-[8px] px-2.5 py-1">
            CYBER-LAB OVERVIEW
          </span>
        </div>
        <span className="font-mono text-[11px] text-acid">UPIITA - IPN · MÉXICO</span>
      </div>

      <p className="font-pixel text-[9px] text-cyber tracking-widest uppercase mb-1.5">
        THINK. BUILD. EXPERIMENT.
      </p>
      <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-paper uppercase leading-none mb-2.5">
        BIENVENIDO A MI{' '}
        <span className="text-acid underline decoration-coral decoration-4">PORTAFOLIO</span>
      </h1>
      <p className="font-display text-base sm:text-lg text-coral mb-3">
        &ldquo;Ideas en acción.&rdquo;
      </p>
      <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed mb-4">
        Soy <strong className="text-acid">Omar Stankewech Marta Olvera</strong>, egresado de{' '}
        <strong className="text-paper">Ingeniería en Telemática</strong> en{' '}
        <strong className="text-paper">UPIITA - IPN</strong>, certificado en IA y Liderazgo por{' '}
        <strong className="text-paper">Samsung Innovation Campus</strong> y Técnico en Sistemas Digitales
        (CECyT 9). Explora mis estaciones de proyectos o visita mi{' '}
        <strong className="text-cyber">Muro de Skills</strong>.
      </p>

      {/* Quick Station Telemetry Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <div className="bg-black/45 border border-coral/50 p-2">
          <span className="font-pixel text-[7px] text-coral block">ESTACIÓN 01</span>
          <span className="font-mono text-xs text-paper font-bold">STM32 &amp; NFC</span>
        </div>
        <div className="bg-black/45 border border-acid/50 p-2">
          <span className="font-pixel text-[7px] text-acid block">ESTACIÓN 02</span>
          <span className="font-mono text-xs text-paper font-bold">CNN &amp; 5G AI</span>
        </div>
        <div className="bg-black/45 border border-cyber/50 p-2">
          <span className="font-pixel text-[7px] text-cyber block">ESTACIÓN 03</span>
          <span className="font-mono text-xs text-paper font-bold">QA &amp; Gaming</span>
        </div>
        <button
          onClick={onJumpToOmarWall}
          className="bg-acid/15 border border-acid p-2 text-left hover:bg-acid/25 transition-colors"
        >
          <span className="font-pixel text-[7px] text-acid block">ESTACIÓN 04</span>
          <span className="font-mono text-xs text-paper font-bold">Muro de Skills</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={onStart}
          className="brutal-btn bg-acid text-carbon text-xs sm:text-sm px-4 py-2.5"
        >
          Iniciar Recorrido 3D ↓
        </button>
        <button
          onClick={onJumpToOmarWall}
          className="brutal-btn bg-coral text-paper text-xs sm:text-sm px-4 py-2.5"
        >
          🎉 Muro de Omar &amp; Piñata (Omar.tsx)
        </button>
      </div>
    </div>
  );
}
