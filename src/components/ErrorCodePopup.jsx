import React, { useEffect } from "react";
import PopupPanel from "./PopupPanel";

const ErrorCodePopup = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // auto-close after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <PopupPanel title="ACCESS DENIED" onClose={onClose}>
      <p>{message}</p>
    </PopupPanel>
  );
};

export default ErrorCodePopup;
