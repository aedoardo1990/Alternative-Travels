import React, { useEffect, useRef, useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Image from "react-bootstrap/Image";

import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";

import { useHistory, useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

import TagField from "../../components/TagField";
import Asset from "../../components/Asset";

function PostEditForm(props) {
    const { showMessage } = props;
    const [errors, setErrors] = useState({});

    const [postData, setPostData] = useState({
        title: '',
        content: '',
        image: '',
        tags: [],
    });

    const { title, content, image, tags } = postData;

    const imageInput = useRef(null);
    const history = useHistory();
    const { id } = useParams();
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        const handleMount = async () => {
            if (!hasLoaded) {
            try {
                const { data } = await axiosReq.get(`/posts/${id}`);
                setHasLoaded(true);
                const { title, content, image, is_owner, tags } = data;

                is_owner ? setPostData({ title: title, content: content, image: image, tags: tags }) : history.push("/");
            } catch (err) {
                console.log(err);
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

    // Method for getting tags from TagField component
    const setTags = (tags) => {
        setPostData({
            ...postData,
            tags: tags,
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
        const formData = new FormData();

        formData.append('title', title);
        formData.append('content', content);

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
            history.push(`/posts/${id}`);
        } catch (err) {
            console.log(err);
            if (err.response?.status !== 401) {
                setErrors(err.response?.data);
            }
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
                                <Image className={appStyles.Image} src={image} rounded />
                            </figure>
                            <div>
                                <Form.Label className={`${btnStyles.Button} ${btnStyles.Blue} btn`} htmlFor="image-upload">
                                    Change image
                                </Form.Label>
                            </div>
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

                       {title && <TagField sendTags={setTags} showMessage={showMessage} previousTags={tags} />}
                       {tagErrors}
                        <Button
                            className={`${btnStyles.Button} ${btnStyles.Blue}`}
                            onClick={() => history.goBack()}
                        >
                            Delete
                        </Button>
                        <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
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

export default PostEditForm;