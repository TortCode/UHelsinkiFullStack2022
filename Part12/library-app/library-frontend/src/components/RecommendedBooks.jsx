import { useQuery } from "@apollo/client";
import { BOOKS_BY_GENRE, MY_INFO } from "../queries";

const RecommendedBooks = (props) => {
  const myInfo = useQuery(MY_INFO)
  const result = useQuery(BOOKS_BY_GENRE, {
    variables: { genre: myInfo.data?.me?.favoriteGenre },
    fetchPolicy: "cache-and-network",
    skip: !myInfo.data?.me
  });

  if (result.loading || myInfo.loading) {
    return <div>loading...</div>;
  }

  const genreFilter = myInfo.data.me.favoriteGenre
  const books = result.data.allBooks;

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <strong>{genreFilter}</strong>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecommendedBooks;
