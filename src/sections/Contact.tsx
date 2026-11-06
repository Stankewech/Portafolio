'use client';

import { PERSONAL_LINKS } from '@/data/projects';

export default function Contact({ onViewProjects }: { onViewProjects: () => void }) {
  return (
    <div className="w-full max-w-xl interactive-panel brutal-card cyber-corner p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <span className="font-pixel text-[8px] bg-acid text-carbon px-2.5 py-1 border border-carbon font-bold">
          ESCENA 05 // 100% — CONTACTO DIRECTO
        </span>
        <span className="font-mono text-[11px] text-cyber">{PERSONAL_LINKS.phone}</span>
      </div>

      <p className="font-pixel text-[10px] text-acid mt-2">THINK. BUILD. EXPERIMENT.</p>
      <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-paper uppercase leading-none mt-1 mb-2.5">
        Let&apos;s build something <span className="text-coral">together.</span>
      </h2>
      <p className="text-xs sm:text-sm text-neutral-300 mb-4 leading-relaxed">
        Disponible para colaborar en proyectos y oportunidades de <strong className="text-paper">QA &amp; Test Automation</strong>,{' '}
        <strong className="text-paper">Desarrollo de Software</strong>, <strong className="text-paper">Inteligencia Artificial</strong>,{' '}
        <strong className="text-paper">Redes 5G</strong> y <strong className="text-paper">Sistemas Embebidos</strong>.
      </p>

      {/* Direct Contact Info Box */}
      <div className="bg-black/50 border border-white/15 p-3 mb-4 space-y-1 font-mono text-xs">
        <div className="flex items-center justify-between gap-2">
          <span className="text-neutral-400">EMAIL PERSONAL:</span>
          <a href={`mailto:${PERSONAL_LINKS.emailPrimary}`} className="text-acid hover:underline truncate">
            {PERSONAL_LINKS.emailPrimary}
          </a>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-neutral-400">EMAIL IPN:</span>
          <a href={`mailto:${PERSONAL_LINKS.emailInstitutional}`} className="text-cyber hover:underline truncate">
            {PERSONAL_LINKS.emailInstitutional}
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <a
          href={`mailto:${PERSONAL_LINKS.emailPrimary}`}
          className="brutal-btn bg-acid text-carbon text-xs px-4 py-2.5 text-center"
        >
          ✉ Enviar Correo
        </a>
        <a
          href={PERSONAL_LINKS.cvUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="brutal-btn bg-coral text-paper text-xs px-4 py-2.5 text-center"
        >
          📄 Descargar CV (PDF)
        </a>
        <button
          onClick={onViewProjects}
          className="brutal-btn bg-cyber text-carbon text-xs px-4 py-2.5 text-center"
        >
          🗂 Explorar Estaciones
        </button>
        <div className="grid grid-cols-2 gap-2">
          <a
            href={PERSONAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="brutal-btn bg-violet text-paper text-xs px-3 py-2.5 text-center"
          >
            LinkedIn ↗
          </a>
          <a
            href={PERSONAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="brutal-btn bg-paper text-carbon text-xs px-3 py-2.5 text-center"
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </div>
  );
}
