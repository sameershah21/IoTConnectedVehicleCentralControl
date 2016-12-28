var express = require('express')
var vehicleutil = require('./vehicleutil')
var fs = require('fs')

var router = express.Router({
    mergeParams: true
}) //create own router instance

//root logging to log all calls made to the root
router.all('/',function (req, res, next) {
    //log all requests
    console.log("A",req.method, 'was made to the root for', req.params.vehicleid)
    next()
})

router.get('/',vehicleutil.verifyVehicle, function (req, res) {
    //get all cars (owned, leased, rented, loaner, etc)
    var vehicleid = req.params.vehicleid
    var vehicle = vehicleutil.getVehicle(vehicleid)

    res.render('vehicle', {
        vehicle: vehicle
    })
})
router.put('/',function (req, res) {
    var vehicleid = req.params.vehicleid
    var vehicle = vehicleutil.getVehicle(vehicleid)

    vehicle.temperature = req.body.temperature
    vehicle.tirepressure = req.body.tirepressure
    vehicle.currentspeed = req.body.currentspeed
    vehicle.carbonmonoxide = req.body.carbonmonoxide
    vehicle.pollencount = req.body.pollencount
    vehicle.GPS.latitude = req.body.latitude
    vehicle.GPS.longitude = req.body.longitude
    vehicle.lastupdated = new Date().toLocaleString()
    vehicleutil.updateVehicle(vehicleid, vehicle)

    res.end()
})

module.exports = router


