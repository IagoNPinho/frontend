"use client"

import { useState } from "react"
import { ConversationList, type Conversation } from "@/components/conversation-list"
import { ChatArea, type Message } from "@/components/chat-area"
import { EmptyChat } from "@/components/empty-chat"

// Dados de exemplo - prontos para substituir por dados da API REST
const mockConversations: Conversation[] = [
  {
    id: "1",
    contactName: "Maria Silva",
    lastMessage: "Olá, gostaria de agendar uma consulta",
    timestamp: "10:30",
    unread: true,
    aiEnabled: true,
  },
  {
    id: "2",
    contactName: "João Santos",
    lastMessage: "Qual o valor da avaliação?",
    timestamp: "09:45",
    unread: true,
    aiEnabled: false,
  },
  {
    id: "3",
    contactName: "Ana Costa",
    lastMessage: "Obrigada pelo atendimento!",
    timestamp: "Ontem",
    aiEnabled: true,
  },
  {
    id: "4",
    contactName: "Pedro Oliveira",
    lastMessage: "Vocês trabalham aos sábados?",
    timestamp: "Ontem",
    aiEnabled: false,
  },
  {
    id: "5",
    contactName: "Carla Mendes",
    lastMessage: "Preciso remarcar minha consulta",
    timestamp: "23/01",
    aiEnabled: true,
  },
]

const mockMessages: Record<string, Message[]> = {
  "1": [
    { id: "1", content: "Olá, boa tarde!", sender: "contact", timestamp: "10:25" },
    { id: "2", content: "Olá Maria! Bem-vinda à nossa clínica. Como posso ajudá-la hoje?", sender: "ai", timestamp: "10:25" },
    { id: "3", content: "Gostaria de agendar uma consulta para avaliação", sender: "contact", timestamp: "10:28" },
    { id: "4", content: "Claro! Temos horários disponíveis para esta semana. Você prefere manhã ou tarde?", sender: "ai", timestamp: "10:28" },
    { id: "5", content: "Prefiro no período da tarde, se possível", sender: "contact", timestamp: "10:30" },
  ],
  "2": [
    { id: "1", content: "Bom dia!", sender: "contact", timestamp: "09:40" },
    { id: "2", content: "Bom dia! Como posso ajudar?", sender: "user", timestamp: "09:42" },
    { id: "3", content: "Qual o valor da avaliação?", sender: "contact", timestamp: "09:45" },
  ],
  "3": [
    { id: "1", content: "Olá, vim confirmar minha consulta de amanhã", sender: "contact", timestamp: "14:20" },
    { id: "2", content: "Olá Ana! Sua consulta está confirmada para amanhã às 15h. Lembre-se de trazer seus documentos.", sender: "ai", timestamp: "14:20" },
    { id: "3", content: "Obrigada pelo atendimento!", sender: "contact", timestamp: "14:22" },
  ],
  "4": [
    { id: "1", content: "Boa tarde, vocês trabalham aos sábados?", sender: "contact", timestamp: "16:30" },
  ],
  "5": [
    { id: "1", content: "Olá, preciso remarcar minha consulta", sender: "contact", timestamp: "11:00" },
    { id: "2", content: "Olá Carla! Sem problemas. Qual data e horário seria melhor para você?", sender: "ai", timestamp: "11:00" },
  ],
}

const mockAiStatus: Record<string, boolean> = {
  "1": true,
  "2": false,
  "3": true,
  "4": false,
  "5": true,
}

export default function DashboardPage() {
  const [conversations, setConversations] = useState(mockConversations)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [messages, setMessages] = useState(mockMessages)
  const [aiStatus, setAiStatus] = useState(mockAiStatus)

  const selectedConversation = conversations.find(c => c.id === selectedId)
  const selectedMessages = selectedId ? messages[selectedId] || [] : []

  const handleSelectConversation = (id: string) => {
    setSelectedId(id)
    // Marcar como lido
    setConversations(prev => 
      prev.map(c => c.id === id ? { ...c, unread: false } : c)
    )
  }

  const handleToggleAi = (enabled: boolean) => {
    if (selectedId) {
      setAiStatus(prev => ({ ...prev, [selectedId]: enabled }))
      setConversations(prev =>
        prev.map(c => c.id === selectedId ? { ...c, aiEnabled: enabled } : c)
      )
    }
  }

  const handleSendMessage = (content: string) => {
    if (selectedId) {
      const newMessage: Message = {
        id: Date.now().toString(),
        content,
        sender: "user",
        timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages(prev => ({
        ...prev,
        [selectedId]: [...(prev[selectedId] || []), newMessage],
      }))
      
      // Atualizar última mensagem na lista
      setConversations(prev =>
        prev.map(c => c.id === selectedId ? { ...c, lastMessage: content, timestamp: "Agora" } : c)
      )
    }
  }

  return (
    <div className="flex h-full">
      {/* Lista de conversas - 30% */}
      <div className="w-[30%] min-w-[280px] max-w-[400px]">
        <ConversationList
          conversations={conversations}
          selectedId={selectedId}
          onSelect={handleSelectConversation}
        />
      </div>

      {/* Área de chat - 70% */}
      <div className="flex-1">
        {selectedConversation ? (
          <ChatArea
            contactName={selectedConversation.contactName}
            messages={selectedMessages}
            aiEnabled={aiStatus[selectedId!] || false}
            onToggleAi={handleToggleAi}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <EmptyChat />
        )}
      </div>
    </div>
  )
}
