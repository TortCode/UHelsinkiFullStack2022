import axios from 'axios'

let baseUrl = ''

const setBaseUrl = newVal => baseUrl = newVal

const extractData = req => req.then(r => r.data)

const getAll = () => 
  extractData(axios.get(baseUrl))

const create = newobj => 
  extractData(axios.post(baseUrl, newobj))

const update = (id, newobj) =>
  extractData(axios.put(`${baseUrl}/${id}`, newobj))

const destroy = id =>
  extractData(axios.delete(`${baseUrl}/${id}`))

export default {
  setBaseUrl,
  getAll,
  create,
  update,
  destroy
}
