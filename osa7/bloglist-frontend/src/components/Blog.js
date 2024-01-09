import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, user }) => {
  const [showDetails, setShowDetails] = useState(false)

  const showWhenIdMatches = {
    display: user.username === blog.user.username ? '' : 'none',
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const addLike = async () => {}

  const handleRemove = async () => {}

  if (!showDetails) {
    return (
      <div style={blogStyle}>
        {blog.title} {blog.author}{' '}
        <button id='view-button' onClick={() => setShowDetails(true)}>
          view
        </button>
      </div>
    )
  }

  return (
    <div className='blog' style={blogStyle}>
      {blog.title} {blog.author}{' '}
      <button onClick={() => setShowDetails(false)}>hide</button>
      <p>{blog.url}</p>
      <p>
        likes: {blog.likes}{' '}
        <button id='like-button' onClick={addLike}>
          like
        </button>
      </p>
      <p>{blog.author}</p>
      <button
        id='remove-button'
        onClick={handleRemove}
        style={showWhenIdMatches}
      >
        remove
      </button>
    </div>
  )
}
Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
}

export default Blog
