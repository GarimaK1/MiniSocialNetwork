import React from 'react';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div style={landingStyle} className="landing">
            <Link to="/register">
                <Button variant="dark" style={btnStyle} size="sm">Sign Up</Button>
            </Link>
            <Link to="/login">
                <Button variant="dark" style={btnStyle} size="sm">Login</Button>
            </Link>
        </div>
    )
}

const btnStyle = {
    width: '7rem',
    margin: '0.25rem',
    border: '1px solid rgb(255, 255, 255)'
};

const landingStyle = {
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    height: "90vh",
};

export default Landing;