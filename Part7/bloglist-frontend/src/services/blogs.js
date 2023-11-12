import axios from "axios";
import { makeService } from "./utils";

const blogsUrl = "/api/blogs";

const service = makeService(blogsUrl, {
  postComment: (baseUrl, token) => {
    return async (id, comment) => {
      const response = await axios.post(`${baseUrl}/${id}/comments`, {
        comment,
      });
      return response.data;
    };
  },
});

export default service;
