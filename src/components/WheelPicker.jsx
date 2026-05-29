import { useEffect, useRef, useCallback } from 'react';

// iOS-style vertical wheel picker.
//
// Items in the visible center are flat / forward-facing; items above and below
// curve back proportionally to their distance from center (rotateX + scale +
// opacity).
//
// Scrolling: the mouse wheel is intercepted and translated into a *smooth*
// proportional glide (scroll distance ∝ wheel delta, eased), which then snaps to
// the nearest item once scrolling stops. This avoids both the old "hard stop on
// every item" and the "skip several items per notch" feels. Touch and keyboard
// use native scroll / explicit centering; the same snap-on-settle applies.
//
// Props:
//   items: Array<{ id, name, icon? }>  (icon is a react-icons component)
//   selectedId: id of currently selected item
//   onSelect: (id) => void  — fires when the centered item changes after scroll
//   itemHeight?: pixel height of each item (default 36)
//   maxRotate?: degrees of rotateX at the top/bottom edge (default 50)
//   maxScale?: scale reduction at the edge (default 0.18 ⇒ edge scale 0.82)
//   wheelSpeed?: scroll px per wheel-delta px (default 0.3). Lower = fewer items
//                advanced per notch; raise it if a notch moves too little.
//   className?: applied to outer scroll container
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

  // Item index whose center is nearest the viewport center. Given the layout
  // (top spacer = 50% - itemHeight/2), scrollTop = i * itemHeight centers item i,
  // so the centered index is simply round(scrollTop / itemHeight).
  const centeredIndex = useCallback(() => {
    const container = containerRef.current;
    if (!container) return 0;
    return Math.max(
      0,
      Math.min(items.length - 1, Math.round(container.scrollTop / itemHeight)),
    );
  }, [items.length, itemHeight]);

  // Smoothly ease container.scrollTop toward targetScroll.
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

  // Scroll the selected item to center (used on mount, on tab/list change, and
  // when an item is clicked). 'auto' lands instantly (mount); 'smooth' animates.
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

    // After scrolling settles, snap to the nearest item center and select it.
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

  // Intercept the wheel (non-passive so we can preventDefault) and turn it into a
  // smooth proportional glide. Touch is unaffected (no wheel events) — native
  // scroll + the snap-on-settle above handle it.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e) => {
      e.preventDefault();
      const now = performance.now();
      const maxScroll = container.scrollHeight - container.clientHeight;
      // Start of a fresh gesture: seat the target at the current position so
      // small (trackpad) deltas accumulate within a gesture but reset between.
      if (targetScroll.current == null || now - lastWheelTs.current > 200) {
        targetScroll.current = container.scrollTop;
      }
      lastWheelTs.current = now;
      const delta = e.deltaMode === 1 ? e.deltaY * itemHeight : e.deltaY;
      // Cap a single event's contribution to one item so one wheel notch always
      // advances exactly one item regardless of how large the notch delta is
      // (high-delta mice would otherwise jump 2+). Fast multi-notch spins still
      // accumulate across events; small trackpad deltas pass through unchanged.
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

  // Initial centering + transform paint. Re-runs when the items array changes
  // (e.g. switching tabs).
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

  // Cancel any in-flight animations / timers on unmount.
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
      {/* Selection band: thin shaded strip at the vertical center of the wheel,
          indicating where the "selected" item sits. Pointer-events-none so it
          doesn't intercept clicks/scrolls on the wheel below. */}
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
          // Snapping is handled in JS (smooth glide + snap-on-settle), so native
          // scroll-snap is disabled to avoid it fighting the programmatic glide.
          scrollSnapType: 'none',
          // Fade items toward the top and bottom edges of the container so the
          // wheel reads as receding into the distance rather than ending on a
          // hard line of empty space at the boundaries.
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
