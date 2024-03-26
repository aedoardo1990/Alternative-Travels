import React from "react";
import styles from "../styles/PostImage.module.css";

const PostImage = ({ src, height = 50, text }) => {
  return (
    <span className="align-bottom">
      <img className={`${styles.PostImage} me-2`} src={src} alt="PostImage" height={height} width={height} />
      <strong className="fs-5">{text}</strong>
    </span>
  );
};

export default PostImage;