import { Canvas, useThree, useFrame} from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Spaceboi from "../../public/Spaceboi";
import Planets from './Planets';
import { Suspense, useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';

// Scene goes inside Canvas and can use useThree()
function Scene({ activeSection, setActiveSection, fadeInTimeout, setShowContent, shouldResetCamera,
  setShouldResetCamera, }) {
  const controlsRef = useRef();
  const { camera, invalidate } = useThree();
  const [activePlanetPosition, setActivePlanetPosition] = useState(null);


  // Expose  for other methods to use
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 3.5, 0);
      camera.position.set(0, 5, 8);
    }
  }, []);

  // reset camera on DDH click
  useEffect(() => {
    if(shouldResetCamera && controlsRef.current) {
      controlsRef.current.target.set(0, 3.5, 0);
      camera.position.set(0, 5, 8);
      controlsRef.current.update();
      invalidate();

      setShouldResetCamera(false); // reset the flag
    }
  }, [shouldResetCamera]);

  const openSection = (sectionName, planetPosition) => {
    setActiveSection(sectionName);
    setActivePlanetPosition(planetPosition);

    if (controlsRef.current && camera) {
      if (planetPosition) {
        controlsRef.current.target.set(...planetPosition);

        const offset = [
          planetPosition[0] + 3,
          planetPosition[1] + 2,
          planetPosition[2] + 3,
        ];
        camera.position.set(...offset);

        controlsRef.current.update();
        invalidate();
      } /*else {
        controlsRef.current.target.set(0, 3.5, 0);
        camera.position.set(0, 5, 8);
        controlsRef.current.update();
        invalidate();
      }*/
    }
  };

  return (
    <>
      <ambientLight intensity={0.5} />

      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.1}
        maxPolarAngle={Math.PI / 2}
        onStart={() => {
          if (fadeInTimeout.current) {
            clearTimeout(fadeInTimeout.current);
          }
          setShowContent(false);
        }}
        onEnd={() => {
          if (fadeInTimeout.current) clearTimeout(fadeInTimeout.current);
          fadeInTimeout.current = setTimeout(() => setShowContent(true), 4000);
        }}
      />

      <Suspense fallback={null}>
        <Spaceboi />
        <Planets onPlanetClick={openSection} activeSection={activeSection} activePlanetPosition={activePlanetPosition} />
      </Suspense>
    </>
  );
}

// === Hero Component (wraps layout & Canvas) ===
const Hero = forwardRef((props, ref) => {
  const [showContent, setShowContent] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const fadeInTimeout = useRef(null);
  const [activePlanetPosition, setActivePlanetPosition] = useState(null);
  const [shouldResetCamera, setShouldResetCamera] = useState(false);


  useImperativeHandle(ref, () => ({
    resetCamera: () => {
      setShouldResetCamera(true); //  set a flag to indicate camera reset
      setActiveSection(null);
      setShowContent(false);
      if (fadeInTimeout.current) clearTimeout(fadeInTimeout.current);
      fadeInTimeout.current = setTimeout(() => setShowContent(true), 1000);
    },
  }));

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div id="hero" className="hero-container">
      <Canvas className="hero-canvas">
        <Scene
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          activePlanetPosition={activePlanetPosition}
          setActivePlanetPosition={setActivePlanetPosition}
          fadeInTimeout={fadeInTimeout}
          setShowContent={setShowContent}
          shouldResetCamera={shouldResetCamera}
          setShouldResetCamera={setShouldResetCamera}
        />
      </Canvas>

      {/* Overlay content */}
      <div className={`hero-content ${showContent ? 'visible' : ''}`}>
        <h1>Welcome to My Portfolio</h1>
        <p>Pan around or click on of the buttons to explore my work</p>
      </div>

      <p className={`hero-content-credits ${showContent ? 'visible' : ''}`}>
        "space boi" by{" "}
        <a href="https://skfb.ly/oyXLG" target="_blank" rel="noopener noreferrer" className='.hero-content-credits'>
          silvercrow101  
        </a>{" "}
        is licensed under Creative Commons Attribution-NonCommercial license.
      </p>
    </div>
  );
});

export default Hero;
