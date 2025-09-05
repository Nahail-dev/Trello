import React from 'react'
import Navbar from '../Navbar/Navbar'
import './Home.css'
import Tcard from '../TrelloCards/Tcard'
function Home() {
  return (
    <div className="home">
        <Navbar/>   
        <Tcard/>
    </div>
  )
}

export default Home