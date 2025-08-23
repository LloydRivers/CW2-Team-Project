import { stub, assertSpyCall } from "@std/testing/mock";
import { assertEquals, assertExists, assertInstanceOf } from 'jsr:@std/assert@1'
import 'jsr:@std/dotenv/load'
import request from "npm:supertest"
import router from "../drivers/index.ts"
import drivers from "./mockResponses/drivers.json" with { type: "json" };
import driver from "./mockResponses/driver.json" with { type: "json" };

function mockFetch (response) {
  const mockedFetch = stub( globalThis, "fetch", () => ( Promise.resolve( 
      new Response( JSON.stringify(response),
        { status: 200, headers: { "Content-Type": "application/json" } }
      ))
  ));
  globalThis.fetch = mockedFetch
  return mockedFetch;
}

Deno.test('Get all drivers', async () => {
  const mockedFetch = mockFetch(drivers)

  try {
    await request(router)
    .get("/drivers")
    .expect(200)
    .expect(drivers.drivers)

    assertSpyCall(mockedFetch, 0, {
      args: ['https://f1connectapi.vercel.app/api/drivers']
    })
  } finally {
    mockedFetch.restore();
  }
})

Deno.test('Get driver by name', async () => {
  const mockedFetch = mockFetch(drivers)

  try {
    await request(router)
    .get("/drivers?name=test")
    .expect(200)
    .expect(drivers.drivers)

    assertSpyCall(mockedFetch, 0, {
      args: ['https://f1connectapi.vercel.app/api/drivers/search?q=test']
    })
  } finally {
    mockedFetch.restore();
  }
})

Deno.test('Handles multiple names entered', async () => {
  const mockedFetch = mockFetch(drivers)

  try {
    await request(router)
    .get("/drivers?name=multiple+words")
    .expect(200)
    .expect(drivers.drivers)

    assertSpyCall(mockedFetch, 0, {
      args: ['https://f1connectapi.vercel.app/api/drivers/search?q=multiple']
    })
  } finally {
    mockedFetch.restore();
  }
})

Deno.test('Sends 404 if no drivers found', async () => {
  const mockedFetch = mockFetch([])

  try {
    await request(router)
    .get("/drivers")
    .expect(404)
    .expect('No drivers found')

    assertSpyCall(mockedFetch, 0, {
      args: ['https://f1connectapi.vercel.app/api/drivers']
    })
  } finally {
    mockedFetch.restore();
  }
})

Deno.test('Chooses a featured driver', async () => {
  const mockedFetch = mockFetch(drivers)

  try {
    const result = await request(router)
    .get("/drivers/featured")
    .expect(200)

    assertInstanceOf(result.body, Object)
    assertExists(result.body.driverId)
    assertSpyCall(mockedFetch, 0, {
      args: ['https://f1connectapi.vercel.app/api/current/drivers']
    })
  } finally {
    mockedFetch.restore();
  }
})

Deno.test('Sends 404 if no current drivers found', async () => {
  const mockedFetch = mockFetch([])

  try {
    await request(router)
    .get("/drivers/featured")
    .expect(404)
    .expect('No current drivers found')

    assertSpyCall(mockedFetch, 0, {
      args: ['https://f1connectapi.vercel.app/api/current/drivers']
    })
  } finally {
    mockedFetch.restore();
  }
})

Deno.test('Get current drivers', async () => {
  const mockedFetch = mockFetch(drivers)

  try {
    await request(router)
    .get("/drivers/current")
    .expect(200)
    .expect(drivers.drivers)

    assertSpyCall(mockedFetch, 0, {
      args: ['https://f1connectapi.vercel.app/api/current/drivers']
    })
  } finally {
    mockedFetch.restore();
  }
})

Deno.test('Sends 404 if no current drivers found', async () => {
  const mockedFetch = mockFetch([])

  try {
    await request(router)
    .get("/drivers/current")
    .expect(404)
    .expect('No current drivers found')

    assertSpyCall(mockedFetch, 0, {
      args: ['https://f1connectapi.vercel.app/api/current/drivers']
    })
  } finally {
    mockedFetch.restore();
  }
})

Deno.test('Get driver by ID', async () => {
  const mockedFetch = mockFetch(driver)

  try {
  const result = await request(router)
    .get("/drivers/id/Cannoc")
    .expect(200)

    assertEquals(result.body, driver.driver)
    assertSpyCall(mockedFetch, 0, {
      args: ['https://f1connectapi.vercel.app/api/drivers/Cannoc']
    })
  } finally {
    mockedFetch.restore();
  }
})

Deno.test('Sends 404 if no driver found for given ID', async () => {
  const mockedFetch = mockFetch([])

  try {
    await request(router)
    .get("/drivers/id/test")
    .expect(404)
    .expect('Driver not found')

    assertSpyCall(mockedFetch, 0, {
      args: ['https://f1connectapi.vercel.app/api/drivers/test']
    })
  } finally {
    mockedFetch.restore();
  }
})