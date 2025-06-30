import React, { useEffect, useState } from 'react'
import Chart from 'react-google-charts'
import regression from 'regression'

const LinearRegressionChart = ({ historicalData }) => {
  const [data, setData] = useState([['Time', 'Regression']])
  const [equation, setEquation] = useState('')

  useEffect(() => {
    let rawData = []
    if (historicalData?.prices) {
      // Formato CoinGecko: [[timestamp, price], ...]
      rawData = historicalData.prices.map((item, index) => [index, item[1]])
    } else if (historicalData && typeof historicalData === 'object') {
      // Formato backend propio: { 'YYYYMMDD_HHMMSSsss': 'price', ... }
      // Ordenar las claves por fecha ascendente
      const entries = Object.entries(historicalData).sort(([a], [b]) => {
        // Extrae fecha UTC de la clave
        const parseKey = (key) => {
          const year = parseInt(key.slice(0, 4))
          const month = parseInt(key.slice(4, 6)) - 1
          const day = parseInt(key.slice(6, 8))
          const hour = parseInt(key.slice(9, 11))
          const minute = parseInt(key.slice(11, 13))
          const second = parseInt(key.slice(13, 15))
          return Date.UTC(year, month, day, hour, minute, second)
        }
        return parseKey(a) - parseKey(b)
      })
      rawData = entries.map(([key, value], index) => [index, parseFloat(value)])
    }

    if (rawData.length > 1) {
      // Calculamos la regresión lineal
      const result = regression.linear(rawData)
      // Guardamos la ecuación en formato y = mx + b
      const [slope, intercept] = result.equation
      setEquation(`y = ${slope.toFixed(4)}x + ${intercept.toFixed(2)}`)
      // Solo graficamos los valores de la regresión
      const regressionData = rawData.map(([x]) => [x, result.predict(x)[1]])
      setData([['Time', 'Linear Regression'], ...regressionData])
    } else {
      setEquation('')
      setData([['Time', 'Linear Regression']])
    }
  }, [historicalData])

  const options = {
    backgroundColor: 'transparent',
    legend: { position: 'none' },
    colors: ['#00FFFF'],
    hAxis: { title: 'Time', textStyle: { color: '#fff' } },
    vAxis: { title: 'Price', textStyle: { color: '#fff' } },
    chartArea: {
      width: '90%',
      height: '80%'
    }
  }

  return (
    <div className='w-full bg-gray-800/20 backdrop-blur-sm rounded-xl p-4 border border-emerald-500/20'>
      <p className='text-sm text-cyan-400 mb-2'>Ecuación de la recta: <span className='text-white font-mono'>{equation}</span></p>
      <Chart
        chartType='LineChart'
        data={data}
        options={options}
        loader={<div className='text-emerald-400'>Loading Regression Chart...</div>}
      />
    </div>
  )
}

export default LinearRegressionChart
