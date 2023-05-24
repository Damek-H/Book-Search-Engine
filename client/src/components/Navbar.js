import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Modal, Tab } from 'react-bootstrap';
import MySignUpForm from './SignupForm';
import MyLoginForm from './LoginForm';

import MyAuth from '../utils/auth';

const MyNavbar = () => {
  const [myShowModal, setMyShowModal] = useState(false);

  return (
    <>
      <Navbar bg='dark' variant='dark' expand='lg'>
        <Container fluid>
          <Navbar.Brand as={Link} to='/'>
            My Book Search
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='navbar' />
          <Navbar.Collapse id='navbar' className='d-flex flex-row-reverse'>
            <Nav className='ml-auto d-flex'>
              <Nav.Link as={Link} to='/'>
                Search Books
              </Nav.Link>

              {MyAuth.loggedIn() ? (
                <>
                  <Nav.Link as={Link} to='/saved'>
                    View Saved Books
                  </Nav.Link>
                  <Nav.Link onClick={MyAuth.logout}>Logout</Nav.Link>
                </>
              ) : (
                <Nav.Link onClick={() => setMyShowModal(true)}>Login/Sign Up</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal
        size='lg'
        show={myShowModal}
        onHide={() => setMyShowModal(false)}
        aria-labelledby='signup-modal'>

        <Tab.Container defaultActiveKey='login'>
          <Modal.Header closeButton>
            <Modal.Title id='signup-modal'>
              <Nav variant='pills'>
                <Nav.Item>
                  <Nav.Link eventKey='login'>Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey='signup'>Sign Up</Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Content>
              <Tab.Pane eventKey='login'>
                <MyLoginForm handleModalClose={() => setMyShowModal(false)} />
              </Tab.Pane>
              <Tab.Pane eventKey='signup'>
                <MySignUpForm handleModalClose={() => setMyShowModal(false)} />
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </>
  );
};

export default MyNavbar;
