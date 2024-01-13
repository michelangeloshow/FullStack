import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Users = () => {
  const users = useSelector((state) => state.users)

  if (!users) {
    return null
  }

  return (
    <>
      <h1>Users</h1>
      <div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Blogs</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </td>
                <td>{user.blogs.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Users
