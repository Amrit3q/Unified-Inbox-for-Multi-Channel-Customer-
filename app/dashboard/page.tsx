import { PrismaClient } from '@prisma/client'
import { MessageSquare, Clock, User } from 'lucide-react'

const prisma = new PrismaClient();

interface Message {
    id:     string
    sender: string
    content: string
    createdAt: Date
}

async function getMessages(): Promise<Message[]> {
    try{
        const messages = (await prisma.message.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        })) as Message[];
        return messages
    } catch(e){
        console.error("Database fetch failed:", e);
        return [];
    }
}

export default async function Dashboard(){
    const messages = await getMessages();
    return(
        <>
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <header className="py-6 text-center border-b border-indigo-200 mb-8 bg-white shadow-md rounded-lg">
        <h1 className="text-4xl font-extrabold text-indigo-700">
          WhatsApp Webhook Dashboard
        </h1>
        <p className="mt-2 text-xl text-gray-500">
          Viewing {messages.length} messages received via Twilio and stored in PostgreSQL.
        </p>
      </header>

      <div className="max-w-4xl mx-auto">
        {messages.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-xl shadow-lg border border-gray-100">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg text-gray-600 font-medium">
              No messages found yet. Send a message to your Twilio number to see data appear here!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageCard key={message.id} message={message} />
            ))}
          </div>
        )}
      </div>
    </div>
        </>
    )
}

const MessageCard = ({ message }: { message: Message }) => {
  const formattedTime = new Date(message.createdAt).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  
  // Simple formatting for the sender ID (hiding part of the number for display)
  const displaySender = message.sender.replace('whatsapp:', '');
  const maskedSender = displaySender.slice(0, 5) + '...' + displaySender.slice(-4);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-400 hover:shadow-xl transition duration-300">
      <div className="flex items-start justify-between mb-3 border-b pb-2">
        <div className="flex items-center text-sm font-semibold text-gray-700">
          <User className="w-4 h-4 mr-2 text-indigo-500" />
          Sender: <span className="ml-1 text-indigo-600 font-bold">{maskedSender}</span>
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="w-3 h-3 mr-1" />
          {formattedTime}
        </div>
      </div>
      
      <p className="text-lg text-gray-800 leading-relaxed break-words">
        {message.content}
      </p>
    </div>
  );
};