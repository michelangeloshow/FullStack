import { useState } from "react"

const Button = ({ handleClick, text }) => {
  return <button onClick={handleClick}>{text}</button>
}

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.",
    "The only way to go fast, is to go well.",
  ]

  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState({
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
  })

  const getRandomInt = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
  }

  const nextAnecdote = () => {
    setSelected(getRandomInt(0, anecdotes.length))
  }

  const vote = () => {
    const copy = { ...points }
    copy[selected] += 1
    setPoints(copy)
  }

  const findMax = () => {
    let arr = Object.values(points)
    let max = Math.max(...arr)
    return Object.keys(points).find((key) => points[key] === max)
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]}
      <p>has {points[selected]} votes</p>
      <p>
        <Button handleClick={vote} text="vote" />
        <Button handleClick={nextAnecdote} text="next anecdote" />
      </p>
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[findMax()]}</p>
    </div>
  )
}

export default App
