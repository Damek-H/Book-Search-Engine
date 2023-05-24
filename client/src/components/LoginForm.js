import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

import { loginUser } from '../utils/API';
import Auth from '../utils/auth';

import { LOGIN_USER } from '../utils/mutations';

import { useMutation, useQuery } from '@apollo/client';

const MyLoginForm = () => {
  const [myUserFormData, setMyUserFormData] = useState({ email: '', password: '' });

  const [myLogin, { myError }] = useMutation(LOGIN_USER);

  const [myValidated] = useState(false);
  const [myShowAlert, setMyShowAlert] = useState(false);

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
      const { data } = await myLogin({
        variables: { ...myUserFormData },
      });

      console.log(data.login.user);
      Auth.login(data.login.token);
    } catch (err) {
      console.error(err);
      setMyShowAlert(true);
    }

    setMyUserFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  return (
    <>
      <Form noValidate validated={myValidated} onSubmit={handleFormSubmit}>
        <Alert
          dismissible
          onClose={() => setMyShowAlert(false)}
          show={myShowAlert}
          variant="danger"
        >
          Something went wrong with your login credentials!
        </Alert>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your email"
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
          disabled={!(myUserFormData.email && myUserFormData.password)}
          type="submit"
          variant="success"
        >
          Submit
        </Button>
      </Form>
    </>
  );
};

export default MyLoginForm;
