import React, { useContext, useState, useEffect} from 'react'
import { CryptoContext } from '../context/CryptoContext' //Permitimos que se use el contexto global
import { Coins } from 'lucide-react'


//Barra de navegacion con contador

const Navbar = () => {
    const [secondsLeft, setSecondsLeft] = useState(60);

    useEffect(() => {
        // Inicializar correctamente con el tiempo actual
        const syncWithClock = () => {
            const currentSeconds = new Date().getSeconds();
            setSecondsLeft(60 - currentSeconds);
        };

        syncWithClock(); // Llamada inicial

        const interval = setInterval(() => {
            setSecondsLeft(prev => {
                if (prev <= 1) {
                    return 60;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval); // Limpieza
    }, []);

    return (
        <nav className=' flex flex-wrap md:flex-nowrap items-center justify-between gap-4 px-[5%] md:px[8%] lg:px-[10%]
        py-5 bg-gray-900/80 backdrop-blur-md border-b border-gray-700/30 sticky top-0 z-50'>
            <a href="/" className=' order-1 flex-shrink-0 flex items-center gap-2 hover:scale-105
             transition-transform'>
                <Coins className=' w-8 h-8 text-emerald-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]' />
                <span className=' text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text
                 text-transparent'>
                    Cryptovros
                </span>
                
            </a>
            <div className="order-3 flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full border border-emerald-500/30">
                    <span className="text-sm text-cyan-400">Actualización en:</span>
                    <span className="font-mono text-emerald-400">{secondsLeft}s</span>
            </div>

            
        </nav>
    )
}

export default Navbar