'use client';

import { ProjectCaseStudy } from '@/data/projects';

interface ProjectModalProps {
  project: ProjectCaseStudy | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-[#0E1017] border-2 border-paper shadow-[8px_8px_0px_#C4FF36] max-w-3xl w-full p-5 sm:p-7 max-h-[88vh] overflow-y-auto cyber-corner"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/15">
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[9px] bg-acid text-carbon px-2 py-0.5 font-bold">
              {project.code}
            </span>
            <span className="font-mono text-xs text-cyber">
              {project.period} // {project.role}
            </span>
          </div>
          <button
            onClick={onClose}
            className="brutal-btn bg-coral text-paper font-pixel text-[9px] px-3 py-1.5"
          >
            ✕ CERRAR [ESC]
          </button>
        </div>

        <h2 className="font-display text-2xl sm:text-3xl text-paper uppercase mt-4 tracking-tight">
          {project.title}
        </h2>
        <p className="text-sm font-semibold text-acid mt-0.5">{project.subtitle}</p>
        <p className="text-sm text-neutral-200 mt-3 leading-relaxed">{project.description}</p>

        {/* Key Telemetry Metrics */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-5">
            {project.metrics.map((m) => (
              <div key={m.label} className="bg-black/50 border border-acid/40 p-3">
                <span className="block font-mono text-[10px] text-neutral-400 uppercase">
                  {m.label}
                </span>
                <span className="block font-display text-base sm:text-lg text-acid mt-1">
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Interactive System Architecture Pipeline */}
        {project.architectureNodes && project.architectureNodes.length > 0 && (
          <div className="mt-5 bg-black/55 border border-white/15 p-4">
            <span className="font-pixel text-[8px] text-cyber uppercase block mb-3">
              ARQUITECTURA &amp; FLUJO DE VALIDACIÓN DEL SISTEMA
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 items-center">
              {project.architectureNodes.map((node, i) => (
                <div key={node} className="relative flex items-center">
                  <div className="w-full bg-[#151926] border border-acid/60 p-2.5 text-center">
                    <span className="font-pixel text-[7px] text-acid block mb-1">STAGE 0{i + 1}</span>
                    <span className="font-mono text-xs text-paper font-bold block leading-tight">
                      {node}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Problem / Solution / Results Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-5">
          <div className="bg-black/45 border-2 border-coral p-4">
            <h4 className="font-pixel text-[9px] text-coral mb-2">01 // PROBLEMA</h4>
            <p className="text-xs text-neutral-200 leading-relaxed">{project.problem}</p>
          </div>
          <div className="bg-black/45 border-2 border-acid p-4">
            <h4 className="font-pixel text-[9px] text-acid mb-2">02 // SOLUCIÓN TÉCNICA</h4>
            <p className="text-xs text-neutral-200 leading-relaxed">{project.solution}</p>
          </div>
          <div className="bg-black/45 border-2 border-cyber p-4">
            <h4 className="font-pixel text-[9px] text-cyber mb-2">03 // RESULTADOS</h4>
            <p className="text-xs text-neutral-200 leading-relaxed">{project.results}</p>
          </div>
        </div>

        {/* Stack Tags */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-5 pt-4 border-t border-white/15">
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.map((t) => (
              <span
                key={t}
                className="font-mono text-xs bg-white/5 border border-white/25 px-2.5 py-1 text-acid"
              >
                {t}
              </span>
            ))}
          </div>
          <button
            onClick={onClose}
            className="brutal-btn bg-acid text-carbon text-xs px-4 py-2"
          >
            Volver al Laboratorio 3D
          </button>
        </div>
      </div>
    </div>
  );
}
