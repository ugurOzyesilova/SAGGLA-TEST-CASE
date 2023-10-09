import React from 'react'
import "./App.css"
import BitcoinGraph from './components/BitcoinGraph'
import SocketGraph from "./components/SocketGraph"
import KlineTable from "./components/KlineTable"
import Nav from "./components/Nav"
import Header from "./components/Header"
const App = () => {
  return (
    <div className='app'>
    <div className='ball'></div>
      <div className='ball2'></div>
    <div className='app-glass'>
        <Nav />
        <div className='app-glass__structure'>
          <Header />
          <div className='app-glass__structure__graphs'>
            <BitcoinGraph />
            <SocketGraph />
            <KlineTable />
          </div>
         
        </div>
    </div>
     
    </div>
  )
}

export default App
