import React from "react";
import "./Dropdown.css"; 

const Dropdown = ({
  header,
  content,
  bottom,
  className = "",
  style = {}
}) => {
  return (
    <div className={`app-dropdown ${className}`} style={style}>
      {header && <div className="app-dropdown-header">{header}</div>}
      {content && <div className="app-dropdown-content">{content}</div>}
      {bottom && <div className="app-dropdown-bottom">{bottom}</div>}
    </div>
  );
};

export default Dropdown;
