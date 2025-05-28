import { Canvas, useThree, useFrame, invalidate } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Spaceboi from "../../public/Spaceboi";
import Planets from './Planets';
import { Suspense, useEffect, useState, useRef } from 'react';
import * as THREE from 'three';


// Scene goes inside Canvas and can use useThree()
const Scene = ({ 
    activeSection, 
    setActiveSection, 
    fadeInTimeout, 
    setShowContent, 
    shouldResetCamera,
    setShouldResetCamera, }) => {
  const controlsRef = useRef();
  const { camera } = useThree();
  const [activePlanetPosition, setActivePlanetPosition] = useState(null);

  // Refs for lerping targets
  const targetPosition = useRef(new THREE.Vector3(0, 5, 8));
  const targetLookAt = useRef(new THREE.Vector3(0, 3.5, 0));
  const [isLerping, setIsLerping] = useState(false);

  // Expose initial camera state
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.copy(targetLookAt.current);
      camera.position.copy(targetPosition.current);
    }
  }, []);

  // reset camera on DDH click
  useEffect(() => {
    if(shouldResetCamera && controlsRef.current) {
      // Set new goals (they’ll lerp toward this)
      targetLookAt.current.set(0, 3.5, 0);
      targetPosition.current.set(0, 5, 8);

      setShouldResetCamera(false); // reset the flag
      setShowContent(false); // optional: fade content during move
      setIsLerping(true); // set lerping state
    }
  }, [shouldResetCamera]);

  // LERP camera every frame
  useFrame(() => {
    if(!controlsRef.current) return; // ??

    // Smoothly approach the target
    if (isLerping){
      camera.position.lerp(targetPosition.current, 0.1);
      controlsRef.current.target.lerp(targetLookAt.current, 0.1);
      controlsRef.current.update();

      // Close to target check
      const distance = camera.position.distanceTo(targetPosition.current);
      if (distance < 0.01) {
        camera.position.copy(targetPosition.current);
        controlsRef.current.target.copy(targetLookAt.current);
        controlsRef.current.update();

        setIsLerping(false); // stop lerping
        setShowContent(true); // fade in content after lerp
      }
    }

    invalidate(); // triggers a render frame
  });

  // Function to open a section and set camera position
  const openSection = (sectionName, planetPosition) => {
    setActiveSection(sectionName);
    setActivePlanetPosition(planetPosition);

   
    if (planetPosition) {
      const offset = new THREE.Vector3(
        planetPosition[0] + 2,
        planetPosition[1] + 0,
        planetPosition[2] + 2,
      );
      
      // Set lerp goals
      targetPosition.current.copy(offset);
      targetLookAt.current.set(...planetPosition);

      setShowContent(false); // optional: fade content during move
      setIsLerping(true); // set lerping state
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

export default Scene;