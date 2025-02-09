export const sendMessage = async (messages: any[], threadId?: string) => {
  try {
    const response = await fetch('/api/createMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages, threadId })
    })
    return await response.json()
  } catch (error) {
    console.error(error)
    throw error
  }
}