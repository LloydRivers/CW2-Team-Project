import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import express from 'npm:express'

const router = express();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const baseUrl = "https://f1connectapi.vercel.app/api"

router.get('/drivers', async (request, response) => {
  try {
    let name = request.query.name
    if (name) {
      // the api only accepts either first name or last name as the query parameter
      name = name.split(" ")[0] // so if multiple words have been entered only use the first
    }
    const result = await fetch(`${baseUrl}/drivers${name ? `/search?q=${name}` : ""}`)
    const { drivers } = await result.json()

    if (drivers === undefined || drivers.length < 1) {
      response.status(404).send('No drivers found')
      return
    }

    response.send(drivers)
  } catch (error) {
    response.status(500).send(error)
  }
});

router.get('/drivers/featured', async (request, response) => {
  try {
    const result = await fetch(`${baseUrl}/current/drivers`)
    const { drivers } = await result.json()

    if (drivers === undefined || drivers.length < 1) {
      response.status(404).send('No current drivers found')
      return
    }

    const index = Math.round(Math.random() * 100) % drivers.length
    response.status(200).send(drivers[index])
  } catch (error) {
    response.status(500).send(error)
  }
});

router.get('/drivers/current', async (request, response) => {
  try {
    const result = await fetch(`${baseUrl}/current/drivers`)
    const { drivers } = await result.json()

    if (drivers === undefined || drivers.length < 1) {
        response.status(404).send('No current drivers found')
        return
    }
    response.status(200).send(drivers)
  } catch (error) {
    response.status(500).send(error)
  }
});

router.get('/drivers/id/:id', async (request, response) => {
   try {
      const driverId = request.params.id
      const result = await fetch(`${baseUrl}/drivers/${driverId}`)
      const { driver } = await result.json()

      if (!driver) {
          response.status(404).send('Driver not found')
          return
      }
      response.status(200).send(driver)
    } catch (error) {
      response.status(500).send(error)
    }
});

router.listen(3000, () => {})