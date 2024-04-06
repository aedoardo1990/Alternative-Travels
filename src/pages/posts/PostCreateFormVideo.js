import React, { useRef, useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Asset from "../../components/Asset";
import Spinner from "react-bootstrap/Spinner";

import Upload from "../../assets/upload.png";

import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import TagField from "../../components/TagField";
import LocationField from "../../components/LocationField";
import 'react-toastify/dist/ReactToastify.css';
import { successToast, errorToast } from "../../components/Toasts";

import { useHistory } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import { useRedirect } from "../../hooks/useRedirect";

function PostCreateFormVideo() {
    useRedirect('loggedOut');

    const [postData, setPostData] = useState({
        title: '',
        content: '',
        video: '',
        tags: [],
        location: [],
    });

    const { title, content, video, tags, location } = postData;
    const videoInput = useRef(null);
    const history = useHistory();
    const [buttonDisabled, setButtonDisabled] = useState(false);

    // Method for getting tags from TagField component
    const setTags = (tags) => {
        setPostData({
            ...postData,
            tags: tags,
        });
    };

    // Method for getting location from LocationField component
    const setLocation = (location) => {
        setPostData({
            ...postData,
            location: location,
        });
    };

    const handleChange = (event) => {
        setPostData({
            ...postData,
            [event.target.name]: event.target.value,
        });
    };

    const handleChangeVideo = (event) => {
        if (event.target.files.length) {
            URL.revokeObjectURL(video);
            setPostData({
                ...postData,
                video: URL.createObjectURL(event.target.files[0]),
            });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setButtonDisabled(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('latitude', location[0]);
        formData.append('longitude', location[1]);
        formData.append('video', videoInput.current.files[0]);
        //for sending array of tags from: https://stackoverflow.com/questions/39247160/javascript-formdata-to-array
        if (tags.length) {
            tags.forEach((tag, index) => {
                formData.append(`tags[${index}]`, tag);
            });
        } else {
            formData.append("tags", []);
        }
        try {
            const { data } = await axiosReq.post('/posts/', formData);
            setButtonDisabled(false);
            successToast("Post successfully created!");
            history.push(`/posts/${data.id}`);
        } catch (err) {
            if (err.response.data.title) {
                // display errors of title field
                errorToast(err.response.data.title[0]);
            } else if (err.response.data.video) {
                // display errors for video field
                errorToast(err.response.data.video[0]);
            } else if (err.response.data.content) {
                // display errors for content field
                errorToast(err.response.data.content[0]);
            } else if (err.response.data.latitude) {
                // display errors for latitude field
                errorToast(err.response.data.latitude[0]);
            } else if (err.response.data.longitude) {
                // display errors for longitude field
                errorToast(err.response.data.longitude[0]);
            } else if (err.response.data.tags) {
                // display errors for tags field
                errorToast(err.response.data.tags[0]);
            } else {
                errorToast("Oops, something went wrong!");
            }
            setButtonDisabled(false);
        }
    };

    const textFields = (
        <div className="text-center">
            {/* Create Post form */}

            <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control
                    type="text"
                    name="title"
                    value={title}
                    onChange={handleChange} />
            </Form.Group>

            <Form.Group>
                <Form.Label>Content</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={6}
                    name="content"
                    value={content}
                    onChange={handleChange} />
            </Form.Group>

        </div>
    );

    return (
        <Form onSubmit={handleSubmit}>
            <Row className="mt-2">
                <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
                    <Container
                        className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
                    >
                        <Form.Group className="text-center">
                            {video ? (
                                <>
                                    <figure>
                                        <video className={appStyles.Image} src={video} controls width="100%" rounded="true" />
                                    </figure>
                                    <div>
                                        <Form.Label className={`${btnStyles.Button} ${btnStyles.Blue} btn`} htmlFor="video-upload">
                                            Change video
                                        </Form.Label>
                                    </div>
                                </>
                            ) : (
                                <Form.Label
                                    className="d-flex justify-content-center"
                                    htmlFor="video-upload"
                                >
                                    <Asset src={Upload} message="Click or tap to upload a video" />
                                </Form.Label>
                            )}
                            <Form.File id="video-upload" accept="video/*" onChange={handleChangeVideo} ref={videoInput} />
                        </Form.Group>

                    </Container>
                </Col>

                <Col md={5} lg={4} className="d-md-block p-0 p-md-2">
                    <Container className={appStyles.Content}>
                        {textFields}

                        <LocationField sendLocation={setLocation} setButtonDisabled={setButtonDisabled} />

                        <TagField sendTags={setTags} currentTags={tags} className="d-md-none" />

                        <div className="text-center">
                        <Button
                            className={`${btnStyles.Button} ${btnStyles.Black}`}
                            onClick={() => history.goBack()}
                        >
                            Delete
                        </Button>
                        <Button className={`${btnStyles.Button} ${btnStyles.Black}`} type="submit" disabled={buttonDisabled}>
                        {buttonDisabled ? <Spinner animation="grow" size="sm" /> : "Create"}
                        </Button>
                        </div>
                    </Container>
                </Col>
            </Row>
        </Form >
    );
}

export default PostCreateFormVideo;