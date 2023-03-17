import { useState } from "react"

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
)

const Statistic = ({ good, neutral, bad }) => {
  const countAll = () => good + neutral + bad

  const countAverage = () => {
    return (good - bad) / countAll()
  }

  const countPositivePercentage = () => {
    return (good / countAll()) * 100
  }

  if (good === 0 && neutral === 0 && bad === 0) {
    return <div>No feedback given.</div>
  }

  return (
    <table>
      <tbody>
        <StatisticLine value={good} text="good" />
        <StatisticLine value={neutral} text="neutral" />
        <StatisticLine value={bad} text="bad" />
        <StatisticLine value={countAll()} text="all" />
        <StatisticLine value={countAverage()} text="average" />
        <StatisticLine value={countPositivePercentage()} text="positive%" />
      </tbody>
    </table>
  )
}

const StatisticLine = ({ value, text }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />
      <h1>statistics</h1>

      <Statistic good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
