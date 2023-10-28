import { useSelector, useDispatch } from 'react-redux'
import { voteFor } from '../reducers/anecdoteReducer'
import { clearNotification, setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => {
    console.log("STATE:",state);
    return state.anecdotes.filter(a => a.content.includes(state.filter))
  })

  const vote = (id) => {
    console.log('vote', id)
    dispatch(voteFor(id))
    dispatch(setNotification(`you voted '${anecdotes.find(a => a.id === id).content}'`))
    setTimeout(() => {
      dispatch(clearNotification());
    }, 5000);
  }

  anecdotes.sort((a, b) => b.votes - a.votes)

  return (
    <>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </>
  )
}

export default AnecdoteList