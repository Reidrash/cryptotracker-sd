import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import CryptoContextProvider from './context/CryptoContext'

//Punto de entrada de react y configuracion

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <CryptoContextProvider>
      <App />
    </CryptoContextProvider>
  </BrowserRouter>
)
