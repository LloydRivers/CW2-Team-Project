const driverService = require("../services/driverService")

const getDrivers = async (request, response) => {
    try {
        const name = request.query.name
        const drivers = name ? await driverService.getDriversByName(name) : await driverService.getDrivers()
        if (drivers.length < 1) {
            response.sendStatus(404)
        }
        response.status(200).send(drivers)
    } catch (error) {
        response.status(500).send(error)
    }
}

const getCurrentDrivers = async (request, response) => {
    try {
        const drivers = await driverService.getCurrentDrivers()
        if (drivers.length < 1) {
            response.sendStatus(404)
        }
        response.status(200).send(drivers)
    } catch (error) {
        response.status(500).send(error)
    }
}

const getDriverById = async (request, response) => { 
    try {
        const driverId = request.params.id
        const driver = await driverService.getDriverById(driverId)
        if (!driver) {
            response.sendStatus(404)
        }
        response.status(200).send(driver)
    } catch (error) {
        response.status(500).send(error)
    }
}

const getFeaturedDriver = async (request, response) => {
    try {
        const driver = await driverService.getRandomCurrentDriver()
        if (!driver) {
            response.sendStatus(404)
        }
        response.status(200).send(driver)
    } catch (error) {
        response.status(500).send(error)
    }
}

module.exports = {
    getDrivers,
    getCurrentDrivers,
    getDriverById,
    getFeaturedDriver
}