import React, { useState } from "react";
import axios from "axios";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";

import { Link, useHistory } from "react-router-dom";

import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import { useSetCurrentUser } from '../../contexts/CurrentUserContext';
import { useRedirect } from "../../hooks/useRedirect";
import 'react-toastify/dist/ReactToastify.css';
import { successToast, errorToast } from "../../components/Toasts";

function SignInForm() {
    const setCurrentUser = useSetCurrentUser();
    useRedirect('loggedIn');

    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
    });

    const { username, password } = loginData;

    const history = useHistory();
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const { data } = await axios.post('/dj-rest-auth/login/', loginData);
            setCurrentUser(data.user);
            history.goBack();
            successToast("Successfully logged in as " + data.user.username + "!");
        } catch (err) {
            // Check if response status is 400
            if (err.response.data.non_field_errors) {
                // Display error message when non field errors are present
                errorToast(err.response.data.non_field_errors[0]);
            } else if (err.response.data.username) {
                // Display username errors
                errorToast(err.response.data.username[0]);
            } else if (err.response.data.password) {
                // display password errors
                errorToast(err.response.data.password[0]);
            } else {
                // display generic error message 
                errorToast("Oops, something went wrong!");
            }
        }
    };

    const handleChange = (event) => {
        setLoginData({
            ...loginData,
            [event.target.name]: event.target.value,
        });
    };

    return (
        <Row className={styles.Row}>
            <Col className="my-auto p-0 p-md-2" md={6}>
                <Container className={`${appStyles.Content} p-4`}>
                    <h1 className={styles.Header}>Login</h1>

                    {/* Login Form */}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="username" className={styles.FormGroup}>
                            <Form.Label className="d-none">Username</Form.Label>
                            <Form.Control className={styles.Input} type="text" placeholder="Username" name="username" value={username} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group controlId="password" className={styles.FormGroup}>
                            <Form.Label className="d-none">Password</Form.Label>
                            <Form.Control className={styles.Input} type="password" placeholder="Password" name="password" value={password} onChange={handleChange} />
                        </Form.Group>

                        <Button className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright} ${styles.FormGroup}`} type="submit">
                            Login
                        </Button>

                    </Form>

                </Container>
                <Container className={`mt-3 ${appStyles.Content}`}>
                    <Link className={styles.Link} to="/signup">
                        Don't have an account? <span>Sign up now!</span>
                    </Link>
                </Container>
            </Col>
            <Col
                md={6}
                className={`my-auto d-none d-md-block p-2 ${styles.SignInCol}`}
            >
                <Image
                    className={`${appStyles.FillerImage}`}
                    src={"https://res.cloudinary.com/duoyolryv/image/upload/v1712422360/wheel-night_ax9jro.webp"}
                />
            </Col>
        </Row>
    );
}

export default SignInForm;