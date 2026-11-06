'use client';

import { useEffect, useState } from 'react';
import {
  PINATA_SKILLS,
  TECHNICAL_CATEGORIES,
  TRAJECTORY_MILESTONES,
  PERSONAL_TASTES,
  WHY_HIRE_ME_PILLARS,
  PinataSkill,
} from '@/data/aboutData';
import { PERSONAL_LINKS } from '@/data/projects';
import { buildOmarDataUrl } from '@/components/Omar';

interface AboutMeProps {
  unlockedCount: number;
  hitTrigger: number;
  activeSkill: PinataSkill | null;
  onHitPinata: () => void;
  onUnlockAllSkills: () => void;
  onResetPinata: () => void;
  onSelectSkill: (skill: PinataSkill) => void;
  onJumpToContact: () => void;
}

type TabKey = 'all' | 'pinata' | 'this-is-me' | 'trajectory' | 'hire-me';

export default function AboutMe({
  unlockedCount,
  hitTrigger,
  activeSkill,
  onHitPinata,
  onUnlockAllSkills,
  onResetPinata,
  onSelectSkill,
  onJumpToContact,
}: AboutMeProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [selectedTasteId, setSelectedTasteId] = useState<string | null>(null);
  const [omarPortraitUrl, setOmarPortraitUrl] = useState<string>('');
  const [omarPokeUrl, setOmarPokeUrl] = useState<string>('');
  const [isPokingUi, setIsPokingUi] = useState(false);

  useEffect(() => {
    setOmarPortraitUrl(buildOmarDataUrl('#C4FF36', 'open', 'smirk', 6));
    setOmarPokeUrl(buildOmarDataUrl('#C4FF36', 'wide', 'open', 6));
  }, []);

  useEffect(() => {
    if (hitTrigger > 0) {
      setIsPokingUi(true);
      const timer = setTimeout(() => setIsPokingUi(false), 420);
      return () => clearTimeout(timer);
    }
  }, [hitTrigger]);

  const totalSkills = PINATA_SKILLS.length;
  const pctUnlocked = Math.round((unlockedCount / totalSkills) * 100);

  return (
    <div className="w-full max-w-2xl interactive-panel space-y-4 pb-4">
      {/* ================= STICKY SUB-NAVIGATION & PIÑATA CONTROLLER BAR ================= */}
      <div className="brutal-card cyber-corner p-3.5 sm:p-4 bg-[#0B0C10]/95">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[8px] bg-acid text-carbon px-2 py-0.5 border border-carbon font-bold">
              ESCENA 04 // MURO DE OMAR &amp; SKILLS
            </span>
            <span className="font-mono text-[11px] text-cyber font-bold">
              PIÑATA: {unlockedCount}/{totalSkills} SKILLS ({pctUnlocked}%)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onHitPinata}
              className="brutal-btn bg-acid text-carbon font-pixel text-[8px] px-2.5 py-1.5"
              title="Golpea el cuadro 3D de Omar.tsx para que salgan sus skills"
            >
              🎉 GOLPEAR OMAR.TSX (+SKILL)
            </button>
            {unlockedCount < totalSkills ? (
              <button
                onClick={onUnlockAllSkills}
                className="brutal-btn bg-coral text-paper font-mono text-[10px] px-2 py-1"
                title="Desbloquear las 16 skills alrededor del cuadro"
              >
                💥 Romper Todo
              </button>
            ) : (
              <button
                onClick={onResetPinata}
                className="brutal-btn bg-violet text-paper font-mono text-[10px] px-2 py-1"
              >
                ↺ Reiniciar
              </button>
            )}
          </div>
        </div>

        {/* Section Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/15">
          {[
            { id: 'all', label: '★ TODO EL PERFIL' },
            { id: 'pinata', label: '01. BIO & PIÑATA SKILLS' },
            { id: 'this-is-me', label: '02. THIS IS ME (GUSTOS)' },
            { id: 'trajectory', label: '03. TRAYECTORIA (IPN · SIC)' },
            { id: 'hire-me', label: '04. TECH & WHY HIRE ME' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as TabKey)}
              className={`px-2.5 py-1 font-mono text-[10px] font-bold border transition-all ${
                activeTab === t.id
                  ? 'bg-acid text-carbon border-carbon shadow-[2px_2px_0px_#FFFFFF]'
                  : 'bg-neutral-900/90 text-neutral-300 border-white/20 hover:border-acid hover:text-acid'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ================= BLOCK 1: "I AM OMAR S." + BIOGRAPHY + OMAR.TSX PIÑATA ================= */}
      {(activeTab === 'all' || activeTab === 'pinata') && (
        <section className="brutal-card cyber-corner p-5 sm:p-6 relative overflow-hidden">
          {/* Subtle diagonal geometric background lines inspired by reference image */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Left Column: Editorial "I am Omar S." + 3-Paragraph Bio */}
            <div className="md:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/15 px-2.5 py-1">
                <span className="w-2 h-2 bg-acid inline-block" />
                <span className="font-mono text-[10px] text-neutral-300 uppercase">
                  Omar Stankewech Marta Olvera · Ing. Telemática
                </span>
              </div>

              <div>
                <h2 className="font-sans text-3xl sm:text-4xl font-bold text-paper tracking-tight leading-none">
                  Yo soy
                </h2>
                <p
                  className="text-4xl sm:text-5xl text-acid leading-none mt-1"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic' }}
                >
                  Stanke.
                </p>
              </div>

              <div className="text-neutral-300 text-xs sm:text-sm space-y-2.5 leading-relaxed pt-1">
                <p>
                  Hola, como ya viste soy <strong className="text-paper">Omar Stankewech Marta Olvera</strong>,
                  egresado de <strong className="text-acid">Ingeniería en Telemática en la UPIITA - IPN</strong> con
                  un trasfondo único. Antes de ser ingeniero telemático, me
                  formé como <strong className="text-paper">Técnico en Sistemas Digitales en el CECyT 9 &ldquo;Juan de Dios Bátiz&rdquo;</strong>,
                  lo que me enseñó a resolver problemas desde el nivel de hardware y microcontroladores.
                </p>
                <p>
                  En mi etapa universitaria (promedio <strong className="text-cyber">8.78/10</strong>) y al certificarme
                  en <strong className="text-paper">IA y Liderazgo (150h) por Samsung Innovation Campus</strong>,
                  descubrí mi pasión por conectar mundos: evaluar redes neuronales <strong className="text-acid">Siamese CNN</strong>,
                  pronosticar tráfico <strong className="text-violet">5G PRB con XGBoost/LSTM</strong> y blindar sistemas
                  con <strong className="text-coral">QA Automation, FastAPI y PostgreSQL</strong>.
                </p>
                <p>
                  En mi tiempo libre probablemente me encontrarás entrenando fuerza en el gimnasio, compitiendo en
                  videojuegos o armando mazos estratégicos en Pokémon TCG. Abajo puedes conocer al Omar fuera del
                  laboratorio y golpear mi cuadro para descubrir todas mis skills. ↓
                </p>
              </div>
            </div>

            {/* Right Column: Interactive Framed Omar.tsx Piñata Card (Synced with 3D Wall) */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div
                onClick={onHitPinata}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') onHitPinata();
                }}
                className="w-full bg-[#090B10] border-2 border-acid p-4 shadow-[6px_6px_0px_#C4FF36] hover:shadow-[8px_8px_0px_#FFDA35] transition-all cursor-pointer flex flex-col items-center text-center group relative"
                title="¡Haz clic sobre Omar.tsx como piñata para liberar otra skill en la pared 3D!"
              >
                <div className="w-full flex items-center justify-between text-[9px] font-mono text-cyber mb-2 pb-1.5 border-b border-white/15">
                  <span>CUADRO INTERACTIVO</span>
                  <span className="bg-coral text-paper px-1.5 py-0.5 font-bold animate-pulse">
                    CLICK = PIÑATA!
                  </span>
                </div>

                {/* Pixel Art Representation from Omar.tsx */}
                <div
                  className={`relative my-2 transition-transform duration-200 ${
                    isPokingUi ? 'scale-110 -rotate-6' : 'group-hover:scale-105'
                  }`}
                >
                  {omarPortraitUrl && (
                    <img
                      src={isPokingUi ? omarPokeUrl : omarPortraitUrl}
                      alt="Representación Pixel Art de Omar (Omar.tsx)"
                      className="w-28 h-40 object-contain mx-auto select-none"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  )}
                </div>

                <span className="font-pixel text-[8px] text-acid mt-1 block">
                  OMAR.TSX // 16-BIT WALL MODEL
                </span>
                <span className="font-mono text-[10px] text-neutral-300 mt-1">
                  Haz clic aquí o en el <strong className="text-paper">cuadro 3D de la pared derecha →</strong>
                </span>

                {/* Progress Bar inside Frame */}
                <div className="w-full bg-neutral-900 border border-white/30 h-2.5 mt-3 overflow-hidden">
                  <div
                    className="h-full bg-acid transition-all duration-300"
                    style={{ width: `${pctUnlocked}%` }}
                  />
                </div>
                <span className="font-mono text-[10px] text-cyber font-bold mt-1.5">
                  {unlockedCount} de {totalSkills} Skills en la Pared
                </span>
              </div>
            </div>
          </div>

          {/* ================= PIÑATA SKILLS CLOUD AROUND OMAR ================= */}
          <div className="mt-5 pt-4 border-t border-white/15">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <span className="font-pixel text-[8px] text-cyber uppercase block">
                  SKILLS QUE HAN SALIDO DE LA PIÑATA ({unlockedCount}/{totalSkills})
                </span>
                <p className="text-xs text-neutral-300 mt-0.5">
                  Cada clic en <strong className="text-acid">Omar</strong> lanza una nueva skill alrededor del
                  cuadro en la pared 3D. Haz clic en cualquier skill para inspeccionar cómo la aplico:
                </p>
              </div>
            </div>

            {/* Active / Newly Popped Skill Detail Banner */}
            {activeSkill && (
              <div
                className="mb-3 p-3 bg-black/65 border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                style={{ borderColor: activeSkill.color }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="font-pixel text-[8px] px-2 py-0.5 text-carbon font-bold"
                      style={{ backgroundColor: activeSkill.color }}
                    >
                      {activeSkill.category}
                    </span>
                    <span className="font-display text-sm sm:text-base text-paper uppercase">
                      {activeSkill.name}
                    </span>
                    <span className="font-mono text-[10px] text-cyber">
                      [{activeSkill.level}]
                    </span>
                  </div>
                  <p className="text-xs text-neutral-200 mt-1">{activeSkill.detail}</p>
                </div>
                <span className="font-mono text-[10px] text-acid shrink-0">
                  ★ EN PARED 3D
                </span>
              </div>
            )}

            {/* 16 Skill Pills Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PINATA_SKILLS.map((sk, idx) => {
                const isUnlocked = idx < unlockedCount;
                const isSelected = activeSkill?.id === sk.id;
                return (
                  <button
                    key={sk.id}
                    onClick={() => (isUnlocked ? onSelectSkill(sk) : onHitPinata())}
                    className={`p-2 text-left border transition-all ${
                      isUnlocked
                        ? isSelected
                          ? 'bg-white/15 border-2 border-acid shadow-[2px_2px_0px_#C4FF36]'
                          : 'bg-black/55 border-white/25 hover:border-acid'
                        : 'bg-black/30 border-white/10 opacity-60 hover:opacity-100 hover:border-coral'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className="font-mono text-[9px] font-bold truncate"
                        style={{ color: isUnlocked ? sk.color : '#94A3B8' }}
                      >
                        #{String(idx + 1).padStart(2, '0')} {sk.category}
                      </span>
                      <span className="text-[9px] font-mono text-neutral-400">
                        {isUnlocked ? '✓' : '🔒'}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-paper font-bold block truncate mt-0.5">
                      {isUnlocked ? sk.name : 'Golpea a Omar...'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ================= BLOCK 2: "THIS IS ME" PERSONAL TASTES GALLERY ================= */}
      {(activeTab === 'all' || activeTab === 'this-is-me') && (
        <section className="brutal-card-violet cyber-corner p-5 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-2 mb-4">
            <div>
              <span className="font-pixel text-[8px] bg-violet text-paper px-2.5 py-1 border border-carbon font-bold">
                MÁS ALLÁ DEL CÓDIGO // GUSTOS PERSONALES
              </span>
              <h3 className="font-display text-2xl sm:text-3xl md:text-4xl text-paper uppercase tracking-tight mt-2 leading-none">
                THIS IS <span className="text-acid">ME</span>
              </h3>
            </div>
            <p className="font-mono text-[11px] text-neutral-300">
              Videojuegos · Programación · Gym · Electrónica · IA · TCG
            </p>
          </div>

          {/* 3x2 Portrait Gallery Grid inspired by Leon A. reference image */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {PERSONAL_TASTES.map((item) => {
              const isExpanded = selectedTasteId === item.id;
              return (
                <article
                  key={item.id}
                  onClick={() => setSelectedTasteId(isExpanded ? null : item.id)}
                  className="group cursor-pointer flex flex-col"
                >
                  <div
                    className="relative overflow-hidden border-2 border-white/80 bg-[#0D1018] shadow-[4px_4px_0px_#0B0C10] group-hover:border-acid transition-all"
                    style={{ aspectRatio: '3 / 4' }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className={`w-full h-full object-cover transition-all duration-500 ${
                        isExpanded
                          ? 'scale-105 blur-[2px] brightness-50'
                          : 'group-hover:scale-105 brightness-90 group-hover:brightness-75'
                      }`}
                    />

                    {/* Top Category Tag */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1">
                      <span
                        className="font-mono text-[9px] font-bold px-2 py-0.5 text-carbon border border-carbon"
                        style={{ backgroundColor: item.accent }}
                      >
                        {item.category}
                      </span>
                    </div>

                    {/* Bottom Frosted Overlay with Title & Description */}
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/95 via-black/80 to-transparent">
                      <h4 className="font-display text-sm text-paper uppercase leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-neutral-200 mt-1.5 leading-snug">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Editorial Caption Below Card ("Gamer Omar", "Athletic Omar", etc.) */}
                  <div className="mt-2 flex items-center justify-between px-0.5">
                    <span className="text-xs text-paper font-semibold">
                      {item.labelPrefix}{' '}
                      <em
                        className="text-neutral-400 font-normal"
                        style={{ fontFamily: 'Georgia, serif' }}
                      >
                        {item.labelName}
                      </em>
                    </span>
                    <span
                      className="font-mono text-[10px]"
                      style={{ color: item.accent }}
                    >
                      ● ACTIVO
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* ================= BLOCK 3: MI TRAYECTORIA (UPIITA · SAMSUNG SIC · CECyT 9) ================= */}
      {(activeTab === 'all' || activeTab === 'trajectory') && (
        <section className="brutal-card-coral cyber-corner p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <span className="font-pixel text-[8px] bg-coral text-paper px-2.5 py-1 border border-carbon font-bold">
                FORMACIÓN &amp; EVOLUCIÓN // IPN &amp; SAMSUNG SIC
              </span>
              <h3 className="font-display text-2xl sm:text-3xl text-paper uppercase mt-2 leading-none">
                MI <span className="text-cyber">TRAYECTORIA</span> ACADÉMICA Y TÉCNICA
              </h3>
            </div>
            <span className="font-mono text-xs text-acid font-bold">
              CECyT 9 → UPIITA → SAMSUNG SIC
            </span>
          </div>

          <div className="space-y-3.5">
            {TRAJECTORY_MILESTONES.map((m) => {
              const borderCol =
                m.accent === 'acid'
                  ? 'border-acid'
                  : m.accent === 'violet'
                  ? 'border-violet'
                  : 'border-coral';
              const badgeBg =
                m.accent === 'acid'
                  ? 'bg-acid text-carbon'
                  : m.accent === 'violet'
                  ? 'bg-violet text-paper'
                  : 'bg-coral text-paper';

              return (
                <div
                  key={m.id}
                  className={`bg-black/55 border-2 ${borderCol} p-4 transition-all`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <span className={`font-pixel text-[8px] px-2 py-0.5 font-bold ${badgeBg}`}>
                      {m.code}
                    </span>
                    <span className="font-mono text-xs text-cyber font-bold bg-white/5 px-2.5 py-0.5 border border-white/15">
                      {m.highlightBadge}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-baseline justify-between gap-2 mt-2">
                    <h4 className="font-display text-lg sm:text-xl text-paper uppercase">
                      {m.institution}
                    </h4>
                    <span className="font-mono text-xs text-neutral-400">{m.period}</span>
                  </div>
                  <p className="font-mono text-xs text-acid font-bold mt-0.5">{m.roleOrDegree}</p>
                  <p className="text-xs text-neutral-200 mt-2 leading-relaxed">{m.summary}</p>

                  <ul className="mt-2.5 space-y-1.5 text-xs text-neutral-300 list-disc list-inside">
                    {m.achievements.map((ach, i) => (
                      <li key={i} className="leading-snug">
                        {ach}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-1.5 mt-3 pt-2.5 border-t border-white/10">
                    {m.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] bg-white/5 border border-white/15 px-2 py-0.5 text-neutral-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ================= BLOCK 4: CONOCIMIENTOS TÉCNICOS & WHY YOU SHOULD HIRE ME ================= */}
      {(activeTab === 'all' || activeTab === 'hire-me') && (
        <section className="brutal-card-yellow cyber-corner p-5 sm:p-6 space-y-5">
          {/* Technical Knowledge Matrix */}
          <div>
            <span className="font-pixel text-[8px] bg-cyber text-carbon px-2.5 py-1 border border-carbon font-bold">
              STACK &amp; ARQUITECTURA // CONOCIMIENTOS TÉCNICOS
            </span>
            <h3 className="font-display text-2xl sm:text-3xl text-paper uppercase mt-2 leading-none">
              CONOCIMIENTOS <span className="text-acid">TÉCNICOS</span>
            </h3>
            <p className="text-xs text-neutral-300 mt-1">
              Competencias validadas en proyectos de laboratorio, pruebas de integración y certificaciones:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3.5">
              {TECHNICAL_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-black/55 border border-white/20 p-3.5 flex flex-col justify-between"
                >
                  <div>
                    <span
                      className="font-pixel text-[8px] block"
                      style={{ color: cat.accent }}
                    >
                      {cat.code}
                    </span>
                    <h4 className="font-display text-base text-paper uppercase mt-1">
                      {cat.title}
                    </h4>
                    <p className="text-[11px] text-neutral-300 mt-1 leading-snug">
                      {cat.description}
                    </p>
                  </div>
                  <ul className="mt-2.5 pt-2 border-t border-white/10 space-y-1">
                    {cat.items.map((it) => (
                      <li
                        key={it}
                        className="font-mono text-[11px] text-neutral-200 flex items-center gap-1.5"
                      >
                        <span style={{ color: cat.accent }}>▸</span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* WHY YOU SHOULD HIRE ME */}
          <div className="pt-4 border-t border-white/20">
            <div className="flex flex-wrap items-end justify-between gap-2 mb-3">
              <div>
                <span className="font-pixel text-[8px] bg-acid text-carbon px-2.5 py-1 border border-carbon font-bold">
                  PROPUESTA DE VALOR // DIFERENCIADORES
                </span>
                <h3 className="font-display text-2xl sm:text-3xl md:text-4xl text-paper uppercase mt-2 leading-none">
                  WHY YOU SHOULD{' '}
                  <span
                    className="text-cyber font-normal"
                    style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
                  >
                    HIRE ME
                  </span>
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {WHY_HIRE_ME_PILLARS.map((pillar) => (
                <div
                  key={pillar.id}
                  className="bg-[#0B0E17] border-2 border-white/80 p-4 shadow-[4px_4px_0px_#C4FF36] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-pixel text-[7px] text-acid">{pillar.code}</span>
                      <span className="font-mono text-[10px] bg-white/10 text-cyber px-2 py-0.5 font-bold">
                        {pillar.metric}
                      </span>
                    </div>
                    <h4 className="font-display text-base sm:text-lg text-paper uppercase leading-tight">
                      {pillar.title}
                    </h4>
                    <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/10 font-mono text-[10px] text-acid">
                    ✓ {pillar.proof}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Call to Action */}
            <div className="mt-4 bg-black/60 border border-acid/60 p-3.5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="font-display text-sm sm:text-base text-paper uppercase block">
                  ¿Listo para sumar a Omar a tu equipo de Ingeniería, QA o IA?
                </span>
                <span className="font-mono text-xs text-neutral-300">
                  Disponible para posiciones en CDMX / Estado de México / Remoto · Egreso Sept 2026
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={PERSONAL_LINKS.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brutal-btn bg-coral text-paper text-xs px-3.5 py-2"
                >
                  📄 Ver CV Oficial
                </a>
                <button
                  onClick={onJumpToContact}
                  className="brutal-btn bg-acid text-carbon text-xs px-3.5 py-2"
                >
                  ✉ Contactar Ahora →
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
