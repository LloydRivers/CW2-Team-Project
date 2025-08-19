import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import {createClient} from "npm:@supabase/supabase-js@2";
import express from 'npm:express'

const router = express();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

let supabase;

router.use( async (request,response,next) => {
	try {
		const bearer = request.header("Authorization")
		if (!bearer) {
			response.status(401).send("Missing Authorization header")
			return
		}

		// need to add the Authorization header to make the edge function use the user's JWT token so that the RLS works properly
		supabase = createClient( Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"), {
			global: {
				headers: {
					'Authorization': bearer
				}
			}
		})

		const [,token] = bearer.split(" ")
		if (!token) {
			response.status(401).send('Invalid JWT token')
			return
		}

		const { data: {user} } = await supabase.auth.getUser(token)
		if (!user) {
			response.status(401).send('Invalid JWT token')
			return
		}
	
		response.locals.user_id = user.id
		next()
	} catch(error) {
		response.status(500).send(error)
	}
})

router.get('/ratings/races', async (request, response) => {
    try {      
        const result = await supabase.from("race-ratings").select()

        if (result.error) {
          response.status(result.status).send(result.error)
          return
        }

		if (result.data.length < 1) {
			response.status(404).send('No ratings found')
		}

        response.status(200).send(result.data)
    } catch (error) {
        response.status(500).send(error)
    }
});

router.get('/ratings/races/:raceId', async (request, response) => {
    try {
        const race_id = request.params.raceId
        const result = await supabase.from("race-ratings").select().match({race_id})

        if (result.error) {
          response.status(result.status).send(result.error)
          return
        }

		if (result.data.length < 1) {
			response.status(404).send('No ratings found for given race')
		}

        response.status(200).send(result.data)
    } catch (error) {
        response.status(500).send(error)
    }
});

router.put('/ratings/races/:raceId', async (request, response) => {
    try {
        const race_id = request.params.raceId
      	const {rating} = request.body
   		if (!rating || isNaN(rating)) {
			response.status(400).send("Invalid rating")
			return
		}

        const result = await supabase.from("race-ratings").upsert({user_id: response.locals.user_id, race_id, rating}).eq('user_id', `${response.locals.user_id}`)
        if (result.error) {
            response.status(result.status).send(result.error)
			return
		}

        response.sendStatus(200)
    } catch (error) {
        response.status(500).send(error)
    }
});

router.delete('/ratings/races/:raceId', async (request, response) => {
    try {
        const race_id = request.params.raceId

        const result = await supabase.from("race-ratings").delete().eq('race_id', `${race_id}`)
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
        const result = await supabase.from("driver-ratings").select()

        if (result.error) {
          response.status(result.status).send(result.error)
          return
        }

		if (result.data.length < 1) {
			response.status(404).send('No ratings found')
		}

        response.status(200).send(result.data)
    } catch (error) {
        response.status(500).send(error)
    }
});

router.get('/ratings/drivers/:driverId', async (request, response) => {
    try {
        const driver_id = request.params.driverId
        const result = await supabase.from("driver-ratings").select().eq({driver_id})

        if (result.error) {
          response.status(result.status).send(result.error)
          return
        }

		if (result.data.length < 1) {
			response.status(404).send('No ratings found')
		}

        response.status(200).send(result.data)
    } catch (error) {
        response.status(500).send(error)
    }
});

router.put('/ratings/races/:raceId/drivers/:driverId', async (request, response) => {
    try {
		const race_id = request.params.raceId
        const driver_id = request.params.driverId

      	const {rating} = request.body
   		if (!rating || isNaN(rating)) {
			response.status(400).send("Invalid rating")
			return
		}

        const result = await supabase.from("driver-ratings").upsert({user_id: response.locals.user_id, race_id, driver_id, rating}).match({user_id: response.locals.user_id})
        if (result.error) {
            response.status(result.status).send(result.error)
			return
		}

        response.sendStatus(200)
    } catch (error) {
        response.status(500).send(error)
    }
});

router.delete('/ratings/races/:raceId/drivers/:driverId', async (request, response) => {
    try {
        const race_id = request.params.raceId
		const driver_id = request.params.driverId

        const result = await supabase.from("driver-ratings").delete().match({race_id, driver_id})
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