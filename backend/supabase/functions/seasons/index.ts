import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import express from 'npm:express'

const router = express();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const baseUrl = "https://f1connectapi.vercel.app/api"

router.get('/seasons/:year', async (request, response) => {
   try {
      const year = request.params.year
      if (isNaN(year)) {
        response.status(400).send("Invalid year")
        return
      }

      const result = await fetch(`${baseUrl}/${year}`)
      const data = await result.json()

      if (!data || !data.championship || !data.races) {
        response.status(data.status).send(data.message)
        return
      }

      response.status(200).send({championship: data.championship, races: data.races})
    } catch (error) {
      response.status(500).send(error)
    }
});

router.listen(3000, () => {})