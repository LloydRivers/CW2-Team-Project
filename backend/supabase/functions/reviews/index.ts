import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import express from 'npm:express'
import { corsHeaders } from '../_shared/cors.ts'
import { authorisation } from '../_shared/authorisation.ts'
import { useToken } from '../_shared/useToken.ts'

const router = express();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(corsHeaders)
router.use(useToken)

router.get('/reviews/races', async (request, response) => {
    try {      
        const result = await response.locals.supabase.from("reviews").select()

        if (result.error) {
          response.status(result.status).send(result.error)
          return
        }

		if (result.data.length < 1) {
			response.status(404).send('No reviews found')
			return
		}

      	response.status(200).send(result.data)
    } catch (error) {
      	response.status(500).send(error)
    }
});

router.get('/reviews/races/:raceId', async (request, response) => {
    try {
        const race_id = request.params.raceId
        const result = await response.locals.supabase.from("reviews").select().match({race_id})

        if (result.error) {
          response.status(result.status).send(result.error)
          return
        }

		if (result.data.length < 1) {
			response.status(404).send('No reviews found for given race')
			return
		}

        response.status(200).send(result.data)
    } catch (error) {
        response.status(500).send(error)
    }
});

router.put('/reviews/races/:raceId', authorisation, async (request, response) => {
    try {
        const race_id = request.params.raceId
      	const {review} = request.body
   		if (!review) {
			response.status(400).send("Invalid request body")
			return
		}

        const result = await response.locals.supabase.from("reviews").upsert({user_id: response.locals.user_id, race_id, review}).eq('user_id', `${response.locals.user_id}`)
        if (result.error) {
            response.status(result.status).send(result.error)
			return
		}

        response.sendStatus(200)
    } catch (error) {
        response.status(500).send(error)
    }
});

router.delete('/reviews/races/:raceId', authorisation, async (request, response) => {
    try {
        const race_id = request.params.raceId

        const result = await response.locals.supabase.from("reviews").delete().eq('race_id', `${race_id}`)
        if (result.error) {
            response.status(result.status).send(result.error)
			return
		}

        response.sendStatus(200)
    } catch (error) {
        response.status(500).send(error)
    }
});

router.listen(3000, () => {})