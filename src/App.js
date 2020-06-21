import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import 'bulma/css/bulma.css'
import * as countries from './data/countries.json';
import * as cities from './data/cities.json';
import * as locations from './data/locations.json';

const api_url = 'https://api.openaq.org/v1/'

const get_countries = () => countries.results
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
      <div class="">
        <SearchForm onSearchTextChange={this.handlePlaceChange} />
        <PlacesList places={this.state.places} />
      </div>
    )
  }
}

const Place = (props) => {
  const placeType = props.placeType
  let name
  let placeLink
  if (placeType === "country" || props.code) {
    placeLink = `/countries/${props.code}`
    name = props.name || `Name Unknown (code: ${props.code})`
  } else if (placeType === "city") {
    placeLink = `/countries/${props.country}/cities/${props.name}/`
    name = `${props.name}, ${props.country}`
  } else {
    placeLink = `/locations/${props.id}`
    name = `${props.location}, ${props.city}, ${props.country}`
  }
  return (
    <li className={placeType}>
      <Link to={placeLink}>{name || props.name}</Link>
    </li>
  )
}

const PlacesList = (props) => {
  const places = props.places.map(place => <Place key={place.id} {...place} />)
  return (
    <ul className="is-size-3">
      {places}
    </ul>
  )
}

const Country = () => {
  const { countryCode } = useParams()
  const result = get_countries().filter(country => country.code === countryCode)
  if (result.length === 0) return <h2>Country with code "{countryCode}" not found.</h2>
  const country = result[0]
  const cities = get_cities()
                  .filter(c => c.country === countryCode)
                  .map(c => <CityLinkItem countryCode={countryCode} cityName={c.name} />)
  const locations = get_locations()
                      .filter(l => l.country === countryCode)
                      .map(l => <LocationLinkItem locationId={l.id} locationName={l.location} />)
  return (
    <div>
      <Breadcrumbs countryCode={countryCode} />
      <h2 className="title is-2">{country.name}</h2>
      <ul>
        <li>Code: {country.code}</li>
        <li>Total measurements: {country.count}</li>
        <li>Total number of measurement stations: {country.locations}</li>
        <li>Number of cities with stations: {country.cities}</li>
      </ul>
      <h3 className="title is-3">Links</h3>
      <ul>
        <li><a href={`${api_url}measurements?country=${country.code}`} target="_blank">Measurements (JSON response - opens in new window)</a></li>
        <li><a href={`${api_url}latest?country=${country.code}`} target="_blank">Latest Measurements (JSON response - opens in new window)</a></li>
      </ul>
      <h3 className="title is-3">Cities ({cities.length})</h3>
      <ol type="1" className="is-size-4">
        {cities}
      </ol>
      <h3 className="title is-3">Stations ({locations.length})</h3>
      <ol type="1" className="is-size-4">
        {locations}
      </ol>
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
                    .map(l => <LocationLinkItem locationId={l.id} locationName={l.location} />)
  return (
    <div>
      <Breadcrumbs countryCode={countryCode} cityName={cityName} />
      <h2 className="title is-2">{cityName}</h2>
      <ul>
        <li>Country: <Link to={`/countries/${city.country}`}>{city.country}</Link></li>
        <li>Total number of measurements: {city.count}</li>
        <li>Number of stations: {city.locations}</li>
      </ul>
      <h3 className="title is-3">Stations ({stations.length})</h3>
      <ul className="is-size-4">
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

const Locations = () => {
  let match = useRouteMatch()

  return (
    <div>
      <Switch>
        <Route path={`${match.path}/:locationId`}>
          <Location />
        </Route>
        <Route path={match.path}>
          <h2>Please select a location.</h2>
        </Route>
      </Switch>
    </div>
  )
}

const Location = () => {
  const { locationId } = useParams()
  const result = get_locations()
                    .filter(l => l.id === locationId)
  if (result.length === 0) return <h2>Location with ID {locationId} not found.</h2>
  const location = result[0]
  return (
    <div>
      <Breadcrumbs
        countryCode={location.country}
        cityName={location.city}
        locationId={location.id}
        locationName={location.location} />
      <h2 className="title is-2">Location: {location.location}</h2>
      <ul>
        <li>ID: {location.id}</li>
        <li>Country: <Link to={`/countries/${location.country}`}>{location.country}</Link></li>
        <li>City: <Link to={`/countries/${location.country}/cities/${location.city}`}>{location.city}</Link></li>
        <li>Source name: {location.sourceName}</li>
        <li>Source type: {location.government}</li>
        <li>Coordinates: {location.coordinates.longitude}, {location.coordinates.latitude}</li>
        <li>First updated: {location.firstUpdated}</li>
        <li>Last updated: {location.lastUpdated}</li>
        <li>Pollutants measured: {location.parameters.join(', ')}</li>
      </ul>
    </div>
  )
}

const Breadcrumbs = ({countryCode, cityName, locationName, locationId}) => {
  return <nav class="breadcrumb" aria-label="breadcrumbs">
    <ul>
      <li><Link to="/">Home</Link></li>
      {countryCode ? <CountryLinkItem countryCode={countryCode} /> : ''}
      {countryCode && cityName ? <CityLinkItem countryCode={countryCode} cityName={cityName} /> : ''}
      {locationName && locationId ? <LocationLinkItem locationName={locationName} locationId={locationId} /> : ''}
    </ul>
  </nav>
}

const CountryLinkItem = ({countryCode}) => {
  return <li><Link to={`/countries/${countryCode}`}>{countryCode}</Link></li>
}

const CityLinkItem = ({countryCode, cityName}) => {
  return <li><Link to={`/countries/${countryCode}/cities/${cityName}`}>{cityName}</Link></li>
}

const LocationLinkItem = ({locationName, locationId}) => {
  return <li><Link to={`/locations/${locationId}`}>{locationName}</Link></li>
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
      <div class="field">
        <label className="label">Search for a place: </label>
        <input class="input is-large is-primary" type="text" onChange={this.handleTextChange} />
        <p class="help">Name of a country, a city, or a station</p>
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
      <div className="">
        <h1 class="title is-1 is-spaced">Let's get some air quality data</h1>
        <Switch>
            <Route path="/countries">
              <Countries />
            </Route>
            <Route path="/locations">
              <Locations />
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
