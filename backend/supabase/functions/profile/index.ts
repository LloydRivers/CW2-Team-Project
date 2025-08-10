import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import {createClient} from "npm:@supabase/supabase-js@2";
import express from 'npm:express'

const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
const router = express();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/profile', async (request, response) => {
  try {
        const bearer = request.header("Authorization") 
        if (!bearer) return response.status(401).send("Missing Authorization header")
        const [,token] = bearer.split(" ")
        if(!token) return response.sendStatus(401)

        const {data: claims} = await supabase.auth.getClaims(token) // verify JWT
        if (!claims) return response.sendStatus(401)
        
        const {data: { user }} = await supabase.auth.getUser(token) // check authorisation
        if (!user) return response.sendStatus(403)

        const result = await supabase.from("profiles").select().eq("id", `${user.id}`) 
        
        if (result.error) {
            response.status(result.status).send(result.error)
        }
        response.status(200).send(result.data)
    } catch (error) {
        response.status(500).send(error)
    }
});

router.listen(3000, () => {})