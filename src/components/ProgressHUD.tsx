'use client';

import { SCENES } from '@/data/scenes';
import { PERSONAL_LINKS } from '@/data/projects';

interface ProgressHUDProps {
  progress: number;
  activeSceneIndex: number;
  poroDialogue: string;
  hudHidden?: boolean;
  onToggleHud?: () => void;
  onJumpToScene: (index: number) => void;
  onPokePoro: () => void;
}

export default function ProgressHUD({
  progress,
  activeSceneIndex,
  poroDialogue,
  hudHidden = false,
  onToggleHud,
  onJumpToScene,
  onPokePoro,
}: ProgressHUDProps) {
  const activeScene = SCENES[activeSceneIndex] || SCENES[0];
  const pct = Math.round(progress * 100);

  return (
    <>
      {/* TOP TELEMETRY BAR */}
      <header className="hud-top-bar fixed top-0 left-0 right-0 z-40 px-3 sm:px-5 pt-2.5 pointer-events-none">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-2 bg-[#0B0C10]/90 backdrop-blur-md border-2 border-paper px-3 py-2 shadow-[4px_4px_0px_#C4FF36] interactive-panel">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-2.5 h-2.5 bg-acid animate-pulse shrink-0" />
            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="font-display text-xs sm:text-sm md:text-base text-paper tracking-tight leading-none">
                  STANKEECH
                </span>
                <span className="hidden sm:inline-block font-pixel text-[8px] bg-acid text-carbon px-1.5 py-0.5 font-bold">
                  v2.5
                </span>
              </div>
              <span className="font-mono text-[10px] text-neutral-400 block leading-none mt-0.5 truncate">
                OMAR STANKEWECH  Marta Olvera// ING. TELEMÁTICA (UPIITA - IPN)
              </span>
            </div>
          </div>

          <div className="hidden lg:flex flex-col items-center flex-1 max-w-md mx-4">
            <div className="w-full flex items-center justify-between text-[10px] font-mono mb-1">
              <span className="text-acid font-bold">
                {activeScene.code} // {activeScene.title}
              </span>
              <span className="text-cyber font-bold">{pct}% SCROLL</span>
            </div>
            <div className="w-full h-2 bg-neutral-900 border border-white/40 relative overflow-hidden">
              <div
                className="h-full transition-all duration-100"
                style={{
                  width: `${pct}%`,
                  backgroundColor: activeScene.accentColor,
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onToggleHud && (
              <button
                onClick={onToggleHud}
                className={`px-2.5 py-1.5 font-mono text-[11px] font-bold border transition-all ${
                  hudHidden
                    ? 'bg-acid text-carbon border-carbon shadow-[2px_2px_0px_#FFFFFF]'
                    : 'bg-neutral-900 text-paper border-white/40 hover:border-acid'
                }`}
                title="Alternar paneles para explorar el escritorio 3D libremente"
              >
                {hudHidden ? '👁 Mostrar Paneles' : '👁 Vista 3D Limpia'}
              </button>
            )}
            <a
              href={PERSONAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center px-2.5 py-1.5 font-mono text-[11px] font-bold bg-neutral-900 text-paper border border-white/40 hover:border-acid hover:text-acid transition-colors"
            >
              GitHub ↗
            </a>
            <a
              href={PERSONAL_LINKS.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-2.5 py-1.5 font-mono text-[11px] font-bold bg-coral text-paper border border-carbon shadow-[2px_2px_0px_#FFFFFF] hover:brightness-110 transition-all"
            >
              CV PDF
            </a>
          </div>
        </div>
      </header>

      {/* BOTTOM UNIFIED DOCK */}
      <footer className="hud-bottom-dock fixed bottom-0 left-0 right-0 z-40 px-3 sm:px-5 pb-2.5 pointer-events-none">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-stretch md:items-end justify-between gap-2">
          <aside className="interactive-panel bg-[#0B0C10]/92 backdrop-blur-md border-2 border-paper px-3 py-2 shadow-[4px_4px_0px_#FFDA35] max-w-xl flex items-center gap-3">
            <button
              onClick={onPokePoro}
              className="shrink-0 w-10 h-10 bg-cyber border-2 border-carbon flex flex-col items-center justify-center shadow-[2px_2px_0px_#FF5B42] hover:scale-105 active:scale-95 transition-transform"
              title="Haz clic para hablar con Poro el Teporingo"
            >
              <span className="text-sm leading-none">🐰</span>
              <span className="font-pixel text-[6px] text-carbon font-bold mt-0.5">PORO</span>
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-pixel text-[8px] text-cyber uppercase">
                  GUÍA VIRTUAL: PARIS EL PERRITO
                </span>
                <span className="font-mono text-[9px] text-acid hidden sm:inline">
                  [Clic para tip técnico]
                </span>
              </div>
              <p className="text-xs text-neutral-100 leading-snug line-clamp-2 mt-0.5">
                {poroDialogue}
              </p>
            </div>
          </aside>

          <nav
            aria-label="Selector de escenas 3D"
            className="interactive-panel bg-[#0B0C10]/92 backdrop-blur-md border-2 border-paper p-1.5 shadow-[4px_4px_0px_#C4FF36] flex items-center gap-1 overflow-x-auto"
          >
            {SCENES.map((s) => {
              const active = s.index === activeSceneIndex;
              return (
                <button
                  key={s.id}
                  onClick={() => onJumpToScene(s.index)}
                  className={`px-2.5 py-1.5 font-pixel text-[8px] sm:text-[9px] border transition-all whitespace-nowrap ${
                    active
                      ? 'bg-acid text-carbon border-carbon font-bold shadow-[2px_2px_0px_#FFFFFF]'
                      : 'bg-neutral-900/90 text-neutral-200 border-neutral-700 hover:border-acid hover:text-acid'
                  }`}
                >
                  {s.shortLabel}
                </button>
              );
            })}
          </nav>
        </div>
      </footer>
    </>
  );
}
