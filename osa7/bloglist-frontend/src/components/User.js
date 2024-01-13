import { Link, useParams } from 'react-router-dom'

const User = ({ users }) => {
  const user = users.find((user) => user.id === useParams().id)

  if (!user) {
    return <Link to='/users'>Back</Link>
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <h2>Added blogs</h2>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
      <Link to='/users'>Back</Link>
    </div>
  )
}

export default User
