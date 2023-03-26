import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotificationMessage(state, action) {
      return action.payload
    },
  },
})

export const { setNotificationMessage } = notificationSlice.actions
export default notificationSlice.reducer

export const setNotification = (message, timeOut) => {
  return (dispatch) => {
    dispatch(setNotificationMessage(message))
    setTimeout(() => {
      dispatch(setNotificationMessage(null))
    }, timeOut)
  }
}
