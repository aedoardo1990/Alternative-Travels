import React, { useEffect, useRef, useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Spinner from "react-bootstrap/Spinner";

import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";

import { useHistory, useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

import TagField from "../../components/TagField";
import LocationField from "../../components/LocationField";
import Asset from "../../components/Asset";
import 'react-toastify/dist/ReactToastify.css';
import { successToast, errorToast } from "../../components/Toasts";

function PostEditImageForm() {

    const [postData, setPostData] = useState({
        title: '',
        content: '',
        image: '',
        tags: [],
        location: [],
    });

    const { title, content, image, tags, location } = postData;

    const imageInput = useRef(null);
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
                    const { title, content, image, is_owner, tags, latitude, longitude } = data;
                    is_owner ? setPostData({
                        title: title,
                        content: content,
                        image: image,
                        tags: tags,
                        location: [latitude, longitude],
                    })
                        : history.push("/");
                } catch (err) {
                    // console.log(err);
                }
            }
        };

        handleMount();
    }, [history, id, postData, hasLoaded]);

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

    const handleChangeImage = (event) => {
        if (event.target.files.length) {
            URL.revokeObjectURL(image);
            setPostData({
                ...postData,
                image: URL.createObjectURL(event.target.files[0]),
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
        if (imageInput?.current?.files[0]) {
            formData.append('image', imageInput.current.files[0]);
        }
        try {
            await axiosReq.put(`/posts/${id}`, formData);
            successToast("Post edited successfully!");
            setButtonDisabled(false);
            history.push(`/posts/${id}`);
        } catch (err) {
            if (err.response.data.title) {
                // display if there are errors in title field
                errorToast(err.response.data.title[0]);
            } else if (err.response.data.image) {
                // display errors for image field
                errorToast(err.response.data.image[0]);
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
                <Form.Control type="text" name="title" value={title} onChange={handleChange} />
            </Form.Group>

            <Form.Group>
                <Form.Label>Content</Form.Label>
                <Form.Control as="textarea" rows={6} name="content" value={content} onChange={handleChange} />
            </Form.Group>
            
        </div>
    );

    return (
        <>
            {hasLoaded ? (
                <Form onSubmit={handleSubmit}>
                    <Row className="mt-2">
                        <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
                            <Container
                                className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
                            >
                                <Form.Group className="text-center">
                                    <figure>
                                        <Image className={appStyles.Image} src={image} rounded />
                                    </figure>
                                    <div>
                                        <Form.Label className={`${btnStyles.Button} ${btnStyles.Black} btn`} htmlFor="image-upload">
                                            Change image
                                        </Form.Label>
                                    </div>
                                    <Form.File id="image-upload" accept="image/*" onChange={handleChangeImage} ref={imageInput} />
                                </Form.Group>
                                
                            </Container>
                        </Col>
                        <Col md={5} lg={4} className="d-md-block p-0 p-md-2">
                            <Container className={appStyles.Content}>
                                {textFields}

                                {title && <TagField sendTags={setTags} previousTags={tags} />}

                                { location.length &&<LocationField
                                    sendLocation={setLocation}
                                    previousLocation={location}
                                    setButtonDisabled={setButtonDisabled}
                                />}
                                <div className="text-center">
                                <Button
                                    className={`${btnStyles.Button} ${btnStyles.Black}`}
                                    onClick={() => history.goBack()}
                                >
                                    Delete
                                </Button>
                                <Button className={`${btnStyles.Button} ${btnStyles.Black}`} type="submit" disabled={buttonDisabled}>
                                {buttonDisabled ? <Spinner animation="grow" size="sm" /> : "Update"}
                                </Button>
                                </div>
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

export default PostEditImageForm;