import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import express from 'npm:express'

const router = express();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const baseUrl = "https://f1connectapi.vercel.app/api"

router.get('/teams', async (request, response) => {
  try {
    const result = await fetch(`${baseUrl}/teams`)
    const { teams } = await result.json()

    if (teams === undefined || teams.length < 1) {
      response.status(404).send('No teams found')
      return
    }
    response.status(200).send(teams)
  } catch (error) {
    response.status(500).send(error)
  }
});

router.get('/teams/id/:id', async (request, response) => {
   try {
      const teamId = request.params.id
      const result = await fetch(`${baseUrl}/teams/${teamId}`)
      const { team } = await result.json()

      if (!team) {
          response.status(404).send("No team found for given ID")
          return
      }
      response.status(200).send(team)
    } catch (error) {
      response.status(500).send(error)
    }
});

router.get('/teams/featured', async (request, response) => {
  try {
    const result = await fetch(`${baseUrl}/current/teams`)
    const { teams } = await result.json()

    if (teams === undefined || teams.length < 1) {
      response.status(404).send('No current teams found')
      return
    }

    const index = Math.round(Math.random() * 100) % teams.length
    response.status(200).send(teams[index])
  } catch (error) {
    response.status(500).send(error)
  }
});

router.get('/teams/current', async (request, response) => {
  try {
    const result = await fetch(`${baseUrl}/current/teams`)
    const { teams } = await result.json()

    if (teams === undefined || teams.length < 1) {
        response.status(404).send('No current teams found')
        return
    }
    response.status(200).send(teams)
  } catch (error) {
    response.status(500).send(error)
  }
});

router.listen(3000, () => {})