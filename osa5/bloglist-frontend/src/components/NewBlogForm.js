import { useState } from 'react'

export const NewBlogForm = ({ createNewBlog }) => {
  const [newBlog, setNewBlog] = useState({})

  const handleBlogChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    setNewBlog({ ...newBlog, [name]: value })
  }

  const addNewBlog = (event) => {
    event.preventDefault()
    setNewBlog({})
    createNewBlog(newBlog)
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addNewBlog}>
        <div>
          title:
          <input
            type='text'
            name='title'
            value={newBlog.title || ''}
            onChange={handleBlogChange}
            id='title-input'
          />
        </div>
        <div>
          author:
          <input
            type='text'
            name='author'
            value={newBlog.author || ''}
            onChange={handleBlogChange}
            id='author-input'
          />
        </div>
        <div>
          url:
          <input
            type='text'
            name='url'
            value={newBlog.url || ''}
            onChange={handleBlogChange}
            id='url-input'
          />
        </div>
        <button type='submit' id='submit-button'>
          create
        </button>
      </form>
    </div>
  )
}
