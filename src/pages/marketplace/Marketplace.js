import React, { useState } from 'react'
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Accordion from 'react-bootstrap/Accordion';

import styles from "../../styles/Post.module.css";
import appStyles from "../../App.module.css";
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { Card, Media, OverlayTrigger, Tooltip, Modal, Container, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { axiosRes } from '../../api/axiosDefaults';
import { MoreDropdown } from '../../components/MoreDropdown';
import 'react-toastify/dist/ReactToastify.css';
import { successToast, errorToast } from "../../components/Toasts";

const Marketplace = (props) => {
    const {
        id,
        owner,
        profile_id,
        profile_image,
        title,
        price,
        image,
        condition,
        details,
        address,
        contact_number,
        email,
        updated_at,
        marketplacePage,
    } = props;

    const currentUser = useCurrentUser();
    const is_owner = currentUser?.username === owner;
    const history = useHistory();
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const handleShowDetails = () => {
        setRerenderMap(rerenderMap ? false : true);
    };

    const handleEditImage = () => {
        history.push(`/marketplace/${id}/edit-image`);
    };

    const handleDelete = async () => {
        try {
            await axiosRes.delete(`/marketplace/${id}`);
            history.goBack('/');
            successToast("Post deleted successfully!");
        } catch (err) {
            errorToast("Oops, something went wrong!");
        }
    };

    return (
        <Container>
            <Card className={styles.Post}>
                <Card.Body>
                    <div>

                    </div>
                    <Media className='d-flex align-items-start justify-content-between'>
                        <div className='d-flex align-items-center'>
                            <Link to={`/profiles/${profile_id}`} className="fw-bold">
                                <Avatar src={profile_image} height={50} />
                                {owner}
                            </Link>
                        </div>
                        <div className='d-flex align-items-center'>
                            <span className="mx-2" style={{ fontSize: 14, color: 'grey' }}>{updated_at}</span>
                            {is_owner && postPage && (<MoreDropdown
                                        handleEdit={handleEditImage}
                                        handleShow={handleShow}
                                    />
                            )}
                        </div>
                    </Media>
                </Card.Body>

                    <Link to={`/marketplace/${id}`}>
                        <Card.Img src={image} alt={title} />
                    </Link>

                <Card.Body>
                    {title && <Card.Title className='text-center'>{title}</Card.Title>}
                    {price && <Card.Text>{price}</Card.Text>}
                    {condition && <Card.Text>{condition}</Card.Text>}
                    {marketplacePage ? (
                        details
                    ) : (<Accordion>
                        <Card>
                            <Card.Header>
                                <Accordion.Toggle as={Button} variant="link text-decoration-none" className={styles.Toggle} eventKey="0" onClick={handleShowDetails}>
                                    <i class="fa-solid fa-location-dot" ></i>Details and contact
                                </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="0">
                                <Card.Body><p>{details}</p><p>{address}</p><p>{contact_number}</p><p>{email}</p></Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                    )}
                </Card.Body>
            </Card>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure to delete the post?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Marketplace;