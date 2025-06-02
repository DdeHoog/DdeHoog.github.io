import { Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';

const Planets = ({ onPlanetClick, activeSection, activePlanetPosition, showCard }) => {
  return (
    <>
    <mesh position={[3.755, 4.28, 0]} label="experience" onClick={() => onPlanetClick("experience", [3.755, 4.28, 0])}>
        <sphereGeometry args={[0.61, 32, 32]} />
        <meshStandardMaterial color="blue" transparent opacity={0.5}/>
        <Html center distanceFactor={10} style={{ pointerEvents: 'auto'}}>
            <AnimatePresence>
            {activeSection === "experience" && showCard && (
                <motion.div
                    className="planet-card"
                    initial={{ opacity: 0, scale: 0.5, y:20 }}
                    animate={{ opacity: 1, scale: 1, y:0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20}}
                    transition={{ type: "spring", stiffness: 50, damping:15 }}
                    onPointerDown={(e) => e.stopPropagation()} // prevent orbitControls through the card
                    onPointerUp={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button 
                    className="close-button" 
                    onClick={() =>onPlanetClick(null, activePlanetPosition)}>
                        ×
                    </button>
                    <h2>Experience</h2>
                    <p>My experience</p>
                </motion.div>
            )}
            </AnimatePresence>
        </Html>
    </mesh>
    <mesh position={[-3.42, 4.605, -1.17]} label="portfolio" onClick={() => onPlanetClick("portfolio", [-3.42, 4.605, -1.17])}>
        <sphereGeometry args={[0.61, 32, 32]} />
        <meshStandardMaterial color="orange" transparent opacity={0.5}/>
        <Html center distanceFactor={10} style={{ pointerEvents: 'auto'}}>
            <AnimatePresence>
            {activeSection === "portfolio" && showCard && (
                <motion.div 
                    className="planet-card"
                    initial={{ opacity: 0, scale: 0.5, y:20 }}
                    animate={{ opacity: 1, scale: 1, y:0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20}}
                    transition={{ type: "spring", stiffness: 50, damping:15 }}
                    onPointerDown={(e) => e.stopPropagation()} // prevent orbitControls through the card
                    onPointerUp={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button 
                    className="close-button" 
                    onClick={() =>onPlanetClick(null, activePlanetPosition)}>
                        ×
                    </button>
                    <h2>Portfolio</h2>
                    <p>My work</p>
                </motion.div>
            )}
            </AnimatePresence>
        </Html>
    </mesh>
    <mesh position={[2, 5.67, -2.21]} label="contact" onClick={() => onPlanetClick("contact", [2, 5.67, -2.21])}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="pink" transparent opacity={0.5}/>
        <Html center distanceFactor={10} style={{ pointerEvents: 'auto'}}>
            <AnimatePresence>
            {activeSection === "contact" && showCard && (
                <motion.div 
                    className="planet-card"
                    initial={{ opacity: 0, scale: 0.5, y:20 }}
                    animate={{ opacity: 1, scale: 1, y:0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20}}
                    transition={{ type: "spring", stiffness: 50, damping: 15 }}
                    onPointerDown={(e) => e.stopPropagation()} // prevent orbitControls through the card
                    onPointerUp={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button className="close-button" onClick={() =>onPlanetClick(null, activePlanetPosition)}>×</button>
                    <h2>Contact</h2>
                    <p>Let's work together!</p>
                </motion.div>
            )}
            </AnimatePresence>
        </Html>
    </mesh>
    </>
  );
};

export default Planets;