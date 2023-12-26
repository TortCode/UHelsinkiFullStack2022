import { useQuery } from "@apollo/client";
import { BOOKS_BY_GENRE } from "../queries";
import { useEffect, useState } from "react";

const Books = (props) => {
  const [genreList, setGenreList] = useState([]);
  const [genreFilter, setGenreFilter] = useState(null);
  const result = useQuery(BOOKS_BY_GENRE, {
    refetchPolicy: "cache-and-network",
    variables: { genre: genreFilter },
  });

  useEffect(() => {
    if (genreFilter === null && result.data) {
      const books = result.data.allBooks
      setGenreList([...new Set(books.map((b) => b.genres).flat())])
    }
  }, [genreFilter, result.data])

  if (result.loading) {
    return <div>loading...</div>;
  }

  const books = result.data.allBooks;

  return (
    <div>
      <h2>books</h2>
      <p>
        in{" "}
        {genreFilter ? (
          <>
            genre <strong>{genreFilter}</strong>
          </>
        ) : (
          "all genres"
        )}
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
      <div>
        {genreList.map((g) => (
          <button key={g} onClick={() => setGenreFilter(g)}>
            {g}
          </button>
        ))}
        <button onClick={() => setGenreFilter(null)}>all genres</button>
      </div>
    </div>
  );
};

export default Books;
