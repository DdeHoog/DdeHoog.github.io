import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';
import portfolioShot from '../assets/Portfolio.png';
import bitCrabBeat from '../assets/bitCrabBeat.png';
import feitengHome from '../assets/FeitengEU.jpg';
import feitengDownload from '../assets/FeitengDownload.jpg';

const projects = [
  {
    id: 'portfolio',
    title: 'This Portfolio',
    blurb: "The site you're on — one fullscreen 3D scene you explore by flying to planets.",
    description:
      "This portfolio is built as a single continuous WebGL scene rather than a set of pages: a statue floats in space surrounded by planets, and clicking one flies the camera in and opens a content card. The idea was for the portfolio to be an experience in itself — a bit of creative exploration that leans into the cosmic theme instead of another scrolling page.\n\nIt runs on React and Vite, with the 3D scene built on Three.js via react-three-fiber and drei, animated with Framer Motion, and styled with Tailwind CSS.\n\nThe interesting challenges were mostly about feel and performance: keeping a static 3D scene at near-zero idle cost with on-demand rendering, tuning the camera flights so they ease naturally rather than snapping, pinning the HTML cards to each planet's projected screen position every frame, and sizing card content to the card itself with CSS container queries instead of viewport breakpoints.",
    tech: ['React', 'Vite', 'Three.js', 'react-three-fiber', 'Framer Motion', 'Tailwind CSS'],
    image: portfolioShot,
    gradient: 'from-indigo-500 via-purple-500 to-fuchsia-600',
    links: { github: 'https://github.com/DdeHoog/DdeHoog.github.io' },
  },
  {
    id: 'bit-crab-beat',
    title: 'Bit Crab Beat',
    blurb: 'A rhythm game built with friends in a weekend game jam — my first Godot project.',
    description:
      "Bit Crab Beat is a rhythm game where you keep a little crab moving in time with the music. It was made by a small team of friends during BitJam, an itch.io game jam, and it was my first time building anything in Godot.\n\nAs programmer and designer I focused on the core beat system — a conductor that syncs gameplay events to the music track — along with input timing, obstacle spawning and player movement.\n\nWorking to a jam deadline meant scoping tightly, splitting work across the team, and getting a playable loop shipped fast. It's free to play in the browser on itch.io.",
    tech: ['Godot 4', 'GDScript', 'Game Jam'],
    image: bitCrabBeat,
    links: {
      demo: 'https://shironin.itch.io/bit-crab-beats',
      demoLabel: 'Play on itch.io',
      github: 'https://github.com/DdeHoog/bit-crab-beat',
    },
  },
  {
    id: 'feiteng',
    title: 'Feiteng EU — Client Portal',
    blurb: 'A full-stack portal where Feiteng EU customers log in to check stock and download manuals.',
    description:
      "Feiteng EU is a web application I build and maintain as solo full-stack developer for the client Feiteng. It gives their customers a secure login to check live stock and download product manuals and documentation.\n\nThe frontend is a React single-page app (React Router, Axios, Tailwind), and the backend is a Node/Express API with JWT-based authentication, rate limiting and Helmet for hardening, plus structured logging — all organised as an npm-workspaces monorepo.\n\nIt's live in production at feitengacp.eu.",
    tech: ['React', 'Node.js', 'Express', 'JWT Auth', 'Tailwind CSS'],
    image: feitengHome,
    images: [feitengDownload],
    links: { demo: 'https://www.feitengacp.eu', demoLabel: 'Visit site' },
  },
];

// Drag past this many px commits the gesture to a scroll instead of a click.
const DRAG_THRESHOLD_PX = 5;

