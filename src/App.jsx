import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <video autoPlay muted loop class="background-video">
        <source src="images/rain_vid.mp4" type="video/mp4" />
      </video>
      {/* <img src="images/Artyfycial_black.png" /> */}
      <h2>Coming soon.</h2>
    </div>
  )
}

export default App
