import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Spaceboi from "../../public/Spaceboi";
import { Suspense } from 'react';

const Hero = () => (
    <div id="hero" className="hero-container">
        <Canvas className="hero-canvas">

          <ambientLight intensity={0.5} />
          <OrbitControls target={[0, 3.5, 0]} 
            enableDamping 
            dampingFactor={0.1} 
            maxPolarAngle={Math.PI / 2}/>
          <Suspense fallback={null}>
            <Spaceboi />
          </Suspense>
        </Canvas>
        {/* Overlayed content */}
        <div className="hero-content1">
            <h1>Welcome to My Portfolio</h1>
            <p>Scroll to explore my work.</p>
            {/* buttons, links, etc. */}
        </div>
    </div>
);

export default Hero;