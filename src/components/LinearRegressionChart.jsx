import React, { useEffect, useState } from 'react'
import Chart from 'react-google-charts'
import regression from 'regression'

const LinearRegressionChart = ({ historicalData }) => {
  const [data, setData] = useState([['Time', 'Regression']])
  const [equation, setEquation] = useState('')

  useEffect(() => {
    if (historicalData?.prices) {
      // Preparamos los datos como [x, y], usando el índice como x
      const rawData = historicalData.prices.map((item, index) => [index, item[1]])

      // Calculamos la regresión lineal
      const result = regression.linear(rawData)

      // Guardamos la ecuación en formato y = mx + b
      const [slope, intercept] = result.equation
      setEquation(`y = ${slope.toFixed(4)}x + ${intercept.toFixed(2)}`)

      // Solo graficamos los valores de la regresión
      const regressionData = rawData.map(([x]) => [x, result.predict(x)[1]])

      // Establecemos los datos con solo la línea de regresión
      setData([['Time', 'Linear Regression'], ...regressionData])
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
