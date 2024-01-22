import { NextApiRequest, NextApiResponse } from 'next'

export const maxDuration = 5000 // This function can run for a maximum of 5 seconds

export default async function createMessage(req: NextApiRequest, res: NextApiResponse) {
  const { messages } = req.body

  const BASE_URL = 'https://server-stemuli.ngrok.io'

  const body = JSON.stringify({ message: messages[messages.length - 1] })

  try {
    const response = await fetch(BASE_URL + '/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    })

    const data = await response.json()
    res.status(200).json({ data })
  } catch (error) {
    res.status(500).json({ error: 'An unknown error occurred.' })
  }
}
