import { Canvas } from '@react-three/fiber'
import { Grid, OrbitControls } from '@react-three/drei'
import Spaceboi from "../../public/Spaceboi";
import Planets from './Planets';
import { Suspense, useEffect, useState, useRef, forwardRef, useImperativeHandle, use } from 'react';


// forwardRef to allow parent access to internal methods
const Hero = forwardRef ((props, ref) => {
  // State to track whether to show (fade in) the hero content
  const [showContent, setShowContent] = useState(false);
  const [activeSection, setActiveSection] = useState(null); // State to track the active section
  const fadeInTimeout = useRef(null); // Ref to track fadein timer
  const controlsRef = useRef(); // Ref to track OrbitControls

  // Fade in text after mount
  useEffect(() => {
    // Trigger fade-in shortly after the component mounts
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 200); //1 second delay helps prevent flicker; can be 0

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer); 
  }, [])

  // Clear timeout if component unmounts or on interaction
  const clearFadeInTimeout = () => {
    if (fadeInTimeout.current) {
      clearTimeout(fadeInTimeout.current);
      fadeInTimeout.current = null; 
    }
  }

  useImperativeHandle(ref, () => ({ //pass ref to parent
    resetCamera: () => { // Method to reset camera position
      const controls = controlsRef.current;
      if (controls) {
        
        controls.reset(); // Reset camera position
        controls.target.set(0, 3.5, 0); // Set target to the model's position
        controls.update(); // Update controls to apply changes
        clearFadeInTimeout(); // Clear fade-in timeout on reset
        setActiveSection(null); // Reset active section
        if (!setShowContent){
          setShowContent(false);  // Optional: hide text during reset
        }
        fadeInTimeout.current = setTimeout(() => {
          setShowContent(true); // Fade text back in after reset
        }, 1000);
      }
    },
  }));

  const openSection = (sectionName, planetPosition) => {
    setActiveSection(sectionName); // Set the active section

    const controls = controlsRef.current;
    const camera = controls?.object; // Get the camera object

    if (controls && camera) {
      if (planetPosition){
        controls.target.set(...planetPosition); // Set target to the planet's position

        //move camera to a good view of planet offset from it
        const offset = [planetPosition[0] + 3, planetPosition[1] + 1.5, planetPosition[2] + 3];
        camera.position.set(...offset); // Set camera position to the offset

        controls.update(); // Update controls to apply changes

      } else{
        controls.target.set(0, 3.5, 0); // Reset target to the model's position
        camera.position.set(0, 5, 10); // Reset camera position
        controls.update(); // Update controls to apply changes
      }
    }
  }


  // Return the hero section with a 3D model and text overlay
  return(
    <div id="hero" className="hero-container">
      {/* Background canvas */}
        <Canvas className="hero-canvas">
          {/* Ambient light to softly illuminate the model */}
          <ambientLight intensity={0.5} />

          {/* OrbitControls allows you to move around the scene with the mouse */}
          <OrbitControls 
            ref={controlsRef} // Ref to be able to reset camera
            /*target={[0, 3.5, 0]} */
            enableDamping 
            dampingFactor={0.1} 
            maxPolarAngle={Math.PI / 2}

            onStart={() => { 
              clearFadeInTimeout(); // Clear fade-in timeout on interaction
              setShowContent(false) //Hide content when interacting
            }}

            onEnd={() => { //Show content when interaction ends
              clearFadeInTimeout(); // Clear fade-in timeout on interaction
              fadeInTimeout.current = setTimeout(() => 
                setShowContent(true), 4000); // Fade back in after 2 sec of inactivity
            }}
            />

          {/* Lighting to illuminate the model */}
          {/* Suspense to handle asynchronous model loading */}
          <Suspense fallback={null}>
            <Spaceboi /> {/* The 3D model */}
            <Planets  
            onPlanetClick={(section ) => openSection(section)} 
            activeSection={activeSection}
            />{/* The planets */}
          </Suspense>
        </Canvas>

        {/* === Text Overlay Content === */}
        <div className={`hero-content ${showContent ? 'visible' : ''}`}>
            {/* Can add more tags/buttons here later */}
            <h1>Welcome to My Portfolio</h1>
            <p>Pan around to explore my work</p>
        </div>
        <p className={`hero-content-credits ${showContent ? 'visible' : ''}`}>"space boi" by <a href="https://skfb.ly/oyXLG" target="_blank" rel="noopener noreferrer">silvercrow101 is licensed under Creative Commons Attribution-NonCommercial</a></p>
    </div>
  )
});

export default Hero;