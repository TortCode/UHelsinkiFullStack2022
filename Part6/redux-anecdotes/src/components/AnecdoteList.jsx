import { useSelector, useDispatch } from 'react-redux'
import { voteFor } from '../reducers/anecdoteReducer'
import AnecdoteFilter from './AnecdoteFilter'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => {
    console.log("STATE:",state);
    return state.anecdotes.filter(a => a.content.includes(state.filter))
  })

  const vote = (id) => {
    console.log('vote', id)
    dispatch(voteFor(id))
  }

  anecdotes.sort((a, b) => b.votes - a.votes)

  return (
    <>
      <h2>Anecdotes</h2>
      <AnecdoteFilter />
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