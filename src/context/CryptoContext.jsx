import { createContext, useEffect, useState } from "react";

//Contexto global para el manejo de estado
//El contexto global nos permite compartir datos entre componentes sin pasarlos manualmente
/*Es como una memoria compartida entre componentes, definimos este componente como un
proveedor de contexto para que sea consumido por cualquier componente*/

export const CryptoContext = createContext();

const CryptoContextProvider = (props) => {
  //Estados principales
  const [cryptoList, setCryptoList] = useState([]); //Todas las criptomonedas
  const [filteredCryptos, setFilteredCryptos] = useState([]); //Lista filtrada
  const [searchTerm, setSearchTerm] = useState(""); //Busqueda
  const [currentCurrency, setCurrentCurrency] = useState({
    //Moneda seleccionada para mostrar los datos
    name: "usd",
    symbol: "$",
  });

  //Fetch a coingecko
  const fetchCryptoData = async () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": "CG-AnBWaS7PvDtHUrGcEzUhXCKf",
      },
    };

    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currentCurrency.name}`,
        options
      );
      const data = await res.json();
      setCryptoList(data);
    } catch (err) {
      console.error("Failed to fetch crypto data:", err);
    }
  };

  // Efectos
  useEffect(() => {
    fetchCryptoData(); //Re-fetch cuando cambia la moneda

    // Nuevo: actualizar cada minuto
    const interval = setInterval(() => {
      fetchCryptoData();
    }, 60000); // 60,000 ms = 1 minuto

    return () => clearInterval(interval); // Limpieza al desmontar o cambiar moneda
  }, [currentCurrency]);

  useEffect(() => {
    //Filtrado en tiempo real segun el termino de busqueda
    if (searchTerm.trim() === "") {
      setFilteredCryptos(cryptoList);
    } else {
      setFilteredCryptos(
        cryptoList.filter((c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [cryptoList, searchTerm]);

  const contextValue = {
    cryptoList,
    filteredCryptos,
    currentCurrency,
    setCurrentCurrency,
    searchTerm,
    setSearchTerm,
  };

  return (
    <CryptoContext.Provider value={contextValue}>
      {props.children}
    </CryptoContext.Provider>
  );
};

export default CryptoContextProvider;
