import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import {createClient} from "npm:@supabase/supabase-js@2";
import express from 'npm:express'
import { corsHeaders } from '../_shared/cors.ts'

const router = express();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(corsHeaders)

let supabase;

router.use(async(request,response,next) => {
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
        response.status(401).send('Failed to authenticate user')
        return
    }

    response.locals.user_id = user.id
    next()
})

router.get('/profiles', async (request, response) => {
    try {
        const result = await supabase.from("profiles").select()

        if (result.error) {
            response.status(result.status).send(result.error)
            return
        }

        if (!result.data){
            response.status(404).send("Profile not found")
            return
        }

        response.status(200).send(result.data)
    } catch (error) {
        response.status(500).send(error)
    }
});

router.put('/profiles', async (request, response) => {
    try {
        const data = request.body
        if (!data || (!data.favourite_driver && !data.favourite_team)) {
            response.status(400).send("Bad request body")
            return
        } 
        let updatedData: {user_id, favourite_driver?, favourite_team?} = {
            user_id: response.locals.user_id,
            favourite_driver: data.favourite_driver,
            favourite_team: data.favourite_team
        }

        const result = await supabase.from("profiles").upsert(updatedData)

        if (result.error) {
            response.status(result.status).send(result.error)
            return
        }
        response.sendStatus(200)
    } catch (error) {
        response.status(500).send(`${error}`) 
    }
})

router.listen(3000, () => {})