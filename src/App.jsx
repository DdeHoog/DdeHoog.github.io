import './App.css'
import { About, Experience, Hero, Portfolio, NavBar } from './components'
import { Suspense, useRef, useState } from 'react';


function App() {
  const heroRef = useRef(); // Ref to access the Hero component

  // State to manage visibility of Hero content
  const [heroContentVisible, setHeroContentVisible] = useState(false); 

  const handleNavigate = (sectionName, position) => {
    // Calls the navigateToSection method on the Hero component
    if (heroRef.current) {
      heroRef.current.navigateToSection(sectionName, position);
    }
  }

  return (
    <div>
      <NavBar 
        onLogoClick={() => heroRef.current?.resetCamera()}
        onPlanetClick={handleNavigate}// Calls the navigateToSection method on Hero component
        showTooltipOnHeroContentVisible={heroContentVisible} // Pass the function to set hero content visibility
      />
      <Hero 
        ref={heroRef}
        onSetHeroContentVisible={setHeroContentVisible} // Pass the setter function to Hero
      />

    </div>
  )
}

export default App