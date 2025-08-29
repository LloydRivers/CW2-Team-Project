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
router.use(authorisation)


router.get('/profiles', async (request, response) => {
    try {
        const result = await response.locals.supabase.from("profiles").select()

        if (result.error) {
            response.status(result.status).send(result.error)
            return
        }

        if (!result.data){
            response.status(404).send({'message': "Profile not found"})
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
            response.status(400).send({'message': "Bad request body"})
            return
        } 
        let updatedData: {user_id, favourite_driver?, favourite_team?} = {
            user_id: response.locals.user_id,
            favourite_driver: data.favourite_driver,
            favourite_team: data.favourite_team
        }

        const result = await response.locals.supabase.from("profiles").upsert(updatedData)

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