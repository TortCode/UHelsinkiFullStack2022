import axios from "axios";

const BASE_URL = "http://localhost:3001/anecdotes";

export const getAnecdotes = async () => {
    const res = await axios.get(BASE_URL);
    return res.data;
}

export const createAnecdote = async (content) => {
    const anecdote = { content, votes: 0 };
    const res = await axios.post(BASE_URL, anecdote);
    return res.data;
}

export const patchAnecdote = async (id, changes) => {
    const res = await axios.patch(`${BASE_URL}/${id}`, changes);
    return res.data
}