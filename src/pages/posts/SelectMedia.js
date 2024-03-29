import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import styles from "../../styles/SelectMedia.module.css";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { useRedirect } from "../../hooks/useRedirect";

const SelectMedia = () => {
  useRedirect("loggedOut");
  return (
    <Row>
      <Col md={6} className="mt-4">
        <Container className={styles.Choice}>
          <div className={styles.first}>
            <Image
              className={styles.ImageIcon}
              src={
                "https://res.cloudinary.com/duoyolryv/image/upload/v1709726107/default_post_g5kn5h.jpg"
              }
            />
            <Link className={styles.Link} to="/posts/add/image">
              Create a post with an image
            </Link>
          </div>
          <div className={styles.second}>
            <Image
              className={styles.ImageIcon}
              src={
                "https://res.cloudinary.com/duoyolryv/image/upload/v1711705321/default_video_waimeh.png"
              }
            />
            <Link className={styles.Link} to="/posts/add/video">
              Create a post with a video
            </Link>
          </div>
        </Container>
      </Col>
    </Row>
  );
};

export default SelectMedia;