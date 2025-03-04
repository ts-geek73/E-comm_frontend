import { WebhookEvent } from '@clerk/nextjs/server'

export async function POST(request: Request) {
  try {
    const payload: WebhookEvent = await request.json()
    console.log(payload)

    // process the event

    // everything went well
    return Response.json({ message: 'Received' })
  } catch (e) {
    console.log(e);
    
    return Response.error()
  }
}