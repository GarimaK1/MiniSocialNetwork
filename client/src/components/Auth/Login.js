import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from "../../redux/actions/authActions";

const Login = ({ login, isAuthenticated }) => {
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
        login(email, password);
        setLoginData({
            email: '',
            password: ''
        });
    }

    useEffect(() => {
        console.log('Inside login useEffect');
    }, [])

    // Redirect if logged-in
    if (isAuthenticated) {
        return <Redirect to="/dashboard" />
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
                                    // required
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    name='password'
                                    value={password}
                                    onChange={handleChange}
                                    // required
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

Login.propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated // implicitly returning isAuthenticated coz arrow function
})

export default connect(mapStateToProps, { login })(Login);