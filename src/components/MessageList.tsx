import { useMessages } from 'utils/useMessages'
import ReactMarkdown from 'react-markdown'

const MessagesList = () => {
  const { messages, isLoadingAnswer } = useMessages()

  const cleanMessage = (content:any) => {
    if (!content) return ''
    return content.replace(/\\n/g, '\n').replace(/\\"/g, '"')
  }

  const renderMessage = (message:any, isUser:any) => {
    if (!message?.content) {
      return <div className="text-gray-500">No message content available</div>
    }

    return (
      <ReactMarkdown
        className={`prose ${isUser ? 'text-white prose-headings:text-white prose-strong:text-white prose-a:text-white' : 'dark:prose-invert'} max-w-none`}
      >
        {cleanMessage(message.content)}
      </ReactMarkdown>
    )
  }

  return (
    <div className="max-w-3xl mx-auto pt-8">
      {messages?.map((message, i) => {
        const isUser = message.role === 'user'
        if (message.role === 'system') return null

        return (
          <div
            id={`message-${i}`}
            className={`flex mb-4 fade-up ${isUser ? 'justify-end' : 'justify-start'} ${
              i === 1 ? 'max-w-md' : ''
            }`}
            key={i}
          >
            {!isUser && (
              <img
                src="https://www.teamsmart.ai/next-assets/team/ai.jpg"
                className="w-9 h-9 rounded-full"
                alt="AI avatar"
              />
            )}
            <div
              style={{ maxWidth: 'calc(100% - 45px)' }}
              className={`group relative px-3 py-2 rounded-lg ${
                isUser
                  ? 'mr-2 bg-indigo-600 text-white'
                  : 'ml-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200'
              }`}
            >
              {renderMessage(message, isUser)}
            </div>
            {isUser && (
              <img
                src="https://www.teamsmart.ai/next-assets/profile-image.png"
                className="w-9 h-9 rounded-full cursor-pointer"
                alt="User avatar"
              />
            )}
          </div>
        )
      })}
      {isLoadingAnswer && (
        <div className="flex justify-start mb-4">
          <img
            src="https://www.teamsmart.ai/next-assets/team/ai.jpg"
            className="w-9 h-9 rounded-full"
            alt="AI avatar"
          />
          <div className="loader ml-2 p-2.5 px-4 bg-gray-200 dark:bg-gray-800 rounded-full space-x-1.5 flex justify-between items-center relative">
            <span className="block w-3 h-3 rounded-full"></span>
            <span className="block w-3 h-3 rounded-full"></span>
            <span className="block w-3 h-3 rounded-full"></span>
          </div>
        </div>
      )}
    </div>
  )
}

export default MessagesList