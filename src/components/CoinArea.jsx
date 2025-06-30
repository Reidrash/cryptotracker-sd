import React, { useContext, useState } from "react";
import { CryptoContext } from "../context/CryptoContext";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

// Diccionario de símbolos cortos válidos para mostrar en la Home Page
const allowedSymbols = [
  "ADA",
  "ETH",
  "XRP",
  "DOGE",
  "LINK",
  "SOL",
  "BTC",
  "BCH",
  "TRX",
  "HP",
];

//Lista principal de criptomonedas

const CoinArea = () => {
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const { filteredCryptos, currentCurrency, setCurrentCurrency } =
    useContext(CryptoContext);
  const [input, setInput] = useState(""); //Guara el texto que se ingresa en la barra de busqueda
  const [filteredCoins, setFilteredCoins] = useState([]); // Lista de criptomonedas filtradas para mostrar sugerencias
  //Lista de criptomonedas junto con la funcion para actualizar el termino de busqueda
  const { cryptoList = [], setSearchTerm } = useContext(CryptoContext);

  //Cambio de moneda por medio de un menu en la cabecera de la tabla, por default es USD
  const handleCurrencySelect = (selectedCurrency) => {
    switch (selectedCurrency) {
      case "usd":
        setCurrentCurrency({ name: "usd", symbol: "$" });
        break;
      case "eur":
        setCurrentCurrency({ name: "eur", symbol: "€" });
        break;
      case "mxn":
        setCurrentCurrency({ name: "mxn", symbol: "MXN" });
        break;
      default:
        setCurrentCurrency({ name: "usd", symbol: "$" });
    }
    setIsCurrencyDropdownOpen(false);
  };

  //Manejador de busqueda
  const searchHandler = (event) => {
    event.preventDefault(); //Se evita la recarga de la pagina
    setSearchTerm(input); //Actualiza la busqueda global en Cryptocontext
    setFilteredCoins([]); //Limpia sugerencias
  };

  //Autocompletado para la barra de busqueda
  const inputHandler = (event) => {
    const value = event.target.value;
    setInput(value); //Actualiza el input con lo que el usuario escriba

    if (value === "") {
      //Si el campo queda vacio...
      setSearchTerm(""); //Se borra el termino
      setFilteredCoins([]); //Limpia las sugerencias
    } else {
      //Si hay texto...
      //Filtra y muestra las primeras 5 coincidencias
      const suggestions = cryptoList.filter((coin) =>
        coin.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCoins(suggestions.slice(0, 5)); //Limita el numero de sugerencias
    }
  };

  return (
    <div
      className=" min-h-screen bg-gradient-to-br from-gray-900 via-gray-900/95 to-gray-900/90 text-white
         px-4 sm:px-[5%] py-6 md:py-10 relative z-0"
    >
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

      {/* SEARCH */}
      <form onSubmit={searchHandler} className=" mb-6 relative z-50">
        <div className=" relative group">
          <div
            className=" absolute -inset-0.5 bg-gradient-to-r from-emerald-600/40 to-cyan-500/40 rounded-full
                     blur opacity-30 group-hover:opacity-50 transition duration-300"
          />

          <div className=" relative flex items-center">
            <input
              type="text"
              placeholder="Buscar criptomomenda"
              value={input}
              onChange={inputHandler}
              required
              className=" w-full px-6 py-3 bg-gray-800/60 border border-gray-600/30 rounded-full
                          focus:outline-none focus:ring-2 focus:ring-emerald-500/50 placeholder-gray-400 text-gray-200
                           backdrop-blur-sm"
            />

            <button
              type="submit"
              className=" z-10 relative right-2 top-1/2 -translate-x-1/2 px-4
                           py-1.5 bg-gradient-to-r from-emerald-400 to-cyan-400 text-white rounded-full
                            hover:scale-105 transition-all"
            >
              <Search className=" w-4 h-4 pointer-events-none" />
            </button>
          </div>
        </div>

        {filteredCoins.length > 0 && (
          <ul
            className="absolute top-full left-0 w-full bg-gray-800/95 border border-gray-700 mt-2 rounded-lg
                                shadow-xl z-50 backdrop-blur-md max-h-60 overflow-y-auto"
          >
            {filteredCoins.map((coin, idx) => (
              <li
                key={idx}
                className=" px-4 py-2 hover:bg-emerald-600/30 cursor-pointer text-gray-100"
                onClick={() => {
                  setInput(coin.name);
                  setFilteredCoins([]);
                }}
              >
                {coin.name}
              </li>
            ))}
          </ul>
        )}
      </form>

      {/* TASK HEADER */}
      <div
        className=" hidden md:grid grid-cols-5 gap-4 text-sm py-4 px-4 mb-2 bg-gray-800/40 backdrop-blur-lg rounded-xl
             border border-emerald-500/20"
      >
        <p className=" text-emerald-400/90">Posicion</p>
        <p className=" text-cyan-400/90">Nombre</p>

        <div
          className=" relative flex items-center gap-1 cursor-pointer group"
          onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
        >
          <span>Precio</span>
          <div className=" flex items-center gap-1">
            <span className=" text-emerald-400/90 ">
              ({currentCurrency.symbol})
            </span>
            <ChevronDown
              className={`w-4 h-4 text-cyan-400/80 transition-transform ${
                isCurrencyDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
        <p className=" text-center">Cambio</p>
        <p className=" text-right">Valor total</p>
      </div>

      {/* CURRENCY DROPDOWN */}
      {isCurrencyDropdownOpen && (
        <div
          className=" relative bg-gray-800/95 backdrop-blur-xl rounded-lg border
                  border-emerald-500/20 shadow-2xl z-50"
        >
          {["usd", "eur", "mxn"].map((code) => (
            <div
              key={code}
              className=" px-4 py-3 hover:bg-emerald-600/30 transition-colors cursor-pointer
                         flex items-center gap-2"
              onClick={() => handleCurrencySelect(code)}
            >
              <span className=" text-emerald-400/80">
                {code === "usd" ? "$" : code === "eur" ? "€" : "MXN"}
              </span>
              <span className=" text-gray-100">{code.toUpperCase()}</span>
            </div>
          ))}
        </div>
      )}

      {/* COIN LIST */}
      <div className=" space-y-3 relative z-10">
        {filteredCryptos
          .filter((item) => allowedSymbols.includes(item.symbol?.toUpperCase()))
          .slice(0, 10)
          .map((item) => (
            <Link
              to={`/crypto/${item.symbol}`}
              key={item.id}
              className=" block p-4 bg-gray-800/30 backdrop-blur-md hover:bg-gray-700/40 rounded-xl
                     border border-emerald-500/10 hover:border-cyan-500/30 transition-all duration-300 group"
            >
              {/* MOBILE TABLET LAYOUT */}
              <div className=" md:hidden space-y-3">
                <div className=" flex items-center justify-between">
                  <div className=" flex items-center gap-3">
                    <span className=" text-emerald-400/80 text-sm">
                      #{item.market_cap_rank}
                    </span>
                    <img
                      src={item.image}
                      alt={item.name}
                      className=" w-7 h-7 sm:w-8 sm:h-8 rounded-full
                                     bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 p-0.5"
                    />

                    <div>
                      <p className=" font-medium text-gray-100 sm:text-base text-sm">
                        {item.name}
                      </p>
                      <p className=" text-xs sm:text-sm text-cyan-400/80 mt-0.5">
                        {item.symbol.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div className=" text-right">
                    <p className=" text-sm sm:text-base text-gray-100">
                      {currentCurrency.symbol}
                      {item.current_price.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className=" flex items-center justify-between pt-2 border-t border-emerald-500/10">
                  <div
                    className={`flex items-center gap-1 text-sm sm:text-base 
                                ${
                                  item.price_change_percentage_24h > 0
                                    ? "text-emerald-400"
                                    : "text-red-400"
                                } `}
                  >
                    <span>
                      {" "}
                      {item.price_change_percentage_24h > 0 ? "▲" : "▼"}
                    </span>
                    {Math.abs(item.price_change_percentage_24h).toFixed(2)}%
                  </div>

                  <div className=" text-right">
                    <p className=" text-sm sm:text-base text-gray-100">
                      {currentCurrency.symbol}
                      {item.market_cap.toLocaleString()}
                    </p>
                    <p className=" text-xs sm:text-sm text-emerald-400/60 mt-0.5">
                      Vol: {currentCurrency.symbol}
                      {item.total_volume.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* DESKTOP VIEW */}
              <div className=" hidden md:grid grid-cols-5 gap-4 items-center">
                <span className=" text-emerald-400/80 text-sm lg:text-base">
                  #{item.market_cap_rank}
                </span>
                <div className=" flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className=" w-8 h-8 lg:w-10 lg:h-10 rounded-full
                                 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 p-0.5"
                  />

                  <div>
                    <p className=" font-medium text-gray-100 text-base lg:text-lg">
                      {item.name}
                    </p>
                    <p className=" text-sm lg:text-base text-cyan-400/80">
                      {item.symbol.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className=" flex items-center gap-1">
                  <span className=" text-cyan-400/80">
                    {currentCurrency.symbol}
                  </span>
                  <span className=" text-gray-100">
                    {item.current_price.toLocaleString()}
                  </span>
                </div>

                <div
                  className={`text-center px-2 py-1 rounded-full text-sm lg:text-base 
                                    ${
                                      item.price_change_percentage_24h > 0
                                        ? "bg-emerald-500/20 text-emerald-400"
                                        : "bg-red-500/20 text-red-400"
                                    } `}
                >
                  {item.price_change_percentage_24h > 0 ? "▲" : "▼"}
                  {Math.abs(item.price_change_percentage_24h).toFixed(2)}%
                </div>

                <div className=" text-right">
                  <p className=" text-sm lg:text-base text-gray-100">
                    {currentCurrency.symbol}
                    {item.market_cap.toLocaleString()}
                  </p>
                  <p className=" text-xs lg:text-sm text-emerald-400/60 mt-0.5">
                    Vol: {currentCurrency.symbol}
                    {item.total_volume.toLocaleString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default CoinArea;
