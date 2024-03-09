import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import logo from '../assets/logo.jpeg';

const NavBar = () => {
  return (
  <Navbar expand="md" fixed="top">
    <Container>
      <Navbar.Brand>
        <img src={logo} alt='logo' height='45' />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          <Nav.Link>
            <i className="fas fa-dharmachakra"></i> HOME
          </Nav.Link>
          <Nav.Link>
            <i className="fas fa-door-open"></i> LOGIN
          </Nav.Link>
          <Nav.Link>
            <i className="fas fa-user-plus"></i> SIGN UP
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
  );
};

export default NavBar;