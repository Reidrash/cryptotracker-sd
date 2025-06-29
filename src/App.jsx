import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Crypto from './pages/Crypto'

//Aqui tenemos el componente principal con las rutas del Home y Crypto (detalles individuales)

const App = () => {
  return (
    <div className='app'>
      <Routes>
        {/* Ruta principal - muestra lista de cryptos */}
        <Route path='/' element={<Home />} />
        {/* Ruta dinámica - detalles de crypto específica */}
        <Route path='/crypto/:cryptoId' element={<Crypto />} />
      </Routes>
    </div>
  )
}

export default App