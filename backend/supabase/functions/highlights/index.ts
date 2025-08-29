import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import express from 'npm:express'
import { corsHeaders } from '../_shared/cors.ts'

const router = express();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(corsHeaders)

router.get('/highlights', async (request, response) => {
  try {
    const YT_API_KEY = Deno.env.get("YT_API_KEY")

    const result = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UC3kxJQ9RfaS5CKeYbbFMi4Q&maxResults=1&&q=Highlights&type=video&key=${YT_API_KEY}`)
    const data = await result.json()

    if (!data?.items || !data.items.length || !data.items[0]?.id?.videoId) {
      response.status(404).send({'message': 'Could not get a highlights video'})
      return
    }
    response.send({'embedUrl': `https://www.youtube.com/embed/${data.items[0].id.videoId}?autoplay=1&mute=1`})
  } catch (error) {
    response.status(500).send(error)
  }
});

export default router.listen(3000, () => {})