import { useToast } from '@apideck/components'
import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { sendMessage } from './sendMessage'

interface ContextProps {
  messages: any[]
  addMessage: (content: string) => Promise<void>
  isLoadingAnswer: boolean
}

const ChatsContext = createContext<Partial<ContextProps>>({})

export function MessagesProvider({ children }: { children: ReactNode }) {
  const { addToast } = useToast()
  const [messages, setMessages] = useState<any[]>([])
  const [threadId, setThreadId] = useState<string>('')
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false)

  useEffect(() => {
    const initializeChat = () => {
      const welcomeMessage: any = {
        role: 'assistant',
        content: 'Today having its ups and downs?'
      }
      setMessages([welcomeMessage])
    }

    if (!messages?.length) {
      initializeChat()
    }
  }, [messages?.length])

  const addMessage = async (content: string) => {
    setIsLoadingAnswer(true)
    try {
      const newMessage: any = {
        role: 'user',
        content
      }
      const newMessages = [...messages, newMessage]
      setMessages(newMessages)

      const response = await sendMessage(newMessages, threadId)

      if (response.threadId) {
        setThreadId(response.threadId)
      }

      const reply = {
        role: 'assistant',
        content: response.messages.data[0].content[0].text.value
      }

      setMessages([...newMessages, reply])
    } catch (error) {
      addToast({ title: 'An error occurred', type: 'error' })
    } finally {
      setIsLoadingAnswer(false)
    }
  }

  return (
    <ChatsContext.Provider value={{ messages, addMessage, isLoadingAnswer }}>
      {children}
    </ChatsContext.Provider>
  )
}

export const useMessages = () => {
  return useContext(ChatsContext) as ContextProps
}