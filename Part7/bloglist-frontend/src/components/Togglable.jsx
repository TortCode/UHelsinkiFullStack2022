import React, { useState } from "react";
import ToggleContext from "../ToggleContext";
import PropTypes from "prop-types";

const Togglable = ({ buttonLabel, children }) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <ToggleContext.Provider value={{ toggleVisibility }}>
      <div>
        <div style={hideWhenVisible}>
          <button className="button" type="button" onClick={toggleVisibility}>
            {buttonLabel}
          </button>
        </div>
        <div style={showWhenVisible}>
          <div className="block">{children}</div>
          <button className="button" type="button" onClick={toggleVisibility}>
            Cancel
          </button>
        </div>
      </div>
    </ToggleContext.Provider>
  );
};

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
};

export default Togglable;
