import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom"; //id de la moneda desde la URL
import { CryptoContext } from "../context/CryptoContext"; //Proporciona la moneda actual
import AreaChart from "../components/AreaChart"; //Para el grafico de precios
import AreaChartMulti from "../components/AreaChartMulti";
import { ArrowDown, ArrowUp } from "lucide-react";
import { resilientFetch } from "../utils/fetchWithFallback";

import LinearRegressionChart from "../components/LinearRegressionChart";
import PriceCalculator from "../components/PriceCalculator";
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

// Diccionario de símbolos válidos y sus nombres e iconos locales
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

//Pagina de detalles de criptomonedas individuales

const CoinPage = () => {
  const { cryptoId } = useParams();
  const [chartData, setChartData] = useState(null); //Datos historicos
  const [period, setPeriod] = useState("10"); //Periodo seleccionado
  const [error, setError] = useState(null); //Manejo de errores
  const [prices, setPrices] = useState({});
  const [prevPrices, setPrevPrices] = useState({});
  const [changes, setChanges] = useState({});
  const [selectedSymbols, setSelectedSymbols] = useState([
    cryptoId.toUpperCase(),
  ]);
  const [allCharts, setAllCharts] = useState({});

  const { currentCurrency } = useContext(CryptoContext); //Moneda actual

  // Busca info local de la cripto
  const cryptoInfo = allowedCryptos.find(
    (c) => c.symbol === cryptoId.toUpperCase()
  );

  // Fetch precios actuales y cambios por minuto
  const fetchPrices = async () => {
    try {
      const res = await resilientFetch("/cripto/update");
      const data = await res.json();
      setPrevPrices(prices);
      setPrices(data);
    } catch (e) {}
  };

  // Fetch inicial y cada minuto
  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  // Calcular cambios porcentuales
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

  // Fetch datos históricos para la gráfica
  useEffect(() => {
    const fetchChart = async () => {
      setError(null);
      try {
        const symbolParam =
          cryptoId.toUpperCase() === "HYPE" ? "HP" : cryptoId.toUpperCase();
        const chartRes = await resilientFetch(`/cripto/data?symbol=${symbolParam}`);

        if (!chartRes.ok)
          throw new Error(`Error fetching chart data: ${chartRes.statusText}`);
        setChartData(await chartRes.json());
      } catch (err) {
        setError(err.message);
      }
    };
    fetchChart();
  }, [cryptoId, period]);

  // Filtra los datos de chartData según las horas seleccionadas
  function filterChartDataByHours(chartData, hours) {
    if (!chartData) return chartData;

    // Hora actual en UTC (en milisegundos)
    const now = new Date();
    const nowUTC = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds()
    );
    // Cutoff en UTC
    const cutoffUTC = nowUTC - hours * 60 * 60 * 1000;

    // Si es formato objeto (tu backend)
    if (!chartData.prices) {
      return Object.fromEntries(
        Object.entries(chartData).filter(([key]) => {
          const year = parseInt(key.slice(0, 4));
          const month = parseInt(key.slice(4, 6)) - 1;
          const day = parseInt(key.slice(6, 8));
          const hour = parseInt(key.slice(9, 11));
          const minute = parseInt(key.slice(11, 13));
          const second = parseInt(key.slice(13, 15));
          // Fecha en UTC
          const dateUTC = Date.UTC(year, month, day, hour, minute, second);
          return dateUTC >= cutoffUTC;
        })
      );
    }

    // Si es formato CoinGecko (por compatibilidad)
    return {
      ...chartData,
      prices: chartData.prices.filter(([timestamp]) => {
        return timestamp >= cutoffUTC;
      }),
    };
  }

  // Permite seleccionar/deseleccionar monedas para superponer
  const handleSymbolToggle = (symbol) => {
    setSelectedSymbols((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol]
    );
  };

  // Fetch datos históricos para todas las seleccionadas
  useEffect(() => {
    const fetchAll = async () => {
      const newCharts = {};
      for (const symbol of selectedSymbols) {
        const symbolParam = symbol === "HYPE" ? "HP" : symbol;
        try {
          const res = await resilientFetch(`/cripto/data?symbol=${symbolParam}`);
          if (res.ok) {
            newCharts[symbol] = await res.json();
          }
        } catch (e) {}
      }
      setAllCharts(newCharts);
    };
    fetchAll();
  }, [selectedSymbols, period]);

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>{error}</p>
      </div>
    );

  if (!cryptoInfo || !chartData)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500" />
      </div>
    );

  // Para HYPE, usa el valor de HP
  const priceKey =
    cryptoId.toUpperCase() === "HYPE" ? "HP" : cryptoId.toUpperCase();
  const currentPrice = parseFloat(prices[priceKey] || 0);
  const change = changes[priceKey] || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900/95 to-gray-900/90 text-white px-4 sm:px-[5%] md:px-[8%] py-6">
      <div className="flex flex-col items-center md:flex-row gap-4 mb-6 bg-gray-800/30 backdrop-blur-lg p-4 rounded-xl border border-emerald-500/20 ">
        <img
          src={cryptoInfo.icon}
          alt={cryptoInfo.name}
          className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 p-1"
        />
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            {cryptoInfo.name}
            <span className="text-xl md:text-2xl ml-2 text-cyan-400/80 inline-block mt-1">
              ({cryptoInfo.symbol})
            </span>
          </h1>
        </div>
      </div>

      <div className="mb-6 bg-gray-800/30 backdrop-blur-md p-4 rounded-xl border border-emerald-500/20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
          <h2 className="text-lg font-semibold text-emerald-400/90">
            Cambio de precio (USD)
          </h2>
          <div className="relative group flex items-center gap-2">
            <label htmlFor="hours" className="text-gray-300 text-sm">
              Horas:
            </label>
            <input
              id="hours"
              type="number"
              min={1}
              max={24}
              value={period}
              onChange={(e) => {
                const val = Math.max(1, Math.min(24, Number(e.target.value)));
                setPeriod(val);
              }}
              className="w-20 px-2 py-1 rounded bg-gray-800 border border-emerald-500 text-white text-sm"
            />
            <span className="text-gray-400 text-xs">(1-24)</span>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600/20 to-cyan-500/20 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-300 -z-10" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {allowedCryptos.map((c) => (
            <button
              key={c.symbol}
              onClick={() => handleSymbolToggle(c.symbol)}
              className={`px-3 py-1 rounded-full border text-sm transition-all duration-200 ${
                selectedSymbols.includes(c.symbol)
                  ? "bg-emerald-500/30 border-emerald-400 text-emerald-100"
                  : "bg-gray-700/40 border-gray-500 text-gray-300 hover:bg-emerald-500/10 hover:border-emerald-400"
              }`}
            >
              {c.symbol}
            </button>
          ))}
        </div>
        <div className="h-64 md:h-80 ">
          <AreaChartMulti
            selectedSymbols={selectedSymbols}
            allChartData={allCharts}
            filterChartDataByHours={filterChartDataByHours}
            period={period}
          />
        </div>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-emerald-400/90 mb-2">
            Regresión lineal
          </h2>
          <LinearRegressionChart
            historicalData={filterChartDataByHours(chartData, period)}
          />
        </div>
      </div>

      <div className="mb-6 bg-gray-800/30 backdrop-blur-md p-4 rounded-xl border border-emerald-500/20 flex flex-col md:flex-row gap-4 items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <span className="text-sm text-cyan-400/80 mb-1">Precio actual</span>
          <span className="text-2xl font-bold text-emerald-400">
            $
            {currentPrice.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 8,
            })}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-sm text-cyan-400/80 mb-1">Cambio 1min</span>
          <span
            className={`text-2xl font-bold ${
              change > 0
                ? "text-emerald-400"
                : change < 0
                ? "text-red-400"
                : "text-gray-300"
            }`}
          >
            {change > 0 ? "▲" : change < 0 ? "▼" : ""}
            {Math.abs(change).toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="mb-6 bg-gray-800/30 backdrop-blur-md p-4 rounded-xl border border-emerald-500/20">
        <PriceCalculator
          currentPrice={currentPrice}
          currencySymbol={"$"}
          cryptoSymbol={cryptoInfo.symbol}
        />
      </div>
    </div>
  );
};

export default CoinPage;
