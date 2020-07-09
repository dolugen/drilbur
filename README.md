## Drilbur

[![Netlify Status](https://api.netlify.com/api/v1/badges/8c061fb4-4db0-4f2e-8a9a-7a4614d3f776/deploy-status)](https://app.netlify.com/sites/drilbur/deploys)

Helps you drill down into OpenAQ data.

**Status: Experimental**

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Ideas for further development

Currently the app allows for quick search for available places, and show their stub profile pages.

Here are some ideas for further improvements.
There are no concrete timeline for this, and it can change at any time.

- Data access methods on place profiles
  Provide code snippets for access methods such as
  cURL, HTTP, R, Python using existing community tools.
  
- Additional places stats for context, such as:
  - Population
  - Weather, humidity, air pressure, etc.
  - Geo data: elevation, terrain type, etc.
  - Plus any other data regarding the city (e.g. transportation related)

- Stats related to air quality data availability for places
  - Example data points:
    - Number of active stations (in the world, in a country, etc.)
    - Stations per city
    - Stations per capita
    - Cities without stations

## Search data

The search data is generated from the API. Here the data retrieval method is documented for future use.

### GraphQL queries for generating the search files

#### Locations

```
query LocationsForSearch {
  locations_aggregate {
    aggregate {
      count
    }
  }
  locations {
    location
    id
    country
    city
  }
}
```

#### Cities

```
query CitiesForSearch {
  cities_aggregate {
    aggregate {
      count
    }
  }
  cities {
    country
    name
  }
}
```

### Countries list

Since country names aren't stored in the database, let's look them up from the API.

```
curl https://api.openaq.org/v1/countries?limit=200 > countries.json
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
