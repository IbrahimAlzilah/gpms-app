import React, { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { cn } from '../../lib/utils'
import { Card, CardContent, CardHeader } from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Badge from '../ui/Badge'
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical,
  Search,
  Phone,
  Video,
  Info,
  Users,
  Clock,
  Check,
  CheckCheck,
  Image,
  File,
  Download
} from 'lucide-react'

interface Message {
  id: string
  content: string
  sender: {
    id: string
    name: string
    avatar?: string
    role: string
  }
  timestamp: Date
  type: 'text' | 'image' | 'file' | 'system'
  status: 'sending' | 'sent' | 'delivered' | 'read'
  attachments?: {
    name: string
    type: string
    size: number
    url: string
  }[]
  replyTo?: {
    id: string
    content: string
    sender: string
  }
}

interface ChatConversation {
  id: string
  name: string
  type: 'individual' | 'group'
  participants: {
    id: string
    name: string
    avatar?: string
    role: string
    isOnline: boolean
  }[]
  lastMessage?: {
    content: string
    timestamp: Date
    sender: string
  }
  unreadCount: number
  isPinned: boolean
  isMuted: boolean
}

interface ChatComponentProps {
  className?: string
}

const ChatComponent: React.FC<ChatComponentProps> = ({ className }) => {
  const { t } = useLanguage()
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mock conversations data
  const conversations: ChatConversation[] = [
    {
      id: '1',
      name: 'د. أحمد محمد علي',
      type: 'individual',
      participants: [
        {
          id: '1',
          name: 'د. أحمد محمد علي',
          role: 'مشرف',
          isOnline: true
        }
      ],
      lastMessage: {
        content: 'هل يمكنك إرسال التقرير اليوم؟',
        timestamp: new Date('2024-01-22T10:30:00'),
        sender: 'د. أحمد محمد علي'
      },
      unreadCount: 2,
      isPinned: true,
      isMuted: false
    },
    {
      id: '2',
      name: 'فريق مشروع الذكاء الاصطناعي',
      type: 'group',
      participants: [
        {
          id: '2',
          name: 'محمد علي',
          role: 'طالب',
          isOnline: true
        },
        {
          id: '3',
          name: 'سارة أحمد',
          role: 'طالب',
          isOnline: false
        },
        {
          id: '4',
          name: 'خالد محمود',
          role: 'طالب',
          isOnline: true
        }
      ],
      lastMessage: {
        content: 'تم الانتهاء من المرحلة الأولى',
        timestamp: new Date('2024-01-22T09:15:00'),
        sender: 'محمد علي'
      },
      unreadCount: 0,
      isPinned: false,
      isMuted: false
    },
    {
      id: '3',
      name: 'د. سارة أحمد حسن',
      type: 'individual',
      participants: [
        {
          id: '5',
          name: 'د. سارة أحمد حسن',
          role: 'مشرف',
          isOnline: false
        }
      ],
      lastMessage: {
        content: 'شكراً لك على التقرير الممتاز',
        timestamp: new Date('2024-01-21T16:45:00'),
        sender: 'د. سارة أحمد حسن'
      },
      unreadCount: 0,
      isPinned: false,
      isMuted: false
    }
  ]

  // Mock messages data
  const messages: Record<string, Message[]> = {
    '1': [
      {
        id: '1',
        content: 'مرحباً، كيف حال مشروعك؟',
        sender: {
          id: '1',
          name: 'د. أحمد محمد علي',
          role: 'مشرف'
        },
        timestamp: new Date('2024-01-22T10:00:00'),
        type: 'text',
        status: 'read'
      },
      {
        id: '2',
        content: 'أهلاً دكتور، المشروع يسير بشكل جيد. لقد انتهيت من المرحلة الأولى',
        sender: {
          id: 'user',
          name: 'أنت',
          role: 'طالب'
        },
        timestamp: new Date('2024-01-22T10:05:00'),
        type: 'text',
        status: 'read'
      },
      {
        id: '3',
        content: 'ممتاز! هل يمكنك إرسال التقرير اليوم؟',
        sender: {
          id: '1',
          name: 'د. أحمد محمد علي',
          role: 'مشرف'
        },
        timestamp: new Date('2024-01-22T10:30:00'),
        type: 'text',
        status: 'delivered'
      }
    ],
    '2': [
      {
        id: '4',
        content: 'مرحباً جميعاً، كيف حال العمل على المشروع؟',
        sender: {
          id: '2',
          name: 'محمد علي',
          role: 'طالب'
        },
        timestamp: new Date('2024-01-22T09:00:00'),
        type: 'text',
        status: 'read'
      },
      {
        id: '5',
        content: 'تم الانتهاء من المرحلة الأولى',
        sender: {
          id: '2',
          name: 'محمد علي',
          role: 'طالب'
        },
        timestamp: new Date('2024-01-22T09:15:00'),
        type: 'text',
        status: 'read'
      }
    ]
  }

  const filteredConversations = conversations.filter(conv =>
    !searchQuery || 
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const currentMessages = selectedConversation ? messages[selectedConversation] || [] : []
  const currentConversation = conversations.find(conv => conv.id === selectedConversation)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentMessages])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    // Simulate sending message
    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: {
        id: 'user',
        name: 'أنت',
        role: 'طالب'
      },
      timestamp: new Date(),
      type: 'text',
      status: 'sending'
    }

    // In real app, this would be sent to server
    console.log('Sending message:', message)
    setNewMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sending':
        return <Clock className="w-4 h-4 text-gray-400" />
      case 'sent':
        return <Check className="w-4 h-4 text-gray-400" />
      case 'delivered':
        return <CheckCheck className="w-4 h-4 text-gray-400" />
      case 'read':
        return <CheckCheck className="w-4 h-4 text-blue-500" />
      default:
        return null
    }
  }

  return (
    <div className={cn('flex h-[600px] bg-white rounded-lg shadow-sm border border-gray-200', className)}>
      {/* Conversations List */}
      <div className="w-1/3 border-l border-gray-200 rtl:border-l-0 rtl:border-r">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">المحادثات</h2>
            <Button size="sm" variant="outline">
              <Users className="w-4 h-4" />
            </Button>
          </div>
          
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="البحث في المحادثات..."
            className="w-full"
          />
        </div>

        <div className="overflow-y-auto h-[500px]">
          {filteredConversations.map(conversation => (
            <div
              key={conversation.id}
              className={cn(
                'p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors',
                selectedConversation === conversation.id && 'bg-gpms-light/10 border-r-4 border-gpms-light'
              )}
              onClick={() => setSelectedConversation(conversation.id)}
            >
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <div className="relative">
                  <div className="w-12 h-12 bg-gpms-light rounded-full flex items-center justify-center text-white font-semibold">
                    {conversation.name.charAt(0)}
                  </div>
                  {conversation.type === 'individual' && conversation.participants[0]?.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {conversation.name}
                    </h3>
                    <div className="flex items-center space-x-1 rtl:space-x-reverse">
                      {conversation.isPinned && <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>}
                      {conversation.unreadCount > 0 && (
                        <Badge variant="error" size="sm">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {conversation.lastMessage && (
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage.sender}: {conversation.lastMessage.content}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">
                      {conversation.lastMessage && formatTime(conversation.lastMessage.timestamp)}
                    </span>
                    {conversation.type === 'group' && (
                      <span className="text-xs text-gray-500">
                        {conversation.participants.length} أعضاء
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-10 h-10 bg-gpms-dark rounded-full flex items-center justify-center text-white font-semibold">
                    {currentConversation?.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {currentConversation?.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {currentConversation?.type === 'group' 
                        ? `${currentConversation.participants.length} أعضاء`
                        : currentConversation?.participants[0]?.isOnline ? 'متصل الآن' : 'آخر ظهور منذ ساعة'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Button size="sm" variant="outline">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Info className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentMessages.map(message => (
                <div
                  key={message.id}
                  className={cn(
                    'flex',
                    message.sender.id === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div className={cn(
                    'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
                    message.sender.id === 'user'
                      ? 'bg-gpms-dark text-white'
                      : 'bg-gray-100 text-gray-900'
                  )}>
                    {message.sender.id !== 'user' && (
                      <p className="text-xs font-medium mb-1 opacity-70">
                        {message.sender.name}
                      </p>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <div className={cn(
                      'flex items-center justify-end mt-1 space-x-1 rtl:space-x-reverse',
                      message.sender.id === 'user' ? 'text-white/70' : 'text-gray-500'
                    )}>
                      <span className="text-xs">
                        {formatTime(message.timestamp)}
                      </span>
                      {message.sender.id === 'user' && getStatusIcon(message.status)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Button size="sm" variant="outline">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Image className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <File className="w-4 h-4" />
                </Button>
                
                <div className="flex-1">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="اكتب رسالتك..."
                    className="w-full"
                  />
                </div>
                
                <Button size="sm" variant="outline">
                  <Smile className="w-4 h-4" />
                </Button>
                
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-gpms-dark text-white hover:bg-gpms-light"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                اختر محادثة للبدء
              </h3>
              <p className="text-gray-600">
                اختر محادثة من القائمة لبدء المحادثة
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatComponent
