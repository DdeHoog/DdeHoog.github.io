import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';

// ── Placeholder projects ─────────────────────────────────────────────────────
// Drop real data in here. Shape:
//   id        — stable key
//   title     — short headline
//   blurb     — one-liner shown on the carousel card
//   description — longer body shown in the expanded modal
//   tech      — array of short tag strings
//   gradient  — Tailwind gradient classes for the placeholder hero swatch
//               (delete and replace with `image: importedImage` when you wire
//               real screenshots — and then render <img src={project.image}>
//               in place of the gradient div)
//   links     — optional { demo, github } URLs
const projects = [
  {
    id: 'p1',
    title: 'Project Alpha',
    blurb: 'Short one-liner describing what this project does.',
    description:
      'Longer description placeholder. Covers what the project is, what problem it solves, the technical approach, and any noteworthy outcomes. This is what shows up in the expanded modal.',
    tech: ['React', 'TypeScript', 'Tailwind'],
    gradient: 'from-blue-500 via-indigo-500 to-purple-600',
    links: { demo: '#', github: '#' },
  },
  {
    id: 'p2',
    title: 'Project Beta',
    blurb: 'Another one-liner about another placeholder project.',
    description: 'Longer description placeholder. Replace with real project details.',
    tech: ['Python', 'FastAPI', 'PostgreSQL'],
    gradient: 'from-orange-400 via-rose-500 to-red-600',
    links: { demo: '#', github: '#' },
  },
  {
    id: 'p3',
    title: 'Project Gamma',
    blurb: 'Yet another placeholder blurb to fill the carousel.',
    description: 'Longer description placeholder. Replace with real project details.',
    tech: ['Three.js', 'WebGL', 'GLSL'],
    gradient: 'from-pink-400 via-fuchsia-500 to-purple-600',
    links: { demo: '#', github: '#' },
  },
  {
    id: 'p4',
    title: 'Project Delta',
    blurb: 'And another, so the carousel has room to scroll.',
    description: 'Longer description placeholder. Replace with real project details.',
    tech: ['Go', 'Docker', 'Kubernetes'],
    gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
    links: { demo: '#', github: '#' },
  },
  {
    id: 'p5',
    title: 'Project Epsilon',
    blurb: 'Last placeholder for the skeleton.',
    description: 'Longer description placeholder. Replace with real project details.',
    tech: ['Rust', 'WebAssembly'],
    gradient: 'from-amber-300 via-yellow-500 to-orange-500',
    links: { demo: '#', github: '#' },
  },
];

// Drag-distance threshold (px) above which a pointer gesture is committed to
// a drag-to-scroll instead of a tap/click on a card.
const DRAG_THRESHOLD_PX = 5;

