import { Canvas } from '@react-three/fiber';
import Scene from './Scene';
import CardOverlay from './CardOverlay';
import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';



// === Hero Component (wraps layout & Canvas) ===
const Hero = forwardRef(({ onSetHeroContentVisible }, ref) => {
  const [showContent, setShowContent] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [shouldResetCamera, setShouldResetCamera] = useState(false);
  const [cardOpen, setCardOpen] = useState(false); // gates whether OrbitControls onStart hides hero text
  const [showCard, setShowCard] = useState(false); // toggled by Scene once camera lerp arrives
  const [cardNonce, setCardNonce] = useState(0); // bumped per open so each card gets a unique AnimatePresence key
  const sceneRef = useRef(null); // Reference to the Scene component for navbar buttons

  useImperativeHandle(ref, () => ({
    resetCamera: () => {
      if (sceneRef.current?.isBusy?.()) return;
      setShouldResetCamera(true);
      setActiveSection(null);
    },
    navigateToSection: (sectionName, position) => {
      if (sceneRef.current) {
        sceneRef.current.openSection(sectionName, position);
      }
    }
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
      if (onSetHeroContentVisible) {
        onSetHeroContentVisible(true);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [onSetHeroContentVisible]);

  const handleCloseCard = () => {
    if (sceneRef.current) {
      sceneRef.current.openSection(null, null);
    }
  };

  return (
    <div id="hero" className="hero-container">
      <Canvas
        className="hero-canvas"
        frameloop="demand"
        // Clamp DPR — biggest fillrate win on hi-DPI; 1.5 still looks crisp.
        dpr={[1, 1.5]}
        // R3F may drop DPR toward this floor under load.
        performance={{ min: 0.5 }}
      >
        <Scene
          ref={sceneRef}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          showCard={showCard}
          setShowCard={setShowCard}
          setCardNonce={setCardNonce}
          setShowContent={(val) => {
            setShowContent(val);
            if (onSetHeroContentVisible) {
              onSetHeroContentVisible(val);
            }
          }}
          shouldResetCamera={shouldResetCamera}
          setShouldResetCamera={setShouldResetCamera}
          cardOpen={cardOpen}
          setCardOpen={setCardOpen}
        />
      </Canvas>

      <CardOverlay
        activeSection={activeSection}
        showCard={showCard}
        cardNonce={cardNonce}
        onClose={handleCloseCard}
      />

      {/* Welcome overlay */}
      <div className={`hero-content ${showContent ? 'visible' : ''}`}>
        <h1 className="font-display tracking-wide">Welcome to My Portfolio</h1>
        <p>Click on one of the planets or buttons to explore my work</p>
      </div>

      {/* credits for the 3d model - do not remove (CC-BY-NC license) */}
      <p className={`hero-content-credits ${showContent ? 'visible' : ''}`}>
        "space boi" by{" "}
        <a href="https://skfb.ly/oyXLG" target="_blank" rel="noopener noreferrer">
          silvercrow101
        </a>{" "}
        is licensed under Creative Commons Attribution-NonCommercial license.
      </p>
    </div>
  );
});

export default Hero;