const ProjectCard = ({ project, isFocused, onActivate, registerRef }) => {
  return (
    <button
      ref={registerRef}
      type="button"
      onClick={onActivate}
      aria-label={isFocused ? `Open details for ${project.title}` : `Bring ${project.title} to center`}
      className={`
        shrink-0 snap-center
        w-[55cqi] max-w-[500px] min-w-[180px] h-full
        rounded-xl border overflow-hidden
        flex flex-col text-left
        bg-black/40
        transition-[transform,opacity,border-color,box-shadow] duration-200
        ${isFocused
          ? 'border-white opacity-100 scale-100 shadow-[0_0_20px_rgba(255,255,255,0.15)]'
          : 'border-white/30 opacity-70 scale-[0.94]'}
      `}
    >
      <div className="relative w-full h-[55%] shrink-0 overflow-hidden bg-black/40">
        {project.image ? (
          // draggable=false so dragging the image doesn't fight drag-to-scroll.
          <img src={project.image} alt={project.title} draggable={false} className="w-full h-full object-contain" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${project.gradient}`} />
        )}
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

// Portaled to document.body: a `position: fixed` child is positioned relative
// to the card's animating transform (and clipped by its overflow) otherwise.
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
        className="@container relative w-[min(900px,95vw)] h-[min(640px,90vh)] text-white bg-black/85 border border-white rounded-xl overflow-hidden flex flex-col"
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
        <div className="shrink-0 w-full h-[40%] overflow-hidden bg-black flex items-center justify-center">
          {project.image ? (
            <img src={project.image} alt={project.title} className="w-full h-full object-contain" />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${project.gradient}`} />
          )}
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-2">
          <h2 id="project-detail-title" className="ftext-2xl font-display font-bold tracking-wide">
            {project.title}
          </h2>
          {project.description.split('\n\n').map((para, i) => (
            <p key={i} className="ftext-base text-white/85">{para}</p>
          ))}
          <div className="flex flex-wrap gap-1">
            {project.tech.map((t) => (
              <span key={t} className="ftext-xs px-2 py-0.5 rounded-full bg-white/10 border border-white/20">
                {t}
              </span>
            ))}
          </div>
          {project.images?.length > 0 && (
            <div className="flex flex-col gap-2 mt-1">
              {project.images.map((src, i) => (
                <img key={i} src={src} alt={`${project.title} screenshot ${i + 1}`} className="w-full rounded-lg border border-white/15" />
              ))}
            </div>
          )}
          <div className="mt-2 flex gap-3 ftext-sm">
            {project.links?.demo && (
              <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-300 transition-colors">
                <FaExternalLinkAlt /> {project.links.demoLabel || 'Live demo'}
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

const Portfolio = () => {
  const [focusedIdx, setFocusedIdx] = useState(0);
  const [expandedId, setExpandedId] = useState(null);

  const scrollRef = useRef(null);
  const itemRefs = useRef([]);
  const rafId = useRef(null);

  // Mirror so the once-attached wheel handler reads the live index.
  const focusedIdxRef = useRef(0);
  const wheelAccum = useRef(0);
  const lastWheelTs = useRef(0);

  const dragState = useRef({ active: false, captured: false, moved: false, startX: 0, startScrollLeft: 0, pointerId: null });

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

  useEffect(() => {
    scrollToIdx(0, 'auto');
    requestAnimationFrame(updateFocused);
  }, [scrollToIdx, updateFocused]);

  useEffect(() => () => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
  }, []);

  useEffect(() => { focusedIdxRef.current = focusedIdx; }, [focusedIdx]);

  // Vertical wheel drives horizontal movement, one card per notch. Native
  // non-passive listener because React's onWheel is passive (preventDefault
  // would no-op). Delta accumulates and resets after a gap so a trackpad's
  // many small deltas read as one gesture.
  useEffect(() => {
    const c = scrollRef.current;
    if (!c) return;
    const STEP = 90;
    const GESTURE_GAP = 200;
    const onWheelNative = (e) => {
      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (!delta) return;
      e.preventDefault();
      const now = performance.now();
      if (now - lastWheelTs.current > GESTURE_GAP) wheelAccum.current = 0;
      lastWheelTs.current = now;
      wheelAccum.current += delta;
      let idx = focusedIdxRef.current;
      while (wheelAccum.current >= STEP && idx < projects.length - 1) { idx++; wheelAccum.current -= STEP; }
      while (wheelAccum.current <= -STEP && idx > 0) { idx--; wheelAccum.current += STEP; }
      if (idx !== focusedIdxRef.current) scrollToIdx(idx);
    };
    c.addEventListener('wheel', onWheelNative, { passive: false });
    return () => c.removeEventListener('wheel', onWheelNative);
  }, [scrollToIdx]);

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

  // Mouse drag-to-scroll; touch/trackpad stay native. Commit only past the
  // threshold, then capture so the drag survives leaving the carousel.
  // Never stopPropagation pointer events here — see the CardOverlay gotcha.
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
  };

  // Clicking a side card centers it; only the centered card opens. A drag's
  // trailing click is gated out via dragState.moved.
  const handleActivate = (idx, id) => {
    if (dragState.current.moved) {
      dragState.current.moved = false;
      return;
    }
    if (idx !== focusedIdx) {
      scrollToIdx(idx);
      return;
    }
    setExpandedId(id);
  };

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
            onActivate={() => handleActivate(idx, p.id)}
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
