import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, patchAnecdote } from './requests'
import { setNotificationFor, useNotificationDispatch } from './NotificationContext'

const App = () => {

  const queryClient = useQueryClient();
  const voteMutation = useMutation({
    mutationFn: ({id, votes}) => patchAnecdote(id, { votes: votes + 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey:['anecdotes'] })
    }
  });

  const notificationDispatch = useNotificationDispatch();

  const handleVote = (anecdote) => {
    voteMutation.mutate(anecdote);
    setNotificationFor(notificationDispatch, `anecdote '${anecdote.content}' voted`, 5);
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1,
  });

  if (result.isError) {
    return <div>anecdote service not available due to server problems</div>
  }

  const anecdotes = (result.isSuccess) ? result.data : [];

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
