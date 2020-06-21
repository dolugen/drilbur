import React from 'react';
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
    console.log(name)
    // TODO: update URL
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
  return (
    <li className={placeType}>
      <strong>{props.name || "Unknown"} {placeType ? `(${placeType})` : ''}</strong>
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
        <label for="place">Search for a place: </label>
        <input type="text" id="place" name="place" onChange={this.handleTextChange} />
      </div>
    )
  }
}

function App() {
  return (
    <div className="App">
      <h1>Let's find some air quality data</h1>
      <PlacesViewer />
    </div>
  );
}

export default App;
