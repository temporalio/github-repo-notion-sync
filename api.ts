import { serve } from 'https://deno.land/std@0.140.0/http/server.ts'
import { syncGithubToNotion } from './sync.ts'

serve(async (req) => {
  const token = Deno.env.get('AUTH_TOKEN')
  if (token && req.url.includes(token)) {
    await syncGithubToNotion()

    return new Response('Hello World!' + req.url + JSON.stringify(req.body), {
      headers: { 'content-type': 'text/plain' },
    })
  }

  return new Response('Unauthorized', {
    status: 401,
    headers: { 'content-type': 'text/plain' },
  })
})
