import { assertArrayIncludes, assertEquals, assertExists } from 'jsr:@std/assert@1'
import { afterAll, afterEach, beforeAll, describe, it } from "jsr:@std/testing/bdd";
import { createClient, SupabaseClient, User } from 'npm:@supabase/supabase-js@2'
import 'jsr:@std/dotenv/load'

const supabaseUrl = Deno.env.get('LOCAL_SUPABASE_URL') ?? ''
const supabaseKey = Deno.env.get('LOCAL_SUPABASE_API_KEY') ?? ''
const serviceRoleKey = Deno.env.get('LOCAL_SUPABASE_SERVICE_ROLE_KEY') ?? '' 

describe('Profiles table', () => {
  let anonymousClient: SupabaseClient;
  let authenticatedClient: SupabaseClient;
  let adminClient: SupabaseClient;
  let user1: User;
  let user2: User;

  beforeAll( async () => {
    anonymousClient = createClient(supabaseUrl, supabaseKey, { auth: { 
      autoRefreshToken: false, 
      persistSession: false, 
      detectSessionInUrl: false 
    }})

    adminClient = createClient(supabaseUrl, serviceRoleKey,{ 
    global: {
			headers: {
				'Authorization': `Bearer ${serviceRoleKey}`
			}
		},
     auth: { 
      autoRefreshToken: false, 
      persistSession: false, 
      detectSessionInUrl: false 
    }})

    const {data: data1} = await adminClient.auth.signUp({email: "email@test.co.uk", password: "Password"})
    const {data: data2} = await adminClient.auth.signUp({email: "new-email@test.com", password: "abcdefg"})

    if (!data1.user || !data2.user) return
    user1 = data1.user
    user2 = data2.user

    authenticatedClient = createClient(supabaseUrl, supabaseKey, { 
    global: {
			headers: {
				'Authorization': `Bearer ${data1.session?.access_token}`
			}
		},
    auth: {
      autoRefreshToken: false, 
      persistSession: false, 
      detectSessionInUrl: false 
  }})
})

  it('Only allows a users to retrieve their own profile data', async () => {
    await adminClient.from('profiles').insert([
      {user_id: user1.id, favourite_driver: 'John Doe', favourite_team: "Ferrari"},
      {user_id: user2.id, favourite_driver: 'Jane Doe', favourite_team: "Ferrari"}
    ])

    const profile = await authenticatedClient.from('profiles').select()

    assertExists(profile.data)
    assertEquals(profile.data, [{user_id: user1.id, favourite_driver: 'John Doe', favourite_team: "Ferrari"}])
  })

  it('Allows a user to create a profile', async () => {
    await authenticatedClient.from('profiles').insert(
       {user_id: user1.id, favourite_driver: 'John Doe', favourite_team: "Ferrari"},
    )
    const profile = await adminClient.from('profiles').select()

    assertExists(profile.data)
    assertArrayIncludes(profile.data, [{user_id: user1.id, favourite_driver: 'John Doe', favourite_team: "Ferrari"}])
  })

  it('Prevents an unauthorised user from creating a profile', async () => {
    const profileResult = await anonymousClient.from('profiles').insert(
      {user_id: user1.id, favourite_driver: 'John Doe', favourite_team: "Ferrari"}
    )
    const profile = await adminClient.from('profiles').select()

    assertExists(profileResult.error)
    assertEquals(profile.data, [])
  })

  it('Prevents a user from creating a profile for a different user', async () => {
    const profileResult = await authenticatedClient.from('profiles').insert(
      {user_id: user2.id, favourite_driver: 'John Doe', favourite_team: "Ferrari"}
    )
    const profile = await adminClient.from('profiles').select()

    assertExists(profileResult.error)
    assertEquals(profile.data, [])
  })

  it('Allows a user to update their favourites', async () => {
    await authenticatedClient.from('profiles').insert(
      {user_id: user1.id, favourite_driver: 'John Doe', favourite_team: "Ferrari"}
    )
    const profile = await authenticatedClient.from('profiles').upsert(
      {user_id: user1.id, favourite_driver: 'Jane Doe', favourite_team: "team 1"}
    ).eq('user_id', `${user1.id}`)
    const profiles = await adminClient.from('profiles').select()
    const oldProfile = profiles.data?.filter(profile => profile.favourite_driver === "John Doe")

    assertEquals(oldProfile, [])
    assertEquals(profile.error, null)
    assertExists(profiles.data)
    assertArrayIncludes(profiles.data, [{user_id: user1.id, favourite_driver: 'Jane Doe', favourite_team: "team 1"}])
  })

  it('Prevents an unauthorised user from editing profiles', async () => {
    await adminClient.from('profiles').insert(
      {user_id: user2.id, favourite_driver: 'John Doe', favourite_team: "Ferrari"}
    )
    const profile = await anonymousClient.from('profiles').upsert(
       {user_id: user2.id, favourite_driver: 'edited', favourite_team: "Ferrari"}
    ).eq('user_id', `${user1.id}`)

    const profiles = await adminClient.from('profiles').select()
    const editedProfile = profiles.data?.filter(profile => profile.favourite_driver === "edited")

    assertExists(profile.error)
    assertEquals(editedProfile, [])
    assertArrayIncludes(profiles.data, [{user_id: user2.id, favourite_driver: 'John Doe', favourite_team: "Ferrari"}])
  })

  it("Prevents a user from editing another user's profile", async () => {
    await adminClient.from('profiles').insert(
      {user_id: user2.id, favourite_driver: 'John Doe', favourite_team: "Ferrari"}
    )
    const profile = await authenticatedClient.from('profiles').upsert(
      {user_id: user2.id, favourite_driver: 'edited', favourite_team: "Ferrari"}
    ).eq('user_id', `${user2.id}`)

    const profiles = await adminClient.from('profiles').select()
    const editedProfile = profiles.data?.filter(profile => profile.favourite_driver === "edited")

    assertEquals(editedProfile, [])
    assertArrayIncludes(profiles.data, [{user_id: user2.id, favourite_driver: 'John Doe', favourite_team: "Ferrari"}])
  })

  it('Prevents an unauthorised user from deleting a profile', async () => {
    await adminClient.from('profiles').insert(
      {user_id: user2.id, favourite_driver: 'John Doe', favourite_team: "Ferrari"}
    )
    await anonymousClient.from('profiles').delete().eq('favourite_driver', 'John Doe')
    const profiles = await adminClient.from('profiles').select()
    
    assertArrayIncludes(profiles.data, [{user_id: user2.id, favourite_driver: 'John Doe', favourite_team: "Ferrari"}])
  })

  it("Prevents a user from deleting another user's profile", async () => {
    await adminClient.from('profiles').insert(
      {user_id: user2.id, favourite_driver: 'John Doe', favourite_team: "Ferrari"}
    )
    await authenticatedClient.from('profiles').delete().eq('favourite_driver', 'John Doe')
    const profiles = await adminClient.from('profiles').select()
    
    assertArrayIncludes(profiles.data, [{user_id: user2.id, favourite_driver: 'John Doe', favourite_team: "Ferrari"}])
  })

  it("Deleting a user deletes their profile", async () => {
    const {data: {session}} = await adminClient.auth.signUp({email: "otherUser@test.com", password: "DifferentPassword"})
    const userId = session?.user.id
    if (!userId) return 

    await adminClient.from('profiles').insert(
      {user_id: userId, favourite_driver: 'John Doe', favourite_team: "Ferrari"}
    )

    let profile = await adminClient.from('profiles').select()
    assertArrayIncludes(profile.data, [{user_id: userId, favourite_driver: 'John Doe', favourite_team: "Ferrari"}])

    await adminClient.auth.admin.deleteUser(userId)
    profile = await adminClient.from('profiles').select()
    const deletedProfile = profile.data?.filter(profile => profile.user_id === userId)
    assertEquals(deletedProfile, [])
  })

  afterEach(async () => {
    await adminClient.from('profiles').delete().not('user_id', 'is', null)
  })

  afterAll(async () => {
    await adminClient.auth.admin.deleteUser(user1.id)
    await adminClient.auth.admin.deleteUser(user2.id)
  })
})