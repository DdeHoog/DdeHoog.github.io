import { Canvas, useThree, useFrame} from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Spaceboi from "../../public/Spaceboi";
import Planets from './Planets';
import Scene from './Scene';
import { Suspense, useEffect, useState, useRef, forwardRef, useImperativeHandle, use } from 'react';



// === Hero Component (wraps layout & Canvas) ===
const Hero = forwardRef((props, ref) => {
  const [showContent, setShowContent] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const fadeInTimeout = useRef(null);
  const [activePlanetPosition, setActivePlanetPosition] = useState(null);
  const [shouldResetCamera, setShouldResetCamera] = useState(false);
  const [cardOpen, setCardOpen] = useState(false); // manages html card open for hiding content
  const sceneRef = useRef(null); // Reference to the Scene component for navbar buttons

  // Expose resetCamera method to parent components
  // This allows parent components to reset the camera when needed
  // This is useful for resetting the camera when the user clicks on the DDH logo
  useImperativeHandle(ref, () => ({
    resetCamera: () => {
      setShouldResetCamera(true); //  set a flag to indicate camera reset
      setActiveSection(null);
      }, 
    navigateToSection: (sectionName, position) => {
      // Checks if ref is connected then calls function on Scene component
      if (sceneRef.current) {
        sceneRef.current.openSection(sectionName, position);//calls opensection
        //Sets the new active section based on the name and position.
      }
    }
  }));

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div id="hero" className="hero-container">
      <Canvas className="hero-canvas">
        <Scene
          ref={sceneRef} // Pass the ref to Scene component
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          activePlanetPosition={activePlanetPosition}
          setActivePlanetPosition={setActivePlanetPosition}
          fadeInTimeout={fadeInTimeout}
          setShowContent={setShowContent}
          shouldResetCamera={shouldResetCamera}
          setShouldResetCamera={setShouldResetCamera}
          cardOpen={cardOpen}
          setCardOpen={setCardOpen}
        />
      </Canvas>

      {/* Overlay content */}
      <div className={`hero-content ${showContent ? 'visible' : ''}`}>
        <h1>Welcome to My Portfolio</h1>
        <p>Click on one of the planets or buttons to explore my work</p>
      </div>

      {/* Arrow + text tooltip */}
      < div className={`ddh-tooltip ${showContent ? 'visible' : ''}`}>
        <div className="arrow"></div>
        <p>Click here to reset</p>
      </div>

      {/* credits for the 3d model - do not remove */}
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
