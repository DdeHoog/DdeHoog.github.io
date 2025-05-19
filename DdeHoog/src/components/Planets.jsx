import { Html } from '@react-three/drei';

const Planets = ({ onPlanetClick, activeSection, activePlanetPosition }) => {
  return (
    <>
    <mesh position={[3.755, 4.28, 0]} label="experience" onClick={() => onPlanetClick("experience", [3.755, 4.28, 0])}>
        <sphereGeometry args={[0.61, 32, 32]} />
        <meshStandardMaterial color="blue" transparent opacity={0.5}/>
        <Html center distanceFactor={10} style={{ pointerEvents: 'auto'}}>
            {activeSection === "experience" && (
                <div className="planet-card">
                    <button className="close-button" onClick={() =>onPlanetClick(null, activePlanetPosition)}>×</button>
                    <h2>Experience</h2>
                    <p>My experience</p>
                </div>
            )}
        </Html>
    </mesh>
    <mesh position={[-3.42, 4.605, -1.17]} label="portfolio" onClick={() => onPlanetClick("portfolio", [-3.42, 4.605, -1.17])}>
        <sphereGeometry args={[0.61, 32, 32]} />
        <meshStandardMaterial color="orange" transparent opacity={0.5}/>
        <Html center distanceFactor={10} style={{ pointerEvents: 'auto'}}>
            {activeSection === "portfolio" && (
                <div className="planet-card">
                    <button className="close-button" onClick={() =>onPlanetClick(null, activePlanetPosition)}>×</button>
                    <h2>Portfolio</h2>
                    <p>My work</p>
                </div>
            )}
        </Html>
    </mesh>
    <mesh position={[2, 5.67, -2.21]} label="contact" onClick={() => onPlanetClick("contact", [2, 5.67, -2.21])}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="pink" transparent opacity={0.5}/>

        <Html center distanceFactor={10} style={{ pointerEvents: 'auto'}}>
            {activeSection === "contact" && (
                <div className="planet-card">
                    <button className="close-button" onClick={() =>onPlanetClick(null, activePlanetPosition)}>×</button>
                    <h2>Contact</h2>
                    <p>Let's work together!</p>
                </div>
            )}
        </Html>
    </mesh>
    </>
  );
};

export default Planets;