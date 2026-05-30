import { useEffect, useRef, useCallback } from 'react';

// iOS-style vertical wheel picker. Center items face forward; edge items curve
// back (rotateX + scale + opacity). Wheel input is intercepted into a smooth
// glide that snaps to the nearest item on settle; touch/keyboard use native
// scroll + the same snap.
const WheelPicker = ({
  items,
  selectedId,
  onSelect,
  itemHeight = 36,
  maxRotate = 50,
  maxScale = 0.18,
  wheelSpeed = 0.3,
  className = '',
}) => {
  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const rafId = useRef(null);        // throttles updateTransforms on native scroll
  const snapTimer = useRef(null);    // fires after scrolling stops → snap + select
  const targetScroll = useRef(null); // smooth-scroll target (free, unsnapped)
  const rafScroll = useRef(null);    // smooth-scroll animation handle
  const lastWheelTs = useRef(0);

  const updateTransforms = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const halfHeight = rect.height / 2;

    itemRefs.current.forEach((el) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const itemCenter = r.top + r.height / 2;
      const offset = itemCenter - center;
      const ratio = Math.max(-1, Math.min(1, offset / halfHeight));

      const rotate = -ratio * maxRotate; // positive rotateX tilts top away
      const scale = 1 - maxScale * Math.abs(ratio);
      const opacity = 1 - 0.5 * Math.abs(ratio);

      el.style.transform = `rotateX(${rotate}deg) scale(${scale})`;
      el.style.opacity = String(opacity);
    });
  }, [maxRotate, maxScale]);

  // Layout makes scrollTop = i*itemHeight center item i, so round() gives the index.
  const centeredIndex = useCallback(() => {
    const container = containerRef.current;
    if (!container) return 0;
    return Math.max(
      0,
      Math.min(items.length - 1, Math.round(container.scrollTop / itemHeight)),
    );
  }, [items.length, itemHeight]);

  const animateScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container || targetScroll.current == null) {
      rafScroll.current = null;
      return;
    }
    const cur = container.scrollTop;
    const diff = targetScroll.current - cur;
    if (Math.abs(diff) < 0.5) {
      container.scrollTop = targetScroll.current;
      updateTransforms();
      rafScroll.current = null;
      return;
    }
    container.scrollTop = cur + diff * 0.18;
    updateTransforms();
    rafScroll.current = requestAnimationFrame(animateScroll);
  }, [updateTransforms]);

  const scrollToId = useCallback((id, behavior = 'smooth') => {
    const idx = items.findIndex((i) => i.id === id);
    if (idx < 0) return;
    const el = itemRefs.current[idx];
    const container = containerRef.current;
    if (!el || !container) return;
    el.scrollIntoView({ block: 'center', behavior });
  }, [items]);

  const handleScroll = useCallback(() => {
    if (rafId.current == null) {
      rafId.current = requestAnimationFrame(() => {
        rafId.current = null;
        updateTransforms();
      });
    }

    // On settle, snap to the nearest item and select it.
    if (snapTimer.current) clearTimeout(snapTimer.current);
    snapTimer.current = setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;
      const idx = centeredIndex();
      const dest = idx * itemHeight;
      if (Math.abs(dest - container.scrollTop) > 0.5) {
        targetScroll.current = dest;
        if (rafScroll.current == null) {
          rafScroll.current = requestAnimationFrame(animateScroll);
        }
      }
      const id = items[idx]?.id;
      if (id != null && id !== selectedId) onSelect(id);
    }, 120);
  }, [updateTransforms, centeredIndex, itemHeight, items, selectedId, onSelect, animateScroll]);

  // Non-passive wheel → smooth glide (React's onWheel is passive).
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e) => {
      e.preventDefault();
      const now = performance.now();
      const maxScroll = container.scrollHeight - container.clientHeight;
      // Fresh gesture: reseat the target so deltas accumulate within a gesture, not across.
      if (targetScroll.current == null || now - lastWheelTs.current > 200) {
        targetScroll.current = container.scrollTop;
      }
      lastWheelTs.current = now;
      const delta = e.deltaMode === 1 ? e.deltaY * itemHeight : e.deltaY;
      // Cap one event to one item so a single notch never skips.
      let move = delta * wheelSpeed;
      move = Math.max(-itemHeight, Math.min(itemHeight, move));
      targetScroll.current = Math.max(
        0,
        Math.min(maxScroll, targetScroll.current + move),
      );
      if (rafScroll.current == null) {
        rafScroll.current = requestAnimationFrame(animateScroll);
      }
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, [animateScroll, itemHeight, wheelSpeed]);

  // Center on mount and when items/selection change.
  useEffect(() => {
    if (selectedId != null) {
      scrollToId(selectedId, 'auto');
    }
    requestAnimationFrame(updateTransforms);
  }, [items, selectedId, scrollToId, updateTransforms]);

  useEffect(() => {
    const onResize = () => updateTransforms();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [updateTransforms]);

  useEffect(() => () => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    if (rafScroll.current) cancelAnimationFrame(rafScroll.current);
    if (snapTimer.current) clearTimeout(snapTimer.current);
  }, []);

  const handleKeyDown = (e) => {
    if (!items.length) return;
    const currentIdx = Math.max(0, items.findIndex((i) => i.id === selectedId));
    let nextIdx = currentIdx;
    switch (e.key) {
      case 'ArrowDown':
        nextIdx = Math.min(items.length - 1, currentIdx + 1);
        break;
      case 'ArrowUp':
        nextIdx = Math.max(0, currentIdx - 1);
        break;
      case 'PageDown':
        nextIdx = Math.min(items.length - 1, currentIdx + 3);
        break;
      case 'PageUp':
        nextIdx = Math.max(0, currentIdx - 3);
        break;
      case 'Home':
        nextIdx = 0;
        break;
      case 'End':
        nextIdx = items.length - 1;
        break;
      default:
        return;
    }
    e.preventDefault();
    if (nextIdx !== currentIdx) {
      const nextId = items[nextIdx].id;
      onSelect(nextId);
      scrollToId(nextId);
    }
  };

  return (
    <div className={`relative h-full ${className}`}>
      {/* Center selection band; pointer-events-none so it never blocks scroll. */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 z-10 border-y border-white/20 bg-white/5"
        style={{ height: itemHeight }}
        aria-hidden="true"
      />

      <div
        ref={containerRef}
        className="wheel-picker h-full overflow-y-auto outline-none"
        style={{
          perspective: '600px',
          // JS handles snapping; native scroll-snap would fight the glide.
          scrollSnapType: 'none',
          // Fade the top/bottom edges so the wheel reads as receding.
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)',
        }}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="listbox"
        aria-activedescendant={selectedId != null ? `wheel-item-${selectedId}` : undefined}
      >
        {/* Top spacer so the first item can be centered */}
        <div style={{ height: 'calc(50% - ' + itemHeight / 2 + 'px)' }} aria-hidden="true" />

        {items.map((item, idx) => {
        const isSelected = item.id === selectedId;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            id={`wheel-item-${item.id}`}
            ref={(el) => { itemRefs.current[idx] = el; }}
            onClick={() => {
              onSelect(item.id);
              scrollToId(item.id);
            }}
            role="option"
            aria-selected={isSelected}
            style={{
              height: itemHeight,
              willChange: 'transform, opacity',
            }}
            className={`
              w-full px-1 sm:px-2
              flex items-center gap-1 sm:gap-2
              ftext-sm
              border rounded-md
              transition-colors duration-150
              ${isSelected
                ? 'bg-white text-black font-semibold border-white'
                : 'bg-black/40 text-white border-white/40 hover:bg-white/10 hover:border-white'}
            `}
          >
            {Icon && <Icon className="shrink-0 text-[0.7em]" aria-hidden="true" />}
            <span className="truncate text-left flex-1">{item.name}</span>
          </button>
        );
      })}

        {/* Bottom spacer so the last item can be centered */}
        <div style={{ height: 'calc(50% - ' + itemHeight / 2 + 'px)' }} aria-hidden="true" />
      </div>
    </div>
  );
};

export default WheelPicker;
