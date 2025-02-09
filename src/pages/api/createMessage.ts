import { NextApiRequest, NextApiResponse } from 'next'

class CreateMessage {
  private static instance: CreateMessage;
  private _threadId: string;
  private baseUrl = 'https://api.openai.com/v1';
  private headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    'OpenAI-Beta': 'assistants=v2'
  };

  private constructor() {
    this._threadId = '';
    this.handleRequest = this.handleRequest.bind(this);
  }

  public static getInstance(): CreateMessage {
    if (!CreateMessage.instance) {
      CreateMessage.instance = new CreateMessage();
    }
    return CreateMessage.instance;
  }

  get threadId(): string {
    return this._threadId;
  }

  set threadId(value: string) {
    this._threadId = value;
  }

  private async createThread() {
    const response = await fetch(`${this.baseUrl}/threads`, {
      method: 'POST',
      headers: this.headers
    });

    if (!response.ok) {
      throw new Error(`Failed to create thread: ${response.statusText}`);
    }

    const data = await response.json();
    return data.id;
  }

  private async addMessageToThread(threadId: string, content: string) {
    const response = await fetch(`${this.baseUrl}/threads/${threadId}/messages`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        role: 'user',
        content: content
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to add message: ${response.statusText}`);
    }

    return await response.json();
  }

  private async createRun(threadId: string, assistantId: string) {
    const response = await fetch(`${this.baseUrl}/threads/${threadId}/runs`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        assistant_id: assistantId
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to create run: ${response.statusText}`);
    }

    return await response.json();
  }

  private async checkRunStatus(threadId: string, runId: string) {
    const response = await fetch(`${this.baseUrl}/threads/${threadId}/runs/${runId}`, {
      headers: this.headers
    });

    if (!response.ok) {
      throw new Error(`Failed to check run status: ${response.statusText}`);
    }

    return await response.json();
  }

  private async listMessages(threadId: string) {
    const response = await fetch(`${this.baseUrl}/threads/${threadId}/messages`, {
      headers: this.headers
    });

    if (!response.ok) {
      throw new Error(`Failed to list messages: ${response.statusText}`);
    }

    return await response.json();
  }

  async handleRequest(req: NextApiRequest, res: NextApiResponse) {
    const { messages, threadId } = req.body;
    const message = messages[messages.length - 1];
    const assistantId = 'asst_iZFhoJRH3Ixu0s1Otde6rajy'; // Your assistant ID

    try {
      // Use provided threadId or create new thread
      if (threadId) {
        this._threadId = threadId;
      } else if (!this._threadId) {
        this._threadId = await this.createThread();
      }

      // Add message to thread
      await this.addMessageToThread(this._threadId, message.content);

      // Create and monitor run
      const run = await this.createRun(this._threadId, assistantId);
      let runStatus = await this.checkRunStatus(this._threadId, run.id);

      // Poll for completion
      while (!runStatus.completed_at && runStatus.status !== 'failed') {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between checks
        runStatus = await this.checkRunStatus(this._threadId, run.id);
      }

      if (runStatus.status === 'failed') {
        throw new Error('Run failed');
      }

      // Get thread messages
      const threadMessages = await this.listMessages(this._threadId);
      res.status(200).json({
        messages: threadMessages,
        threadId: this._threadId
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
        error: 'An error occurred',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export default CreateMessage.getInstance().handleRequest;