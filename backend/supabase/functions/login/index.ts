import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import express from 'npm:express'
import {createClient} from "npm:@supabase/supabase-js@2";
import { corsHeaders } from '../_shared/cors.ts'

const router = express();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(corsHeaders)

const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"))

router.post('/login', async (request, response) => {
  try {
    const {email, password} = request.body
    const result = await supabase.auth.signInWithPassword({email, password})

    if (result.error) {
      response.status(result.error.status).send(result.error)
      return
		}

    response.send(result)
  } catch (error) {
    response.status(500).send(error)
  }
});

router.post('/login/signup', async (request, response) => {
  try {
    const {email, password} = request.body
    const result = await supabase.auth.signUp({email, password})
    
    if (result.error) {
      response.status(result.error.status).send(result.error)
			return
		}

    response.send(result)
  } catch (error) {
    response.status(500).send(error)
  }
});

router.listen(3000, () => {})