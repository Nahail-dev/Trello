import React, { useState, useEffect, useCallback } from "react";
import "./Navbar.css";
import "./MenuDropdown.css";
import {
  BiMenuAltRight,
  BiSolidPlaneAlt,
  BiGroup,
  BiCard,
} from "react-icons/bi";
import { GoChevronDown } from "react-icons/go";
import { PiWrench } from "react-icons/pi";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { MdOutlineStarBorder, MdDashboard } from "react-icons/md";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoPerson } from "react-icons/io5";

import viewOptions from "../../content/viewOptions.json";

import {
  FaTable,
  FaRegCalendarAlt,
  FaAlgolia,
  FaMapMarkerAlt,
  FaLock,
} from "react-icons/fa";
import { RiBook2Fill } from "react-icons/ri";
import { GiConsoleController } from "react-icons/gi";
import { IoMailOutline } from "react-icons/io5";
import { MdLabelImportantOutline } from "react-icons/md";
import Dropdown from "../Dropdown/Dropdown";
import { Link, NavLink } from "react-router-dom";
import { MdOutlineFeedback } from "react-icons/md";
import { RiStarSFill } from "react-icons/ri";
import { MdLockOutline } from "react-icons/md";

const iconMap = {
  FaTable,
  FaRegCalendarAlt,
  FaAlgolia,
  FaMapMarkerAlt,
  FaLock,
  MdDashboard,
  RiBook2Fill,
  GiConsoleController,
  IoMailOutline,
  MdOutlineFeedback,
  IoMdClose,
};

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeTab, setActiveTab] = useState('members'); // 'members' or 'requests'

  const toggleDropdown = useCallback(
    (dropdownName) => {
      setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
    },
    [activeDropdown]
  );

  // Handle clicks outside dropdowns and modals
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't do anything if no dropdown is open
      if (!activeDropdown) return;
      
      // Get all elements that should keep the dropdown open when clicked
      const keepOpenSelectors = [
        `[data-dropdown="${activeDropdown}"]`, // The toggle that opened this dropdown
        `#${activeDropdown}-dropdown`,          // The dropdown itself
        '.modal-dialog',                        // Any modal dialogs
        '.modal-backdrop'                       // Modal backdrops
      ];
      
      // Check if click is inside any of the keep-open elements
      const shouldKeepOpen = keepOpenSelectors.some(selector => {
        const element = document.querySelector(selector);
        return element && element.contains(event.target);
      });
      
      // Close the dropdown if click is outside
      if (!shouldKeepOpen) {
        setActiveDropdown(null);
      }
    };

    // Handle Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape' && activeDropdown) {
        setActiveDropdown(null);
      }
    };

    // Only add event listeners when a dropdown is active
    if (activeDropdown) {
      // Prevent body scroll when modal is open
      if (activeDropdown === 'share') {
        document.body.style.overflow = 'hidden';
      }
      
      // Use a small timeout to prevent immediate close on open
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
      }, 10);
      
      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
      };
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeDropdown]);
  return (
    <nav className="app-navbar">
      <div className="app-navbar-left gap-sm-4 gap-2">
        <h2 className="app-logo">Aut eum omnis consec</h2>

        <div className="app-icon-wrapper">
          <div
            className="app-select-icon"
            onClick={() => toggleDropdown("menu")}
          >
            <BiMenuAltRight />
            <GoChevronDown className="app-chevron-icon" />
          </div>

          {activeDropdown === "menu" && (
            <Dropdown
              className=""
              style={{ padding: "8px" }}
              header={
                <div className="app-dropdown-header">
                  <h2 className="app-dropdown-title">Upgrade for views</h2>
                  <IoMdClose
                    className="app-close-icon"
                    onClick={() => toggleDropdown("menu")}
                  />
                </div>
              }
              content={
                <div className="app-dropdown-content">
                  <div className="app-d-content-title">
                    <BiCard className="app-bicard" />
                    Board
                  </div>
                  <ul className="app-d-contentlist">
                    {viewOptions.map((option) => {
                      const IconLeft = iconMap[option.leftIcon];
                      const IconRight = iconMap[option.rightIcon];
                      return (
                        <li key={option.id} className="app-d-content-item">
                          <div className="app-d-content-left">
                            <IconLeft className="app-d-icon-left" />
                            <span>{option.name}</span>
                          </div>
                          <IconRight className="app-d-icon-right" />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              }
              bottom={
                <div className="app-dropdown-bottom">
                  <h2 className="app-bottom-title">
                    See your work in new ways
                  </h2>
                  <div
                    className="app-d-bottom-content"
                    onClick={() => toggleDropdown("menu")}
                  >
                    <p>
                      View key timelines, assignments, data, and more directly
                      from your Trello board with Trello Premium.
                    </p>
                  </div>
                  <button className="app-dropdown-btn">Start free trial</button>

                  <p className="app-special">
                    <NavLink
                      to="/"
                      onClick={() => toggleDropdown("menu")}
                      className={({ isActive }) =>
                        isActive ? "app-active-link" : "app-default-link"
                      }
                    >
                      Learn more about trello premium
                    </NavLink>
                  </p>
                </div>
              }
            />
          )}
          <span className="app-tool-tip">Views</span>
        </div>
      </div>

      <div className="app-navbar-right gap-2 gap-sm-4 ">
        <div
          className="app-icon-wrapper "
          onClick={() => toggleDropdown("profile")}
        >
          <div className="app-nav-avatar">AT</div>
          <span className="app-tool-tip">Profile</span>
          {activeDropdown === "profile" && (
            <>
              <div
                className="profile-popup "
                onClick={() => toggleDropdown("profile")}
              >
                <div className="profile-header">
                  <IoMdClose
                    className="profile-close"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown("profile");
                    }}
                  />
                  <div className="profile-avatar">AT</div>
                  <div className="profile-user-info">
                    <div className="profile-name">Aamir Tariq</div>
                    <div className="profile-username">@aamirtariq1</div>
                  </div>
                </div>
                <div className="profile-option">Edit profile info</div>
                <hr className="profile-divider" />
                <div className="profile-option">
                  View member's board activity
                </div>
              </div>
            </>
          )}
        </div>

        <div
          className="app-icon-wrapper  d-md-block d-none"
          onClick={() => toggleDropdown("ups")}
        >
          <BiSolidPlaneAlt className="app-nav-icon" />
          <span className="app-tool-tip">Plane</span>
          {activeDropdown === "ups" && (
            <Dropdown
              style={{ padding: "0 18px" }}
              header={
                <div className="ups-dropdown-header">
                  <h2 className="ups-dropdown-title">Power-Ups</h2>
                  <IoMdClose
                    className="profile-close"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown("ups");
                    }}
                  />
                </div>
              }
              content={
                <div className="ups-dropdown-content">
                  <img
                    src="/powers-img.jpg"
                    alt="Power-Ups"
                    className="ups-dropdown-img"
                  />
                  <p>
                    Bring additional features to your boards and integrate app
                    like Google Drive, Slack, and more.
                  </p>
                </div>
              }
              bottom={
                <div className="ups-dropdown-bottom">
                  <button className="app-dropdown-btn" id="ups-btn">
                    Add power-ups
                  </button>
                </div>
              }
            />
          )}
        </div>

        <div
          className="app-icon-wrapper d-md-block d-none"
          onClick={() => toggleDropdown("setting")}
        >
          <PiWrench className="app-nav-icon" />
          <span className="app-tool-tip">Settings</span>
          {activeDropdown === "setting" && (
            <div className="card-popup" id="popup-info">
              <div className="popup-header">
                <h6 className="popup-title">Automation</h6>
                <span
                  className="close-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown("setting");
                  }}
                >
                  ×
                </span>
              </div>
              <div className="popup-content">
                <div className="popup-item">
                  <RiBook2Fill className="popup-icon" />
                  <div className="popup-item-content">
                    <strong>Rules</strong>
                    <p>Lorem ipsum dolor sit amet psum dolor laboriosam!</p>
                  </div>
                </div>
                <div className="popup-item">
                  <GiConsoleController className="popup-icon" />
                  <div className="popup-item-content">
                    <strong>Button</strong>
                    <p>Lorem ipsum dolor sit amet psum dolor laboriosam!</p>
                  </div>
                </div>
                <div className="popup-item">
                  <IoMailOutline className="popup-icon" />
                  <div className="popup-item-content">
                    <strong>Email</strong>
                    <p>Lorem ipsum dolor sit amet psum dolor laboriosam!</p>
                  </div>
                </div>
                <div className="popup-item">
                  <MdOutlineFeedback className="popup-icon" />
                  <div className="popup-item-content">
                    <strong>Feedback</strong>
                    <p>Lorem ipsum dolor sit amet psum dolor laboriosam!</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="app-icon-wrapper d-md-block d-none">
          <div
            className="app-nav-icon"
            onClick={() => toggleDropdown("newmenu")}
          >
            <IoMdMenu />
            <span className="app-tool-tip">Menu</span>
          </div>

          {activeDropdown === "newmenu" && (
            <div className="menu-dropdown" onClick={(e) => e.stopPropagation()}>
              <div className="menu-header">
                <h6 className="menu-title">Filter</h6>
                <button
                  className="close-btn"
                  onClick={() => toggleDropdown("newmenu")}
                  aria-label="Close menu"
                >
                  <div className="bx bx-x close-btn" />
                </button>
              </div>

              <div className="menu-content">
                <div className="menu-section">
                  <label className="menu-label">Keyword</label>
                  <input
                    type="text"
                    placeholder="Enter a keyword..."
                    className="menu-input"
                  />
                  <small className="menu-hint">
                    Search cards, members, labels, and more.
                  </small>
                </div>

                <div className="menu-section">
                  <label className="menu-label">Members</label>
                  <label className="menu-option">
                    <input type="checkbox" id="noMembers" />
                    <span className="menu-icon">
                      <IoPerson />
                    </span>
                    <span>No members</span>
                  </label>
                  <label className="menu-option">
                    <input type="checkbox" id="assignedToMe" />
                    <div className="avatar">AT</div>
                    <span>Cards assigned to me</span>
                  </label>
                </div>

                <div className="menu-section">
                  <label className="menu-label">Card status</label>
                  <label className="menu-option">
                    <input type="checkbox" />
                    <span>Marked as complete</span>
                  </label>
                  <label className="menu-option">
                    <input type="checkbox" />
                    <span>Not marked as complete</span>
                  </label>
                </div>

                <div className="menu-section">
                  <label className="menu-label">Due date</label>
                  <label className="menu-option">
                    <input type="checkbox" />
                    <span>No dates</span>
                  </label>
                  <label className="menu-option">
                    <input type="checkbox" />
                    <span>Overdue</span>
                  </label>
                  <label className="menu-option">
                    <input type="checkbox" />
                    <span>Due in the next day</span>
                  </label>
                </div>

                <div className="menu-section">
                  <label className="menu-label">Labels</label>
                  <label className="menu-option">
                    <input type="checkbox" id="noLabels" />
                    <span className="menu-icon">
                      <MdLabelImportantOutline />
                    </span>
                    <span>No labels</span>
                  </label>
                  <div className="label-colors">
                    <div className="label-color green" title="Green" />
                    <div className="label-color yellow" title="Yellow" />
                    <div className="label-color orange" title="Orange" />
                  </div>
                  <select className="menu-dropdown-select">
                    <option>Select labels</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          className="app-icon-wrapper d-md-block d-none"
          onClick={() => toggleDropdown("star")}
        >
          <MdOutlineStarBorder className="app-nav-icon" />
          <span className="app-tool-tip">Star</span>
          {activeDropdown === "star" && (
            <div>
              <div className="card-popup" id="popup-star">
                <div className="d-flex justify-content-between align-items-center border-0">
                  <h6 className="upgrade-title m-0 mx-auto mt-2">Favorites</h6>
                  <IoMdClose />
                </div>
                <p>Starred boards and items will appear here.</p>
                <div className="rating">
                  <RiStarSFill className="star-icon" />
                  <RiStarSFill className="star-icon" />
                  <RiStarSFill className="star-icon" />
                  <RiStarSFill className="star-icon" />
                  <RiStarSFill className="star-icon" />
                  <span style={{ marginLeft: "8px" }}>4.5</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          className="app-icon-wrapper d-md-block d-none"
          onClick={() => toggleDropdown("group")}
        >
          <BiGroup className="app-nav-icon" />
          <span className="app-tool-tip">Group</span>
          {activeDropdown === "group" && (
            <div>
              <div className="card-popup" id="popup-visibility">
                <div className="d-flex justify-content-between align-items-center border-0">
                  <h6 className="upgrade-title m-0 mx-auto mt-2">
                    Change visibility
                  </h6>
                  <IoMdClose />
                </div>
                <p>
                  <MdLockOutline className="text-danger" />
                  <strong>Private</strong>
                </p>
                <p>Lorem ipsum dolor sit amet psum dolor laboriosam!</p>
                <p />
                <p>
                  <BiGroup className="fs-6 text-danger" />
                  <strong>workspace</strong>
                </p>
                <p>Lorem ipsum dolor sit amet psum dolor laboriosam!</p>
                <p />
                <p>
                  <BiGroup className="fs-6" style={{ color: "#515c65" }} />
                  <strong style={{ color: "#515c65" }}>organize all</strong>
                </p>
                <p style={{ color: "#515c65" }}>
                  Lorem ipsum dolor sit amet psum dolor laboriosam!
                </p>
                <p />
                <p>
                  <IoPerson />
                  <strong>Public</strong>
                </p>
                <p>Lorem ipsum dolor sit amet psum dolor laboriosam!</p>
                <p />
              </div>
            </div>
          )}
        </div>

        <div className=" d-md-block d-none">
          <button
            className="app-nav-btn"
            onClick={() => toggleDropdown("share")}
          >
            Share
          </button>

          {/* Modal Backdrop */}
          <div 
            className={`modal-backdrop fade ${activeDropdown === "share" ? "show" : ""}`}
            style={{ 
              display: activeDropdown === "share" ? "block" : "none",
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1040
            }}
            onClick={() => toggleDropdown("share")}
          ></div>

          {/* Modal */}
          <div
            className={`modal fade ${activeDropdown === "share" ? "show" : ""}`}
            style={{ 
              display: activeDropdown === "share" ? "block" : "none",
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1050,
              overflow: 'auto',
              outline: 0
            }}
            tabIndex="-1"
            role="dialog"
            aria-hidden={activeDropdown !== "share"}
          >
            <div className="modal-dialog modal-dialog-centered modal-md" role="document">
              <div className="modal-content custom-modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header border-0">
                  <h5 className="modal-title text-white">Share board</h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => toggleDropdown("share")}
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body text-white">
                  <div className="mb-3 d-flex">
                    <input
                      type="text"
                      className="form-control me-2 custom-input"
                      placeholder="Email address or name"
                    />
                    <select
                      className="form-select custom-select me-2"
                      style={{ width: "auto" }}
                    >
                      <option>Member</option>
                      <option>Admin</option>
                    </select>
                    <button className="btn btn-primary">Share</button>
                  </div>
                  <div className="mb-3">
                    <Link href="/" className="text-link">
                      Create link
                    </Link>
                  </div>
                  
                  {/* Tabs Navigation */}
                  <ul className="nav nav-tabs border-secondary mb-3" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === 'members' ? 'active bg-light bg-opacity-10 ' : ''}  border-0`}
                        onClick={() => setActiveTab('members')}
                        role="tab"
                        aria-selected={activeTab === 'members'}
                      >
                        Board members{' '}
                        <span className="badge bg-secondary">1</span>
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === 'requests' ? 'active bg-white bg-opacity-10 ' : ''} `}
                        onClick={() => setActiveTab('requests')}
                        role="tab"
                        aria-selected={activeTab === 'requests'}
                      >
                        Join requests
                      </button>
                    </li>
                  </ul>
                  
                  {/* Tab Content */}
                  <div className="tab-content">
                    {/* Board Members Tab */}
                    <div 
                      className={`tab-pane fade ${activeTab === 'members' ? 'show active' : ''}`}
                      role="tabpanel"
                    >
                      <div className="member-box mt-3">
                        <div>
                          <strong>Aamir Tariq (you)</strong>
                          <br />
                          <small>@aamirtariq1 • Workspace admin</small>
                        </div>
                        <select className="form-select form-select-sm" style={{ width: 'auto' }}>
                          <option>Member</option>
                          <option>Admin</option>
                          <option>Remove</option>
                        </select>
                      </div>
                      
                      {/* Add more members here */}
                      <div className="member-box mt-3">
                        <div>
                          <strong>John Doe</strong>
                          <br />
                          <small>@johndoe • Member</small>
                        </div>
                        <select className="form-select form-select-sm" style={{ width: 'auto' }}>
                          <option>Member</option>
                          <option>Admin</option>
                          <option>Remove</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Join Requests Tab */}
                    <div 
                      className={`tab-pane fade ${activeTab === 'requests' ? 'show active ' : ''}`}
                      role="tabpanel"
                    >
                      <div className="text-center py-4">
                        <p>No pending join requests</p>
                        <button className="btn btn-sm btn-outline-light mt-2">
                          <i className="bi bi-people me-1"></i>
                          Invite members
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="dropdown">
            <HiOutlineDotsHorizontal
              className="app-nav-icon-dots"
              onClick={() => toggleDropdown("dot")}
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded={activeDropdown === "dot" ? "true" : "false"}
              style={{ cursor: "pointer" }}
            />
            <ul
              className={`dropdown-menu dropdown-menu-end dropdown-card ${
                activeDropdown === "dot" ? "show" : ""
              }`}
              aria-labelledby="dropdownMenuButton"
              style={{
                position: "absolute",
                inset: "0px auto auto 0px",
                margin: "0px",
                transform: "translate(-220px, 40px)",
              }}
            >
              <li>
                <a className="dropdown-item" href="/">
                  <div className="dropdown-avatar">AT</div>
                  Profile
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/">
                  <i className="bx bx-bell"></i>
                  Notifications
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/">
                  <i className="bx bx-bolt-circle"></i>
                  Power-Ups
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/">
                  <i className="bx bx-star"></i>
                  Favorites
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/">
                  <i className="bx bx-info-circle"></i>
                  Info
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/">
                  <i className="bx bx-log-out"></i>
                  Log out
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/">
                  <i className="bx bx-cog"></i> Settings
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/">
                  <i className="bx bx-palette"></i> Change background
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/">
                  <i className="bx bx-upload"></i> Upgrade
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/">
                  <i className="bx bx-file"></i> Start free trial
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/">
                  <i className="bx bx-rocket"></i> Automation
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/">
                  <i className="bx bx-puzzle"></i> Power-Ups
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/">
                  <i className="bx bx-label"></i> Labels
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/">
                  <i className="bx bx-sticker"></i> Stickers
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/">
                  <i className="bx bx-template"></i> Make template
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/">
                  <i className="bx bx-list-check"></i> Activity
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/">
                  <i className="bx bx-archive"></i> Archived items
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/">
                  <i className="bx bx-show"></i> Watch
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/">
                  <i className="bx bx-copy-alt"></i> Copy board
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/">
                  <i className="bx bx-mail-send"></i> Email-to-board
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/">
                  <i className="bx bx-window-close"></i> Close board
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
