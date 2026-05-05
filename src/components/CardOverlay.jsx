import { motion, AnimatePresence } from 'framer-motion';
import Experience from './Experience';
import Portfolio from './Portfolio';
import About from './About';
import { ANCHORS } from '../scene/anchors';

const renderSectionContent = (activeSection) => {
  switch (activeSection) {
    case 'experience':
      return <Experience />;
    case 'portfolio':
      return <Portfolio />;
    case 'about':
      return <About />;
    default:
      return null;
  }
};

const CardOverlay = ({ activeSection, showCard, onClose }) => {
  const isVisible = showCard && activeSection;

  return (
    <div
      className="fixed inset-0 z-20 pointer-events-none overflow-hidden"
      aria-hidden={!isVisible}
    >
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key={activeSection}
            // Outer wrapper rides the planet's projected screen position via
            // x/y MotionValues; centering is handled by the middle div below.
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              x: ANCHORS[activeSection].x,
              y: ANCHORS[activeSection].y,
            }}
          >
            <div style={{ transform: 'translate(-50%, -50%)' }}>
              <motion.div
                className="
                  relative pointer-events-auto flex flex-col text-white
                  w-[90vw] max-w-[640px]
                  h-[70vh] max-h-[480px]
                  bg-black/80 backdrop-blur-md
                  border border-white rounded-xl
                  p-2 sm:p-3
                  shadow-[0_0_20px_rgba(255,255,255,0.1)]
                  overflow-hidden
                "
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: 20 }}
                transition={{ type: 'spring', stiffness: 50, damping: 15 }}
                onPointerDown={(e) => e.stopPropagation()}
                onPointerUp={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                onWheel={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute top-1 right-2 bg-transparent border-none text-white text-2xl leading-none cursor-pointer hover:text-red-500 z-10"
                  onClick={onClose}
                  aria-label="Close"
                >
                  ×
                </button>
                <div className="w-full h-full overflow-hidden flex-1 min-h-0">
                  {renderSectionContent(activeSection)}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CardOverlay;
