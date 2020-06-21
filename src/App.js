import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import './App.css';
import * as countries from './data/countries.json';
import * as cities from './data/cities.json';
import * as locations from './data/locations.json';

const get_countries = () => countries.results.filter(c => c.name)
const get_cities = () => cities.results
const get_locations = () => locations.results

class PlacesViewer extends React.Component {
  constructor(props) {
    super(props)
    this.handlePlaceChange = this.handlePlaceChange.bind(this)
    this.state = {
      places: get_countries()
    }
  }

  handlePlaceChange(name) {
    // reset countries list
    if (name.length === 0) {
      this.setState({places: get_countries()})
      return
    }
    // TODO: update URL with query param
    // start searching on 2nd char
    if (name.length < 2) return
    const places = findPlace(name)
    this.setState({name: name, places: places})
  }

  render() {
    return (
      <div>
        <SearchForm onSearchTextChange={this.handlePlaceChange} />
        <PlacesList places={this.state.places} />
      </div>
    )
  }
}

const Place = (props) => {
  const placeType = props.placeType
  let placeLink
  if (placeType === "country" || props.code) {
    placeLink = `/countries/${props.code}`
  } else if (placeType === "city") {
    placeLink = `/countries/${props.country}/cities/${props.name}/`
  } else {
    placeLink = `/locations/${props.id}`
  }
  return (
    <li className={placeType}>
      <Link to={placeLink}>{props.name || "Unknown"} {placeType ? `(${placeType})` : ''}</Link>
    </li>
  )
}

const PlacesList = (props) => {
  const places = props.places.map(place => <Place key={place.id} {...place} />)
  return (
    <ul>
      {places}
    </ul>
  )
}

const CityListItem = ({city}) => {
  const cityLink = `/countries/${city.country}/cities/${city.name}`
  return <li>
    <Link to={cityLink}>{city.name}</Link>
  </li>
}

const LocationListItem = ({location}) => {
  const locationLink = `/locations/${location.id}`
  return <li>
    <Link to={locationLink}>{location.location}</Link>
  </li>
}

const Country = () => {
  const { countryCode } = useParams()
  const result = get_countries().filter(country => country.code === countryCode)
  console.log(result)
  if (result.length === 0) return <h2>Country with code "{countryCode}" not found.</h2>
  const country = result[0]
  const cities = get_cities()
                  .filter(c => c.country === countryCode)
                  .map(c => <CityListItem city={c} />)
  const locations = get_locations()
                      .filter(l => l.country === countryCode)
                      .map(l => <LocationListItem location={l} />)
  return (
    <div>
      <h2>{country.name}</h2>
      <h3>Stats</h3>
      <ul>
        <li>Code: {country.code}</li>
        <li>Total measurements: {country.count}</li>
        <li>Total number of measurement stations: {country.locations}</li>
        <li>Number of cities with stations: {country.cities}</li>
      </ul>
      <h3>Cities ({cities.length})</h3>
      <ul>
        {cities}
      </ul>
      <h3>Stations ({locations.length})</h3>
      <ul>
        {locations}
      </ul>
    </div>
  )
}

const City = () => {
  const { countryCode, cityName } = useParams()
  const result = get_cities().filter(c => c.country === countryCode && c.name === cityName)
  if (result.length === 0) return <h2>City with name "{cityName}" not found.</h2>
  const city = result[0]
  const stations = get_locations()
                    .filter(l => l.country === countryCode && l.city === cityName)
                    .map(l => <LocationListItem location={l} />)
  return (
    <div>
      <h2>{cityName}</h2>
      <h3>Stats</h3>
      <ul>
        <li>Country code: {city.country}</li>
        <li>Total number of measurements: {city.count}</li>
        <li>Number of stations: {city.locations}</li>
      </ul>
      <h3>Stations ({stations.length})</h3>
      <ul>
        {stations}
      </ul>
    </div>
  )
}

const Countries = () => {
  let match = useRouteMatch()

  return (
    <div>
      <Switch>
        <Route path={`${match.path}/:countryCode/cities/:cityName`}>
          <City />
        </Route>
        <Route path={`${match.path}/:countryCode`}>
          <Country />
        </Route>
        <Route path={match.path}>
          <h2>Please select a country or a city.</h2>
        </Route>
      </Switch>
    </div>
  )
}

const findPlace = (place) => {
  const regex = new RegExp(place, 'gi')
  const locationMatches = get_locations()
                            .filter(item => item.location && item.location.match(regex))
                            .map(item => ({
                              placeType: 'location',
                              name: item.location,
                              ...item}))
  const cityMatches = get_cities()
                        .filter(city => city.name.match(regex))
                        .map(item => ({
                          placeType: 'city',
                          id: item.name + '_' + item.country,
                          ...item }))
  const countryMatches = get_countries()
                          .filter(country => country.name && country.name.match(regex))
                          .map(item => ({
                            placeType: 'country',
                            id: item.code,
                            ...item}))
  
  return countryMatches.concat(cityMatches).concat(locationMatches)
}

class SearchForm extends React.Component {
  constructor(props) {
    super(props)
    this.handleTextChange = this.handleTextChange.bind(this)
  }

  handleTextChange(e) {
    this.props.onSearchTextChange(e.target.value)
  }

  render() {
    return (
      <div>
        <label htmlFor="place">Search for a place: </label>
        <input type="text" id="place" name="place" onChange={this.handleTextChange} />
      </div>
    )
  }
}

const Nav = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
      </ul>
    </nav>
  )
}

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Let's get some air quality data</h1>
        <Nav />
        <Switch>
            <Route path="/countries">
              <Countries />
            </Route>
            <Route path="/">
              <PlacesViewer />
            </Route>
          </Switch>
      </div>
    </Router>
  );
}

export default App;
