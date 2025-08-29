import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import express from 'npm:express'
import { corsHeaders } from '../_shared/cors.ts'

const router = express();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(corsHeaders)

router.get('/health', (request, response) => {
  response.sendStatus(200)
});

router.listen(3000, () => {})