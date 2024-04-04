import React, { useState } from "react";
import { Media, Button, Modal, Card } from 'react-bootstrap';
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { MoreDropdown } from '../../components/MoreDropdown';
import OpinionEditForm from "./OpinionEditForm";
import styles from "../../styles/Comment.module.css";
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { axiosRes } from '../../api/axiosDefaults';

const Opinion = (props) => {
  const {
    profile_id,
    profile_image,
    owner,
    updated_at,
    content,
    id,
    setMarketplace,
    setOpinions,
  } = props;

  const [showEditForm, setShowEditForm] = useState(false);
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/opinions/${id}/`);
      setMarketplace((prevMarketplace) => ({
        results: [
          {
            ...prevMarketplace.results[0],
            opinions_count: prevMarketplace.results[0].opinions_count - 1,
          },
        ],
      }));

      setOpinions((prevOpinions) => ({
        ...prevOpinions,
        results: prevOpinions.results.filter((opinion) => opinion.id !== id),
      }));
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <>
      <br />
      <Media className='d-flex align-items-start mt-4'>
        <Link to={`/profiles/${profile_id}`} className="fw-bold d-flex">
          <Avatar src={profile_image} />
        </Link>
        <Media.Body className="mx-2 mx-md-4 col-7 col-md-9">
          {showEditForm ? (
            <OpinionEditForm
              id={id}
              profile_id={profile_id}
              content={content}
              profileImage={profile_image}
              setOpinions={setOpinions}
              setShowEditForm={setShowEditForm}
            />
          ) : (
            <Card className={styles.Card}>
              <Card.Body>
              <span className="fw-bold">{owner}</span>
                <p>{content}</p>
                </Card.Body>
            </Card>
          )}
          <div className="mt-2">
            <span className={styles.Date}>{updated_at}</span>
          </div>
        </Media.Body>
        {is_owner && !showEditForm && (
          <MoreDropdown
            handleEdit={() => setShowEditForm(true)}
            handleShow={handleShow}
          />
        )}
      </Media>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure to delete this comment?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Opinion;