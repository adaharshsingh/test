import { Dock, Home, Navbar, Welcome } from '#components'
import { Draggable } from 'gsap/Draggable'
import { gsap } from 'gsap'
import { Terminal, Safari, Resume, Text, Finder, Image, Contact, Gallery } from '#windows';
gsap.registerPlugin(Draggable);

const App = () => {
  return (
    <main className="macapp-container">
      <Navbar />
      <Welcome />
      <Dock />

      <Terminal />
      <Safari />
      <Resume />
      <Text />
      <Finder />
      <Image />
      <Contact />
      <Gallery />
      <Home />
    </main>
  )
}

export default App