import { gql } from '@apollo/client';

export const MY_LOGIN_USER = gql`
  mutation myLogin($myEmail: String!, $myPassword: String!) {
    myLogin(email: $myEmail, password: $myPassword) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const MY_SAVE_BOOK = gql`
  mutation mySaveBook($myBook: SavedBookInput!) {
    mySaveBook(book: $myBook) {
      _id
      username
      email
      savedBooks {
        authors
        description
        title
        bookId
        image
        link
      }
    }
  }
`;

export const MY_ADD_USER = gql`
  mutation myAddUser($myUsername: String!, $myEmail: String!, $myPassword: String!) {
    myAddUser(username: $myUsername, email: $myEmail, password: $myPassword) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const MY_REMOVE_BOOK = gql`
  mutation myRemoveBook($myBookId: ID!) {
    myRemoveBook(bookId: $myBookId) {
      _id
      username
      email
      bookCount
      savedBooks {
        authors
        description
        bookId
        image
        link
        title
      }
    }
  }
`;
