import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';

const MyNavbar = () => {
    return (
        <Navbar bg="dark" variant="dark" style={{ borderBottom: 'solid 1px white' }}>
            {/* <Link to="/">
                <Navbar.Brand href="/">
                    MiniSocialNetwork
                </Navbar.Brand>
            </Link> */}
            <Navbar.Brand href="/">
                MiniSocialNetwork
            </Navbar.Brand>
            <div className="d-flex flex-wrap justify-content-end flex-fill">
                <Nav>
                    <Link to="/users" className="nav-link">
                        Users
                    </Link>
                </Nav>
                <Nav>
                    <Link to="/register" className="nav-link">
                        Register
                    </Link>
                </Nav>
                <Nav>
                    <Link to="/login" className="nav-link">
                        Login
                    </Link>
                </Nav>
            </div>
        </Navbar>
    )
}

export default MyNavbar;
