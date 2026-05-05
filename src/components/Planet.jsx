// Click-target sphere for one section. Visual card rendering lives in <CardOverlay>
// outside the Canvas (see Hero.jsx); this component is purely the 3D mesh + click hit.
const Planet = ({ section, onPlanetClick }) => {
  return (
    <mesh
      position={section.position}
      label={section.id}
      onClick={() => onPlanetClick(section.id, section.position)}
    >
      <sphereGeometry args={[section.radius, 32, 32]} />
      <meshStandardMaterial color={section.color} transparent opacity={0.5} />
    </mesh>
  );
};

export default Planet;
