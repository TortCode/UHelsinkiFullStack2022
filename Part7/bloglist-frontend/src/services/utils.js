import axios from "axios";

const serverUrl = "http://localhost:3003";
let token = "";

export const makeService = (baseUrl, customs = {}) => {
  baseUrl = `${serverUrl}${baseUrl}`;

  const extraMethods = {};
  Object.entries(customs).forEach(([name, method]) => {
    extraMethods[name] = method(baseUrl, token);
  });

  return {
    getAll: async () => {
      const response = await axios.get(baseUrl);
      return response.data;
    },
    create: async (obj) => {
      const config = {
        headers: { Authorization: token },
      };
      const response = await axios.post(baseUrl, obj, config);
      return response.data;
    },
    update: async (id, obj) => {
      const config = {
        headers: { Authorization: token },
      };
      const response = await axios.put(`${baseUrl}/${id}`, obj, config);
      return response.data;
    },
    destroy: async (id) => {
      const config = {
        headers: { Authorization: token },
      };
      const response = await axios.delete(`${baseUrl}/${id}`, config);
      return response.data;
    },
    ...extraMethods,
  };
};

export const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};
