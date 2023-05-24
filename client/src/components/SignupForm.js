import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

import { createNewUser } from '../utils/API';
import MyAuth from '../utils/auth';
import { REGISTER_USER } from '../utils/mutations';

import { useMutation, useQuery } from '@apollo/client';

const MySignupForm = () => {

  const [myUserFormData, setMyUserFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  
  const [registerUser, { error }] = useMutation(REGISTER_USER);


  const [validated] = useState(false);

  const [showAlert, setShowAlert] = useState(false);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setMyUserFormData({ ...myUserFormData, [name]: value });
  };

  const handleFormSubmit = async event => {
    event.preventDefault();


    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const { data } = await registerUser({
        variables: { ...myUserFormData },
      });

      console.log(data.registerUser.user);
      MyAuth.login(data.registerUser.token);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    setMyUserFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  return (
    <>

      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>

        <Alert
          dismissible
          onClose={() => setShowAlert(false)}
          show={showAlert}
          variant="danger"
        >
          Something went wrong with your registration!
        </Alert>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="username">Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your username"
            name="username"
            onChange={handleInputChange}
            value={myUserFormData.username}
            required
          />
          <Form.Control.Feedback type="invalid">
            Username is required!
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Your email address"
            name="email"
            onChange={handleInputChange}
            value={myUserFormData.email}
            required
          />
          <Form.Control.Feedback type="invalid">
            Email is required!
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Your password"
            name="password"
            onChange={handleInputChange}
            value={myUserFormData.password}
            required
          />
          <Form.Control.Feedback type="invalid">
            Password is required!
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={
            !(
              myUserFormData.username &&
              myUserFormData.email &&
              myUserFormData.password
            )
          }
          type="submit"
          variant="success"
        >
          Register
        </Button>
      </Form>
    </>
  );
};

export default MySignupForm;
