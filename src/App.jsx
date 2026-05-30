import { About, Experience, Hero, Portfolio, NavBar } from './components'
import { Suspense, useRef, useState } from 'react';


function App() {
  const heroRef = useRef();
  const [heroContentVisible, setHeroContentVisible] = useState(false);

  const handleNavigate = (sectionName, position) => {
    if (heroRef.current) {
      heroRef.current.navigateToSection(sectionName, position);
    }
  }

  return (
    <div>
      <NavBar
        onLogoClick={() => heroRef.current?.resetCamera()}
        onPlanetClick={handleNavigate}
        showTooltipOnHeroContentVisible={heroContentVisible}
      />
      <Hero
        ref={heroRef}
        onSetHeroContentVisible={setHeroContentVisible}
      />
    </div>
  )
}

export default App