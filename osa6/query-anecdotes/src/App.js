import { useQuery, useMutation, useQueryClient } from 'react-query'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAll, update } from './requests'
import { useReducer } from 'react'
import NotificationContext from './notificationContext'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.payload
    default:
      return state
  }
}

const App = () => {
  const queryClient = useQueryClient()

  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    null
  )

  const editAnecdoteMutation = useMutation(update, {
    onSuccess: (data) => {
      queryClient.invalidateQueries('anecdotes')
      notificationDispatch({
        type: 'SET_NOTIFICATION',
        payload: `anecdote '${data.content}' voted!`,
      })
      setTimeout(() => {
        notificationDispatch({
          type: 'SET_NOTIFICATION',
          payload: null,
        })
      }, 5000)
    },
  })

  const handleVote = (anecdote) => {
    editAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  }

  const result = useQuery('anecdotes', getAll, {
    refetchOnWindowFocus: false,
    retry: false,
  })

  if (result.isLoading) {
    return <div>loading...</div>
  }

  if (result.error) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      <div>
        <h3>Anecdote app</h3>

        <Notification />
        <AnecdoteForm />

        {anecdotes.map((anecdote) => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button onClick={() => handleVote(anecdote)}>vote</button>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

export default App
