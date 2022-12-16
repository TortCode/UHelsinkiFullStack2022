import { useState, useEffect } from 'react'
import axios from 'axios'

const SearchFilter = ({filterStr, handler}) =>
  <div>
    filter shown with <input value={filterStr} onChange={handler} />
  </div>

const PersonForm = ({data}) => {
      return (
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
}

const PersonDisplay = ({persons}) =>
  <div> {persons.map(p => <p key={p.name}>{p.name} {p.number}</p>)} </div>

const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterStr, setFilterStr] = useState('')

  useEffect(() => {
    axios.get('http://localhost:3001/persons').then(response =>
      setPersons(response.data)
    ) 
  }, [])

  const hNameChange = (event) => { setNewName(event.target.value.trim()) }

  const hNumberChange = (event) => { setNewNumber(event.target.value.trim()) }

  const hFilterChange = (event) => { setFilterStr(event.target.value.toLowerCase()) }

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(p => p.name === newName)) {
      alert(`${newName} is already in the phonebook`)
      return
    }
    setPersons(persons.concat({ name: newName, number: newNumber }))
    setNewName('')
    setNewNumber('')
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
      <PersonDisplay persons={filteredPersons} />
    </div>
  )
}

export default App;
