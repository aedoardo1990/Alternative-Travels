import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import logo from '../assets/logo.jpeg';
import styles from '../styles/NavBar.module.css';
import { NavLink } from 'react-router-dom';
import { useCurrentUser, useSetCurrentUser, } from '../contexts/CurrentUserContext';
import Avatar from './Avatar';
import axios from 'axios';
import useClickOutsideToggle from '../hooks/useClickOutsideToggle';
import 'react-toastify/dist/ReactToastify.css';
import { successToast, errorToast } from "./Toasts";

const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  const { expanded, setExpanded, ref } = useClickOutsideToggle();

  const handleSignOut = async () => {
    try {
      await axios.post('dj-rest-auth/logout/');
      setCurrentUser(null);
      successToast("Successfully logged out!");
    } catch (err) {
      errorToast("Oops, something went wrong!");
    }
  };

  const addPostIcon = (
    <NavLink to='/posts/add' className={styles.NavLink} activeClassName={styles.Active}>
      <i className="far fa-solid fa-plus"></i> Post
    </NavLink>
  );

  const loggedInIcons = (
    <>
      <NavLink to='/newsfeed' className={styles.NavLink} activeClassName={styles.Active}>
        <i className="fas fa-regular fa-newspaper"></i> Feed
      </NavLink>
      <NavLink to='/liked-posts' className={styles.NavLink} activeClassName={styles.Active}>
        <i className="fas fa-solid fa-thumbs-up"></i> Liked
      </NavLink>
      <NavLink to='/map' className={styles.NavLink} activeClassName={styles.Active}>
        <i className="fas fa-earth-europe"></i> Map
      </NavLink>
      <NavLink to='/marketplace' className={styles.NavLink} activeClassName={styles.Active}>
        <i className="fas fa-solid fa-store"></i> Market
      </NavLink>
      <NavLink to='/marketplace/add' className={styles.NavLink} activeClassName={styles.Active}>
      <i className="far fa-solid fa-truck-arrow-right"></i> Sell
    </NavLink>
      <NavLink to='/' className={styles.NavLink} onClick={handleSignOut}>
        <i className="fas fa-solid fa-right-from-bracket"></i> Logout
      </NavLink>
      <NavLink to={`/profiles/${currentUser?.profile_id}`} className={styles.NavLink}>
        <Avatar src={currentUser?.profile_image} text={currentUser?.username} height={40} />
      </NavLink>
    </>
  );
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
    <Navbar expanded={expanded} expand="md" fixed="top" className={styles.NavBar}>
      <Container>
        <NavLink to='/'>
          <Navbar.Brand>
            <img src={logo} alt='logo' height='45' />
          </Navbar.Brand>
        </NavLink>
        {currentUser && addPostIcon}
        <Navbar.Toggle ref={ref} onClick={() => setExpanded(!expanded)} aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <NavLink exact to='/' activeClassName={styles.Active}>
              <i className="fas fa-solid fa-house"></i> Home
            </NavLink>
            {currentUser ? loggedInIcons : loggedOutIcons}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;