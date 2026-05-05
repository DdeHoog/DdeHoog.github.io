import { useThree, useFrame, invalidate } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Spaceboi from "./Spaceboi";
import Planets from './Planets';
import { Suspense, useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { HOME_CAMERA, SECTIONS } from '../scene/sections';
import { ANCHORS } from '../scene/anchors';


// Manages camera transitions and scene state. Card rendering lives in <CardOverlay>
// outside the Canvas (see Hero.jsx).
const Scene = forwardRef(({
    activeSection,
    setActiveSection,
    activePlanetPosition,
    setActivePlanetPosition,
    showCard,
    setShowCard,
    setShowContent,
    shouldResetCamera,
    setShouldResetCamera,
    cardOpen,
    setCardOpen
}, ref) => {

  const controlsRef = useRef();
  const sectionNameRef = useRef(null);
  const fadeInTimeout = useRef(null);
  const { camera, size } = useThree();
  const [isLerping, setIsLerping] = useState(false);

  const targetPosition = useRef(new THREE.Vector3(...HOME_CAMERA.position));
  const targetLookAt = useRef(new THREE.Vector3(...HOME_CAMERA.lookAt));
  const projectionScratch = useRef(new THREE.Vector3());

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.copy(targetLookAt.current);
      camera.position.copy(targetPosition.current);
    }
  }, []);

  useEffect(() => {
    if (shouldResetCamera && controlsRef.current) {
      setActivePlanetPosition(null);
      sectionNameRef.current = null;
      setActiveSection(null);
      setShowCard(false);
      setCardOpen(false);

      if (fadeInTimeout.current) clearTimeout(fadeInTimeout.current);
      fadeInTimeout.current = setTimeout(() => {
        setShowContent(true);
      }, 4000);

      targetLookAt.current.set(...HOME_CAMERA.lookAt);
      targetPosition.current.set(...HOME_CAMERA.position);

      setShouldResetCamera(false);
      setIsLerping(true);
    }
  }, [shouldResetCamera]);

  useFrame(() => {
    // Project every section's world position to screen pixels and write to its
    // anchor MotionValues. CardOverlay reads these to keep each card visually
    // pinned to its planet while the camera moves.
    for (const s of SECTIONS) {
      projectionScratch.current.set(...s.position).project(camera);
      ANCHORS[s.id].x.set((projectionScratch.current.x * 0.5 + 0.5) * size.width);
      ANCHORS[s.id].y.set((projectionScratch.current.y * -0.5 + 0.5) * size.height);
    }

    if (!controlsRef.current) return;

    if (isLerping) {
      camera.position.lerp(targetPosition.current, 0.1);
      controlsRef.current.target.lerp(targetLookAt.current, 0.1);
      controlsRef.current.update();

      const distance = camera.position.distanceTo(targetPosition.current);
      if (distance < 0.01) {
        camera.position.copy(targetPosition.current);
        controlsRef.current.target.copy(targetLookAt.current);
        controlsRef.current.update();

        setIsLerping(false);

        if (activePlanetPosition) {
          setActiveSection(sectionNameRef.current);
          setShowCard(true);
        }
      }
      invalidate();
    }
  });

  const openSection = (sectionName, planetPosition) => {
    const isOpen = sectionName !== null;
    setCardOpen(isOpen);

    if (isOpen) {
      setShowCard(false);
      setShowContent(false);
      sectionNameRef.current = sectionName;
      setActivePlanetPosition(planetPosition);

      if (fadeInTimeout.current) clearTimeout(fadeInTimeout.current);

      const offset = new THREE.Vector3(
        planetPosition[0] + 2,
        planetPosition[1] + 0,
        planetPosition[2] + 2,
      );
      targetPosition.current.copy(offset);
      targetLookAt.current.set(...planetPosition);
      setIsLerping(true);
    } else {
      sectionNameRef.current = null;
      setActivePlanetPosition(null);
      setActiveSection(null);
      setShowCard(false);

      if (fadeInTimeout.current) clearTimeout(fadeInTimeout.current);
      fadeInTimeout.current = setTimeout(() => {
        setShowContent(true);
      }, 4000);
    }
  };

  useImperativeHandle(ref, () => ({
    openSection
  }));

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
          if (!cardOpen) {
            setShowContent(false);
          }
        }}
        onEnd={() => {
          if (!cardOpen) {
            if (fadeInTimeout.current) clearTimeout(fadeInTimeout.current);
            fadeInTimeout.current = setTimeout(() => setShowContent(true), 4000);
          }
        }}
      />

      <Suspense fallback={null}>
        <Spaceboi />
        <Planets onPlanetClick={openSection} />
      </Suspense>
    </>
  );
});

export default Scene;
