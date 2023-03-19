import { useState, useEffect } from "react"
import personServices from "./services/persons"

const Notification = ({ message, error }) => {
  const notiStyle = {
    color: error ? "red" : "green",
    backGround: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  if (message === null) {
    return
  }

  return <div style={notiStyle}>{message}</div>
}

const Person = ({ personInfo, removeById }) => {
  return (
    <p>
      {personInfo.name} {personInfo.number}
      <button
        onClick={() => {
          if (window.confirm(`Delete ${personInfo.name}?`)) {
            removeById(personInfo.id)
          }
        }}
      >
        delete
      </button>
    </p>
  )
}

const Filter = ({ filter, handleChangeFunction }) => (
  <div>
    filter shown with <input value={filter} onChange={handleChangeFunction} />
  </div>
)

const PersonForm = ({
  newName,
  newNumber,
  handlePersonChange,
  handleNumberChange,
  addPerson,
}) => (
  <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={handlePersonChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Persons = ({ personsToShow, removeById }) => {
  return personsToShow.map((person) => (
    <Person key={person.id} personInfo={person} removeById={removeById} />
  ))
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [filter, setNewFilter] = useState("")
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    personServices.getAll().then((persons) => setPersons(persons))
  }, [])

  const handlePersonChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const removeById = (id) => {
    personServices
      .remove(id)
      .then(() => {
        setPersons(persons.filter((person) => person.id !== id))
        handleNewMessage(`User deleted`, false)
      })
      .catch((error) => {
        handleNewMessage(`Something went wrong!`, true)
      })
  }

  const handleNewMessage = (text, isError) => {
    setError(isError)
    setMessage(text)

    setTimeout(() => {
      setMessage(null)
    }, 3000)
  }

  const personsToShow =
    filter.length === 0
      ? persons
      : persons.filter(
          (person) =>
            person.name.toLowerCase().includes(filter.toLowerCase()) ||
            person.number.includes(filter)
        )

  const addPerson = (event) => {
    event.preventDefault()

    // Handle "name already exists" case
    if (persons.find((person) => person.name === newName)) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const foundPerson = persons.find((person) => person.name === newName)
        const modifiedPerson = { ...foundPerson, number: newNumber }
        personServices
          .update(foundPerson.id, modifiedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== foundPerson.id ? person : returnedPerson
              )
            )
            handleNewMessage(`Editing ${modifiedPerson.name} succesful`, false)
          })
          .catch((error) => {
            handleNewMessage(
              `User ${modifiedPerson.name} already removed from the server`,
              true
            )
            setPersons(persons.filter((person) => person.id !== foundPerson.id))
          })
        setNewName("")
        setNewNumber("")
      }
      return
    }

    // Handle normal case
    const personObject = {
      name: newName,
      number: newNumber,
    }

    personServices
      .create(personObject)
      .then((person) => {
        setPersons(persons.concat(person))
        handleNewMessage(`Added ${person.name}`, false)
      })
      .catch((error) => {
        handleNewMessage("Something went wrong!", true)
      })

    setNewName("")
    setNewNumber("")
  }

  return (
    <div>
      <Notification message={message} error={error} />
      <h2>Phonebook</h2>
      <Filter filter={filter} handleChangeFunction={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handlePersonChange={handlePersonChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} removeById={removeById} />
    </div>
  )
}

export default App
