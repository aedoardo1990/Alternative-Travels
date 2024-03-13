import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import logo from '../assets/logo.jpeg';
import styles from '../styles/NavBar.module.css';
import { NavLink } from 'react-router-dom';
import { useCurrentUser } from '../contexts/CurrentUserContext';

const NavBar = () => {
  const currentUser = useCurrentUser();

  const addPostIcon = (
    <NavLink to='/posts/add' className={styles.NavLink} activeClassName={styles.Active}>
      <i className="far fa-solid fa-plus"></i> POST
    </NavLink>
  );

  const loggedInIcons = <>
    <NavLink to='/newsfeed' className={styles.NavLink} activeClassName={styles.Active}>
      <i className="fas fa-regular fa-newspaper"></i> Newsfeed
    </NavLink>
    <NavLink to='/liked-posts' className={styles.NavLink} activeClassName={styles.Active}>
      <i className="fas fa-solid fa-thumbs-up"></i> Liked
    </NavLink>
    <NavLink to='/' className={styles.NavLink} onClick={() => {}}>
      <i className="fas fa-solid fa-right-from-bracket"></i> Log Out
    </NavLink>
    <NavLink to={`/profiles/${currentUser?.profile_id}`} className={styles.NavLink}>
      <img src={currentUser?.profile_image} alt='profile image'/>
    </NavLink>
  </>
  const loggedOutIcons = (
    <>
      <NavLink to='/login' className={styles.NavLink} activeClassName={styles.Active}>
        <i className="fas fa-door-open"></i> Login
      </NavLink>
      <NavLink to='/signup' className={styles.NavLink} activeClassName={styles.Active}>
        <i className="fas fa-user-plus"></i> Sign Up
      </NavLink>
    </>
  );
  return (
    <Navbar expand="md" fixed="top" className={styles.NavBar}>
      <Container>
        <NavLink to='/'>
          <Navbar.Brand>
            <img src={logo} alt='logo' height='45' />
          </Navbar.Brand>
        </NavLink>
        {currentUser && addPostIcon}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <NavLink exact to='/' activeClassName={styles.Active}>
              <i className="fas fa-dharmachakra"></i> Home
            </NavLink>
            {currentUser ? loggedInIcons : loggedOutIcons}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;