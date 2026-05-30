// Click-target sphere for one section; the card itself renders in <CardOverlay>.
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
