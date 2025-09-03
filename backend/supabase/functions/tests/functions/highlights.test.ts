import { assertSpyCall, stub } from "@std/testing/mock";
import 'jsr:@std/dotenv/load';
import request from "npm:supertest";
import router from "../../highlights/index.ts";

const YT_API_KEY = Deno.env.get("YT_API_KEY")

function mockFetch (response) {
  const mockedFetch = stub( globalThis, "fetch", () => ( Promise.resolve( 
      new Response( JSON.stringify(response),
        { status: 200, headers: { "Content-Type": "application/json" } }
      ))
  ));
  globalThis.fetch = mockedFetch
  return mockedFetch;
}

Deno.test('Get a highlights video', async () => {
  const mockedFetch = mockFetch({'items': [{'id': {'videoId': "video-id"}}]})

  try {
    await request(router)
    .get("/highlights")
    .expect(200)
    .expect({'embedUrl': `https://www.youtube.com/embed/video-id?autoplay=1&mute=1`})

    assertSpyCall(mockedFetch, 0, {
      args: [`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UC3kxJQ9RfaS5CKeYbbFMi4Q&maxResults=1&&q=Highlights&type=video&key=${YT_API_KEY}`]
    })
  } finally {
    mockedFetch.restore();
  }
})

Deno.test('Sends 404 if no relevant video found', async () => {
  const mockedFetch = mockFetch([])

  try {
    await request(router)
    .get("/highlights")
    .expect(404)
    .expect({'message': 'Could not get a highlights video'})

    assertSpyCall(mockedFetch, 0, {
      args: [`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UC3kxJQ9RfaS5CKeYbbFMi4Q&maxResults=1&&q=Highlights&type=video&key=${YT_API_KEY}`]
    })
  } finally {
    mockedFetch.restore();
  }
})