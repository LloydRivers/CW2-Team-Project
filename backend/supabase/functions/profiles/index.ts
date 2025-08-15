import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import {createClient} from "npm:@supabase/supabase-js@2";
import express from 'npm:express'

const router = express();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

let supabase;

router.use((request,response,next) => {
    const bearer = request.header("Authorization")
    if (!bearer) return response.status(401).send("Missing Authorization header")

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

router.get('/profiles/user/:id', async (request, response) => {
    try {
        const userId = request.params.id
        const result = await supabase.from("profiles").select()

        if (result.error) {
            response.status(result.status).send(result.error)
        }

        if (!result.data){
            response.sendStatus(404)
        }

        response.status(200).send(result.data)
    } catch (error) {
        response.status(500).send(error)
    }
});

router.put('/profiles/user/:id', async (request, response) => {
    try {
        const userId = request.params.id   
        const data = request.body
        if (!data) response.status(400).send("Missing request body")
        let updatedData: {user_id, favourite_driver?, favourite_team?} = {
            user_id: userId,
            favourite_driver: data.favourite_driver,
            favourite_team: data.favourite_team
        }

        const result = await supabase.from("profiles").upsert(updatedData).eq('user_id', `${userId}`)

        if (result.error) {
            response.status(result.error.status).send(result.error)
        }
        response.sendStatus(200)
    } catch (error) {
        response.status(500).send(`${error}`) 
    }
})

router.listen(3000, () => {})