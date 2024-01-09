import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: { text: null, isError: false },
  reducers: {
    setNotificationMessage(state, action) {
      const text = action.payload.message
      const isError = action.payload.error
      return {
        text,
        isError,
      }
    },
  },
})

export const { setNotificationMessage } = notificationSlice.actions
export default notificationSlice.reducer

export const setNotification = (message, error, timeOut) => {
  return (dispatch) => {
    dispatch(setNotificationMessage({ message, error }))
    setTimeout(() => {
      dispatch(setNotificationMessage({ message: null, error: false }))
    }, timeOut)
  }
}
