import { assertSpyCall, assertSpyCalls, stub, resolvesNext} from "@std/testing/mock";
import 'jsr:@std/dotenv/load';
import request from "npm:supertest";
import router from "../../sessions/index.ts";
import roundError from "../mockResponses/round-error.json" with { type: "json" };
import session from "../mockResponses/session.json" with { type: "json" };
import round from "../mockResponses/round.json" with { type: "json" };

function mockFetch (response) {
  const mockedFetch = stub( globalThis, "fetch", () => ( Promise.resolve( 
      new Response( JSON.stringify(response),
        { status: 200, headers: { "Content-Type": "application/json" } }
      ))
  ));
  globalThis.fetch = mockedFetch
  return mockedFetch;
}

Deno.test('Get most recent session', async () => {
  const mockedFetch = stub( globalThis, "fetch", resolvesNext([
    new Response( JSON.stringify(round),
      { status: 200, headers: { "Content-Type": "application/json" } }
    ),
    new Response( JSON.stringify(session),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  ]));
  globalThis.fetch = mockedFetch

  try {
    await request(router)
    .get("/sessions/latest")
    .expect(200)
    .expect({sessionType: 'race', ...session.races})

    assertSpyCall(mockedFetch, 0, {
      args: ['https://f1connectapi.vercel.app/api/current/last']
    })
    assertSpyCall(mockedFetch, 1, {
      args: ['https://f1connectapi.vercel.app/api/current/last/race']
    })
  } finally {
    mockedFetch.restore();
  }
})

Deno.test('Sends 404 if the last round is not found', async () => {
  const mockedFetch = mockFetch([])

  try {
    await request(router)
    .get("/sessions/latest")
    .expect(404)
    .expect({'message': 'Cannot find most recent round'})

    assertSpyCall(mockedFetch, 0, {
      args: ['https://f1connectapi.vercel.app/api/current/last']
    })
  } finally {
    mockedFetch.restore();
  }
})

Deno.test('Sends 404 if the last round has no recent seession data', async () => {
  const mockedFetch = mockFetch(roundError)

  try {
    await request(router)
    .get("/sessions/latest")
    .expect(404)
    .expect({'message': 'No recent sessions found'})

    assertSpyCall(mockedFetch, 0, {
      args: ['https://f1connectapi.vercel.app/api/current/last']
    })
  } finally {
    mockedFetch.restore();
  }
})

Deno.test('Sends 404 if the latest session could not be fetched', async () => {
  const mockedFetch = stub( globalThis, "fetch", resolvesNext([
    new Response( JSON.stringify(round),
      { status: 200, headers: { "Content-Type": "application/json" } }
    ),
    new Response( JSON.stringify([]),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  ]));
  globalThis.fetch = mockedFetch

  try {
    await request(router)
    .get("/sessions/latest")
    .expect(404)
    .expect({ messsage: 'Could not get data for latest session' })

    assertSpyCall(mockedFetch, 0, {
      args: ['https://f1connectapi.vercel.app/api/current/last']
    })
    assertSpyCall(mockedFetch, 1, {
      args: ['https://f1connectapi.vercel.app/api/current/last/race']
    })
  } finally {
    mockedFetch.restore();
  }
})