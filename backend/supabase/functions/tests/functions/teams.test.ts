import { stub, assertSpyCall } from "@std/testing/mock";
import { assertEquals, assertExists, assertInstanceOf } from 'jsr:@std/assert@1'
import 'jsr:@std/dotenv/load'
import request from "npm:supertest"
import router from "../../teams/index.ts"
import teams from "../mockResponses/teams.json" with { type: "json" };
import team from "../mockResponses/team.json" with { type: "json" };

function mockFetch (response) {
  const mockedFetch = stub( globalThis, "fetch", () => ( Promise.resolve( 
      new Response( JSON.stringify(response),
        { status: 200, headers: { "Content-Type": "application/json" } }
      ))
  ));
  globalThis.fetch = mockedFetch
  return mockedFetch;
}

Deno.test('Get all teams', async () => {
  const mockedFetch = mockFetch(teams)

  try {
    await request(router)
    .get("/teams")
    .expect(200)
    .expect(teams.teams)

    assertSpyCall(mockedFetch, 0, {
      args: ['https://f1connectapi.vercel.app/api/teams']
    })
  } finally {
    mockedFetch.restore();
  }
})

Deno.test('Sends 404 if no teams found', async () => {
  const mockedFetch = mockFetch([])

  try {
    await request(router)
    .get("/teams")
    .expect(404)
    .expect({'message': 'No teams found'})

    assertSpyCall(mockedFetch, 0, {
      args: ['https://f1connectapi.vercel.app/api/teams']
    })
  } finally {
    mockedFetch.restore();
  }
})

Deno.test('Get team by ID', async () => {
  const mockedFetch = mockFetch(team)

  try {
  const result = await request(router)
    .get("/teams/id/ferrari")
    .expect(200)

    assertEquals(result.body, team.team)
    assertSpyCall(mockedFetch, 0, {
      args: ['https://f1connectapi.vercel.app/api/teams/ferrari']
    })
  } finally {
    mockedFetch.restore();
  }
})

Deno.test('Sends 404 if no team found for given ID', async () => {
  const mockedFetch = mockFetch([])

  try {
    await request(router)
    .get("/teams/id/test")
    .expect(404)
    .expect({'message': 'No team found for given ID'})

    assertSpyCall(mockedFetch, 0, {
      args: ['https://f1connectapi.vercel.app/api/teams/test']
    })
  } finally {
    mockedFetch.restore();
  }
})

Deno.test('Chooses a featured team', async () => {
  const mockedFetch = mockFetch(teams)

  try {
    const result = await request(router)
    .get("/teams/featured")
    .expect(200)

    assertInstanceOf(result.body, Object)
    assertExists(result.body.teamId)
    assertSpyCall(mockedFetch, 0, {
      args: ['https://f1connectapi.vercel.app/api/current/teams']
    })
  } finally {
    mockedFetch.restore();
  }
})

Deno.test('Sends 404 if no current teams found', async () => {
  const mockedFetch = mockFetch([])

  try {
    await request(router)
    .get("/teams/featured")
    .expect(404)
    .expect({'message': 'No current teams found'})

    assertSpyCall(mockedFetch, 0, {
      args: ['https://f1connectapi.vercel.app/api/current/teams']
    })
  } finally {
    mockedFetch.restore();
  }
})

Deno.test('Get current teams', async () => {
  const mockedFetch = mockFetch(teams)

  try {
    await request(router)
    .get("/teams/current")
    .expect(200)
    .expect(teams.teams)

    assertSpyCall(mockedFetch, 0, {
      args: ['https://f1connectapi.vercel.app/api/current/teams']
    })
  } finally {
    mockedFetch.restore();
  }
})

Deno.test('Sends 404 if no current teams found', async () => {
  const mockedFetch = mockFetch([])

  try {
    await request(router)
    .get("/teams/current")
    .expect(404)
    .expect({'message': 'No current teams found'})

    assertSpyCall(mockedFetch, 0, {
      args: ['https://f1connectapi.vercel.app/api/current/teams']
    })
  } finally {
    mockedFetch.restore();
  }
})