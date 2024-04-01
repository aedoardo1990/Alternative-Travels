import React from "react";
import styles from "../styles/PostVideo.module.css";

const PostVideo = ({ src, height = 50, text }) => {
  return (
    <span className="align-bottom">
      <video className={`${styles.PostVideo} me-2`} src={src} alt="PostVideo" height={height} width={height}></video>
      <strong className="fs-5">{text}</strong>
    </span>
  );
};

export default PostVideo;