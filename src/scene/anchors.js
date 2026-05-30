import { motionValue } from 'framer-motion';
import { SECTIONS } from './sections';

// Per-section MotionValues holding each planet's projected screen position.
// Written in Scene's useFrame (inside the Canvas), read by CardOverlay
// (outside it) so a card stays pinned to its planet during transitions.
export const ANCHORS = SECTIONS.reduce((acc, s) => {
  acc[s.id] = { x: motionValue(0), y: motionValue(0) };
  return acc;
}, {});
