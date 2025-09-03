import { assertArrayIncludes, assertEquals, assertExists } from 'jsr:@std/assert@1'
import { afterAll, beforeAll, describe, it } from "jsr:@std/testing/bdd";
import { createClient, SupabaseClient, User } from 'npm:@supabase/supabase-js@2'
import 'jsr:@std/dotenv/load'

const supabaseUrl = Deno.env.get('LOCAL_SUPABASE_URL') ?? ''
const supabaseKey = Deno.env.get('LOCAL_SUPABASE_API_KEY') ?? ''
const serviceRoleKey = Deno.env.get('LOCAL_SUPABASE_SERVICE_ROLE_KEY') ?? '' 

describe('Driver ratings table', () => {
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

  await adminClient.from('driver-ratings').insert([
    {user_id: user1.id, race_id: 'GrandPrix', driver_id: "JohnDoe", rating: 1},
    {user_id: user2.id, race_id: 'GrandPrix', driver_id: "JohnDoe", rating: 1}
  ])
})

  it('Allows all users to view driver ratings', async () => {
    const ratings = await anonymousClient.from('driver-ratings').select()

    assertExists(ratings.data)
    assertArrayIncludes(ratings.data, [
      {user_id: user1.id, race_id: 'GrandPrix', driver_id: "JohnDoe", rating: 1},
      {user_id: user2.id, race_id: 'GrandPrix', driver_id: "JohnDoe", rating: 1}
    ])
  })

  it('Allows a user to create a driver rating', async () => {
    await authenticatedClient.from('driver-ratings').insert(
      {user_id: user1.id, race_id: 'testRace', driver_id: "JohnDoe", rating: 2}
    )
    const ratings = await adminClient.from('driver-ratings').select()

    assertExists(ratings.data)
    assertArrayIncludes(ratings.data, [{user_id: user1.id, race_id: 'testRace', driver_id: "JohnDoe", rating: 2}])
  })

  it('Prevents an unauthorised user from creating a driver rating', async () => {
    const ratingResult = await anonymousClient.from('driver-ratings').insert(
      {user_id: user1.id, race_id: 'newRace', driver_id: "JohnDoe", rating: 3}
    )
    const ratings = await adminClient.from('driver-ratings').select()
    const rating = ratings.data?.filter(rating => rating.race_id === 'newRace')

    assertExists(ratingResult.error)
    assertEquals(rating, [])
  })

  it('Prevents a user from creating a driver rating as a different user', async () => {
    const ratingResult = await authenticatedClient.from('driver-ratings').insert(
      {user_id: user2.id, race_id: 'newRace', driver_id: "JohnDoe", rating: 4}
    )
    const ratings = await adminClient.from('driver-ratings').select()
    const rating = ratings.data?.filter(rating => rating.race_id === "newRace")

    assertExists(ratingResult.error)
    assertEquals(rating, [])
  })

  it('Allows a user to edit their own driver rating', async () => {
    await authenticatedClient.from('driver-ratings').insert(
      {user_id: user1.id, race_id: 'race_one', driver_id: "JohnDoe", rating:5}
    )
    const rating = await authenticatedClient.from('driver-ratings').upsert(
      {user_id: user1.id, race_id: 'race_one', driver_id: "JohnDoe", rating: 6}
    ).eq('user_id', `${user1.id}`)
    const ratings = await adminClient.from('driver-ratings').select()
    const oldRating = ratings.data?.filter(rating => rating.rating === 5)

    assertEquals(oldRating, [])
    assertEquals(rating.error, null)
    assertExists(ratings.data)
    assertArrayIncludes(ratings.data, [{user_id: user1.id, race_id: 'race_one', driver_id: "JohnDoe", rating: 6}])
  })

  it('Prevents an unauthorised user from editing a rating', async () => {
    await adminClient.from('driver-ratings').insert(
      {user_id: user1.id, race_id: 'abc', driver_id: "JohnDoe", rating: 7}
    )
    const rating = await anonymousClient.from('driver-ratings').upsert(
      {user_id: user1.id, race_id: 'abc', driver_id: "JohnDoe", rating: 8}
    ).eq('user_id', `${user1.id}`)

    const ratings = await adminClient.from('driver-ratings').select()
    const editedRating = ratings.data?.filter(rating => rating.rating === 8)

    assertExists(rating.error)
    assertEquals(editedRating, [])
    assertArrayIncludes(ratings.data, [{user_id: user1.id, race_id: 'abc', driver_id: "JohnDoe", rating: 7}])
  })

  it("Prevents a user from editing another user's rating", async () => {
     await adminClient.from('driver-ratings').insert(
      {user_id: user2.id, race_id: 'abc', driver_id: "JohnDoe", rating: 9}
    )
    const rating = await authenticatedClient.from('driver-ratings').upsert(
      {user_id: user2.id, race_id: 'abc', driver_id: "JohnDoe", rating: 10}
    ).eq('user_id', `${user2.id}`)

    const ratings = await adminClient.from('driver-ratings').select()
    const editedRating = ratings.data?.filter(rating => rating.rating === 10)

    assertExists(rating.error)
    assertEquals(editedRating, [])
    assertArrayIncludes(ratings.data, [{user_id: user2.id, race_id: 'abc', driver_id: "JohnDoe", rating: 9}])
  })

  it('Allows a user to delete their own rating', async () => {
    await authenticatedClient.from('driver-ratings').insert(
      {user_id: user1.id, race_id: 'toBeDeleted', driver_id: "JohnDoe", rating: 11}
    )
    const rating = await authenticatedClient.from('driver-ratings').delete().eq('race_id', 'toBeDeleted')
    const ratings = await adminClient.from('driver-ratings').select()
    const deletedRating = ratings.data?.filter(rating => rating.race_id === "tobeDeleted")

    assertEquals(deletedRating, [])
    assertEquals(rating.error, null)
  })

  it('Prevents an unauthorised user from deleting a rating', async () => {
    await adminClient.from('driver-ratings').insert(
      {user_id: user1.id, race_id: 'race_two', driver_id: "JohnDoe", rating: 12}
    )
    await anonymousClient.from('driver-ratings').delete().eq('race_id', 'race_two')
    const ratings = await adminClient.from('driver-ratings').select()

    assertArrayIncludes(ratings.data, [{user_id: user1.id, race_id: 'race_two', driver_id: "JohnDoe", rating: 12}])
  })

  it("Prevents a user from deleting another user's rating", async () => {
    await adminClient.from('driver-ratings').insert(
      {user_id: user2.id, race_id: 'race_three', driver_id: "JohnDoe", rating: 13}
    )
    await authenticatedClient.from('driver-ratings').delete().eq('race_id', 'race_three')
    const ratings = await adminClient.from('driver-ratings').select()

    assertArrayIncludes(ratings.data, [{user_id: user2.id, race_id: 'race_three', driver_id: "JohnDoe", rating: 13}])
  })

  it("Deleting a user deletes their driver ratings", async () => {
    const {data: {session}} = await adminClient.auth.signUp({email: "user_1@test.com", password: "DifferentPassword"})
    const userId = session?.user.id
    if (!userId) return 

    await adminClient.from('driver-ratings').insert(
      {user_id: userId, race_id: 'new_race', driver_id: "JohnDoe", rating: 14}
    )

    let ratings = await adminClient.from('driver-ratings').select()
    assertArrayIncludes(ratings.data, [{user_id: userId, race_id: 'new_race', driver_id: "JohnDoe", rating: 14}])

    await adminClient.auth.admin.deleteUser(userId)
    ratings = await adminClient.from('driver-ratings').select()
    const deletedRating = ratings.data?.filter(rating => rating.user_id === userId)
    assertEquals(deletedRating, [])
  })

  afterAll(async () => {
    await adminClient.auth.admin.deleteUser(user1.id)
    await adminClient.auth.admin.deleteUser(user2.id)
  })
})