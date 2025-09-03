import { assertSpyCall, assertSpyCalls, stub } from "@std/testing/mock";
import 'jsr:@std/dotenv/load';
import request from "npm:supertest";
import router from "../../seasons/index.ts";
import error from "../mockResponses/error.json" with { type: "json" };
import season from "../mockResponses/season.json" with { type: "json" };

function mockFetch (response) {
  const mockedFetch = stub( globalThis, "fetch", () => ( Promise.resolve( 
      new Response( JSON.stringify(response),
        { status: 200, headers: { "Content-Type": "application/json" } }
      ))
  ));
  globalThis.fetch = mockedFetch
  return mockedFetch;
}

Deno.test('Get season by year', async () => {
  const mockedFetch = mockFetch(season)

  try {
    await request(router)
    .get("/seasons/2025")
    .expect(200)
    .expect({championship: season.championship, races: season.races})

    assertSpyCall(mockedFetch, 0, {
      args: ['https://f1connectapi.vercel.app/api/2025']
    })
  } finally {
    mockedFetch.restore();
  }
})

Deno.test('Sends 400 if invalid year is used', async () => {
  const mockedFetch = mockFetch([])

  try {
    await request(router)
    .get("/seasons/test")
    .expect(400)
    .expect({'message': 'Invalid year'})

    assertSpyCalls(mockedFetch, 0)
  } finally {
    mockedFetch.restore();
  }
})

Deno.test('Sends the recieved error message if data is not found for the given year', async () => {
  const mockedFetch = mockFetch(error)

  try {
    await request(router)
    .get("/seasons/2025")
    .expect(error.status)
    .expect({'message': error.message})

    assertSpyCall(mockedFetch, 0, {
      args: ['https://f1connectapi.vercel.app/api/2025']
    })
  } finally {
    mockedFetch.restore();
  }
})