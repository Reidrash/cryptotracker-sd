import React from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import CoinPage from '../components/CoinPage'

//Pagina de detalles individuales para cada criptomoneda

const Crypto = () => {
    return (
        <>
            <Navbar />
            <CoinPage />
            <Footer />
        </>
    )
}

export default Crypto