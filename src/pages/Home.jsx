import React from 'react'
import Navbar from '../components/Navbar'
import CoinArea from '../components/CoinArea'
import Footer from '../components/Footer'

//Pagina principal que carga la lista de criptomonedas

const Home = () => {
    return (
        <>
            <Navbar />
            <CoinArea />
            <Footer />
        </>
    )
}

export default Home