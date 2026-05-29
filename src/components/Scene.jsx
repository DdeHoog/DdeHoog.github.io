import { useThree, useFrame, invalidate } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Spaceboi from "./Spaceboi";
import Planets from './Planets';
import { Suspense, useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { HOME_CAMERA, SECTIONS } from '../scene/sections';
import { ANCHORS } from '../scene/anchors';

// --- Camera-flow tuning knobs -------------------------------------------------
// How far (world units) the camera ends up from the focused planet. Kept at the
// magnitude of the old hardcoded (+2,0,+2) offset so framing matches what worked.
const APPROACH_DISTANCE = Math.SQRT2 * 2; // ≈ 2.83
// Direction used only if the camera is sitting exactly on the planet (degenerate).
const FALLBACK_DIR = new THREE.Vector3(2, 0, 2).normalize();
// Duration-based easing. Slow start → accelerates into arrival (ease-in), so it
// no longer "rushes there then waits". Duration scales mildly with travel so a
// short hop and a full home-reset both feel deliberate.
const LERP_MIN_DURATION = 1.2;   // seconds — shortest move
const LERP_MAX_DURATION = 2.2;   // seconds — longest move
const LERP_DISTANCE_FACTOR = 0.14; // extra seconds per world-unit travelled
const CARD_OPEN_AT = 0.85;       // open the card at 85% of the distance covered
// OrbitControls zoom bounds (distance from the look-at target).
const MIN_ZOOM_DISTANCE = 2.5;   // must be ≤ APPROACH_DISTANCE so it doesn't fight the lerp
const MAX_ZOOM_DISTANCE = 24;

// Slow start → ramps up to speed → eases to a smooth (non-abrupt) stop.
const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;


// Manages camera transitions and scene state. Card rendering lives in <CardOverlay>
// outside the Canvas (see Hero.jsx).
const Scene = forwardRef(({
    activeSection,
    setActiveSection,
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

  // Duration-based lerp bookkeeping (see useFrame / beginLerp).
  const lerpStartPos = useRef(new THREE.Vector3());
  const lerpStartLookAt = useRef(new THREE.Vector3());
  const lerpElapsed = useRef(0);
  const lerpDuration = useRef(LERP_MIN_DURATION);
  const cardFired = useRef(false);

  // Capture the current camera state as the lerp origin, size the duration to the
  // distance travelled, and start the animation. Targets must already be set.
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
    invalidate(); // kick the first on-demand frame; useFrame self-sustains the rest
  };

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.copy(targetLookAt.current);
      camera.position.copy(targetPosition.current);
    }
    invalidate(); // paint the initial framing under demand frameloop
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
      beginLerp();
    }
  }, [shouldResetCamera]);

  useFrame((_, delta) => {
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
      lerpElapsed.current += delta;
      const t = Math.min(1, lerpElapsed.current / lerpDuration.current);
      const e = easeInOutCubic(t);

      camera.position.lerpVectors(lerpStartPos.current, targetPosition.current, e);
      controlsRef.current.target.lerpVectors(lerpStartLookAt.current, targetLookAt.current, e);
      controlsRef.current.update();

      // Open the card once the camera has covered CARD_OPEN_AT of the *distance*
      // (eased, so ~just before arrival), only when navigating to a section
      // (not on a home reset), so it doesn't feel like it waits.
      const navigating = sectionNameRef.current !== null;
      if (navigating && !cardFired.current && e >= CARD_OPEN_AT) {
        cardFired.current = true;
        setActiveSection(sectionNameRef.current);
        setShowCard(true);
      }

      if (t >= 1) {
        camera.position.copy(targetPosition.current);
        controlsRef.current.target.copy(targetLookAt.current);
        controlsRef.current.update();
        setIsLerping(false);

        // Safety net in case CARD_OPEN_AT was ≥ 1 or the move was instant.
        if (navigating && !cardFired.current) {
          cardFired.current = true;
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

      // Approach the planet along the camera's *current* direction (keeping a
      // fixed distance) instead of teleporting to a fixed front-right corner.
      const planet = new THREE.Vector3(...planetPosition);
      const dir = camera.position.clone().sub(planet);
      if (dir.lengthSq() < 1e-6) dir.copy(FALLBACK_DIR);
      else dir.normalize();
      targetPosition.current.copy(planet).addScaledVector(dir, APPROACH_DISTANCE);
      targetLookAt.current.copy(planet);
      beginLerp();
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
