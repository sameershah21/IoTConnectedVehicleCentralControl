var express = require('express')
var app = express()

var fs = require('fs')
var path = require('path')
var _ = require('lodash')
var JSONStream = require('JSONStream')

var engines = require('consolidate')
var bodyParser = require('body-parser')

//var vehicleutil = require('./vehicleutil')

//init view engines. Using handlebars over jade as express support within view
//is not required
app.engine('hbs', engines.handlebars)
app.set('views', 'views')
app.set('view engine', 'hbs')

//helps in passing whatever data can be parsed with json
app.use(bodyParser.urlencoded({extended: true}))

var vehicleRouter = require('./vehiclerouter')
app.use('/:vehicleid', vehicleRouter)

//to feed json per request based on api call.
app.get('/request/:vehicleid', function (req, res) {
    var vehicleid = req.params.vehicleid
    //non blocking read stream
    var readable = fs.createReadStream('./vehicles/' + vehicleid + '.json')
    //write to the response
    readable.pipe(res)
    // var vehicle = vehicleutil.getVehicle(vehicleid)
    // res.json(vehicle)
})

//get vehicle by state
app.get('/vehicles/findin/:state', function (req, res) {
    var state = req.params.state
    var readable = fs.createReadStream('vehicles.json')
    readable
        .pipe(JSONStream.parse('*', function (vehicle) {

            if (vehicle.state == state) return vehicle.name
        }))
        .pipe(JSONStream.stringify('[\n  ', ',\n  ', '\n]\n'))
        .pipe(res)
})
//owned by my family begins with My
//app.get(/My.*/, function (req, res, next) //using regex
app.get('/vehicles/my', function (req, res) {

    var readable = fs.createReadStream('vehicles.json')
    readable
        .pipe(JSONStream.parse('*', function (vehicle) {

            if (vehicle.name.indexOf("My") !== -1) return vehicle
        }))
        .pipe(JSONStream.stringify('[\n  ', ',\n  ', '\n]\n'))
        .pipe(res)
})


// to let requests download json files for reports and statistics gathering
app.get('*.json', function (req, res) {
    var newpath = req.path.replace('.json', '');
    res.download('./vehicles/' + req.path, newpath + '-' + +new Date + '.json')
})
//to show list of all vehicles
app.get('/', function (req, res) {
    var vehicles = []
    fs.readdir('vehicles', function (err, files) {
        if (err) throw err
        files.forEach(function (file) {
            fs.readFile(path.join(__dirname, 'vehicles', file), {encoding: 'utf8'}, function (err, data) {
                if (err) throw err
                var vehicle = JSON.parse(data)

                vehicles.push(vehicle)
                if (vehicles.length === files.length) res.render('index', {vehicles: vehicles})
            })
        })
    })
})
app.get('/favicon.ico', function (req, res) {
    res.end()
})
//General logging to log every type of request - root calls, json calls, download calls
app.use(function (err, req, res, next) {
    //log all requests
    console.log("General logging: A", req.method, 'was made for', req.params.vehicleid)

    //either use below error handling middleware or remove verify vehicle in router.get('/',vehicleutil.verifyVehicle, function (req, res)
    //below will override default error handling middleware of express
    //res.status(500).send('Terminated Unexpectedly. Sorry about that')
    //console.error(err.stack)
    next()

})


app.get('/error/:vehicleid', function (req, res) {
    res.status(404).send(req.params.vehicleid + ' is not a valid vehicle id from your vehicles list.')
})


var server = app.listen(4000, function () {
    console.log('Server running at http://localhost:' + server.address().port)
})