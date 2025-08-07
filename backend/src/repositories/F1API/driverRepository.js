require("dotenv").config();

const baseUrl = process.env.API_BASE_URL

const getAllDrivers = async () => {
    try {
        const result = await fetch(`${baseUrl}/drivers`)
        const { drivers } = await result.json()
        return drivers
    } catch (error) {
        return error
    }
}

const getCurrentDrivers = async () => {
    try {
        const result = await fetch(`${baseUrl}/current/drivers`)
        const { drivers } = await result.json()
        return drivers
    } catch (error) {
        return error
    }
}

const getById = async (driverId) => {
 try {
        const result = await fetch(`${baseUrl}/drivers/${driverId}`)
        const { driver } = await result.json()
        return driver
    } catch (error) {
        return error
    }
}

const getByName = async (name) => {
    try {
        const result = await fetch(`${baseUrl}/drivers/search?q=${name}`)
        const { drivers } = await result.json()
        return drivers
    } catch (error) {
        return error
    }
}

module.exports = {
    getAllDrivers,
    getCurrentDrivers,
    getByName,
    getById
}