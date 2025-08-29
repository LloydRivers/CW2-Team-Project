import { assertArrayIncludes, assertEquals, assertExists } from 'jsr:@std/assert@1'
import { afterAll, beforeAll, describe, it } from "jsr:@std/testing/bdd";
import { createClient, SupabaseClient, User } from 'npm:@supabase/supabase-js@2'
import 'jsr:@std/dotenv/load'

const supabaseUrl = Deno.env.get('LOCAL_SUPABASE_URL') ?? ''
const supabaseKey = Deno.env.get('LOCAL_SUPABASE_API_KEY') ?? ''
const serviceRoleKey = Deno.env.get('LOCAL_SUPABASE_SERVICE_ROLE_KEY') ?? '' 

describe('Reviews table', () => {
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

  await adminClient.from('reviews').insert([
    {user_id: user1.id, race_id: 'GrandPrix', review: 'This is a test review'},
    {user_id: user2.id, race_id: 'GrandPrix', review: 'Another user review'}
  ])
})

  it('Allows all users to view reviews', async () => {
    const reviews = await anonymousClient.from('reviews').select()

    assertExists(reviews.data)
    assertArrayIncludes(reviews.data, [
      {user_id: user1.id, race_id: 'GrandPrix', review: 'This is a test review'},
      {user_id: user2.id, race_id: 'GrandPrix', review: 'Another user review'}
    ])
  })

  it('Allows a user to create a review', async () => {
    await authenticatedClient.from('reviews').insert(
      {user_id: user1.id, race_id: 'testRace', review: 'New review'}
    )
    const reviews = await adminClient.from('reviews').select()

    assertExists(reviews.data)
    assertArrayIncludes(reviews.data, [{user_id: user1.id, race_id: 'testRace', review: 'New review'}])
  })

  it('Prevents an unauthorised user from creating a review', async () => {
    const reviewResult = await anonymousClient.from('reviews').insert(
      {user_id: user1.id, race_id: 'newRace', review: 'This review should not be created'}
    )
    const reviews = await adminClient.from('reviews').select()
    const review = reviews.data?.filter(review => review.review === 'This review should not be created')

    assertExists(reviewResult.error)
    assertEquals(review, [])
  })

  it('Prevents a user from creating a review as a different user', async () => {
    const reviewResult = await authenticatedClient.from('reviews').insert(
      {user_id: user2.id, race_id: 'newRace', review: 'This review should not be created'}
    )
    const reviews = await adminClient.from('reviews').select()
    const review = reviews.data?.filter(review => review.review === 'This review should not be created')

    assertExists(reviewResult.error)
    assertEquals(review, [])
  })

  it('Allows a user to edit their own review', async () => {
    await authenticatedClient.from('reviews').insert(
      {user_id: user1.id, race_id: 'race_one', review: 'Old review'}
    )
    const review = await authenticatedClient.from('reviews').upsert(
      {user_id: user1.id, race_id: 'race_one', review: 'edited review'}
    ).eq('user_id', `${user1.id}`)
    const reviews = await adminClient.from('reviews').select()
    const oldReview = reviews.data?.filter(review => review.review === 'Old review')

    assertEquals(oldReview, [])
    assertEquals(review.error, null)
    assertExists(reviews.data)
    assertArrayIncludes(reviews.data, [{user_id: user1.id, race_id: 'race_one', review: 'edited review'}])
  })

  it('Prevents an unauthorised user from editing a review', async () => {
    await adminClient.from('reviews').insert(
      {user_id: user1.id, race_id: 'abc', review: 'Old review'}
    )
    const review = await anonymousClient.from('reviews').upsert(
      {user_id: user1.id, race_id: 'abc', review: 'xyz'}
    ).eq('user_id', `${user1.id}`)

    const reviews = await adminClient.from('reviews').select()
    const editedReview = reviews.data?.filter(review => review.review === 'xyz')

    assertExists(review.error)
    assertEquals(editedReview, [])
    assertArrayIncludes(reviews.data, [{user_id: user1.id, race_id: 'abc', review: 'Old review'}])
  })

  it("Prevents a user from editing another user's review", async () => {
     await adminClient.from('reviews').insert(
      {user_id: user2.id, race_id: 'abc', review: 'Old review'}
    )
    const review = await authenticatedClient.from('reviews').upsert(
      {user_id: user2.id, race_id: 'abc', review: 'xyz'}
    ).eq('user_id', `${user2.id}`)

    const reviews = await adminClient.from('reviews').select()
    const editedReview = reviews.data?.filter(review => review.review === 'xyz')

    assertExists(review.error)
    assertEquals(editedReview, [])
    assertArrayIncludes(reviews.data, [{user_id: user2.id, race_id: 'abc', review: 'Old review'}])
  })

  it('Allows a user to delete their own review', async () => {
    await authenticatedClient.from('reviews').insert(
      {user_id: user1.id, race_id: 'race_one', review: 'delete this review'}
    )
    const review = await authenticatedClient.from('reviews').delete().eq('race_id', 'race_one')
    const reviews = await adminClient.from('reviews').select()
    const deletedReview = reviews.data?.filter(review => review.review === 'delete this review')

    assertEquals(deletedReview, [])
    assertEquals(review.error, null)
  })

  it('Prevents an unauthorised user from deleting a review', async () => {
    await adminClient.from('reviews').insert(
      {user_id: user1.id, race_id: 'race_two', review: 'test review'}
    )
    await anonymousClient.from('reviews').delete().eq('race_id', 'race_two')
    const reviews = await adminClient.from('reviews').select()

    assertArrayIncludes(reviews.data, [{user_id: user1.id, race_id: 'race_two', review: 'test review'}])
  })

  it("Prevents a user from deleting another user's review", async () => {
    await adminClient.from('reviews').insert(
      {user_id: user2.id, race_id: 'race_three', review: 'test review'}
    )
    await authenticatedClient.from('reviews').delete().eq('race_id', 'race_three')
    const reviews = await adminClient.from('reviews').select()

    assertArrayIncludes(reviews.data, [{user_id: user2.id, race_id: 'race_three', review: 'test review'}])
  })

  it("Deleting a user deletes their reviews", async () => {
    const {data: {session}} = await adminClient.auth.signUp({email: "temporaryUser@test.com", password: "DifferentPassword"})
    const userId = session?.user.id
    if (!userId) return 

    await adminClient.from('reviews').insert(
      {user_id: userId, race_id: 'new_race', review: 'abcdefghijklmnop'}
    )

    let reviews = await adminClient.from('reviews').select()
    assertArrayIncludes(reviews.data, [{user_id: userId, race_id: 'new_race', review: 'abcdefghijklmnop'}])

    await adminClient.auth.admin.deleteUser(userId)
    reviews = await adminClient.from('reviews').select()
    const deletedReview = reviews.data?.filter(review => review.user_id === userId)
    assertEquals(deletedReview, [])
  })

  afterAll(async () => {
    await adminClient.auth.admin.deleteUser(user1.id)
    await adminClient.auth.admin.deleteUser(user2.id)
  })
})