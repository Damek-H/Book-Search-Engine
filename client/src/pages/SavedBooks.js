import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';

import { getMyBooks, removeBook } from '../utils/API';
import MyAuth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

import { GET_MY_BOOKS } from '../utils/queries';
import { DELETE_BOOK } from '../utils/mutations';

import { useMutation, useQuery } from '@apollo/client';

const MySavedBooks = () => {
  const { loading, data } = useQuery(GET_MY_BOOKS);

  const [deleteBook, { error }] = useMutation(DELETE_BOOK);

  const userData = data?.myBooks || {};

  const userDataLength = Object.keys(userData).length;

  const handleDeleteBook = async bookId => {
    const token = MyAuth.loggedIn() ? MyAuth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await deleteBook({
        variables: { bookId },
      });

      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>My Saved Books</h1>
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {userData?.length
            ? `Viewing ${userData.length} saved ${
                userData?.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData?.map(book => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border="dark">
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant="top"
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className="btn-block btn-danger"
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Remove
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default MySavedBooks;
