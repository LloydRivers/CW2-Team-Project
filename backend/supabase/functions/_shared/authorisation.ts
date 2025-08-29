export async function authorisation (request, response, next) {
	try {
		const [,token] = response.locals.bearerToken.split(" ")
		if (!token) {
			response.status(401).send({'message': 'Invalid JWT token'})
			return
		}

		const { data: {user} } = await response.locals.supabase.auth.getUser(token)
		if (!user) {
			response.status(401).send({'message': 'Failed to authenticate user'})
			return
		}
	
		response.locals.user_id = user.id
		next()
	} catch(error) {
		response.status(500).send(error)
	}
}