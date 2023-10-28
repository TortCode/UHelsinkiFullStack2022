import { createSlice } from "@reduxjs/toolkit"

const anecdotesSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteFor(state, action) {
      const id = action.payload;
      const anecdote = state.find(anecdote => anecdote.id === id);
      anecdote.votes++;
    },
    createAnecdote(state, action) {
      const anecdote = action.payload;
      state.push(anecdote);
    },
    setAnecdotes(state, action) {
      return action.payload;
    }
  }
});

export const { voteFor, createAnecdote, setAnecdotes } = anecdotesSlice.actions
export default anecdotesSlice.reducer