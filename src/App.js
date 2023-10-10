import React from 'react'
import "./App.css"
import BitcoinGraph from './components/BitcoinGraph'
import SocketGraph from "./components/SocketGraph"
import KlineTable from "./components/KlineTable"
import Nav from "./components/Nav"
import Header from "./components/Header"
import {useState} from "react"


const App = () => {

  const [theme, setTheme] = useState("app-dark");
  const changeTheme = () => {setTheme(theme === "app-dark" ? "app-light" : "app-dark")}

  return (
    <div className={theme}>
    <div className='ball'></div>
      <div className='ball2'></div>
    <div className='app-glass'>
        <Nav changeTheme = {changeTheme}/>
        <div className='app-glass__structure'>
          <Header />
          <div className='app-glass__structure__graphs'>
            <BitcoinGraph theme = {theme}/>
            <SocketGraph theme={theme} />
            <KlineTable theme = {theme}/>
          </div>
         
        </div>
    </div>
     
    </div>
  )
}

export default App
