import { useEffect, useRef, useCallback } from 'react';

// iOS-style vertical wheel picker.
//
// Items in the visible center are flat / forward-facing; items above and below
// curve back proportionally to their distance from center (rotateX + scale +
// opacity). Native browser scrolling handles trackpad / mouse-wheel / touch /
// pointer-drag; ArrowUp / ArrowDown / Home / End / PageUp / PageDown handle
// keyboard. Scroll-snap snaps to one item at a time. Top and bottom spacers
// (50% of container height each) let the first and last items sit at center.
//
// Props:
//   items: Array<{ id, name, icon? }>  (icon is a react-icons component)
//   selectedId: id of currently selected item
//   onSelect: (id) => void  — fires when the centered item changes after scroll
//   itemHeight?: pixel height of each item (default 36)
//   maxRotate?: degrees of rotateX at the top/bottom edge (default 50)
//   maxScale?: scale reduction at the edge (default 0.18 ⇒ edge scale 0.82)
//   className?: applied to outer scroll container
const WheelPicker = ({
  items,
  selectedId,
  onSelect,
  itemHeight = 36,
  maxRotate = 50,
  maxScale = 0.18,
  className = '',
}) => {
  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const snapTimer = useRef(null);
  const rafId = useRef(null);

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

      const rotate = -ratio * maxRotate; // see comment in file: positive rotateX tilts top away
      const scale = 1 - maxScale * Math.abs(ratio);
      const opacity = 1 - 0.5 * Math.abs(ratio);

      el.style.transform = `rotateX(${rotate}deg) scale(${scale})`;
      el.style.opacity = String(opacity);
    });
  }, [maxRotate, maxScale]);

  const findCenteredId = useCallback(() => {
    const container = containerRef.current;
    if (!container) return null;
    const rect = container.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    let bestId = null;
    let bestDist = Infinity;
    itemRefs.current.forEach((el, idx) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const itemCenter = r.top + r.height / 2;
      const dist = Math.abs(itemCenter - center);
      if (dist < bestDist) {
        bestDist = dist;
        bestId = items[idx].id;
      }
    });
    return bestId;
  }, [items]);

  const handleScroll = useCallback(() => {
    if (rafId.current) return;
    rafId.current = requestAnimationFrame(() => {
      rafId.current = null;
      updateTransforms();
    });

    if (snapTimer.current) clearTimeout(snapTimer.current);
    snapTimer.current = setTimeout(() => {
      const id = findCenteredId();
      if (id != null && id !== selectedId) {
        onSelect(id);
      }
    }, 120);
  }, [updateTransforms, findCenteredId, selectedId, onSelect]);

  // Scroll the selected item to center (used on mount, on tab/list change, and
  // when an item is clicked). `behavior: 'smooth'` means user-initiated clicks
  // animate; the initial mount uses 'auto' to land instantly.
  const scrollToId = useCallback((id, behavior = 'smooth') => {
    const idx = items.findIndex((i) => i.id === id);
    if (idx < 0) return;
    const el = itemRefs.current[idx];
    const container = containerRef.current;
    if (!el || !container) return;
    el.scrollIntoView({ block: 'center', behavior });
  }, [items]);

  // Initial centering + transform paint. Re-runs when the items array changes
  // (e.g. switching tabs).
  useEffect(() => {
    if (selectedId != null) {
      scrollToId(selectedId, 'auto');
    }
    // updateTransforms after a paint so getBoundingClientRect is up to date.
    requestAnimationFrame(updateTransforms);
  }, [items, selectedId, scrollToId, updateTransforms]);

  useEffect(() => {
    const onResize = () => updateTransforms();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [updateTransforms]);

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
          scrollSnapType: 'y mandatory',
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
              scrollSnapAlign: 'center',
              scrollSnapStop: 'always',
              willChange: 'transform, opacity',
            }}
            className={`
              w-full px-1 sm:px-2
              flex items-center gap-1 sm:gap-2
              text-[0.5rem] sm:text-[0.65rem] md:text-[0.75rem]
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
