import { NextApiRequest, NextApiResponse } from 'next'

export default async function createMessage(req: NextApiRequest, res: NextApiResponse) {
  const controller = new AbortController()

  const timeoutId = setTimeout(() => controller.abort(), 300000)
  const { messages } = req.body

  const BASE_URL = 'https://server-stemuli.ngrok.io'

  const body = JSON.stringify({ message: messages[messages.length - 1] })

  try {
    const response = await fetch(BASE_URL + '/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body,
      signal: controller.signal
    })
    clearTimeout(timeoutId)
    const data = await response.json()
    res.status(200).json({ data })
  } catch (error) {
    res.status(500).json({ error: 'An unknown error occurred.' })
  }
}
