import axios from 'axios';

const baseUrl = '/api/blogs';

let token = '';

const setToken = (newToken) => { token = `Bearer ${newToken}`; };

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = async (obj) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(baseUrl, obj, config);
  return response.data;
};

const update = async (id, obj) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.put(`${baseUrl}/${id}`, obj, config);
  return response.data;
};

const destroy = async (id) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getAll, setToken, create, update, destroy,
};
