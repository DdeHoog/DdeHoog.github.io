import './App.css'
import { About, Experience, Hero, Portfolio, NavBar } from './components'
import { Suspense, useRef } from 'react';


function App() {
  const heroRef = useRef(); // Ref to access the Hero component

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
      />
      <Hero ref={heroRef}/>

    </div>
  )
}

export default App