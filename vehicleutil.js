var fs = require('fs')
var path = require('path')
var _ = require('lodash')

function getVehiclePath(vehicleid) {
    return path.join(__dirname, 'vehicles', vehicleid) + '.json'
}
function getVehicle(vehicleid) {
    //foll does not need callback as it is sync but it will block all other
    //processes from running
    var vehicle = JSON.parse(fs.readFileSync(getVehiclePath(vehicleid), {encoding: 'utf8'}))
    vehicle.name = _.startCase(vehicle.name)
    // _.keys(vehicle.licenseplate).forEach(function (key) {
    //     vehicle.licenseplate[key] = _.startCase(vehicle.licenseplate[key])
    // })
    return vehicle
}
function updateVehicle(vehicleid, vehicleinfo) {

    var fp = getVehiclePath(vehicleid)
    fs.unlinkSync(fp)
    fs.writeFileSync(fp, JSON.stringify(vehicleinfo, null, 2), {encoding: 'utf8'})

}

//Used to verify if a vehicle. If not
function verifyVehicle(req, res, next) {
    var fp = getVehiclePath(req.params.vehicleid)
    fs.exists(fp, function (yes) {
        if (yes) {
            next()
        }
        else {
            //for all routes that dont match go to next handler (which handles incorrect address)
            res.redirect('/error/' + req.params.vehicleid)
        }
    })
}



exports.getVehiclePath = getVehiclePath
exports.getVehicle = getVehicle
exports.updateVehicle = updateVehicle
exports.verifyVehicle  = verifyVehicle