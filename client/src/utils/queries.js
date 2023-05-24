import { gql } from '@apollo/client';

export const FETCH_MY_PROFILE = gql`
  {
    myProfile {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;
