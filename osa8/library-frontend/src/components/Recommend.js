import { useQuery } from '@apollo/client'
import { BOOKS_BY_GENRE } from '../queries'

const Recommend = (props) => {
  const result = useQuery(BOOKS_BY_GENRE, {
    skip: !props.show,
    variables: { genre: props.genre },
    fetchPolicy: 'network-only',
  })

  if (!props.show || !result.data) {
    return null
  }

  const books = result.data.allBooks

  return (
    <div>
      <h2>recommendations</h2>

      <p>
        books in your favorite genre <strong>{props.genre}</strong>
      </p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend
