import { useEffect, useState } from "react";
import { useApolloClient } from "@apollo/client";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import { Link, Routes, Route, Navigate } from "react-router-dom";
import RecommendedBooks from "./components/RecommendedBooks";

const App = () => {
  const [token, setToken] = useState(null);
  const client = useApolloClient();

  useEffect(() => {
    const token = localStorage.getItem("library-user-token");
    if (token) {
      setToken(token);
    }
  }, []);

  const logout = () => {
    setToken(null);
    client.resetStore();
    localStorage.clear();
  };

  return (
    <div>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <Link to="/authors">authors</Link>
        <Link to="/books">books</Link>
        {token !== null && (
          <>
            <Link to="/books/add">add book</Link>
            <Link onClick={logout}>logout</Link>
            <Link to="/books/recommended">recommended</Link>
          </>
        )}
        {token === null && <Link to="/login">login</Link>}
      </div>

      <Routes>
        <Route path="/" element={<Navigate replace to="/authors" />} />
        <Route path="/authors" element={<Authors />} />
        <Route path="/books" element={<Books />} />
        <Route
          path="/books/add"
          element={token ? <NewBook /> : <Navigate replace to="/" />}
        />
        <Route
          path="/books/recommended"
          element={token ? <RecommendedBooks /> : <Navigate replace to="/" />}
        />
        <Route
          path="/login"
          element={
            token ? (
              <Navigate replace to="/" />
            ) : (
              <LoginForm setToken={setToken} />
            )
          }
        />
      </Routes>
    </div>
  );
};

export default App;
