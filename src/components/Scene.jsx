import { Canvas, useThree, useFrame, invalidate } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Spaceboi from "../../public/Spaceboi";
import Planets from './Planets';
import { Suspense, useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import Experience from './Experience';
import Portfolio from './Portfolio';
import About from './About';


// This component wraps the 3D scene, manages camera transitions and UI state.
const Scene = forwardRef(({ // wrapped in forwardRef to be callable for navbar buttons
    activeSection, 
    setActiveSection, 
    fadeInTimeout, 
    setShowContent, 
    shouldResetCamera,
    setShouldResetCamera,
    cardOpen,
    setCardOpen  
}, ref) => {


  const controlsRef = useRef(); // OrbitControls reference
  const sectionNameRef = useRef(null); // Reference to store the current section name
  const { camera } = useThree();
  const [activePlanetPosition, setActivePlanetPosition] = useState(null);
  const [isLerping, setIsLerping] = useState(false); // Controls camera animation state
  const [showCard, setShowCard] = useState(false); // Controls visibility of planet cards

  // Target camera position and lookAt point
  const targetPosition = useRef(new THREE.Vector3(0, 5, 8));
  const targetLookAt = useRef(new THREE.Vector3(0, 3.5, 0));
  

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
      // Clear card state before lerping
      setActivePlanetPosition(null); // Reset active planet position
      sectionNameRef.current = null; // Reset section name
      setActiveSection(null); // Reset active section
      setShowCard(false); // Hide any open card
      setCardOpen(false); // Reset card open state

      // Start fade-in timer again
      if (fadeInTimeout.current) clearTimeout(fadeInTimeout.current);
      fadeInTimeout.current = setTimeout(() => {
        setShowContent(true);
      }, 4000);

      // Set new goals (they’ll lerp toward this)
      targetLookAt.current.set(0, 3.5, 0);
      targetPosition.current.set(0, 5, 8);


      setShouldResetCamera(false); // reset the flag
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

      // Close to target check, if close enough, snap to target
      const distance = camera.position.distanceTo(targetPosition.current);
      if (distance < 0.01) {
        camera.position.copy(targetPosition.current);
        controlsRef.current.target.copy(targetLookAt.current);
        controlsRef.current.update();

        setIsLerping(false); // stop lerping

        if(activePlanetPosition){
          setActiveSection(sectionNameRef.current);// now finally show the card
          setShowCard(true); // show the card
        }
      }
    invalidate(); // triggers a render frame
    }
  });

  // Function to open a section and set camera position - on planetClick
  const openSection = (sectionName, planetPosition) => {
    const isOpen = sectionName !== null;
    setCardOpen(isOpen); // Update card open state

    if (isOpen) {
      //opening a card
      setShowCard(false); // hide and existing active card
      setShowCard(false); // hide any existing card
      sectionNameRef.current = sectionName; // Store the section name
      setActivePlanetPosition(planetPosition); // Set the active planet position

      // Cancel any existing fade in timer
      if  (fadeInTimeout.current) {
        clearTimeout(fadeInTimeout.current);
      }

      // Determine target position based on planet clicked
      const offset = new THREE.Vector3(
        planetPosition[0] + 2,
        planetPosition[1] + 0,
        planetPosition[2] + 2,
      );
      // Set lerp goals
      targetPosition.current.copy(offset);
      targetLookAt.current.set(...planetPosition);
      setIsLerping(true); // set lerping state
    }else {
    // Closing a card
      sectionNameRef.current = null; // Reset section name
      setActivePlanetPosition(null); // Reset active planet position
      setActiveSection(null); // Reset active section
      setShowCard(false); // Hide the card

      // Restart fade in timer
      if (fadeInTimeout.current) clearTimeout(fadeInTimeout.current);
      fadeInTimeout.current = setTimeout(() => {
        setShowContent(true);
      }, 4000); //standard 4 sec delay for fade in
      
      
    }   
  };

  useImperativeHandle(ref, () => ({
    openSection
  }));

  const renderCardContent = () => {
    switch (activeSection) {
      case 'experience':
        return <Experience />;
      case 'portfolio':
        return <Portfolio/>;
      case 'about':
        return <About />;
      default:
        return null;
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
          if(!cardOpen) {
            setShowContent(false);
          }
        }}
        onEnd={() => {
          if(!cardOpen){
            if (fadeInTimeout.current) clearTimeout(fadeInTimeout.current);
            fadeInTimeout.current = setTimeout(() => setShowContent(true), 4000);
          }
        }}
      />

      <Suspense fallback={null}>
        <Spaceboi />
        <Planets 
          onPlanetClick={openSection} 
          activeSection={activeSection} 
          activePlanetPosition={activePlanetPosition} 
          showCard={showCard}
          cardContent={renderCardContent}
        />
      </Suspense>
    </>
  );
});

export default Scene;