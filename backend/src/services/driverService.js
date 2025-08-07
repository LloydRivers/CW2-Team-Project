const driverRepository = require("../repositories/F1API/driverRepository");

const getDrivers = async () => {
    return await driverRepository.getAllDrivers()
}

const getCurrentDrivers = async () => {
    return await driverRepository.getCurrentDrivers()
}

const getDriversByName = async (name) => {
    if (name) {
        // the api only accepts either first name or last name as the query parameter
        name = name.split(" ")[0] // so if multiple words have been entered only use the first
        return await driverRepository.getByName(name)
    }
    return [];
}

const getDriverById = async (id) => {
    return await driverRepository.getById(id);
}

const getRandomCurrentDriver = async () => {
    const drivers = await driverRepository.getCurrentDrivers()
    if (drivers) {
        const index = Math.round(Math.random() * 100) % drivers.length
        return [drivers[index]]
    }
    return [];
}

module.exports = {
    getDrivers,
    getCurrentDrivers,
    getDriverById,
    getDriversByName,
    getRandomCurrentDriver
}