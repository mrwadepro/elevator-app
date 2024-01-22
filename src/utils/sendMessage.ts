import { ChatCompletionRequestMessage } from 'openai'

export const sendMessage = async (messages: ChatCompletionRequestMessage[]) => {
  try {
    const controller = new AbortController()

    const timeoutId = setTimeout(() => controller.abort(), 300000)

    const response = await fetch('/api/createMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages }),
      signal: controller.signal
    })
    clearTimeout(timeoutId)
    return await response.json()
  } catch (error) {
    console.log(error)
  }
}