// ── One carousel card ────────────────────────────────────────────────────────
const ProjectCard = ({ project, isFocused, onActivate, registerRef }) => {
  return (
    <button
      ref={registerRef}
      type="button"
      onClick={onActivate}
      aria-label={`Open details for ${project.title}`}
      className={`
        shrink-0 snap-center
        w-[55cqi] max-w-[420px] min-w-[180px] h-full
        rounded-xl border overflow-hidden
        flex flex-col text-left
        bg-black/40
        transition-[transform,opacity,border-color,box-shadow] duration-200
        ${isFocused
          ? 'border-white opacity-100 scale-100 shadow-[0_0_20px_rgba(255,255,255,0.15)]'
          : 'border-white/30 opacity-70 scale-[0.94]'}
      `}
    >
      {/* Placeholder hero — gradient swatch (replace with <img> when you have screenshots) */}
      <div className={`relative w-full h-[55%] shrink-0 bg-gradient-to-br ${project.gradient} flex items-center justify-center`}>
        <span className="ftext-base font-display tracking-wide text-white/70 px-2 text-center">
          (placeholder image)
        </span>
      </div>
      {/* Text */}
      <div className="flex-1 min-h-0 p-2 flex flex-col gap-1 overflow-hidden">
        <h3 className="ftext-lg font-display font-bold tracking-wide truncate">
          {project.title}
        </h3>
        <p className="ftext-sm text-white/80 line-clamp-2">
          {project.blurb}
        </p>
        <div className="mt-auto flex flex-wrap gap-1">
          {project.tech.map((t) => (
            <span key={t} className="ftext-xs px-1.5 py-0.5 rounded-full bg-white/10 border border-white/20">
              {t}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
};

// ── Expanded detail modal ────────────────────────────────────────────────────
// Portaled to document.body so it escapes the card's transform/clip context
// (motion.div has a non-identity transform during animation, which would
// otherwise make `position: fixed` children relative to the card and clipped
// by its `overflow-hidden`).
const DetailModal = ({ project, onClose }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-detail-title"
    >
      <div
        className="@container relative w-[min(900px,95vw)] h-[min(640px,90vh)] bg-black/85 border border-white rounded-xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-2 right-3 text-white text-2xl leading-none hover:text-red-500 z-10"
        >
          ×
        </button>
        <div className={`shrink-0 w-full h-[40%] bg-gradient-to-br ${project.gradient} flex items-center justify-center`}>
          <span className="ftext-lg font-display tracking-wide text-white/70">
            (placeholder image)
          </span>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-2">
          <h2 id="project-detail-title" className="ftext-2xl font-display font-bold tracking-wide">
            {project.title}
          </h2>
          <p className="ftext-base text-white/85">{project.description}</p>
          <div className="flex flex-wrap gap-1">
            {project.tech.map((t) => (
              <span key={t} className="ftext-xs px-2 py-0.5 rounded-full bg-white/10 border border-white/20">
                {t}
              </span>
            ))}
          </div>
          <div className="mt-2 flex gap-3 ftext-sm">
            {project.links?.demo && (
              <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-300 transition-colors">
                <FaExternalLinkAlt /> Live demo
              </a>
            )}
            {project.links?.github && (
              <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-300 transition-colors">
                <FaGithub /> GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

// ── Carousel ─────────────────────────────────────────────────────────────────
const Portfolio = () => {
  const [focusedIdx, setFocusedIdx] = useState(0);
  const [expandedId, setExpandedId] = useState(null);

  const scrollRef = useRef(null);
  const itemRefs = useRef([]);
  const rafId = useRef(null);

  // Pointer-drag state. `moved` is read by the click gate so a drag-released
  // pointer doesn't also trigger the card's onClick.
  const dragState = useRef({ active: false, captured: false, moved: false, startX: 0, startScrollLeft: 0, pointerId: null });

  // Centered item = scrollLeft-nearest. Cheap; runs in a rAF on scroll.
  const updateFocused = useCallback(() => {
    const c = scrollRef.current;
    if (!c) return;
    const center = c.scrollLeft + c.clientWidth / 2;
    let bestIdx = 0;
    let bestDist = Infinity;
    itemRefs.current.forEach((el, idx) => {
      if (!el) return;
      const dist = Math.abs(el.offsetLeft + el.offsetWidth / 2 - center);
      if (dist < bestDist) { bestDist = dist; bestIdx = idx; }
    });
    setFocusedIdx(bestIdx);
  }, []);

  const onScroll = useCallback(() => {
    if (rafId.current != null) return;
    rafId.current = requestAnimationFrame(() => {
      rafId.current = null;
      updateFocused();
    });
  }, [updateFocused]);

  const scrollToIdx = useCallback((idx, behavior = 'smooth') => {
    const el = itemRefs.current[idx];
    if (!el) return;
    el.scrollIntoView({ behavior, inline: 'center', block: 'nearest' });
  }, []);

  // Center the first card on mount; paint the initial focused state.
  useEffect(() => {
    scrollToIdx(0, 'auto');
    requestAnimationFrame(updateFocused);
  }, [scrollToIdx, updateFocused]);

  useEffect(() => () => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
  }, []);

  // Keyboard: arrows / home / end navigate; Enter opens the focused card.
  // Modal handles its own Escape.
  const onKeyDown = (e) => {
    if (expandedId) return;
    let next = focusedIdx;
    switch (e.key) {
      case 'ArrowRight': next = Math.min(projects.length - 1, focusedIdx + 1); break;
      case 'ArrowLeft':  next = Math.max(0, focusedIdx - 1); break;
      case 'Home':       next = 0; break;
      case 'End':        next = projects.length - 1; break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        setExpandedId(projects[focusedIdx].id);
        return;
      default: return;
    }
    e.preventDefault();
    if (next !== focusedIdx) scrollToIdx(next);
  };

  // Mouse drag-to-scroll. Touch is left to native (scroll-snap handles it);
  // wheel/trackpad horizontal scrolling is also native.
  // We commit to a drag only after exceeding DRAG_THRESHOLD_PX, then take
  // pointer capture so the gesture survives the pointer leaving the carousel.
  // NEVER call e.stopPropagation() on pointerdown/up — OrbitControls listens
  // for pointerup on `document` and a swallowed release leaves the camera
  // stuck mid-rotate (see CardOverlay.jsx comment).
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse') return;
    if (e.button !== 0) return;
    dragState.current = {
      active: true,
      captured: false,
      moved: false,
      startX: e.clientX,
      startScrollLeft: scrollRef.current.scrollLeft,
      pointerId: e.pointerId,
    };
  };

  const onPointerMove = (e) => {
    const d = dragState.current;
    if (!d.active) return;
    const dx = e.clientX - d.startX;
    if (!d.captured && Math.abs(dx) > DRAG_THRESHOLD_PX) {
      d.captured = true;
      d.moved = true;
      try { scrollRef.current.setPointerCapture(e.pointerId); } catch { /* noop */ }
    }
    if (d.captured) {
      scrollRef.current.scrollLeft = d.startScrollLeft - dx;
    }
  };

  const onPointerUp = (e) => {
    const d = dragState.current;
    if (!d.active) return;
    d.active = false;
    if (d.captured) {
      try { scrollRef.current.releasePointerCapture(e.pointerId); } catch { /* noop */ }
    }
    // d.moved stays true until the next click is gated; reset in handleActivate.
  };

  // Click on a card should NOT open the modal if the click was the tail of a
  // drag-to-scroll. The pointer-capture path normally redirects the click off
  // the button anyway, but this is a belt-and-suspenders gate.
  const handleActivate = (id) => {
    if (dragState.current.moved) {
      dragState.current.moved = false;
      return;
    }
    setExpandedId(id);
  };

  // Keep visual + DOM focus in sync when tabbing through cards.
  const onCardFocus = (idx) => {
    scrollToIdx(idx);
  };

  const expanded = expandedId ? projects.find((p) => p.id === expandedId) : null;

  return (
    <div id="portfolio" className="w-full h-full flex flex-col text-white">
      <div
        ref={scrollRef}
        tabIndex={-1}
        role="region"
        aria-roledescription="carousel"
        aria-label="Projects"
        onScroll={onScroll}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="
          flex-1 min-h-0 w-full
          flex items-stretch gap-3
          overflow-x-auto overflow-y-hidden
          snap-x snap-mandatory
          outline-none touch-pan-x
          [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
        "
        // 50% inline padding so the first and last cards can snap-center.
        style={{ paddingInline: '50%' }}
      >
        {projects.map((p, idx) => (
          <ProjectCard
            key={p.id}
            project={p}
            isFocused={idx === focusedIdx}
            onActivate={() => handleActivate(p.id)}
            registerRef={(el) => {
              itemRefs.current[idx] = el;
              if (el) el.onfocus = () => onCardFocus(idx);
            }}
          />
        ))}
      </div>

      {/* Pagination dots */}
      <div className="shrink-0 flex justify-center gap-1.5 py-1.5">
        {projects.map((p, idx) => (
          <button
            key={p.id}
            type="button"
            onClick={() => scrollToIdx(idx)}
            aria-label={`Go to ${p.title}`}
            className={`
              w-2 h-2 rounded-full transition-colors
              ${idx === focusedIdx ? 'bg-white' : 'bg-white/30 hover:bg-white/60'}
            `}
          />
        ))}
      </div>

      {expanded && (
        <DetailModal project={expanded} onClose={() => setExpandedId(null)} />
      )}
    </div>
  );
};

export default Portfolio;
