# cimplex-decoder #

JavaScript library for communicating with the GLEAMviz Proxy Server.

### Using the library ###
Include the following files from the dist folder in your HTML document

```
<script src="https://cdn.jsdelivr.net/npm/zip-js@0.0.2/WebContent/deflate.js"></script>
<script src="https://cdn.jsdelivr.net/npm/zip-js@0.0.2/WebContent/zip.js"></script>
<script src="https://cdn.jsdelivr.net/npm/zip-js@0.0.2/WebContent/inflate.js"></script>
<script src="https://cdn.jsdelivr.net/npm/zip-js@0.0.2/WebContent/z-worker.js"></script>
<script src="dist/gleamviz.js"></script>
```

## API

```
// Login to the server
GleamViz.login(username, password)

// Logout from the server
GleamViz.logout(username, password)

// List all current simulations
GleamViz.listall()

// Create a new simulation
GleamViz.create(definition)

// Remove a simulation 
GleamViz.remove(id)

// Stop the calculation of a simulation 
GleamViz.stop(id)

// Get information regarding a specific simulation
GleamViz.getinfo(id)

// Get the definition of a specific simulation
GleamViz.getdef(id)

// Get  data of a specific simulation
GleamViz.getdata(id)

// Get parameters of a specific simulation
GleamViz.getparameters(id)

// Get simulationdata of a specific simulation
GleamViz.getsimulationdata(id)
```

## Examples

```
// login to the server an fetch all simulation information
GleamViz.login("username", "password").then(userdata => {
    GleamViz.listall().then(simulations => {
        // simulations contains a list of all simulation informations
        GleamViz.logout();
    });
});

// login to the server and get a specific simulation
GleamViz.login("username", "password").then(userdata => {
    GleamViz.getsimulationdata("1486985747939.ASR")
        .then(data => {
            // data contains the simulation data
            GleamViz.logout();
        });
});

// login to the server and create a new simulation using a definition
GleamViz.login("username", "password").then(userdata => {
    GleamViz.create(definition)
        .then(data => {
            GleamViz.logout();
        });
});
```

### How to build the library? 
1. Run *npm install*
2. Run *npm run build* or *npm run watch*

## Contributions

* zip.js - A JavaScript [library](https://gildas-lormeau.github.io/zip.js/) to zip and unzip files
* browserify -  [Organize](https://github.com/browserify/browserify) your browser code and load modules installed by npm
* watchify - [watch](https://github.com/browserify/watchify) mode for browserify builds

## Authors

Authors of this project (comprising ideas, architecture, and code) are:

* Sebastian Alberternst <sebastian.alberternst@dfki.de>
* Jan Sutter <jan.sutter@dfki.de>

This project and code was mainly developed by:

* [DFKI](https://www.dfki.de/web/research/asr/index_html) - German Research Center for Artificial Intelligence
* [ISI](http://www.gleamviz.org/) - Fondazione Istituto per l'Interscambio Scientifico

Parts of the project and code were developed as part of the [EU H2020](https://ec.europa.eu/programmes/horizon2020/) [project](https://www.cimplex-project.eu/) *CIMPLEX* - Bringing *CI*tizens, *M*odels and Data together in *P*articipatory, Interactive Socia*L* *EX*ploratories.

Futher partners that deliver data and simulations via webservice access are:

* ETHZ (ETH Zurich)
* UCL (University College of London)
* Közép-európai Egyetem (Central European University, CEU)
* CNR (National Research Council)
* FBK (Bruno Kessler Foundation)
* USTUTT (University of Stuttgart, Institute for Visualization and Interactive Systems)

## License

See [LICENSE](./LICENSE).
