import React, { useRef, useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Image from "react-bootstrap/Image";
import Asset from "../../components/Asset";

import Upload from "../../assets/upload.png";

import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import TagField from "../../components/TagField";
import LocationField from "../../components/LocationField";

import { useHistory } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import { useRedirect } from "../../hooks/useRedirect";

function PostCreateForm(props) {
    useRedirect('loggedOut');
    const { showMessage } = props;
    const [errors, setErrors] = useState({});

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
        formData.append('image', imageInput.current.files[0]);
        formData.append('latitude', location[0]);
        formData.append('longitude', location[1]);
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
            setButtonDisabled(true);
            history.push(`/posts/${data.id}`);
        } catch (err) {
            setErrors(err.response?.data);
            setButtonDisabled(true);
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

            {errors?.title?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                    {message}
                </Alert>
            ))}

            <Form.Group>
                <Form.Label>Content</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={6}
                    name="content"
                    value={content}
                    onChange={handleChange} />
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
        <Form onSubmit={handleSubmit}>
            <Row>
                <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
                    <Container
                        className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
                    >
                        <Form.Group className="text-center">
                            {image ? (
                                <>
                                    <figure>
                                        <Image className={appStyles.Image} src={image} rounded />
                                    </figure>
                                    <div>
                                        <Form.Label className={`${btnStyles.Button} ${btnStyles.Blue} btn`} htmlFor="image-upload">
                                            Change image
                                        </Form.Label>
                                    </div>
                                </>
                            ) : (
                                <Form.Label
                                    className="d-flex justify-content-center"
                                    htmlFor="image-upload"
                                >
                                    <Asset src={Upload} message="Click or tap to upload an image" />
                                </Form.Label>
                            )}
                            <Form.File id="image-upload" accept="image/*" onChange={handleChangeImage} ref={imageInput} />
                        </Form.Group>
                        {errors?.image?.map((message, idx) => (
                            <Alert variant="warning" key={idx}>
                                {message}
                            </Alert>
                        ))}
                    </Container>
                </Col>

                <Col md={5} lg={4} className="d-md-block p-0 p-md-2">
                    <Container className={appStyles.Content}>
                        {textFields}

                        <LocationField sendLocation={setLocation} showMessage={showMessage} setButtonDisabled={setButtonDisabled} />
                        {locationErrors}

                        <TagField sendTags={setTags} showMessage={showMessage} currentTags={tags} className="d-md-none" />
                        {tagErrors}

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
    );
}

export default PostCreateForm;