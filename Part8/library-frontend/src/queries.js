import { gql } from '@apollo/client'

export const CREATE_BOOK = gql`
  mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ) {
      title
      author {
        name
        born
      }
      published
      genres
    }
  }
`

export const CHANGE_BIRTHYEAR = gql`
  mutation changeBirthyear($name: String!, $born: Int!) {
    editAuthor(
      name: $name,
      setBornTo: $born
    ) {
      name
      born
    }
  }
`

export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      author {
        name
        born
      }
      published
      genres
    }
  }
`

export const BOOKS_BY_GENRE = gql`
  query booksByGenre($genre: String) {
    allBooks(genre: $genre) {
      title
      author {
        name
        born
      }
      published
      genres
    }
  }
`

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(
      username: $username,
      password: $password
    ) {
        value
    }
  }
`

export const MY_INFO = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`