import React, { useState, useEffect } from "react";
import logo from './logo.svg';
import './App.css';

const App = () => {
  const [page, setPage] = useState(1)
  const perPage = 100
  const [values, updateValues] = useState([])
  const [threshold, setThreshold] = useState(50000)
  const [frequency, setFrequency] = useState(0) // should use lazy loading

  let liveSocket = null

  useEffect(() => {
    let getConfigSocket = new WebSocket("ws://localhost:8765/get-config");
    getConfigSocket.onmessage = function (event) {
        const appConfig = JSON.parse(event.data)
        setFrequency(appConfig.update_frequency_milliseconds)
    }
    return () => getConfigSocket.close();
  }, []);

  useEffect(() => {
    liveSocket = new WebSocket("ws://localhost:8765/live");
  }, [])
  useEffect(() => {
    liveSocket.onmessage = function (event) {
        let rows = JSON.parse(event.data)
        updateValues(prevRows => {
          let temp = rows.concat(prevRows)
          if (temp.length > 500) {
            temp = temp.slice(0, 500)
          }
          return temp
        })
    }
  }, [liveSocket]);

  const updateFrequency = (frequency) => {
      let setConfigSocket = new WebSocket("ws://localhost:8765/set-config");
      setConfigSocket.onopen = function (event) {
        setConfigSocket.send(JSON.stringify({update_frequency_milliseconds: frequency}))
      }
   }

  // give some time to the user to set the frequency
  useEffect(() => {
      if (0 === frequency) return
      const timeOutId = setTimeout(() => updateFrequency(frequency), 500);
      return () => clearTimeout(timeOutId);
  }, [frequency]);

  const setBackgroundColor = (price) => {
    return price >= threshold ? "green" : "red"
  };

  let start = 0
  const getRows = (page) => {
    start = (page-1)*perPage
    const finish = page*perPage
    return values.slice(start, finish)
  }

  const pages = []
  for (let i = 1; i<=(Math.floor(values.length/perPage) || 1); i++) {
    pages.push(<option value={i}>{i}</option>)
  }

  return (
      <div className="App">
          <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" /> <p>Web GUI</p>
          </header>
          <p>Page {page}/{Math.floor(values.length/perPage) || 1} <br />
          Goto page: <select onChange={(event) => {
           setPage(event.target.value)
         }}>{pages}</select></p>
          <table className="main-table">
              <thead>
                  <tr>
                     <th>#</th>
                     <th>Symbol</th>
                     <th>Price</th>
                  </tr>
              </thead>
              <tbody>
              {getRows(page).map((row, index) => (
                  <tr key={row.uuid} style={{ backgroundColor: setBackgroundColor(row.price, threshold) }} >
                     <td>{index+1+(start)}</td>
                     <td>{row.symbol}</td>
                     <td>{row.price}</td>
                  </tr>
              ))}
              </tbody>
          </table>
          <form onSubmit={e => { e.preventDefault(); }}>
              <label htmlFor="threshold"><em>Color Threshold</em>
                  <input type="number" id="threshold" name="threshold" min="1" max="100000" value={threshold}
                  onChange={(event) => {
                      setThreshold(event.target.value)
                    }}
                  />
              </label>
              <label htmlFor="frequency"><em>Update Frequency</em>
                  <input type="number" id="frequency" name="frequency" min="10" max="10000" step="10" value={frequency}
                  onChange={(event) => {
                      setFrequency(event.target.value)
                    }}
                  />
              </label>
          </form>
      </div>
  )
}

export default App;
