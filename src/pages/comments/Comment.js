import React, { useState } from "react";
import { Media, Button, Modal, Card } from 'react-bootstrap';
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { MoreDropdown } from '../../components/MoreDropdown';
import CommentEditForm from "./CommentEditForm";
import styles from "../../styles/Comment.module.css";
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { axiosRes } from '../../api/axiosDefaults';

const Comment = (props) => {
  const {
    profile_id,
    profile_image,
    owner,
    updated_at,
    content,
    id,
    setPost,
    setComments,
  } = props;

  const [showEditForm, setShowEditForm] = useState(false);
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/comments/${id}/`);
      setPost((prevPost) => ({
        results: [
          {
            ...prevPost.results[0],
            comments_count: prevPost.results[0].comments_count - 1,
          },
        ],
      }));

      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.filter((comment) => comment.id !== id),
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
            <CommentEditForm
              id={id}
              profile_id={profile_id}
              content={content}
              profileImage={profile_image}
              setComments={setComments}
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

export default Comment;