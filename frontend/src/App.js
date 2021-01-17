import React, { useState, useEffect } from "react";
import logo from './logo.svg';
import './App.css';

const App = () => {
  const [values, updateValues] = useState([])
  const [threshold, setThreshold] = useState(50000)
  const [frequency, setFrequency] = useState(0)

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
        updateValues(rows)
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

  return (
      <div className="App">
          <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" /> <p>Web GUI</p>
          </header>
          <table className="main-table">
              <thead>
                  <tr>
                     <th>Symbol</th>
                     <th>Price</th>
                  </tr>
              </thead>
              <tbody>
              {values.map(row => (
                  <tr key={row.symbol+row.price} style={{ backgroundColor: setBackgroundColor(row.price, threshold) }} >
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
