import { useThree, useFrame, invalidate } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Spaceboi from "./Spaceboi";
import Planets from './Planets';
import { Suspense, useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { HOME_CAMERA, SECTIONS } from '../scene/sections';
import { ANCHORS } from '../scene/anchors';

// Camera-flow tuning knobs.
const APPROACH_DISTANCE = Math.SQRT2 * 2; // world units from the focused planet
const FALLBACK_DIR = new THREE.Vector3(2, 0, 2).normalize(); // used if camera sits on the planet
const LERP_MIN_DURATION = 1.2;     // seconds
const LERP_MAX_DURATION = 2.2;     // seconds
const LERP_DISTANCE_FACTOR = 0.14; // extra seconds per world-unit travelled
const CARD_OPEN_AT = 0.85;         // fraction of eased distance at which the card opens
const MIN_ZOOM_DISTANCE = 2.5;     // keep ≤ APPROACH_DISTANCE
const MAX_ZOOM_DISTANCE = 24;
const CARD_OPEN_LOCK_MS = 500;     // transition-lock window after a card opens
const CARD_CLOSE_LOCK_MS = 320;    // shorter — the card reads as closed well before the spring fully settles

const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const Scene = forwardRef(({
    activeSection,
    setActiveSection,
    showCard,
    setShowCard,
    setCardNonce,
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

  const lerpStartPos = useRef(new THREE.Vector3());
  const lerpStartLookAt = useRef(new THREE.Vector3());
  const lerpElapsed = useRef(0);
  const lerpDuration = useRef(LERP_MIN_DURATION);
  const cardFired = useRef(false);
  const cardLockUntil = useRef(0); // timestamp; transition lock while a card open/close animates

  // Transition in progress: camera flying, or a card open/close still animating.
  const isTransitioning = () => isLerping || performance.now() < cardLockUntil.current;

  // Targets must be set before calling.
  const beginLerp = () => {
    if (!controlsRef.current) return;
    lerpStartPos.current.copy(camera.position);
    lerpStartLookAt.current.copy(controlsRef.current.target);
    lerpElapsed.current = 0;
    cardFired.current = false;
    const moveDist = Math.max(
      lerpStartPos.current.distanceTo(targetPosition.current),
      lerpStartLookAt.current.distanceTo(targetLookAt.current),
    );
    lerpDuration.current = THREE.MathUtils.clamp(
      LERP_MIN_DURATION + moveDist * LERP_DISTANCE_FACTOR,
      LERP_MIN_DURATION,
      LERP_MAX_DURATION,
    );
    setIsLerping(true);
    invalidate(); // kick first frame; useFrame self-sustains
  };

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.copy(targetLookAt.current);
      camera.position.copy(targetPosition.current);
    }
    invalidate(); // initial paint (demand frameloop)
  }, []);

  useEffect(() => {
    if (shouldResetCamera && controlsRef.current) {
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
      beginLerp();
    }
  }, [shouldResetCamera]);

  useFrame((_, delta) => {
    // Project each planet to screen px → anchor MotionValues that CardOverlay reads.
    for (const s of SECTIONS) {
      projectionScratch.current.set(...s.position).project(camera);
      ANCHORS[s.id].x.set((projectionScratch.current.x * 0.5 + 0.5) * size.width);
      ANCHORS[s.id].y.set((projectionScratch.current.y * -0.5 + 0.5) * size.height);
    }

    if (!controlsRef.current) return;

    if (isLerping) {
      // Clamp delta: under frameloop="demand" the first frame after an idle
      // period (e.g. reading an open card) carries all the elapsed wall-time,
      // which would otherwise jump elapsed past the duration and teleport.
      lerpElapsed.current += Math.min(delta, 0.05);
      const t = Math.min(1, lerpElapsed.current / lerpDuration.current);
      const e = easeInOutCubic(t);

      camera.position.lerpVectors(lerpStartPos.current, targetPosition.current, e);
      controlsRef.current.target.lerpVectors(lerpStartLookAt.current, targetLookAt.current, e);
      controlsRef.current.update();

      // Open the card near arrival, but never on a home reset.
      const navigating = sectionNameRef.current !== null;
      if (navigating && !cardFired.current && e >= CARD_OPEN_AT) {
        cardFired.current = true;
        cardLockUntil.current = performance.now() + CARD_OPEN_LOCK_MS;
        setCardNonce((n) => n + 1);
        setActiveSection(sectionNameRef.current);
        setShowCard(true);
      }

      if (t >= 1) {
        camera.position.copy(targetPosition.current);
        controlsRef.current.target.copy(targetLookAt.current);
        controlsRef.current.update();
        setIsLerping(false);

        // Fallback if the card never fired mid-flight.
        if (navigating && !cardFired.current) {
          cardFired.current = true;
          cardLockUntil.current = performance.now() + CARD_OPEN_LOCK_MS;
          setCardNonce((n) => n + 1);
          setActiveSection(sectionNameRef.current);
          setShowCard(true);
        }
      }
      invalidate();
    }
  });

  const openSection = (sectionName, planetPosition) => {
    // Ignore new open/close requests while a transition (camera or card
    // animation) is still in progress, so rapid clicks can't restart the lerp
    // or bounce a half-open card.
    if (isTransitioning()) return;
    const isOpen = sectionName !== null;
    setCardOpen(isOpen);

    if (isOpen) {
      setShowCard(false);
      setShowContent(false);
      sectionNameRef.current = sectionName;

      if (fadeInTimeout.current) clearTimeout(fadeInTimeout.current);

      // Approach along the camera's current direction at a fixed distance.
      const planet = new THREE.Vector3(...planetPosition);
      const dir = camera.position.clone().sub(planet);
      if (dir.lengthSq() < 1e-6) dir.copy(FALLBACK_DIR);
      else dir.normalize();
      targetPosition.current.copy(planet).addScaledVector(dir, APPROACH_DISTANCE);
      targetLookAt.current.copy(planet);
      beginLerp();
    } else {
      sectionNameRef.current = null;
      setActiveSection(null);
      setShowCard(false);
      cardLockUntil.current = performance.now() + CARD_CLOSE_LOCK_MS; // lock until the card reads as closed

      if (fadeInTimeout.current) clearTimeout(fadeInTimeout.current);
      fadeInTimeout.current = setTimeout(() => {
        setShowContent(true);
      }, 4000);
    }
  };

  useImperativeHandle(ref, () => ({
    openSection,
    isBusy: isTransitioning,
  }));

  return (
    <>
      <ambientLight intensity={0.5} />

      <OrbitControls
        ref={controlsRef}
        enabled={!isLerping}
        enableDamping
        dampingFactor={0.1}
        minDistance={MIN_ZOOM_DISTANCE}
        maxDistance={MAX_ZOOM_DISTANCE}
        maxPolarAngle={Math.PI / 2}
        onChange={() => invalidate()} // render while the user orbits (demand frameloop)
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
