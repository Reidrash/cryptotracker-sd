import React, { useState, useEffect } from 'react';

const PriceCalculator = ({ currentPrice, currencySymbol, cryptoSymbol }) => {
  const [cryptoAmount, setCryptoAmount] = useState('');
  const [fiatAmount, setFiatAmount] = useState('');

  // Cuando cambias crypto, actualiza fiat
  useEffect(() => {
    if (cryptoAmount === '') {
      setFiatAmount('');
      return;
    }
    const fiat = parseFloat(cryptoAmount) * currentPrice;
    setFiatAmount(fiat ? fiat.toFixed(2) : '');
  }, [cryptoAmount, currentPrice]);

  // Cuando cambias fiat, actualiza crypto
  const onFiatChange = (e) => {
    const value = e.target.value;
    setFiatAmount(value);

    const crypto = parseFloat(value) / currentPrice;
    setCryptoAmount(crypto ? crypto.toFixed(6) : '');
  };

  return (
    <div className="bg-gray-800/30 p-4 rounded-lg border border-emerald-500/20 my-6">
      <h3 className="text-lg text-emerald-400 mb-4">Calculadora de Precio</h3>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col flex-1">
          <label className="text-sm text-cyan-400 mb-1"> Compras ({cryptoSymbol.toUpperCase()})</label>
          <input
            type="number"
            min="0"
            step="any"
            value={cryptoAmount}
            onChange={e => setCryptoAmount(e.target.value)}
            className="p-2 rounded bg-gray-900 text-white border border-emerald-500"
            placeholder={`Ejemplo: 0.5`}
          />
        </div>
        <div className="flex flex-col flex-1">
          <label className="text-sm text-cyan-400 mb-1">Gastas ({currencySymbol})</label>
          <input
            type="number"
            min="0"
            step="any"
            value={fiatAmount}
            onChange={onFiatChange}
            className="p-2 rounded bg-gray-900 text-white border border-emerald-500"
            placeholder={`Ejemplo: 1000`}
          />
        </div>
      </div>
    </div>
  );
};

export default PriceCalculator;
