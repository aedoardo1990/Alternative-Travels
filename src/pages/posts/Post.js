import React, { useState } from 'react'
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import styles from "../../styles/Post.module.css";
import appStyles from "../../App.module.css";
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { Card, Media, OverlayTrigger, Tooltip, Modal, Container, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { axiosRes } from '../../api/axiosDefaults';
import { MoreDropdown } from '../../components/MoreDropdown';
//import PostImage from "../../components/PostImage";
import PostDetailMap from "../../components/PostDetailMap";
import 'react-toastify/dist/ReactToastify.css';
import { successToast, errorToast } from "../../components/Toasts";

const Post = (props) => {
    const {
        id,
        owner,
        profile_id,
        profile_image,
        comments_count,
        likes_count,
        like_id,
        title,
        content,
        image,
        video,
        updated_at,
        postPage,
        setPosts,
        tags,
        latitude,
        longitude,
    } = props;

    const currentUser = useCurrentUser();
    const is_owner = currentUser?.username === owner;
    const history = useHistory();
    const [rerenderMap, setRerenderMap] = useState(false);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const handleShowDetails = () => {
        setRerenderMap(rerenderMap ? false : true);
    };

    const postDetails = (
        <Row className="mt-2">
            <Col md={7} className="pe-md-0">
                <ListGroup className={`${appStyles.SmallText} mb-1 me-0`}>
                    {tags?.length > 0 && (
                        <ListGroup.Item className="flex-fill">
                            <div className="fw-bold">Tags</div>
                            <div className="d-flex align-items-center flex-wrap">
                                {tags?.map((tag, index) => (
                                    <span className={styles.Tag} key={index}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </ListGroup.Item>
                    )}
                </ListGroup>
            </Col>
            <Col md={5} className="pb-2 pt-1 pt-md-0">
                {latitude && longitude && <PostDetailMap post={{ id: id, location: [latitude, longitude] }} rerender={rerenderMap} />}
            </Col>
        </Row>
    );

    const handleEditImage = () => {
        history.push(`/posts/${id}/edit-image`);
    };

    const handleEditVideo = () => {
        history.push(`/posts/${id}/edit-video`);
    };


    const handleDelete = async () => {
        try {
            await axiosRes.delete(`/posts/${id}`);
            history.goBack('/');
            successToast("Post deleted successfully!");
        } catch (err) {
            errorToast("Oops, something went wrong!");
        }
    };

    const handleLike = async () => {
        try {
            const { data } = await axiosRes.post("/likes/", { post: id });
            setPosts((prevPosts) => ({
                ...prevPosts,
                results: prevPosts.results.map((post) => {
                    return post.id === id
                        ? { ...post, likes_count: post.likes_count + 1, like_id: data.id }
                        : post;
                }),
            }));
        } catch (err) {
            console.log(err);
        }
    };

    const handleUnlike = async () => {
        try {
            await axiosRes.delete(`/likes/${like_id}/`);
            setPosts((prevPosts) => ({
                ...prevPosts,
                results: prevPosts.results.map((post) => {
                    return post.id === id
                        ? { ...post, likes_count: post.likes_count - 1, like_id: null }
                        : post;
                }),
            }));
        } catch (err) {
            console.log(err);
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
                            <span className="mx-2" style={{fontSize: 14, color: 'grey'}}>{updated_at}</span>
                            {/*It renders dropdown for edit/delete image/video post */}
                            {is_owner && postPage && (
                                !image?.includes("default_post_g5kn5h") ?
                                    (<MoreDropdown
                                        handleEdit={handleEditImage}
                                        handleShow={handleShow}
                                    />) : (
                                        <MoreDropdown
                                            handleEdit={handleEditVideo}
                                            handleShow={handleShow}
                                        />
                                    )
                            )}
                        </div>
                    </Media>
                </Card.Body>

                {/*It renders an image or a video post uploaded by the user */}
                {!image?.includes("default_post_g5kn5h") ? (
                    <Link to={`/posts/${id}`}>
                        <Card.Img src={image} alt={title} />
                    </Link>
                ) : (
                    <Link to={`/posts/${id}`}>
                        <video src={video} controls width="100%"/>
                    </Link>
                )}

                <Card.Body>
                    {title && <Card.Title className='text-center'>{title}</Card.Title>}
                    {content && <Card.Text>{content}</Card.Text>}
                    {postDetails}
                    <div className={styles.PostBar}>
                        {is_owner ? (
                            <OverlayTrigger placement='top' overlay={<Tooltip>You can't like your own post</Tooltip>}>
                                <i className='far fa-thumbs-up' />
                            </OverlayTrigger>
                        ) : like_id ? (
                            <span onClick={handleUnlike}>
                                <i className={`fas fa-thumbs-up ${styles.ThumbsUp}`} />
                            </span>
                        ) : currentUser ? (
                            <span onClick={handleLike}>
                                <i className={`far fa-thumbs-up ${styles.ThumbsUpOutline}`} />
                            </span>
                        ) : (
                            <OverlayTrigger placement='top' overlay={<Tooltip>Log in to like posts</Tooltip>}>
                                <i className='far fa-thumbs-up' />
                            </OverlayTrigger>
                        )}
                        {likes_count}
                        <Link to={`/posts/${id}`}>
                            <i className='far fa-comments' />
                        </Link>
                        {comments_count}
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

export default Post;