import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Colores para cada moneda
const COLORS = [
  "#10b981", // emerald
  "#06b6d4", // cyan
  "#f59e42", // orange
  "#e11d48", // rose
  "#6366f1", // indigo
  "#fbbf24", // yellow
  "#a21caf", // purple
  "#84cc16", // lime
  "#f43f5e", // pink
  "#0ea5e9", // sky
];

// Recibe selectedSymbols, allChartData (objeto {symbol: chartData}), filterChartDataByHours, period
const AreaChartMulti = ({
  selectedSymbols,
  allChartData,
  filterChartDataByHours,
  period,
}) => {
  const [multiData, setMultiData] = useState([]);

  useEffect(() => {
    // Unir por fecha los datos de todas las monedas seleccionadas
    const symbolData = {};
    selectedSymbols.forEach((symbol) => {
      const chartData = allChartData[symbol];
      if (!chartData) return;
      const filtered = filterChartDataByHours(chartData, period);
      symbolData[symbol] = filtered;
    });
    // Unir por fecha
    const allDates = new Set();
    Object.values(symbolData).forEach((obj) => {
      Object.keys(obj || {}).forEach((date) => allDates.add(date));
    });
    const sortedDates = Array.from(allDates).sort();
    // Normalizar cada serie para que empiece en 1 y guardar el valor real
    const firstValues = {};
    selectedSymbols.forEach((symbol) => {
      const dates = Object.keys(symbolData[symbol] || {});
      const firstDate = dates.length > 0 ? dates[0] : null;
      firstValues[symbol] = firstDate
        ? Number(symbolData[symbol][firstDate])
        : null;
    });
    const data = sortedDates.map((date) => {
      const entry = { date };
      selectedSymbols.forEach((symbol) => {
        const val = symbolData[symbol]?.[date]
          ? Number(symbolData[symbol][date])
          : null;
        entry[symbol] =
          val && firstValues[symbol] ? val / firstValues[symbol] : null;
        // Guardar el valor real para el tooltip
        entry[`${symbol}_real`] = val;
      });
      return entry;
    });
    setMultiData(data);
  }, [selectedSymbols, allChartData, filterChartDataByHours, period]);

  // Tooltip personalizado para mostrar solo el precio real y la fecha formateada
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;
    // Formatear la fecha: AAAAMMDD_HHMMSSmmm => DD/MM/AAAA HH:mm:ss.mmm
    let formattedLabel = label;
    if (
      typeof label === "string" &&
      label.length >= 16 &&
      label.includes("_")
    ) {
      const [date, time] = label.split("_");
      if (date.length === 8 && time.length >= 6) {
        const yyyy = date.slice(0, 4);
        const mm = date.slice(4, 6);
        const dd = date.slice(6, 8);
        const hh = time.slice(0, 2);
        const min = time.slice(2, 4);
        const ss = time.slice(4, 6);
        const ms = time.length > 6 ? "." + time.slice(6) : "";
        formattedLabel = `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}${ms}`;
      }
    }
    return (
      <div
        style={{
          background: "#222",
          border: "none",
          borderRadius: 8,
          padding: 10,
          color: "#fff",
        }}
      >
        <div style={{ fontSize: 12, marginBottom: 4 }}>
          Fecha: {formattedLabel}
        </div>
        {selectedSymbols.map((symbol, idx) => {
          const serie = payload.find((p) => p.dataKey === symbol);
          const real =
            serie && serie.payload ? serie.payload[`${symbol}_real`] : null;
          return (
            <div
              key={symbol}
              style={{
                color: COLORS[idx % COLORS.length],
                fontWeight: 600,
                marginBottom: 2,
              }}
            >
              {symbol}:{" "}
              <span style={{ color: "#fff", fontWeight: 400 }}>
                {real
                  ? `$${real.toLocaleString(undefined, {
                      maximumFractionDigits: 8,
                    })}`
                  : "-"}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={multiData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <XAxis dataKey="date" hide />
        <YAxis
          domain={["auto", "auto"]}
          tick={false} // Oculta los valores del eje Y
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {/* Las series están normalizadas: todas empiezan en 1 (cambio relativo) */}
        {selectedSymbols.map((symbol, idx) => (
          <Line
            key={symbol}
            type="monotone"
            dataKey={symbol}
            stroke={COLORS[idx % COLORS.length]}
            dot={false}
            strokeWidth={2}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AreaChartMulti;
