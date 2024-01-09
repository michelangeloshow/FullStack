import { useSelector } from 'react-redux'

const Notification = () => {
  const message = useSelector((state) => state.message.text)
  const error = useSelector((state) => state.message.isError)

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

export default Notification
