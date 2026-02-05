import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Hero from './pages/Hero'
import Skills from './pages/Skills'
import MacApp from './mac-app/App'

function App() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<><Hero /><Skills /></>} />
        <Route path="/mac-app" element={<MacApp />} />
      </Routes>
    </Router>
  )
}

export default App