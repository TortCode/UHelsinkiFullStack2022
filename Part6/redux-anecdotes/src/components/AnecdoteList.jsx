import { useSelector, useDispatch } from 'react-redux'
import { voteForAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => {
    console.log("STATE:",state);
    return state.anecdotes.filter(a => a.content.includes(state.filter))
  })

  const vote = (id) => {
    console.log('vote', id)
    dispatch(voteForAnecdote(id))
    dispatch(setNotification(`you voted '${anecdotes.find(a => a.id === id).content}'`, 5))
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