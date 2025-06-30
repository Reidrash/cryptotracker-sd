import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ADAIcon from "../assets/ADA.png";
import ETHIcon from "../assets/ethereum.png";
import XRPIcon from "../assets/XRP.png";
import DOGEIcon from "../assets/DOGE.png";
import LINKIcon from "../assets/chainlink-new-logo.png";
import SOLIcon from "../assets/SOL.png";
import BTCIcon from "../assets/Bitcoin.svg.png";
import BCHIcon from "../assets/Bitcoin_Cash.png";
import TRXIcon from "../assets/TRX.png";
import HYPEIcon from "../assets/HYPE.png";

// Diccionario de símbolos válidos y sus nombres
const allowedCryptos = [
  { symbol: "ADA", name: "Cardano", icon: ADAIcon },
  { symbol: "ETH", name: "Ethereum", icon: ETHIcon },
  { symbol: "XRP", name: "XRP", icon: XRPIcon },
  { symbol: "DOGE", name: "Dogecoin", icon: DOGEIcon },
  { symbol: "LINK", name: "Chainlink", icon: LINKIcon },
  { symbol: "SOL", name: "Solana", icon: SOLIcon },
  { symbol: "BTC", name: "Bitcoin", icon: BTCIcon },
  { symbol: "BCH", name: "Bitcoin Cash", icon: BCHIcon },
  { symbol: "TRX", name: "Tron", icon: TRXIcon },
  { symbol: "HYPE", name: "Hyperliquid", icon: HYPEIcon },
];

const CoinArea = () => {
  const [prices, setPrices] = useState({});
  const [prevPrices, setPrevPrices] = useState({});
  const [changes, setChanges] = useState({});

  // Fetch precios y calcula cambios
  const fetchPrices = async () => {
    try {
      const res = await fetch("http://35.239.176.185/cripto/update");
      const data = await res.json();
      setPrevPrices(prices); // Guarda los precios previos (antes de actualizar)
      setPrices(data);
    } catch (e) {
      // Manejo simple de error
    }
  };

  // Fetch inicial y cada minuto
  useEffect(() => {
    fetchPrices();
    const interval = setInterval(() => {
      fetchPrices();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Calcular cambios porcentuales justo después de actualizar precios
  useEffect(() => {
    const newChanges = {};
    allowedCryptos.forEach(({ symbol }) => {
      const priceKey = symbol === "HYPE" ? "HP" : symbol;
      const prev = parseFloat(prevPrices[priceKey]);
      const curr = parseFloat(prices[priceKey]);
      if (prev && curr) {
        newChanges[priceKey] = ((curr - prev) / prev) * 100;
      } else {
        newChanges[priceKey] = 0;
      }
    });
    setChanges(newChanges);
  }, [prices, prevPrices]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900/95 to-gray-900/90 text-white px-4 sm:px-[5%] py-6 md:py-10 relative z-0">
      {/* HERO SECTION */}
      <div className=" text-center mb-8 md:mb-12 space-y-4 group relative">
        <div
          className=" absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 blur-3xl
                 opacity-30 animate-pulse-slow"
        />
        <h1
          className=" text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-emerald-400
                  via-cyan-300 to-emerald-400 bg-clip-text text-transparent animate-gradient-x leading-tight"
        >
          Analiza criptomonedas <br />
          <span
            className=" text-xl sm:text-2xl md:text-3xl lg:text-4xl bg-gradient-to-r from-cyan-400 to-emerald-400
                     bg-clip-text text-transparent"
          >
            para tomar las mejores decisiones
          </span>
        </h1>
        <p
          className=" text-gray-300/80 max-w-xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed
                  mt-4"
        >
          Ponemos a tu disposicion informacion actualizada que se actualiza
          <span
            className=" bg-gradient-to-r from-emerald-400/80 to-cyan-400/80 bg-clip-text text-transparent
                     mx-2"
          >
            cada minuto
          </span>
        </p>
      </div>

      {/* HEADER */}
      <div className="grid grid-cols-4 gap-4 text-sm py-4 px-4 mb-2 bg-gray-800/40 backdrop-blur-lg rounded-xl border border-emerald-500/20">
        <p className="text-emerald-400/90">Posición</p>
        <p className="text-cyan-400/90">Nombre</p>
        <p className="text-cyan-400/90">Precio (USD)</p>
        <p className="text-center">Cambio 1min</p>
      </div>

      {/* LISTA DE CRYPTOS */}
      <div className="space-y-3 relative z-10">
        {allowedCryptos.map(({ symbol, name, icon }, idx) => {
          // Para HYPE, usa el valor de HP en el objeto de precios y cambios
          const priceKey = symbol === "HYPE" ? "HP" : symbol;
          return (
            <Link to={`/crypto/${symbol}`} key={symbol} className="block">
              <div
                className="grid grid-cols-4 gap-4 items-center p-4 bg-gray-800/30 backdrop-blur-md hover:bg-gray-700/40 rounded-xl border border-emerald-500/10 hover:border-cyan-500/30 transition-all duration-300 group"
              >
                <span className="text-emerald-400/80 text-sm lg:text-base">
                  #{idx + 1}
                </span>
                <div className="flex items-center gap-3">
                  <img
                    src={icon}
                    alt={name}
                    className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 p-0.5"
                  />
                  <div>
                    <p className="font-medium text-gray-100 text-base lg:text-lg">
                      {name}
                    </p>
                    <p className="text-sm lg:text-base text-cyan-400/80">
                      {symbol}
                    </p>
                  </div>
                </div>
                <span className="text-gray-100">
                  $
                  {parseFloat(prices[priceKey] || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 8,
                  })}
                </span>
                <div
                  className={`text-center px-2 py-1 rounded-full text-sm lg:text-base ${
                    changes[priceKey] > 0
                      ? "bg-emerald-500/20 text-emerald-400"
                      : changes[priceKey] < 0
                      ? "bg-red-500/20 text-red-400"
                      : "bg-gray-500/20 text-gray-300"
                  }`}
                >
                  {changes[priceKey] > 0 ? "▲" : changes[priceKey] < 0 ? "▼" : ""}
                  {Math.abs(changes[priceKey] || 0).toFixed(2)}%
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CoinArea;
