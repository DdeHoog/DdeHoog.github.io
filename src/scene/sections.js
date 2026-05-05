// Single source of truth for the three interactive planet sections.
// Order here is the order rendered in the NavBar.
export const SECTIONS = [
  {
    id: 'portfolio',
    navLabel: 'Portfolio',
    navColor: 'text-orange-300 hover:text-orange-400',
    position: [-3.42, 4.605, -1.17],
    radius: 0.61,
    color: 'orange',
  },
  {
    id: 'experience',
    navLabel: 'Experience',
    navColor: 'text-blue-300 hover:text-blue-400',
    position: [3.755, 4.28, 0],
    radius: 0.61,
    color: 'blue',
  },
  {
    id: 'about',
    navLabel: 'About',
    navColor: 'text-pink-300 hover:text-pink-400',
    position: [2, 5.67, -2.21],
    radius: 0.4,
    color: 'pink',
  },
];

export const SECTIONS_BY_ID = Object.fromEntries(
  SECTIONS.map((s) => [s.id, s])
);

export const HOME_CAMERA = {
  position: [0, 5, 8],
  lookAt: [0, 3.5, 0],
};
