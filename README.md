chain-js
========

# chain-js

A fork of [chain-api](https://github.com/ResEnv/chain-api) implemented in Node using JSON-LD instead of HAL-JSON.
This fork is non-functional in its current state; its purpose was merely to experiment with Node and JSON-LD implementations after having implemented *chain-api* with Django and HAL-JSON.

## Usage

Docker is required.

<sub><sup>Note:  If you are on a mounted directory in a virtualized file system, you might have trouble because NPM has problems installing certain packages on such filesystems, because it cannot make symlinks</sup></sub>

If you want a persistant data volume: in the `docker/data` folder, run `./build` and `./create`.

In the `docker/debug` folder: run `./build`.

To run without persistant data, run `./run -i`.  To run with persistant data, run `./run -i --persist`.

The server should be accessible at http://localhost:8080.
Most of the frontend templates have not yet been created, so curl must be used.  Only `Site` has been fully implemented.  Some example usage follows:

Get a list of sites:

`curl -H "Accept: application/json" http://localhost:8080/sites`

Get JSON schema fro creating a site:

`curl -H "Accept: application/json" http://localhost:8080/sites/create`

Create a site:

`curl -H "Accept: application/json" -H "Content-Type: application/json" http://localhost:8080/sites/create -d '{"name":"mysite"}'`

Get a site:

`curl -H "Accept: application/json" http://localhost:8080/sites/1`

Edit a site:

`curl -H "Accept: application/json" -H "Content-Type: application/json" http://localhost:8080/sites/1/edit -d '{"name":"yoursite"}'`

Delete a site:

`curl -H "Accept: application/json" -H "Content-Type: application/json" http://localhost:8080/sites/1/delete -d '{}'`

## Findings

### Pros

1. JSON and JavaScript go hand-in-hand, and there was extensive library support available for JSON-Schema and JSON-LD, which were very compatible in their roles in specifying input formats and displaying linked output data, respectively.
    * JSON-LD demands schematic definitions of the fields (and the compiler enforces this demand), which is very favorable for designing intuitive data structures
    * JSON-LD has a number of interchangable formats for the same data structure (see the [JSON-LD Playground](http://json-ld.org/playground/) for examples), which is convenient
    * JSON-LD's graph structures are much more powerful and more intuitive than HAL, which could be useful for implementing presence data, because presence data introduce cycles, which created problems in Chain-API.
2. Although I did not get a chance to implement the ZMQ or websocket sockets, JavaScript's callback and promise API's seem much more compatable with message queue frameworks in comparison to Python's delegate-based event handling API.

### Cons

1.  Model management:  Django's model management is much better than the model management I attempted with Sequelize.js.  I stopped working on the fork when the associations between model classes (ie many devices to 1 site) became difficult.  Sequelize has custom methods it creates (ie `site.getDevices().then(function() {...})`) to find related resources.  This made it difficult to generalize without getting very hackish very quickly.

## Future Work

If this project is continued, options other than Sequelize.js should be explored for model management in order to clear up the association issues.
