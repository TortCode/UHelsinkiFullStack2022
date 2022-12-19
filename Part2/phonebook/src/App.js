import { useState, useEffect } from 'react'
import axios from 'axios'
import requests from './services/reqs'

const SearchFilter = ({filterStr, handler}) =>
  <div>
    filter shown with <input value={filterStr} onChange={handler} />
  </div>

const PersonForm = ({data}) => (
  <form onSubmit={data.addPerson}>
    <div>
      name: <input value={data.newName} onChange={data.hNameChange}/>
    </div>
    <div>
      number: <input value={data.newNumber} onChange={data.hNumberChange}/>
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const PersonDisplay = ({persons, deleteMethod}) => (
  <div>
    {persons.map(p => 
      <p key={p.name}>
        {p.name} {p.number} {}
        <button type="button" onClick={() => deleteMethod(p)}>delete</button>
      </p>
    )}
  </div>
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterStr, setFilterStr] = useState('')


  useEffect(() => {
    const url = 'http://localhost:3001/persons'
    requests.setBaseUrl(url)
    requests
      .getAll()
      .then(data => setPersons(data))
  }, [])

  const hNameChange = (event) => { setNewName(event.target.value) }

  const hNumberChange = (event) => { setNewNumber(event.target.value) }

  const hFilterChange = (event) => { setFilterStr(event.target.value.toLowerCase()) }

  const addPerson = (event) => {
    event.preventDefault()

    const newPerson = { name: newName.trim(), number: newNumber.trim() }

    if (persons.some(p => p.name === newPerson.name)) {
      if (window.confirm(
        `${newPerson.name} is already in the phonebook, replace with new number?`)) {

        const match = persons.findIndex(p => p.name === newPerson.name)
        requests
          .update(persons[match].id, newPerson)
          .then(returnPerson => {
            const newPersons = [...persons]
            newPersons[match] = returnPerson
            setPersons(newPersons)
            setNewName('')
            setNewNumber('')
          })
      }
    } else {
      requests
        .create(newPerson)
        .then(returnPerson => {
          setPersons(persons.concat(returnPerson))
          setNewName('')
          setNewNumber('')
      })
    }


  }

  const deletePerson = p => {
    if (window.confirm(`Are you sure you want to delete ${p.name}`))
      requests
        .destroy(p.id)
        .then(() => {
          setPersons(persons.filter(q => q.id !== p.id))
        })
  }



  const filteredPersons = persons.filter(p => 
    p.name.toLowerCase().indexOf(filterStr.trim()) !== -1)

  return (
    <div>
      <h2>Phonebook</h2>
      <SearchFilter filterStr={filterStr} handler={hFilterChange} />
      <h2>add a new</h2>
      <PersonForm data={{addPerson, newName, hNameChange, newNumber, hNumberChange}} />
      <h2>Numbers</h2>
      <PersonDisplay persons={filteredPersons} deleteMethod={deletePerson}/>
    </div>
  )
}

export default App;
