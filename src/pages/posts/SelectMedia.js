import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import styles from "../../styles/SelectMedia.module.css";
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
                "https://res.cloudinary.com/duoyolryv/image/upload/v1712135751/photo_re6dr3.webp"
              }
            />

          </div>
          <div className={styles.Create}>
            <Button className={styles.Button} href="/posts/add/image">
              Create image post <i className="fa-solid fa-camera-retro fa-xl"></i>
            </Button>
          </div>
          <div className={styles.second}>
            <Image
              className={styles.ImageIcon}
              src={
                "https://res.cloudinary.com/duoyolryv/image/upload/v1712135751/video_iwnx3h.gif"
              }
            />
          </div>
          <div className={styles.Create}>
            <Button className={styles.Button} href="/posts/add/video">
              Create video post<i className="fa-solid fa-film fa-xl"></i>
            </Button>
          </div>
        </Container>
      </Col>
    </Row>
  );
};

export default SelectMedia;