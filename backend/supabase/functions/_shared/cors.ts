export async function corsHeaders (request,response,next) {
    response.set( 'Access-Control-Allow-Origin', '*')
    response.set('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type')
   
    if (request.method === 'OPTIONS') { 
        response.status(200).send({ headers: corsHeaders })  
        return
    }  

    response.set('Content-Type', 'application/json')
    next()
}