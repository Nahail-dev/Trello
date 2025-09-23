import React from 'react'
import { Link } from 'react-router-dom'
import SearchImg from '../../assets/images/search-img.jpg'
import './AdvSearchNav.css'


function AdvSearchNav() {
  return (
    <div><nav className="navbar-custom border-bottom border-secondary">
    <div className="navbar-content">
      <div className="left-section">
        <Link to="#" className="logo-container">
         
          <span className="trellohover d-flex">
            <div className="trello-icon me-2">
              <div className="bar left"></div>
              <div className="bar right"></div>
            </div>
            <span className="logo-text trello">Trello</span>
          </span>
        </Link>
      </div>

      <div className="center-section">
        <div className="search-container">
          <div className="search-input-container">
            <i className="bx bx-search search-icon"></i>
            <input
              type="text"
              className="search-input"
              placeholder="Search"
            />
            <div className="search-tooltip">
              Search <span className="slash">/</span>
            </div>
            <div className="search-panel">
              <div className="search-panel-content">
                <img
                  src={SearchImg}
                  alt="Search"
                  className="img-fluid mt-2 mb-2"
                />
                <p>Search for what you need</p>
              </div>
              <Link
                className="advanced-search text-decoration-none"
                to="advanced-search.html"
              >
                <i className="bx bx-search"></i> Advanced search
              </Link>
            </div>
          </div>
        </div>
        <i className="bx bx-search center-search-icon"></i>
        <Link to="#" className="text-decoration-none">
          <button className="btn-create">Create</button>
        </Link>
      </div>

      <div className="right-section">
        <div className="icon-btn">
          <i className="bx bx-bell"></i>
          <span className="notification-tooltip">Notifications</span>
        </div>
        <div className="avatar-container" data-bs-toggle="dropdown">
          <div className="avatar">AT</div>
          <span className="avatar-tooltip">Account</span>
        </div>

        <div className="dropdown">
          <button
            className="dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="bx bx-dots-horizontal-rounded"></i>
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <Link className="dropdown-item" to="#">
                <div className="dropdown-avatar">AT</div> Profile
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="#">
                <i className="bx bx-bell"></i> Notifications
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="#">
                <i className="bx bx-log-out"></i> Log out
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav></div>
  )
}

export default AdvSearchNav