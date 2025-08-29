import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import express from 'npm:express'
import { corsHeaders } from '../_shared/cors.ts'

const router = express();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(corsHeaders)

const baseUrl = "https://f1connectapi.vercel.app/api"

router.get('/sessions/latest', async (request, response) => {
  try {
    const result = await fetch(`${baseUrl}/current/last`)
    const { race: round } = await result.json()

    if (!round) {
      response.status(404).send({'message': 'Cannot find most recent round'})
      return 
    }
    
    let sessions: Array<[string, {date:string, time:string}]> = Object.entries(round[0].schedule) as unknown as Array<[string, {date:string, time:string}]>
    sessions = sessions.filter(session => session[1].date !== null)

    if (sessions.length < 1) {
      response.status(404).send({'message': 'No recent sessions found'})
      return
    }

    const latestSession = sessions.reduce((sessionA, sessionB) => {
      const dateA = new Date(sessionA[1].date + 'T' + sessionA[1].time)
      const dateB = new Date(sessionB[1].date + 'T' + sessionB[1].time)
      return dateA > dateB ? sessionA : sessionB
    })

    const sessionResult = await fetch(`${baseUrl}/current/last/${latestSession[0]}`)
    const { races: session } = await sessionResult.json()

    if (!session) {
      response.status(404).send({'messsage': 'Could not get data for latest session'})
      return
    }

    response.send({'sessionType': latestSession[0], ...session})
  } catch (error) {
    response.status(500).send(error)
  }
});

router.listen(3000, () => {})
