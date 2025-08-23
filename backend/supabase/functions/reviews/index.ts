import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import {createClient} from "npm:@supabase/supabase-js@2";
import express from 'npm:express'
import { corsHeaders } from '../_shared/cors.ts'

let supabase;

const router = express();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(corsHeaders)

router.use((request,response,next) => {
	const bearer = request.header("Authorization")
	if (!bearer) {
		response.status(401).send("Missing Authorization header")
		return
	}

	response.locals.bearerToken = bearer

	// need to add the Authorization header to make the edge function use the user's JWT token so that the RLS works properly
	supabase = createClient( Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"), {
		global: {
			headers: {
				'Authorization': bearer
			}
		}
	})

	next()
})

async function authorisation (request, response, next) {
	try {
		const [,token] = response.locals.bearerToken.split(" ")
		if (!token) {
			response.status(401).send('Invalid JWT token')
			return
		}

		const { data: {user} } = await supabase.auth.getUser(token)
		if (!user) {
			response.status(401).send('Failed to authenticate user')
			return
		}
	
		response.locals.user_id = user.id
		next()
	} catch(error) {
		response.status(500).send(error)
	}
}

router.get('/reviews/races', async (request, response) => {
    try {      
        const result = await supabase.from("reviews").select()

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
        const result = await supabase.from("reviews").select().match({race_id})

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

        const result = await supabase.from("reviews").upsert({user_id: response.locals.user_id, race_id, review}).eq('user_id', `${response.locals.user_id}`)
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

        const result = await supabase.from("reviews").delete().eq('race_id', `${race_id}`)
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