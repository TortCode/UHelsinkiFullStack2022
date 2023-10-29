import { createContext, useContext, useReducer } from 'react'

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_NOTIF":
      return action.payload
    case "CLEAR_NOTIF":
      return "";
    default:
      return state;
  }
}

const NotificationContext = createContext();

export const NotificationContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, "");

  return (
    <NotificationContext.Provider value={[ state, dispatch ]}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  return useContext(NotificationContext)[0];
}

export const useNotificationDispatch = () => {
  return useContext(NotificationContext)[1];
}

export const setNotificationFor = (dispatch, message, seconds) => {
  dispatch({ type: "SET_NOTIF", payload: message });
  setTimeout(() => {
    dispatch({ type: "CLEAR_NOTIF" });
  }, seconds * 1000);
};

export default NotificationContext;
