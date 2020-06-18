import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { connect } from 'react-redux';
import { setAlert } from '../../redux/actions/alertActions';
import { register } from '../../redux/actions/authActions';
import PropTypes from 'prop-types';

const Register = (props) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });

    const { name, email, password, password2 } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== password2) {
            props.setAlert('Password entries do not match', 'danger'); // msg, alertType
        } else {
            props.register({
                name,
                email,
                password
            });
        }
    }

    return (
        <Container>
            <Row>
                <Col sm={10} md={6} xl={4} style={{ margin: 'auto' }}>
                    <h2 style={{textAlign: 'center', marginBottom: '0.5rem'}}>
                        Sign Up
                    </h2>
                    <h5 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                        <i className="fas fa-user" /> Create Your Account
                    </h5>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            {/* <Form.Label>Enter Name:</Form.Label> */}
                            <Form.Control
                                type="text"
                                // size="sm" 
                                placeholder="Name"
                                name="name"
                                value={name}
                                onChange={handleChange}
                                required
                                minLength="2"
                            />
                        </Form.Group>
                        <Form.Group>
                            {/* <Form.Label>Enter Email:</Form.Label> */}
                            <Form.Control
                                type="email"
                                // size="sm" 
                                placeholder="Email"
                                name='email'
                                value={email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            {/* <Form.Label>Enter Password:</Form.Label> */}
                            <Form.Control
                                // size="sm"
                                type="password"
                                placeholder="Password"
                                name='password'
                                value={password}
                                onChange={handleChange}
                                required
                                minLength="3"
                                maxLength="10"
                            />
                        </Form.Group>
                        <Form.Group>
                            {/* <Form.Label>Confirm Password:</Form.Label> */}
                            <Form.Control
                                // size="sm"
                                type="password"
                                placeholder="Confirm Password"
                                name='password2'
                                value={password2}
                                onChange={handleChange}
                                required
                                minLength="3"
                                maxLength="10"
                            />
                        </Form.Group>
                        <Button variant="dark" type="submit" block>
                            Register
                        </Button>
                        <p style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                            Already have an account? <Link to="/login">Login</Link>
                        </p>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
};

export default connect(null, { setAlert, register })(Register);
