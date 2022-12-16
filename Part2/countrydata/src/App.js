import { useState, useEffect } from 'react'
import axios from 'axios'

const api_key = process.env.REACT_APP_API_KEY

const CountryView = ({country}) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    const [lat, lng] = country.capitalInfo.latlng
    console.log('request sent')
    
    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${api_key}&units=metric`)
         .then(response => {console.log(response.data); setWeather(response.data);})
  }, [])

  const capital = country.capital[0]
  const ICON_PATH = "http://openweathermap.org/img/wn/"
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {capital}</p>
      <p>area {country.area}</p>
      <p><strong>Languages:</strong></p>
      <ul>
        {Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}
      </ul>
      <img src={country.flags.png} />
      {(weather) ? ( 
        <>
          <h2>Weather in {capital}</h2>
          <p>temperature {weather.main.temp} degrees Celsius</p> 
          <img src={`${ICON_PATH}${weather.weather[0].icon}@2x.png`}/>
          <p>wind {weather.wind.speed} m/s</p>
        </>
      ) : null} 
    </div>
  )
}

const Display = ({countries}) => {
  const len = countries.length

  const [toShow, setToShow] = useState(null)
  if (toShow)
    return (
      <div>
        <CountryView country={toShow} />
        <button type="button" onClick={() => setToShow(null)}>hide</button>
      </div>
    )
  else if (len === 0)
    return (
      <div><p>No matches found</p></div>
    )
  else if (len === 1)
    return (
      <CountryView country={countries[0]} />
    )
  else if (len <= 10) {
    return (
      <div>
        {countries.map(country => (
          <div key={country.name.common}>
            <p>{country.name.common}</p>
            <button type="button" onClick={() => setToShow(country)}>show</button>
          </div>
        ))}
      </div>
    )
  }
  else
    return (
      <div><p>Too many matches, specify another filter</p></div>
    )
}

const Filter = ({filter, onChange}) => (
  <div>
    <p>Find countries</p>
    <input value={filter} onChange={onChange} />
  </div>
)

const App = () => {
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
         .then(response => setCountries(response.data))
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const filteredCountries = countries.filter(country => (
    country.name.common.toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
  ))

  return (
    <div>
      <Filter term={filter} onChange={handleFilterChange} />
      <Display countries={filteredCountries} />
    </div>
  )
}

export default App
