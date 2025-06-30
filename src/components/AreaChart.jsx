import React, { useEffect, useState } from "react";
import Chart from "react-google-charts";

//Componente de graficos, usa Google Charts

//Toma como propiedades los datos crudos obtenidos desde la API (historicalData)
const AreaChart = ({ historicalData, currencySymbol }) => {
  //Estado del grafico
  //Contendra los datos ya formateados
  const [data, setData] = useState([["Date", "Prices"]]);

  //Se toman los datos crudos y se formatean para almacenarse
  useEffect(() => {
    if (
      historicalData &&
      typeof historicalData === "object" &&
      !historicalData.prices
    ) {
      // Nuevo formato: objeto con claves de fecha y valores de precio
      const formattedData = Object.entries(historicalData).map(
        ([key, value]) => {
          // key: "20250629_204100006"
          const year = parseInt(key.slice(0, 4));
          const month = parseInt(key.slice(4, 6)) - 1;
          const day = parseInt(key.slice(6, 8));
          const hour = parseInt(key.slice(9, 11));
          const minute = parseInt(key.slice(11, 13));
          const second = parseInt(key.slice(13, 15));
          const date = new Date(year, month, day, hour, minute, second);
          return [date, parseFloat(value)];
        }
      );
      // Ordena por fecha ascendente
      formattedData.sort((a, b) => a[0] - b[0]);
      setData([["Date", "Price"], ...formattedData]);
    } else if (historicalData?.prices) {
      // Formato CoinGecko (por compatibilidad)
      const formattedData = historicalData.prices.map((item) => [
        new Date(item[0]),
        item[1],
      ]);
      setData([["Date", "Price"], ...formattedData]);
    }
  }, [historicalData]);

  const options = {
    backgroundColor: "transparent",
    legend: "none",
    curveType: "function",
    hAxis: {
      textStyle: { color: "#FFFFFF" },
      gridlines: { color: "#444444" },
      format: "MMM dd",
    },
    vAxis: {
      textStyle: { color: "#FFFFFF" },
      gridlines: { color: "#444444" },
      format: `'${currencySymbol}'#,##0.00`,
    },
    chartArea: {
      backgroundColor: {
        fill: "transparent",
        opacity: 0,
      },
      width: "90%",
      height: "80%",
    },
    colors: ["#10B981"],
    lineWidth: 3,

    crosshair: {
      trigger: "both",
      orientation: "vertical",
      color: "#00FFFF",
      opacity: 0.2,
    },
    tooltip: {
      textStyle: { color: "#000000" },
      showColorCode: true,
      isHtml: true,
    },
  };

  return (
    <div
      className=" w-full bg-gray-800/20 backdrop-blur-sm rounded-xl p-4 border
         border-emerald-500/20"
    >
      <Chart
        chartType="AreaChart"
        data={data}
        options={options}
        loader={<div className=" text-emerald-400">Loading Market Data...</div>}
        rootProps={{ "data-testid": "1" }}
      />
    </div>
  );
};

export default AreaChart;
