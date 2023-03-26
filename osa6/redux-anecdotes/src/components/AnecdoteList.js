import { useSelector, useDispatch } from 'react-redux'
import { editAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

export const AnecdoteList = () => {
  const anecdotes = useSelector(({ filter, anecdotes }) =>
    anecdotes.filter((n) =>
      n.content.toLowerCase().includes(filter.toLowerCase())
    )
  )
  const dispatch = useDispatch()

  const vote = (anecdote) => {
    dispatch(editAnecdote(anecdote))
    dispatch(setNotification(`you voted ${anecdote.content}`, 5000))
  }
  return (
    <div>
      {anecdotes
        .sort((a, b) => b.votes - a.votes)
        .map((anecdote) => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote)}>vote</button>
            </div>
          </div>
        ))}
    </div>
  )
}
