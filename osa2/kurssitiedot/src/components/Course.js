const Header = ({ name }) => <h1>{name}</h1>

const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  )
}

const Content = ({ parts }) => {
  return (
    <>
      {parts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
    </>
  )
}

const Total = ({ parts }) => {
  const total = parts.reduce((s, p) => {
    return s + p.exercises
  }, 0)

  return (
    <p>
      <strong>total of {total} exercises</strong>
    </p>
  )
}

const Course = ({ course }) => {
  return (
    <>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </>
  )
}

export default Course
