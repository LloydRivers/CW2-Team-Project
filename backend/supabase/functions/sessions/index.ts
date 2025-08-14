import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import express from 'npm:express'

const router = express();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const baseUrl = "https://f1connectapi.vercel.app/api"

router.get('/sessions/latest', async (request, response) => {
  try {
    let sessionPromises: Array<Promise<{ name: string; session: any; }>> = [];
    let sessionNames = [ "fp1", "fp2", "fp3", "qualy", "race", "sprint/qualy", "sprint/race" ]

    sessionNames.forEach(name => {
      let data = fetch(`${baseUrl}/current/last/${name}`).then(async result => {
        let session = await result.json()
        return {name, session}
      })
      sessionPromises.push(data)
    })

    let sessions =  await Promise.all(sessionPromises)
    sessions = sessions.filter(result => result.session.status !== 404) // remove sessions that haven't occured yet
  
    // sessions array contains the most recent event for each type of session 
    let latest = sessions.reduce((sessionA, sessionB) => { // find which out of the sessions in the array was most recent

      let [dateA, dateB] = [sessionA, sessionB].map(({ name, session }) => {
        // the fields from the API have a different name for some of the session types
        let changeField = ["race", "sprint/qualy", "sprint/race"].includes(name)
        return new Date(session.races[changeField ? "time" :`${name}Time`] + session.races[changeField ? "date" :`${name}Date`])
      }) 

      if (isNaN(dateA.getTime())) return sessionB
      if (isNaN(dateB.getTime())) return sessionA
      return ( dateA > dateB ? sessionA : sessionB ) 
    })

    if (!latest) response.sendStatus(404)
    response.send(latest.session.races)
  } catch (error) {
    response.status(500).send(error)
  }
});

router.listen(3000, () => {})
