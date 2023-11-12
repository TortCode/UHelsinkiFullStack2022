import React from "react";
import { Link } from "react-router-dom";

const AllUsers = ({ users }) => {
  return (
    <div className="box">
      <div className="title">Users</div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">No. Blogs Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="has-text-link">
                <Link to={`/users/${user.id}`}>
                  {user.name ?? user.username}
                </Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllUsers;
