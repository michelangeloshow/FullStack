import { useState, useEffect } from "react"
import axios from "axios"

const SingleCountry = ({ country }) => {
  const [weatherdata, setWeatherData] = useState(null)

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${country.capitalInfo.latlng[0]}&lon=${country.capitalInfo.latlng[1]}&appid=${process.env.REACT_APP_API_KEY}&units=metric `
      )
      .then((response) => setWeatherData(response.data))
  }, [])

  if (weatherdata === null) return

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital[0]}</p>
      <p>area {country.area}</p>
      <h2>languages:</h2>
      <ul>
        {Object.values(country.languages).map((value, index) => (
          <li key={index}>{value}</li>
        ))}
      </ul>
      <img src={country.flags["png"]} />
      <h2>Weather in {country.capital[0]}</h2>
      <p>temperature {weatherdata.main.temp} Celsius</p>
      <img
        src={`https://openweathermap.org/img/wn/${weatherdata.weather[0].icon}@2x.png`}
      />
      <p>wind {weatherdata.wind.speed} m/s</p>
    </div>
  )
}

const Countries = ({ filteredCountries, filter, setFilter }) => {
  if (filter.length === 0) return

  if (filteredCountries.length > 11) {
    return <p>Too many matches</p>
  } else if (filteredCountries.length < 11 && filteredCountries.length > 1) {
    return (
      <div>
        {filteredCountries.map((country) => (
          <li key={country.name.common}>
            {country.name.common}
            <button onClick={() => setFilter(country.name.common)}>show</button>
          </li>
        ))}
      </div>
    )
  } else if (filteredCountries.length === 1) {
    return <SingleCountry country={filteredCountries[0]} />
  } else return
}

const App = () => {
  const [filter, setFilter] = useState("")
  const [countries, setCountries] = useState([])

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => setCountries(response.data))
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <>
      <div>
        find countries <input value={filter} onChange={handleFilterChange} />
      </div>
      <div>
        <Countries
          filteredCountries={countries.filter((country) =>
            country.name.common.toLowerCase().includes(filter.toLowerCase())
          )}
          filter={filter}
          setFilter={setFilter}
        />
      </div>
    </>
  )
}

export default App
