import './App.css'
import { About, Experience, Hero, Portfolio, NavBar } from './components'
import { Suspense, useRef } from 'react';


function App() {
  const heroRef = useRef(); // Ref to access the Hero component

  return (
    <div>
      <NavBar onLogoClick={() => heroRef.current?.resetCamera()}/>
      <Hero ref={heroRef}/>

    </div>
  )
}

export default App