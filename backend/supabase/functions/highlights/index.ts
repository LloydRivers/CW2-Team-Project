import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import express from 'npm:express'

const router = express();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/highlights', async (request, response) => {
  try {
    const YT_API_KEY = Deno.env.get("YT_API_KEY")

    const result = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UC3kxJQ9RfaS5CKeYbbFMi4Q&maxResults=1&&q=Highlights&type=video&key=${YT_API_KEY}`)
    const data = await result.json()

    const videoId = data.items[0].id.videoId

    if (!videoId) {
      response.status(404).send('Could not get a highlights video')
    }
    response.send({'embedUrl': `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`})
  } catch (error) {
    response.status(500).send(error)
  }
});

router.listen(3000, () => {})