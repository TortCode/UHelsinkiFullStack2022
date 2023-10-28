import { createSlice } from "@reduxjs/toolkit"
import anecdoteService from "../services/anecdoteService";

const anecdotesSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    incrementVoteForAnecdote(state, action) {
      const id = action.payload;
      const anecdote = state.find(anecdote => anecdote.id === id);
      anecdote.votes++;
    },
    appendAnecdote(state, action) {
      state.push(action.payload);
    },
    setAnecdotes(state, action) {
      return action.payload;
    }
  }
});

export const { incrementVoteForAnecdote, appendAnecdote, setAnecdotes } = anecdotesSlice.actions

export const initAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  }
}

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const anecdote = await anecdoteService.createNew(content);
    dispatch(appendAnecdote(anecdote));
  }
}

export const voteForAnecdote = (id) => {
  return async (dispatch, getState) => {
    const { votes } = getState().anecdotes.find(anecdote => anecdote.id === id);
    await anecdoteService.updateById(id, { votes: votes + 1 });
    dispatch(incrementVoteForAnecdote(id));
  }
}

export default anecdotesSlice.reducer