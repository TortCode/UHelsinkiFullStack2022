import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer';
import anecdoteService from '../services/anecdoteService';

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const addAnecdote = async (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    const anecdote = await anecdoteService.createNew(content);
    event.target.anecdote.value = '';
    dispatch(createAnecdote(anecdote));
    dispatch(setNotification(`you created '${content}'`));
    setTimeout(() => {
      dispatch(clearNotification());
    }, 5000);
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div><input name="anecdote" /></div>
        <button>create</button>
      </form>
    </>
  );
}

export default AnecdoteForm;