import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

import { Form, Button, Image, Col, Row, Container } from "react-bootstrap";
import axios from "axios";
import { useRedirect } from "../../hooks/useRedirect";
import 'react-toastify/dist/ReactToastify.css';
import { successToast, errorToast } from "../../components/Toasts";

const SignUpForm = () => {
    useRedirect('loggedIn');
    const [signUpData, setSignUpData] = useState({
        username: '',
        password1: '',
        password2: '',
    });
    const { username, password1, password2 } = signUpData;

    const history = useHistory();

    const handleChange = (event) => {
        setSignUpData({
            ...signUpData,
            [event.target.name]: event.target.value,
        });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('/dj-rest-auth/registration/', signUpData);
            history.push("/login");
            successToast("Successfully signed up!");
        } catch (err) {
            // Check for response status 400
            if (err.response.data.non_field_errors){
                // display error message for non field errors
                errorToast(err.response.data.non_field_errors[0])
            } else if (err.response.data.username){
                // display error message for username
                errorToast(err.response.data.username[0])
            } else if (err.response.data.password1){
                // display error message for password1
                errorToast(err.response.data.password1[0])
            } else if (err.response.data.password2){
                // display error message for password 2
                errorToast(err.response.data.password2[0])
            } else {
                // generic error message for other errors
                errorToast("Ooops, something went wrong")
            }
        }
    }

    return (
        <Row className={styles.Row}>
            <Col className="my-auto py-2 p-md-2" md={6}>
                <Container className={`${appStyles.Content} p-4 `}>
                    <h1 className={styles.Header}>sign up</h1>
                    {/*Form to SignUp */}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="username" className={styles.FormGroup}>
                            <Form.Label className="d-none">Username</Form.Label>
                            <Form.Control className={styles.Input} type="text" placeholder="Username" name="username" value={username} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group controlId="password1" className={styles.FormGroup}>
                            <Form.Label className="d-none">Password</Form.Label>
                            <Form.Control className={styles.Input} type="password" placeholder="Password" name="password1" value={password1} onChange={handleChange} />
                        </Form.Group>
                    
                        <Form.Group controlId="password2" className={styles.FormGroup}>
                            <Form.Label className="d-none">Confirm password</Form.Label>
                            <Form.Control className={styles.Input} type="password" placeholder="Confirm password" name="password2" value={password2} onChange={handleChange} />
                        </Form.Group>

                        <Button className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright} ${styles.FormGroup}`} type="submit">
                            Sign up
                        </Button>

                    </Form>

                </Container>
                <Container className={`mt-3 ${appStyles.Content}`}>
                    <Link className={styles.Link} to="/login">
                        Already have an account? <span>Login</span>
                    </Link>
                </Container>
            </Col>
            <Col
                md={6}
                className={`my-auto d-none d-md-block p-2 ${styles.SignUpCol}`}
            >
                <Image
                    className={`${appStyles.FillerImage}`}
                    src={
                        "https://res.cloudinary.com/duoyolryv/image/upload/v1712423512/ferris-wheel_kxmebj.webp"
                    }
                />
            </Col>
        </Row>
    );
};

export default SignUpForm;