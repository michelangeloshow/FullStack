import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const blogSlice = createSlice({
  name: 'blog',
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      return state.concat(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    },
    addLike(state, action) {
      const { id } = action.payload
      return state.map((blog) =>
        blog.id === id ? { ...blog, likes: blog.likes + 1 } : blog
      )
    },
    removeBlog(state, action) {
      const { id } = action.payload
      return state.filter((blog) => blog.id !== id)
    },
  },
})

export const { appendBlog, setBlogs, addLike, removeBlog } = blogSlice.actions
export default blogSlice.reducer

export const initBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (content) => {
  return async (dispatch) => {
    try {
      const newBlog = await blogService.create(content)
      dispatch(appendBlog(newBlog))
      dispatch(
        setNotification(
          `a new blog ${newBlog.title} by ${newBlog.author} added`,
          false,
          5000
        )
      )
    } catch (error) {
      dispatch(setNotification(error.response.data.error, true, 5000))
    }
  }
}

export const likeBlog = (id, blog) => {
  return async (dispatch) => {
    try {
      await blogService.update(id, { ...blog, likes: blog.likes + 1 })
      dispatch(addLike({ id }))
    } catch (error) {
      dispatch(setNotification(error.response.data.error, true, 5000))
    }
  }
}

export const deleteBlog = (id) => {
  return async (dispatch) => {
    try {
      await blogService.remove(id)
      dispatch(removeBlog({ id }))
      dispatch(setNotification('Blog removed successfully', false, 5000))
    } catch (error) {
      dispatch(setNotification(error.response.data.error, true, 5000))
    }
  }
}
