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

router.get('/ratings/races', async (request, response) => {
    try {      
        const result = await response.locals.supabase.from("race-ratings").select()

        if (result.error) {
          response.status(result.status).send(result.error)
          return
        }

		if (result.data.length < 1) {
			response.status(404).send({'message': 'No ratings found'})
			return
		}

        response.status(200).send(result.data)
    } catch (error) {
        response.status(500).send(error)
    }
});

router.get('/ratings/races/:raceId', async (request, response) => {
    try {
        const race_id = request.params.raceId
        const result = await response.locals.supabase.from("race-ratings").select().match({race_id})

        if (result.error) {
          response.status(result.status).send(result.error)
          return
        }

		if (result.data.length < 1) {
			response.status(404).send({'message': 'No ratings found for given race'})
			return
		}

        response.status(200).send(result.data)
    } catch (error) {
        response.status(500).send(error)
    }
});

router.put('/ratings/races/:raceId', authorisation, async (request, response) => {
    try {
        const race_id = request.params.raceId
      	const {rating} = request.body
   		if (!rating || isNaN(rating)) {
			response.status(400).send({'message': "Invalid rating"})
			return
		}

        const result = await response.locals.supabase.from("race-ratings").upsert({user_id: response.locals.user_id, race_id, rating}).eq('user_id', `${response.locals.user_id}`)
        if (result.error) {
            response.status(result.status).send(result.error)
			return
		}

        response.sendStatus(200)
    } catch (error) {
        response.status(500).send(error)
    }
});

router.delete('/ratings/races/:raceId', authorisation, async (request, response) => {
    try {
        const race_id = request.params.raceId

        const result = await response.locals.supabase.from("race-ratings").delete().eq('race_id', `${race_id}`)
        if (result.error) {
            response.status(result.status).send(result.error)
			return
		}

        response.sendStatus(200)
    } catch (error) {
        response.status(500).send(error)
    }
});

router.get('/ratings/drivers', async (request, response) => {
    try {      
        const result = await response.locals.supabase.from("driver-ratings").select()

        if (result.error) {
          response.status(result.status).send(result.error)
          return
        }

		if (result.data.length < 1) {
			response.status(404).send({'message': 'No ratings found'})
			return
		}

        response.status(200).send(result.data)
    } catch (error) {
        response.status(500).send(error)
    }
});

router.get('/ratings/drivers/:driverId', async (request, response) => {
    try {
        const driver_id = request.params.driverId
        const result = await response.locals.supabase.from("driver-ratings").select().match({driver_id})

        if (result.error) {
          response.status(result.status).send(result.error)
          return
        }

		if (result.data.length < 1) {
			response.status(404).send({'message': 'No ratings found'})
			return
		}

        response.status(200).send(result.data)
    } catch (error) {
        response.status(500).send(error)
    }
});

router.put('/ratings/races/:raceId/drivers/:driverId', authorisation, async (request, response) => {
    try {
		const race_id = request.params.raceId
        const driver_id = request.params.driverId

      	const {rating} = request.body
   		if (!rating || isNaN(rating)) {
			response.status(400).send({'message': "Invalid rating"})
			return
		}

        const result = await response.locals.supabase.from("driver-ratings").upsert({user_id: response.locals.user_id, race_id, driver_id, rating}).match({user_id: response.locals.user_id})
        if (result.error) {
            response.status(result.status).send(result.error)
			return
		}

        response.sendStatus(200)
    } catch (error) {
        response.status(500).send(error)
    }
});

router.delete('/ratings/races/:raceId/drivers/:driverId', authorisation, async (request, response) => {
    try {
        const race_id = request.params.raceId
		const driver_id = request.params.driverId

        const result = await response.locals.supabase.from("driver-ratings").delete().match({race_id, driver_id})
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