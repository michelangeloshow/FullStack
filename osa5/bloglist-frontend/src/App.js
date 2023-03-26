import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import { NewBlogForm } from './components/NewBlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = ({ message, error }) => {
  const notiStyle = {
    color: error ? 'red' : 'green',
    backGround: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  if (message === null) {
    return
  }

  return <div style={notiStyle}>{message}</div>
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(false)
  const newBlogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleNewMessage = (text, isError) => {
    setError(isError)
    setMessage(text)

    setTimeout(() => {
      setMessage(null)
    }, 3000)
  }

  const updateListAfterRemove = (id) => {
    setBlogs(blogs.filter((blog) => blog.id !== id))
  }

  const editBlog = async (blog) => {
    try {
      await blogService.update(blog.id, blog)
      setBlogs(
        blogs.map((elem) =>
          elem.id === blog.id ? { ...elem, likes: elem.likes + 1 } : elem
        )
      )
    } catch (error) {
      console.log(error)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedInUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      handleNewMessage(exception.response.data.error, true)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()

    window.localStorage.removeItem('loggedInUser')
    setUser(null)
  }

  const createNewBlog = async (newBlog) => {
    try {
      const blog = await blogService.create(newBlog)
      blog.user = user
      setBlogs(blogs.concat(blog))
      handleNewMessage(`a new blog ${blog.title} by ${blog.author} created`)
      newBlogFormRef.current.toggleVisibility()
    } catch (exception) {
      handleNewMessage(exception.response.data.error, true)
    }
  }

  if (user === null) {
    return (
      <div>
        <Notification message={message} error={error} />
        <h2>Log in</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type='text'
              value={username}
              name='Username'
              onChange={({ target }) => setUsername(target.value)}
              id='username-input'
            />
          </div>
          <div>
            password
            <input
              type='password'
              value={password}
              name='Password'
              onChange={({ target }) => setPassword(target.value)}
              id='password-input'
            />
          </div>
          <button type='submit' id='login-button'>
            login
          </button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <Notification message={message} error={error} />
      <h2>blogs</h2>
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel='new blog' ref={newBlogFormRef}>
        <NewBlogForm createNewBlog={createNewBlog} />
      </Togglable>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            user={user}
            editBlog={editBlog}
            updateBlogList={updateListAfterRemove}
          />
        ))}
    </div>
  )
}

export default App
