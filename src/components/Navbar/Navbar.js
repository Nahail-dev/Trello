import { useState, useEffect, useCallback } from "react";
import "./Navbar.css";
import "./MenuDropdown.css";
import { BiSolidPlaneAlt, BiGroup } from "react-icons/bi";
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
  const [activeTab, setActiveTab] = useState("members");
  const [activeMemberDropdown, setActiveMemberDropdown] = useState(null);
  const [activeSelectDropdown, setActiveSelectDropdown] = useState(null);
  const [selectedRole, setSelectedRole] = useState("Member");
  const [selectedLabel, setSelectedLabel] = useState("Select labels");
  const [activeDotsDropdown, setActiveDotsDropdown] = useState(null);

  const toggleDropdown = useCallback((dropdownName, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setActiveDropdown((prev) => {
      if (prev === dropdownName) return null;
      return dropdownName;
    });
  }, []);

  const toggleMemberDropdown = useCallback((memberName, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setActiveMemberDropdown((prev) => {
      if (prev === memberName) return null;
      return memberName;
    });
  }, []);

  const toggleSelectDropdown = useCallback((selectName, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setActiveSelectDropdown((prev) => {
      if (prev === selectName) return null;
      return selectName;
    });
  }, []);

  const toggleDotsDropdown = useCallback((dotsName, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setActiveDotsDropdown((prev) => {
      if (prev === dotsName) return null;
      return dotsName;
    });
  }, []);

  useEffect(() => {
    if (
      !activeDropdown &&
      !activeMemberDropdown &&
      !activeSelectDropdown &&
      !activeDotsDropdown
    )
      return;

    const handleClickOutside = (event) => {
      const isInside = event.target.closest(
        `.dropdown-card, 
          .card-popup, 
          .menu-dropdown, 
          .profile-popup, 
          .app-dropdown-btn,
          .app-active-link,
          .modal-content,
          .member-dropdown,
          .select-dropdown,
          .dots-dropdown,
          [data-dropdown="${activeDropdown}"],
          [data-member-dropdown="${activeMemberDropdown}"],
          [data-select-dropdown="${activeSelectDropdown}"],
          [data-dots-dropdown="${activeDotsDropdown}"]`
      );

      if (!isInside) {
        setActiveDropdown(null);
        setActiveMemberDropdown(null);
        setActiveSelectDropdown(null);
        setActiveDotsDropdown(null);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setActiveDropdown(null);
        setActiveMemberDropdown(null);
        setActiveSelectDropdown(null);
        setActiveDotsDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    if (activeDropdown === "share") {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [
    activeDropdown,
    activeMemberDropdown,
    activeSelectDropdown,
    activeDotsDropdown,
  ]);

  return (
    <nav className="app-navbar">
      <div className="app-navbar-left gap-sm-4 gap-2">
        <h2 className="app-logo">Aut eum omnis consec</h2>

        <div className="nav-icon-wrapper">
          <div
            className="nav-left-icon"
            data-dropdown="menu"
            onClick={(e) => toggleDropdown("menu", e)}
          >
            <div className="bx bx-menu-alt-right" />
            <div className="bx bx-chevron-down fs-5" />
          </div>

          {activeDropdown === "menu" && (
            <Dropdown
              className=""
              style={{ padding: "8px" }}
              header={
                <div className="app-dropdown-header">
                  <h2 className="app-dropdown-title">Upgrade for views</h2>
                  <div
                    className="bx bx-x nav-close-icon"
                    data-dropdown-toggle="menu"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown("menu");
                    }}
                  />
                </div>
              }
              content={
                <div className="app-dropdown-content">
                  <div className="app-d-content-title">
                    <div className="bx bx-card" />
                    Board
                  </div>
                  <ul className="app-d-contentlist">
                    {viewOptions.map((option) => {
                      const IconLeft = iconMap[option.leftIcon];
                      const IconRight = iconMap[option.rightIcon];
                      return (
                        <li key={option.id} className="app-d-content-item">
                          <div className="app-d-content-left">
                            <IconLeft className="app-d-icon" />
                            <span>{option.name}</span>
                          </div>
                          <IconRight className="app-d-icon" />
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
                  <div className="app-d-bottom-content">
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

      <div className="app-navbar-right gap-2 gap-sm-4">
        <div className="nav-icon-wrapper">
          <div
            className="app-nav-avatar"
            data-dropdown="profile"
            onClick={(e) => toggleDropdown("profile", e)}
          >
            AT
          </div>
          <span className="app-tool-tip">Profile</span>
          {activeDropdown === "profile" && (
            <div className="profile-popup">
              <div className="profile-header">
                <div
                  className="bx bx-x profile-close text-black"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDropdown(null);
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
              <div className="profile-option">View member's board activity</div>
            </div>
          )}
        </div>

        <div
          className="nav-icon-wrapper d-md-block d-none"
          data-dropdown="ups"
          onClick={(e) => toggleDropdown("ups", e)}
        >
          <BiSolidPlaneAlt className="app-nav-icon" />
          <span className="app-tool-tip">Plane</span>
          {activeDropdown === "ups" && (
            <Dropdown
              style={{ padding: "0 18px" }}
              header={
                <div className="ups-dropdown-header">
                  <h2 className="ups-dropdown-title">Power-Ups</h2>
                  <div
                    className="bx bx-x profile-close text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDropdown(null);
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
          className="nav-icon-wrapper d-md-block d-none"
          data-dropdown="setting"
          onClick={(e) => toggleDropdown("setting", e)}
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
                    setActiveDropdown(null);
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

        <div className="nav-icon-wrapper d-md-block d-none">
          <div
            className="app-nav-icon"
            data-dropdown="newmenu"
            onClick={(e) => toggleDropdown("newmenu", e)}
          >
            <IoMdMenu />
            <span className="app-tool-tip">Menu</span>
          </div>

          {activeDropdown === "newmenu" && (
            <div className="menu-dropdown">
              <div className="menu-header mt-4">
                <h6 className="menu-title">Filter</h6>
                <button
                  className="newmenue-close-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDropdown(null);
                  }}
                  aria-label="Close menu"
                >
                  <div className="bx bx-x" />
                </button>
              </div>

              <div className="menu-content">
                <div className="menu-section">
                  <label className="menu-label mb-2">Keyword</label>
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
                    <input
                      type="checkbox"
                      id="noMembers"
                      className="checkbox"
                    />
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

                  {/* No labels option */}
                  <label className="menu-option">
                    <input type="checkbox" />
                    <span className="menu-icon">
                      <MdLabelImportantOutline />
                    </span>
                    <span>No labels</span>
                  </label>

                  {/* Green label */}
                  <label className="menu-option">
                    <input type="checkbox" />
                    <span className="label-color green" title="Green"></span>
                  </label>

                  {/* Yellow label */}
                  <label className="menu-option">
                    <input type="checkbox" />
                    <span className="label-color yellow" title="Yellow"></span>
                  </label>

                  {/* Orange label */}
                  <label className="menu-option">
                    <input type="checkbox" />
                    <span className="label-color orange" title="Orange"></span>
                  </label>

                  {/* Dropdown tab with its own checkbox */}
                  <label className="menu-option">
                    <input type="checkbox" />
                    <div
                      className="member-dropdown-wrapper"
                      style={{ flex: 1 }}
                    >
                      <button
                        type="button"
                        className="member-dropdown-btn"
                        data-select-dropdown="labelSelect"
                        onClick={(e) => toggleSelectDropdown("labelSelect", e)}
                        style={{
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        {selectedLabel === "Select labels" ? (
                          "Select labels"
                        ) : (
                          <span
                            className={`label-color ${selectedLabel.toLowerCase()}`}
                            aria-hidden="true"
                          />
                        )}
                        <span className="dropdown-arrow">▼</span>
                      </button>

                      {activeSelectDropdown === "labelSelect" && (
                        <div
                          className="member-dropdown swatch-dropdown"
                          style={{ width: "100%" }}
                        >
                          <div
                            className="swatch-row"
                            onClick={() => {
                              setSelectedLabel("Green");
                              setActiveSelectDropdown(null);
                            }}
                          >
                            <span className="label-color green" />
                          </div>
                          <div
                            className="swatch-row"
                            onClick={() => {
                              setSelectedLabel("Yellow");
                              setActiveSelectDropdown(null);
                            }}
                          >
                            <span className="label-color yellow" />
                          </div>
                          <div
                            className="swatch-row"
                            onClick={() => {
                              setSelectedLabel("Orange");
                              setActiveSelectDropdown(null);
                            }}
                          >
                            <span className="label-color orange" />
                          </div>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          className="nav-icon-wrapper d-md-block d-none"
          data-dropdown="star"
          onClick={(e) => toggleDropdown("star", e)}
        >
          <MdOutlineStarBorder className="app-nav-icon" />
          <span className="app-tool-tip">Star</span>
          {activeDropdown === "star" && (
            <div>
              <div className="card-popup" id="popup-star">
                <div className="d-flex justify-content-between align-items-center border-0">
                  <h6 className="upgrade-title m-0 mx-auto mt-2">Favorites</h6>
                  <IoMdClose
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDropdown(null);
                    }}
                  />
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
          className="nav-icon-wrapper d-md-block d-none"
          data-dropdown="group"
          onClick={(e) => toggleDropdown("group", e)}
        >
          <BiGroup className="app-nav-icon" />
          <span className="app-tool-tip">Group</span>
          {activeDropdown === "group" && (
            <div>
              <div className="card-popup" id="popup-visibility">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="upgrade-title mx-auto text-secondary">
                    Change visibility
                  </h6>
                  <div className="bx bx-x fs-5" />
                </div>
                <p className="">
                  <MdLockOutline className="me-1" />
                  <strong>Private</strong>
                </p>
                <p>Lorem ipsum dolor sit amet psum dolor laboriosam!</p>
                <p />
                <p className="my-1">
                  <BiGroup className="me-1" />
                  <strong>Workspace</strong>
                </p>
                <p>Lorem ipsum dolor sit amet psum dolor laboriosam!</p>
                <p />
                <p className="my-1">
                  <BiGroup className="me-1" />
                  <strong>Organize all</strong>
                </p>
                <p>Lorem ipsum dolor sit amet psum dolor laboriosam!</p>
                <p />
                <p className="my-1">
                  <IoPerson className="me-1" />
                  <strong>Public</strong>
                </p>
                <p>Lorem ipsum dolor sit amet psum dolor laboriosam!</p>
                <p />
              </div>
            </div>
          )}
        </div>

        <div className="d-md-block d-none">
          <button
            className="app-nav-btn"
            data-dropdown="share"
            onClick={(e) => toggleDropdown("share", e)}
          >
            Share
          </button>

          {activeDropdown === "share" && (
            <div
              className="modal-backdrop show"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1040,
              }}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setActiveDropdown(null);
                }
              }}
            />
          )}

          <div
            className={`modal ${
              activeDropdown === "share" ? "show d-block" : "d-none"
            }`}
          >
            <div
              className="modal-dialog modal-dialog-centered modal-md"
              role="document"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="modal-content custom-modal-content"
                style={{
                  margin: "1.75rem auto",
                  maxWidth: "500px",
                }}
              >
                <div className="modal-header border-0">
                  <h5 className="modal-title">Share board</h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDropdown(null);
                    }}
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body">
                  <div className="mb-3 d-flex">
                    <input
                      type="text"
                      className="form-control me-2 custom-input"
                      placeholder="Email address or name"
                    />
                    <div className="member-dropdown-wrapper me-2">
                      <button
                        className="member-dropdown-btn"
                        data-select-dropdown="roleSelect"
                        onClick={(e) => toggleSelectDropdown("roleSelect", e)}
                        style={{ width: "auto", minWidth: "100px" }}
                      >
                        {selectedRole}
                        <span className="dropdown-arrow">▼</span>
                      </button>
                      {activeSelectDropdown === "roleSelect" && (
                        <div className="member-dropdown">
                          <div
                            className={`member-dropdown-item ${
                              selectedRole === "Member" ? "active" : ""
                            }`}
                            onClick={() => {
                              setSelectedRole("Member");
                              setActiveSelectDropdown(null);
                            }}
                          >
                            Member
                          </div>
                          <div
                            className={`member-dropdown-item ${
                              selectedRole === "Admin" ? "active" : ""
                            }`}
                            onClick={() => {
                              setSelectedRole("Admin");
                              setActiveSelectDropdown(null);
                            }}
                          >
                            Admin
                          </div>
                        </div>
                      )}
                    </div>
                    <button className="btn btn-primary text-black">
                      Share
                    </button>
                  </div>

                  <div className="create-link-section">
                    <div className="link-icon-box">
                      <div className="bx bx-link-alt"></div>
                    </div>
                    <div className="link-content">
                      <div className="link-title">
                        Share this board with a link
                      </div>
                      <Link href="/" className="text-link">
                        Create link
                      </Link>
                    </div>
                  </div>

                  <ul
                    className="nav nav-tabs border-secondary mb-3"
                    role="tablist"
                  >
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${
                          activeTab === "members"
                            ? "active bg-white bg-opacity-10"
                            : ""
                        } border-0`}
                        onClick={() => setActiveTab("members")}
                        role="tab"
                        aria-selected={activeTab === "members"}
                      >
                        Board members{" "}
                        <span className="badge bg-secondary">1</span>
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${
                          activeTab === "requests"
                            ? "active bg-white bg-opacity-10"
                            : ""
                        }`}
                        onClick={() => setActiveTab("requests")}
                        role="tab"
                        aria-selected={activeTab === "requests"}
                      >
                        Join requests
                      </button>
                    </li>
                  </ul>

                  <div className="tab-content">
                    <div
                      className={`tab-pane fade ${
                        activeTab === "members" ? "show active" : ""
                      }`}
                      role="tabpanel"
                    >
                      <div className="member-box mt-3">
                        <div className="member-info">
                          <div className="member-avatar">AT</div>
                          <div className="member-details">
                            <strong>Aamir Tariq (you)</strong>
                            <small>@aamirtariq1 • Workspace admin</small>
                          </div>
                        </div>
                        <div className="member-dropdown-wrapper">
                          <button
                            className="member-dropdown-btn"
                            data-member-dropdown="member1"
                            onClick={(e) => toggleMemberDropdown("member1", e)}
                          >
                            Admin
                            <span className="dropdown-arrow">▼</span>
                          </button>
                          {activeMemberDropdown === "member1" && (
                            <div className="member-dropdown">
                              <div
                                className="member-dropdown-item"
                                onClick={() => setActiveMemberDropdown(null)}
                              >
                                Member
                              </div>
                              <div
                                className="member-dropdown-item active"
                                onClick={() => setActiveMemberDropdown(null)}
                              >
                                Admin
                              </div>
                              <div
                                className="member-dropdown-item remove"
                                onClick={() => setActiveMemberDropdown(null)}
                              >
                                Remove
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="member-box mt-3">
                        <div className="member-info">
                          <div className="member-avatar">JD</div>
                          <div className="member-details">
                            <strong>John Doe</strong>
                            <small>@johndoe • Member</small>
                          </div>
                        </div>
                        <div className="member-dropdown-wrapper">
                          <button
                            className="member-dropdown-btn"
                            data-member-dropdown="member2"
                            onClick={(e) => toggleMemberDropdown("member2", e)}
                          >
                            Member
                            <span className="dropdown-arrow">▼</span>
                          </button>
                          {activeMemberDropdown === "member2" && (
                            <div className="member-dropdown">
                              <div
                                className="member-dropdown-item active"
                                onClick={() => setActiveMemberDropdown(null)}
                              >
                                Member
                              </div>
                              <div
                                className="member-dropdown-item"
                                onClick={() => setActiveMemberDropdown(null)}
                              >
                                Admin
                              </div>
                              <div
                                className="member-dropdown-item remove"
                                onClick={() => setActiveMemberDropdown(null)}
                              >
                                Remove
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="member-box mt-3">
                        <div className="member-info">
                          <div className="member-avatar">SW</div>
                          <div className="member-details">
                            <strong>Sarah Wilson</strong>
                            <small>@sarahw • Member</small>
                          </div>
                        </div>
                        <div className="member-dropdown-wrapper">
                          <button
                            className="member-dropdown-btn"
                            data-member-dropdown="member3"
                            onClick={(e) => toggleMemberDropdown("member3", e)}
                          >
                            Member
                            <span className="dropdown-arrow">▼</span>
                          </button>
                          {activeMemberDropdown === "member3" && (
                            <div className="member-dropdown">
                              <div
                                className="member-dropdown-item active"
                                onClick={() => setActiveMemberDropdown(null)}
                              >
                                Member
                              </div>
                              <div
                                className="member-dropdown-item"
                                onClick={() => setActiveMemberDropdown(null)}
                              >
                                Admin
                              </div>
                              <div
                                className="member-dropdown-item remove"
                                onClick={() => setActiveMemberDropdown(null)}
                              >
                                Remove
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`tab-pane fade ${
                        activeTab === "requests" ? "show active" : ""
                      }`}
                      role="tabpanel"
                    >
                      <div className="text-center py-4">
                        <p>No pending join requests</p>
                        <button className="btn btn-sm btn-outline-secondary mt-2">
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

        <div className="nav-icon-wrapper">
          <HiOutlineDotsHorizontal
            className="app-nav-icon-dots"
            data-dropdown="dot"
            onClick={(e) => toggleDropdown("dot", e)}
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded={activeDropdown === "dot" ? "true" : "false"}
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
            onClick={(e) => e.stopPropagation()}
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
              <div
                className="dropdown-item"
                style={{ cursor: "pointer", position: "relative" }}
              >
                <i className="bx bx-palette"></i> Change background
                <span
                  className="dropdown-arrow ms-auto"
                  data-dots-dropdown="background"
                  onClick={(e) => toggleDotsDropdown("background", e)}
                >
                  ▼
                </span>
                {activeDotsDropdown === "background" && (
                  <div className="dots-dropdown">
                    <div
                      className="member-dropdown-item"
                      onClick={() => setActiveDotsDropdown(null)}
                    >
                      Default
                    </div>
                    <div
                      className="member-dropdown-item"
                      onClick={() => setActiveDotsDropdown(null)}
                    >
                      Blue Theme
                    </div>
                    <div
                      className="member-dropdown-item"
                      onClick={() => setActiveDotsDropdown(null)}
                    >
                      Green Theme
                    </div>
                  </div>
                )}
              </div>
            </li>
            <li>
              <div
                className="dropdown-item"
                style={{ cursor: "pointer", position: "relative" }}
              >
                <i className="bx bx-rocket"></i> Automation
                <span
                  className="dropdown-arrow ms-auto"
                  data-dots-dropdown="automation"
                  onClick={(e) => toggleDotsDropdown("automation", e)}
                >
                  ▼
                </span>
                {activeDotsDropdown === "automation" && (
                  <div className="dots-dropdown">
                    <div
                      className="member-dropdown-item"
                      onClick={() => setActiveDotsDropdown(null)}
                    >
                      Rules
                    </div>
                    <div
                      className="member-dropdown-item"
                      onClick={() => setActiveDotsDropdown(null)}
                    >
                      Buttons
                    </div>
                    <div
                      className="member-dropdown-item"
                      onClick={() => setActiveDotsDropdown(null)}
                    >
                      Calendar
                    </div>
                  </div>
                )}
              </div>
            </li>
            <li>
              <div
                className="dropdown-item"
                style={{ cursor: "pointer", position: "relative" }}
              >
                <i className="bx bx-label"></i> Labels
                <span
                  className="dropdown-arrow ms-auto"
                  data-dots-dropdown="labels"
                  onClick={(e) => toggleDotsDropdown("labels", e)}
                >
                  ▼
                </span>
                {activeDotsDropdown === "labels" && (
                  <div className="dots-dropdown">
                    <div
                      className="member-dropdown-item"
                      onClick={() => setActiveDotsDropdown(null)}
                    >
                      <span
                        className="label-color green me-2"
                        style={{
                          width: "12px",
                          height: "12px",
                          display: "inline-block",
                        }}
                      ></span>
                      Green Label
                    </div>
                    <div
                      className="member-dropdown-item"
                      onClick={() => setActiveDotsDropdown(null)}
                    >
                      <span
                        className="label-color yellow me-2"
                        style={{
                          width: "12px",
                          height: "12px",
                          display: "inline-block",
                        }}
                      ></span>
                      Yellow Label
                    </div>
                    <div
                      className="member-dropdown-item"
                      onClick={() => setActiveDotsDropdown(null)}
                    >
                      <span
                        className="label-color orange me-2"
                        style={{
                          width: "12px",
                          height: "12px",
                          display: "inline-block",
                        }}
                      ></span>
                      Orange Label
                    </div>
                  </div>
                )}
              </div>
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
    </nav>
  );
};

export default Navbar;
