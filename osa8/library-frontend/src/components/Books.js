import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { BOOKS_BY_GENRE, ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [genre, setGenre] = useState(null)
  const resultAll = useQuery(ALL_BOOKS)
  const resultFiltered = useQuery(BOOKS_BY_GENRE, {
    skip: !genre,
    variables: { genre },
    fetchPolicy: 'network-only',
  })

  const result = genre ? resultFiltered : resultAll

  if (!props.show || !result.data) {
    return null
  }

  const books = result.data.allBooks
  const allBooks = resultAll.data.allBooks
  const genres = [...new Set(allBooks.map((book) => book.genres).flat())]

  return (
    <div>
      <h2>books</h2>

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
      <div>
        {genres.map((genre) => (
          <button key={genre} onClick={() => setGenre(genre)}>
            {genre}
          </button>
        ))}
        <button onClick={() => setGenre(null)}>all genres</button>
      </div>
    </div>
  )
}

export default Books
