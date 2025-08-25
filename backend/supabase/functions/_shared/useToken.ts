import {createClient} from "npm:@supabase/supabase-js@2";

export function useToken (request,response,next) {
	const bearer = request.header("Authorization")
	if (!bearer) {
		response.status(401).send("Missing Authorization header")
		return
	}

	response.locals.bearerToken = bearer

	// need to add the Authorization header to make the edge function use the user's JWT token so that the RLS works properly
	response.locals.supabase = createClient( Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"), {
		global: {
			headers: {
				'Authorization': bearer
			}
		}
	})

	next()
}