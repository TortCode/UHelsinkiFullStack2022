import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createAnecdote } from "../requests";
import { useNotificationDispatch, setNotificationFor } from "../NotificationContext";

const AnecdoteForm = () => {
  const queryClient = useQueryClient();
  const notificationDispatch = useNotificationDispatch();

  const addAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey:['anecdotes'] })
    },
    onError: (error) => {
      setNotificationFor(notificationDispatch, error.response.data.error, 5);
    }
  })


  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value;
    addAnecdoteMutation.mutate(content);
    setNotificationFor(notificationDispatch, `anecdote '${content}' created`, 5);
    event.target.anecdote.value = ''
    console.log('new anecdote')
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
