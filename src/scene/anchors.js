import { motionValue } from 'framer-motion';
import { SECTIONS } from './sections';

// Per-section MotionValues for each planet's projected screen-pixel position.
// Written every frame inside the Canvas (Scene.jsx#useFrame), read outside the
// Canvas by CardOverlay so a card stays anchored to its planet while the camera
// moves — preserving the "card shrinks back into its planet" feel during
// close/transition animations.
export const ANCHORS = SECTIONS.reduce((acc, s) => {
  acc[s.id] = { x: motionValue(0), y: motionValue(0) };
  return acc;
}, {});
