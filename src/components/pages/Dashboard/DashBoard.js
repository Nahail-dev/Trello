import React from 'react'
import Navbar from '../../Navbar/Navbar'
import './DashBoard.css'
import Tcard from '../../TrelloCards/Tcard'
import AdvSearchNav from '../../advSearchNav/AdvSearchNav'

function Dashboard() {
  return (
    <div className="home">
      <AdvSearchNav/>
        <Navbar/>   
        <Tcard/>
    </div>
  )
}

export default Dashboard