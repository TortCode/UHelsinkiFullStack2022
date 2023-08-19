import React from 'react';
import PropTypes from 'prop-types';

function Notification({ message, isError }) {
  if (message === null) {
    return null;
  }
  const className = isError ? 'error' : 'success';

  return (
    <div className={className}>
      {message}
    </div>
  );
}

Notification.propTypes = {
  // message can be string or null
  message: PropTypes.string,
  isError: PropTypes.bool.isRequired,
};

Notification.defaultProps = {
  message: null,
};

export default Notification;
