import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import { NewBlogForm } from './components/NewBlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { setNotification } from './reducers/notificationReducer'
import { useDispatch, useSelector } from 'react-redux'
import { initBlogs } from './reducers/blogReducer'
import { initUsers } from './reducers/userReducer'
import Users from './components/Users'
import User from './components/User'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

const App = () => {
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const newBlogFormRef = useRef()

  const padding = {
    padding: 5,
  }

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initBlogs())
    dispatch(initUsers())
  }, [dispatch])

  const blogs = useSelector((state) => [...state.blogs])
  const users = useSelector((state) => [...state.users])

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleNewMessage = (text, isError) => {
    dispatch(setNotification(text, isError, 5000))
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

  if (user === null) {
    return (
      <div>
        <Notification />
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
      <Notification />
      <Router>
        <div>
          <Link style={padding} to='/'>
            blogs
          </Link>
          <Link style={padding} to='/users'>
            users
          </Link>
        </div>
        <Routes>
          <Route
            path='/'
            element={
              <div>
                <h2>blogs</h2>
                <p>
                  {user.name} logged in{' '}
                  <button onClick={handleLogout}>logout</button>
                </p>
                <Togglable buttonLabel='new blog' ref={newBlogFormRef}>
                  <NewBlogForm />
                </Togglable>

                {blogs
                  .sort((a, b) => b.likes - a.likes)
                  .map((blog) => (
                    <Blog key={blog.id} blog={blog} user={user} />
                  ))}
              </div>
            }
          />
          <Route path='/users' element={<Users users={users} />} />
          <Route path='/users/:id' element={<User users={users} />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
