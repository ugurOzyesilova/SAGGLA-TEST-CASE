import React from 'react'
import "../styles/Nav.css"
import { RiBitCoinLine } from "react-icons/ri"

const Nav = () => {
  return (
    <nav>
          <div className="hamburger">
              <div></div>
              <div className="middle__line"></div>
              <div></div>
          </div>
        <RiBitCoinLine className='nav-coin'/>
    </nav>
  )
}

export default Nav