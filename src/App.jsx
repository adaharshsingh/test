import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Hero from './pages/Hero'
import Skills from './pages/Skills'
import Projects from './pages/Projects'
import Footer from './pages/Footer'
import MacApp from './mac-app/App'
import IntroLoader from './components/IntroLoader'

function App() {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Lock scroll only during intro - MacModel handles its own scroll lock
    if (showLoader) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      // Unlock scroll after intro - MacModel takes over from here
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    }
  }, [showLoader]);

  const handleLoadingComplete = () => {
    setShowLoader(false);
  };

  return (
    <Router>
      {showLoader && <IntroLoader onLoadComplete={handleLoadingComplete} />}
      <Routes>
        <Route path="/" element={
          <div style={{ width: '100vw', overflow: 'visible' }}>
            <Hero loaderComplete={!showLoader} />
            <Skills />
            <Projects isIntroComplete={!showLoader} />
            <Footer />
          </div>
        } />
        <Route path="/mac-app" element={<MacApp />} />
      </Routes>
    </Router>
  )
}

export default App