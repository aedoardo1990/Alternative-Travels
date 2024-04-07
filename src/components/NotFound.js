import React from "react";
import styles from "../styles/NotFound.module.css";

const NotFound = () => {
  return (
    <div className={`${styles.NotFound} text-center`}>
        <h3 className="mb-4">Page not found <i className="fa-solid fa-circle-radiation fa-beat-fade"></i></h3>
      <img
        src={"https://res.cloudinary.com/duoyolryv/image/upload/v1712480108/404_cdhwfe.webp"}
        alt={"404 error"}
        controls width="90%"
        />
    </div>
  );
};

export default NotFound;