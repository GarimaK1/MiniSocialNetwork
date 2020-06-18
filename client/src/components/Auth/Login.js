import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Login = () => {
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = loginData;

    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(loginData);
    }

    return (
        <div>
            <Container >
                <Row>
                    <Col sm={10} md={6} xl={4} style={{ margin: 'auto' }}>
                        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Login</h2>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Control
                                    type="email"
                                    placeholder="Email"
                                    name='email'
                                    value={email}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    name='password'
                                    value={password}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Button variant="dark" type="submit" block>
                                Login
                            </Button>
                            <p style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                                Don't have an account? <Link to="/register">Sign Up</Link>
                            </p>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Login;