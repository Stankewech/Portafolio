'use client';

import { ProjectCaseStudy } from '@/data/projects';

interface FloatingCardProps {
  project: ProjectCaseStudy;
  onSelect: (project: ProjectCaseStudy) => void;
}

export default function FloatingCard({ project, onSelect }: FloatingCardProps) {
  const accentMap = {
    acid: {
      card: 'brutal-card',
      badge: 'bg-acid text-carbon border-carbon',
      text: 'text-acid',
      border: 'border-acid/40',
      btn: 'bg-acid text-carbon',
    },
    coral: {
      card: 'brutal-card-coral',
      badge: 'bg-coral text-paper border-carbon',
      text: 'text-coral',
      border: 'border-coral/40',
      btn: 'bg-coral text-paper',
    },
    violet: {
      card: 'brutal-card-violet',
      badge: 'bg-violet text-paper border-carbon',
      text: 'text-violet',
      border: 'border-violet/40',
      btn: 'bg-violet text-paper',
    },
    cyber: {
      card: 'brutal-card-yellow',
      badge: 'bg-cyber text-carbon border-carbon',
      text: 'text-cyber',
      border: 'border-cyber/40',
      btn: 'bg-cyber text-carbon',
    },
  }[project.accent];

  return (
    <article className={`${accentMap.card} cyber-corner p-4 flex flex-col justify-between`}>
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className={`font-pixel text-[8px] px-2 py-0.5 border font-bold ${accentMap.badge}`}>
            {project.code}
          </span>
          <span className="font-mono text-[11px] text-neutral-300 bg-white/5 px-2 py-0.5 border border-white/10">
            {project.period}
          </span>
        </div>

        <h3 className="font-display text-lg md:text-xl text-paper uppercase leading-tight tracking-tight">
          {project.title}
        </h3>
        <p className={`text-xs font-semibold mt-0.5 ${accentMap.text}`}>{project.subtitle}</p>
        <p className="text-xs text-neutral-300 mt-2 leading-relaxed">{project.description}</p>

        {/* Key Telemetry Metrics */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="grid grid-cols-3 gap-1.5 mt-3">
            {project.metrics.map((m) => (
              <div
                key={m.label}
                className={`bg-black/45 border ${accentMap.border} px-2 py-1.5 rounded-none`}
              >
                <span className="block font-mono text-[9px] text-neutral-400 uppercase leading-none">
                  {m.label}
                </span>
                <span className={`block font-mono text-[11px] font-bold mt-1 leading-tight ${accentMap.text}`}>
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 mt-3">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="text-[10px] font-mono bg-white/5 border border-white/15 px-2 py-0.5 text-neutral-200"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-3.5 pt-2.5 border-t border-white/10 flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] text-neutral-400 truncate">{project.role}</span>
        <button
          onClick={() => onSelect(project)}
          className={`brutal-btn ${accentMap.btn} text-[11px] px-3 py-1.5 shrink-0`}
        >
          Caso de Estudio +
        </button>
      </div>
    </article>
  );
}
