import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import express from 'npm:express'

const router = express();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const baseUrl = "https://f1connectapi.vercel.app/api"

router.get('/drivers', async (request, response) => {
  try {
    const result = await fetch(`${baseUrl}/drivers`)
    const { drivers } = await result.json()
    if (drivers.length < 1) {
      response.sendStatus(404)
    }
    response.send(drivers)
  } catch (error) {
    response.status(500).send(error)
  }
});

router.get('/drivers/featured', async (request, response) => {

});

router.get('/drivers/current', async (request, response) => {

});

router.get('/drivers/id/:id', async (request, response) => {

});

router.listen(3000, () => {})