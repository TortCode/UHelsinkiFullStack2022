import React from "react";
import { useSelector } from "react-redux";

const Notification = () => {
  const notif = useSelector((state) => state.notification);
  if (notif.message === null) {
    return null;
  }
  const classNames = ["is-size-5", "notification"];
  if (notif.status === "success") {
    classNames.push("is-success");
  } else if (notif.status === "error") {
    classNames.push("is-warning");
  }
  return <div className={classNames.join(" ")}>{notif.message}</div>;
};

export default Notification;
