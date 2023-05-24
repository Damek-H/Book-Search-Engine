const { gql } = require('apollo-server-express');


const myTypeDefs = gql`
  type Person {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [LibraryBook]
  }

  type LibraryBook {
    bookId: ID!
    authors: [String!]
    description: String
    title: String!
    image: String
    link: String
  }

  type Authentication {
    token: ID!
    user: Person
  }

  type Query {
    getLoggedInUser: Person
  }

  input SavedBookInput {
    authors: [String]
    description: String
    title: String
    bookId: String
    image: String
    link: String
  }

  type Mutation {
    loginUser(email: String!, password: String!): Authentication

    createUser(username: String!, email: String!, password: String!): Authentication

    saveBook(book: SavedBookInput!): Person

    removeBook(bookId: ID!): Person
  }
`;

module.exports = myTypeDefs;
