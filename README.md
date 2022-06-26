# Node with Express Server with REST API
build a REST API that exposes methods to interact with a cache

## Features

- Express
- REST API
- Node version : v14.15.0

## Installation

- `git clone https://github.com/cyrineB/Challenge_Fashion_Cloud.git`
- `npm install`
- `npm start`


#### Postman


- Add an endpoint that returns the cached data for a given key
  - GET : URL: http://localhost:3000/Cache/key1
- Add an endpoint that returns all stored keys in the cache
  - GET : URL: http://localhost:3000/Allkeys
- Add an endpoint that creates and updates the data for a given key
  - PUT : URL: http://localhost:3000/key1
- Add an endpoint that removes a given key from the cache
  - DELETE : URL: http://localhost:3000/key1
- Add an endpoint that removes all keys from the cache
  - DELETE : URL: http://localhost:3000//Cache/deleteAll
