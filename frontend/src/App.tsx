import './App.css'
import Home from './components/Home';
import { Routes, Route } from "react-router-dom";
import Checkout from "./components/Checkout.tsx";
import Screensaver from "./components/Screensaver.tsx";
function App() {
  

  return (
    <>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/checkout" element={<Checkout />} />
        </Routes>
        <Screensaver idleTime={20000}/>
    </>
  )
}

export default App
