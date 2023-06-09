import React, { useState, useEffect } from 'react';
import { Container, Col, Form, Button, Card, Row } from 'react-bootstrap';

import MyAuth from '../utils/auth';
import { saveBookToDatabase, searchBooksOnGoogle } from '../utils/API';
import { saveBookIdsToLocalStorage, getSavedBookIdsFromLocalStorage } from '../utils/localStorage';

import { useMutation, useQuery } from '@apollo/client';

import { SAVE_BOOK } from '../utils/mutations';
import { GET_MY_PROFILE } from '../utils/queries';

const MySearchBooks = () => {
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  const [saveBook, { error }] = useMutation(SAVE_BOOK);

  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIdsFromLocalStorage());

  useEffect(() => {
    return () => saveBookIdsToLocalStorage(savedBookIds);
  });

  const handleFormSubmit = async event => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchBooksOnGoogle(searchInput);

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const { items } = await response.json();

      const bookData = items.map(book => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || '',
      }));

      setSearchedBooks(bookData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveBook = async bookId => {
    const bookToSave = searchedBooks.find(book => book.bookId === bookId);

    const token = MyAuth.loggedIn() ? MyAuth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await saveBook({
        variables: { book: { ...bookToSave } },
      });

      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Discover Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a book"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg">
                  Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className="pt-5">
          {searchedBooks.length
            ? `Showing ${searchedBooks.length} results:`
            : 'Start your book search'}
        </h2>
        <Row>
          {searchedBooks.map(book => {
            return (
              <Col key={book.bookId} md="4">
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
                    {MyAuth.loggedIn() && (
                      <Button
                        disabled={savedBookIds?.some(
                          savedBookId => savedBookId === book.bookId,
                        )}
                        className="btn-block btn-info"
                        onClick={() => handleSaveBook(book.bookId)}
                      >
                        {savedBookIds?.some(
                          savedBookId => savedBookId === book.bookId,
                        )
                          ? 'This book is already saved!'
                          : 'Save this Book'}
                      </Button>
                    )}
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

export default MySearchBooks;
