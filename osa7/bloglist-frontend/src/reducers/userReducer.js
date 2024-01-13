import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/user'

const userSlice = createSlice({
  name: 'user',
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload
    },
  },
})

export const { setUsers } = userSlice.actions
export default userSlice.reducer

export const initUsers = () => {
  return async (dispatch) => {
    const blogs = await userService.getAll()
    dispatch(setUsers(blogs))
  }
}
