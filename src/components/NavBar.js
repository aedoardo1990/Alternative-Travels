import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import logo from '../assets/logo.jpeg';
import styles from '../styles/NavBar.module.css';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
  return (
  <Navbar expand="md" fixed="top" className={styles.NavBar}>
    <Container>
      <NavLink to='/'>
      <Navbar.Brand>
        <img src={logo} alt='logo' height='45' />
      </Navbar.Brand>
      </NavLink>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          <NavLink exact to='/' activeClassName={styles.Active}>
            <i className="fas fa-dharmachakra"></i> HOME
          </NavLink>
          <NavLink to='/login' activeClassName={styles.Active}>
            <i className="fas fa-door-open"></i> LOGIN
          </NavLink>
          <NavLink to='/signup' activeClassName={styles.Active}>
            <i className="fas fa-user-plus"></i> SIGN UP
          </NavLink>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
  );
};

export default NavBar;