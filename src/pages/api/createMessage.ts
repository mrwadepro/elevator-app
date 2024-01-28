import OpenAI from 'openai'
import { NextApiRequest, NextApiResponse } from 'next'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is the default and can be omitted
})

class CreateMessage {
  private _threadId: string

  constructor() {
    this._threadId = ''

    this.handleRequest = this.handleRequest.bind(this)
  }

  get threadId(): string {
    return this._threadId
  }

  set threadId(value: string) {
    this._threadId = value
  }

  async handleRequest(req: NextApiRequest, res: NextApiResponse) {
    const { messages } = req.body

    // GET LAST MESSAGE
    const message = messages[messages.length - 1]

    if (!this._threadId) {
      const newThread = await openai.beta.threads.create()
      this._threadId = newThread.id
    }

    try {
      // const threadMessages = await openai.beta.threads.messages.create(this._threadId, {
      //   role: 'user',
      //   content: message
      // })

      await openai.beta.threads.messages.create(this._threadId, {
        role: 'user',
        content: message.content
      })

      const run = await openai.beta.threads.runs.create(this._threadId, {
        assistant_id: 'asst_twExmhlOYQRzMJKYC4DsDNJ7'
      })

      let checkedRun = await openai.beta.threads.runs.retrieve(this._threadId, run.id)

      while (!checkedRun.completed_at && checkedRun.status !== 'failed') {
        checkedRun = await openai.beta.threads.runs.retrieve(this._threadId, run.id)
      }

      const threadList = await openai.beta.threads.messages.list(this._threadId)

      res.status(200).json(threadList)
    } catch (error) {
      res.status(500).json({ error: 'An unknown error occurred.' })
    }
  }
}

export default new CreateMessage().handleRequest
