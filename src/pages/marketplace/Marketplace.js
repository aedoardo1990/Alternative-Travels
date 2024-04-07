import React, { useState } from 'react';
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
        opinions_count,
        loves_count,
        love_id,
        title,
        price,
        image,
        condition,
        status,
        details,
        address,
        contact_number,
        email,
        updated_at,
        marketplacePage,
        setMarketplaces,
    } = props;

    const currentUser = useCurrentUser();
    const is_owner = currentUser?.username === owner;
    const history = useHistory();
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleShowDetails = () => {
    };

    const productDetails = (
        <Row className="mt-2">
            <Col md={12} className="pb-2 pt-1 pt-md-0">
                <ListGroup className={`${appStyles.SmallText} mb-0 me-0`}>
                    <ListGroup.Item className="flex-fill d-flex align-items-center flex-wrap" style={{ border: 'none' }}>
                    <strong style={{ marginRight: '5px' }}>Status </strong> <div style={{ color: status === 'Available' ? '#31CE40' : '#FF0000', fontWeight: 'bold' }}>{status}</div>
                    </ListGroup.Item>
                </ListGroup>
            </Col>
            <Col md={12} className="pb-2 pt-1 pt-md-0">
                <ListGroup className={`${appStyles.SmallText} mb-0 me-0`}>
                    <ListGroup.Item style={{ border: 'none' }}>
                    <strong style={{ marginRight: '5px' }} className="flex-fill d-flex align-items-center flex-wrap">Product Description </strong>
                    <div style={{ display: 'block', textAlign: 'left'}}>{details}</div>
                    </ListGroup.Item>
                </ListGroup>
            </Col>
            <Col md={12} className="pb-2 pt-1 pt-md-0">
                <ListGroup className={`${appStyles.SmallText} mb-0 me-0`}>
                    <ListGroup.Item className="flex-fill d-flex align-items-center flex-wrap" style={{ border: 'none' }}>
                    <strong style={{ marginRight: '5px' }}>Address </strong>  {address}
                    </ListGroup.Item>
                </ListGroup>
            </Col>
            <Col md={12} className="pb-2 pt-1 pt-md-0">
                <ListGroup className={`${appStyles.SmallText} mb-0 me-0`}>
                    <ListGroup.Item className="flex-fill d-flex align-items-center flex-wrap" style={{ border: 'none' }}>
                    <strong style={{ marginRight: '5px' }}>Phone </strong> {contact_number}
                    </ListGroup.Item>
                </ListGroup>
            </Col>
            <Col md={12} className="pb-2 pt-1 pt-md-0">
                <ListGroup className={`${appStyles.SmallText} mb-0 me-0`}>
                    <ListGroup.Item className="flex-fill d-flex align-items-center flex-wrap" style={{ border: 'none' }}>
                    <strong style={{ marginRight: '5px' }}>Email </strong> {email}
                    </ListGroup.Item>
                </ListGroup>
            </Col>
        </Row>
    );

    const handleEditProduct = () => {
        history.push(`/marketplace/${id}/edit-product`);
    };

    const handleDelete = async () => {
        try {
            await axiosRes.delete(`/marketplace/${id}`);
            history.goBack('/');
            successToast("Item deleted successfully!");
        } catch (err) {
            errorToast("Oops, something went wrong!");
        }
    };

    const handleLove = async () => {
        try {
            const { data } = await axiosRes.post("/loves/", { marketplace: id });
            setMarketplaces((prevMarketplaces) => ({
                ...prevMarketplaces,
                results: prevMarketplaces.results.map((marketplace) => {
                    return marketplace.id === id
                        ? { ...marketplace, loves_count: marketplace.loves_count + 1, love_id: data.id }
                        : marketplace;
                }),
            }));
        } catch (err) {
            // console.log(err);
        }
    };

    const handleUnlove = async () => {
        try {
            await axiosRes.delete(`/loves/${love_id}/`);
            setMarketplaces((prevMarketplaces) => ({
                ...prevMarketplaces,
                results: prevMarketplaces.results.map((marketplace) => {
                    return marketplace.id === id
                        ? { ...marketplace, loves_count: marketplace.loves_count - 1, love_id: null }
                        : marketplace;
                }),
            }));
        } catch (err) {
            // console.log(err);
        }
    };

    // to format price as currency string - https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-strings
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR',
    });

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
                            {is_owner && marketplacePage && (<MoreDropdown
                                handleEdit={handleEditProduct}
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
                    {price && <Card.Text><strong>{formatter.format(price)}</strong></Card.Text>}
                    {condition && <Card.Text style={{ color: condition === 'New' ? '#31CE40' : '#E7BB1A', fontWeight: 'bold' }}
                    >Condition: {condition}</Card.Text>}
                    {marketplacePage ? (
                        productDetails
                    ) : (<Accordion>
                        <Card>
                            <Card.Header>
                                <Accordion.Toggle as={Button} variant="link text-decoration-none" className={styles.Toggle} eventKey="0" onClick={handleShowDetails}>
                                    <i className="fa-solid fa-address-card"></i>Check details and contact
                                </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="0">
                                <Card.Body>{productDetails}</Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                    )}
                    <div className={styles.PostBar}>
                        {is_owner ? (
                            <OverlayTrigger placement='top' overlay={<Tooltip>You can't like your own post</Tooltip>}>
                                <i className='far fa-thumbs-up' />
                            </OverlayTrigger>
                        ) : love_id ? (
                            <span onClick={handleUnlove}>
                                <i className={`fas fa-thumbs-up ${styles.ThumbsUp}`} />
                            </span>
                        ) : currentUser ? (
                            <span onClick={handleLove}>
                                <i className={`far fa-thumbs-up ${styles.ThumbsUpOutline}`} />
                            </span>
                        ) : (
                            <OverlayTrigger placement='top' overlay={<Tooltip>Log in to like posts</Tooltip>}>
                                <i className='far fa-thumbs-up' />
                            </OverlayTrigger>
                        )}
                        {loves_count}
                        <Link to={`/marketplace/${id}`}>
                            <i className='far fa-comments' />
                        </Link>
                        {opinions_count}
                    </div>
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