import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import express from 'npm:express'

const router = express();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/health', async (request, response) => {
  response.sendStatus(200)
});

router.listen(3000, () => {})