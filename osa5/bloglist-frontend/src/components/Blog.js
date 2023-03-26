import { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const Blog = ({ blog, user, editBlog, updateBlogList }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [blogData, setBlogData] = useState(blog)

  const showWhenIdMatches = {
    display: user.username === blogData.user.username ? '' : 'none',
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const addLike = async () => {
    const updatedBlog = { ...blogData, likes: blogData.likes + 1 }

    await editBlog(updatedBlog)
    setBlogData({ ...blogData, likes: blogData.likes + 1 })
  }

  const handleRemove = async () => {
    const id = blogData.id
    try {
      await blogService.remove(id)
      updateBlogList(blogData.id)
    } catch (error) {
      console.log(error)
    }
  }

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
      {blogData.title} {blog.author}{' '}
      <button onClick={() => setShowDetails(false)}>hide</button>
      <p>{blogData.url}</p>
      <p>
        likes: {blogData.likes}{' '}
        <button id='like-button' onClick={addLike}>
          like
        </button>
      </p>
      <p>{blogData.author}</p>
      <button
        id='remove-button'
        style={showWhenIdMatches}
        onClick={handleRemove}
      >
        remove
      </button>
    </div>
  )
}
Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  updateBlogList: PropTypes.func.isRequired,
}

export default Blog
