import React, { useEffect, useRef, useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";

import { useHistory, useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

import TagField from "../../components/TagField";
import LocationField from "../../components/LocationField";
import Asset from "../../components/Asset";

function PostEditVideoForm(props) {
    const { showMessage } = props;
    const [errors, setErrors] = useState({});

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
    const { id } = useParams();
    const [hasLoaded, setHasLoaded] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    useEffect(() => {
        const handleMount = async () => {
            if (!hasLoaded) {
                try {
                    const { data } = await axiosReq.get(`/posts/${id}`);
                    setHasLoaded(true);
                    const { title, content, video, is_owner, tags, latitude, longitude } = data;
                    console.log(latitude, longitude)
                    is_owner ? setPostData({
                        title: title,
                        content: content,
                        video: video,
                        tags: tags,
                        location: [latitude, longitude],
                    })
                        : history.push("/");
                } catch (err) {
                    console.log(err);
                }
            }
        };

        handleMount();
    }, [history, id, showMessage, postData, hasLoaded]);

    const handleChange = (event) => {
        setPostData({
            ...postData,
            [event.target.name]: event.target.value,
        });
    };

    // to get tags from TagField component
    const setTags = (tags) => {
        setPostData({
            ...postData,
            tags: tags,
        });
    };

    // to get location from LocationField component
    const setLocation = (location) => {
        setPostData({
            ...postData,
            location: location,
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
        formData.append("latitude", location[0]);
        formData.append("longitude", location[1]);
        // Solution for sending array of tags from: https://stackoverflow.com/questions/39247160/javascript-formdata-to-array
        if (tags.length) {
            tags.forEach((tag, index) => {
                formData.append(`tags[${index}]`, tag);
            });
        } else {
            formData.append("tags", []);
        }
        if (videoInput?.current?.files[0]) {
            formData.append('video', videoInput.current.files[0]);
        }
        try {
            await axiosReq.put(`/posts/${id}`, formData);
            setButtonDisabled(false);
            history.push(`/posts/${id}`);
        } catch (err) {
            console.log(err);
            setErrors(err.response?.data);
            setButtonDisabled(false);
        }
    };

    const textFields = (
        <div className="text-center">
            {/* Create Post form */}

            <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" name="title" value={title} onChange={handleChange} />
            </Form.Group>
            {errors?.title?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                    {message}
                </Alert>
            ))}

            <Form.Group>
                <Form.Label>Content</Form.Label>
                <Form.Control as="textarea" rows={6} name="content" value={content} onChange={handleChange} />
            </Form.Group>
            {errors?.content?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                    {message}
                </Alert>
            ))}
        </div>
    );

    const tagErrors = (
        <>
            {errors.tags && (
                <Alert className={styles.Alert} variant="warning">
                    {errors.tags[0]}
                </Alert>
            )}
        </>
    );

    const locationErrors = (
        <>
            {errors.latitude?.map((msg, i) => (
                <Alert className={styles.Alert} variant="warning" key={i}>
                    {msg}
                </Alert>
            ))}
            {errors.longitude?.map((msg, i) => (
                <Alert className={styles.Alert} variant="warning" key={i}>
                    {msg}
                </Alert>
            ))}
        </>
    );

    return (
        <>
            {hasLoaded ? (
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
                            <Container
                                className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
                            >
                                <Form.Group className="text-center">
                                    <figure>
                                        <video className={appStyles.Image} src={video} controls width="100%" rounded="True" />
                                    </figure>
                                    <div>
                                        <Form.Label className={`${btnStyles.Button} ${btnStyles.Blue} btn`} htmlFor="video-upload">
                                            Change video
                                        </Form.Label>
                                    </div>
                                    <Form.File id="video-upload" accept="video/*" onChange={handleChangeVideo} ref={videoInput} />
                                </Form.Group>
                                {errors?.video?.map((message, idx) => (
                                    <Alert variant="warning" key={idx}>
                                        {message}
                                    </Alert>
                                ))}
                            </Container>
                        </Col>
                        <Col md={5} lg={4} className="d-md-block p-0 p-md-2">
                            <Container className={appStyles.Content}>
                                {textFields}

                                {title && <TagField sendTags={setTags} showMessage={showMessage} previousTags={tags} />}
                                {tagErrors}

                                {location.length && <LocationField
                                    sendLocation={setLocation}
                                    showMessage={showMessage}
                                    previousLocation={location}
                                    setButtonDisabled={setButtonDisabled}
                                />}
                                {locationErrors}
                                <Button
                                    className={`${btnStyles.Button} ${btnStyles.Blue}`}
                                    onClick={() => history.goBack()}
                                >
                                    Delete
                                </Button>
                                <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit" disabled={buttonDisabled}>
                                    Create
                                </Button>
                            </Container>
                        </Col>
                    </Row>
                </Form >
            ) : (
                <Asset spinner />
            )}
        </>
    );
}

export default PostEditVideoForm;