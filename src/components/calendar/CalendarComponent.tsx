import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { cn } from '../../lib/utils'
import { Card, CardContent, CardHeader } from '../ui/Card'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Calendar,
  Clock,
  Users,
  MapPin,
  Bell
} from 'lucide-react'

interface CalendarEvent {
  id: string
  title: string
  date: Date
  time: string
  type: 'meeting' | 'deadline' | 'presentation' | 'other'
  participants?: string[]
  location?: string
  description?: string
  priority: 'high' | 'medium' | 'low'
}

interface CalendarProps {
  className?: string
}

const CalendarComponent: React.FC<CalendarProps> = ({ className }) => {
  const { t } = useLanguage()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showAddEvent, setShowAddEvent] = useState(false)

  // Mock events data
  const events: CalendarEvent[] = [
    {
      id: '1',
      title: 'اجتماع متابعة المشاريع',
      date: new Date(2024, 0, 15),
      time: '10:00 ص',
      type: 'meeting',
      participants: ['د. أحمد محمد', 'د. سارة أحمد'],
      location: 'قاعة الاجتماعات الرئيسية',
      priority: 'high'
    },
    {
      id: '2',
      title: 'موعد تسليم التقرير الأول',
      date: new Date(2024, 0, 20),
      time: '11:59 م',
      type: 'deadline',
      priority: 'high'
    },
    {
      id: '3',
      title: 'عرض تقديمي - مشروع الذكاء الاصطناعي',
      date: new Date(2024, 0, 25),
      time: '2:00 م',
      type: 'presentation',
      participants: ['الطالب محمد علي', 'د. خالد محمود'],
      location: 'قاعة المحاضرات 101',
      priority: 'medium'
    },
    {
      id: '4',
      title: 'ورشة عمل - تطوير التطبيقات',
      date: new Date(2024, 0, 28),
      time: '9:00 ص',
      type: 'other',
      participants: ['جميع الطلاب'],
      location: 'معمل الحاسوب 1',
      priority: 'low'
    }
  ]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    )
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-800'
      case 'deadline': return 'bg-red-100 text-red-800'
      case 'presentation': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500'
      case 'medium': return 'border-l-yellow-500'
      case 'low': return 'border-l-green-500'
      default: return 'border-l-gray-500'
    }
  }

  const monthNames = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ]

  const dayNames = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت']

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date) => {
    return selectedDate?.toDateString() === date.toDateString()
  }

  const days = getDaysInMonth(currentDate)
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : []

  return (
    <div className={cn('space-y-6', className)}>
      {/* Calendar Header */}
      <Card className="hover-lift">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Calendar className="w-6 h-6 text-gpms-dark" />
              <h2 className="text-xl font-bold text-gray-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
              >
                اليوم
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setShowAddEvent(true)}
                className="bg-gpms-dark text-white hover:bg-gpms-light"
              >
                <Plus className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                إضافة حدث
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {dayNames.map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (!day) {
                return <div key={index} className="h-24"></div>
              }

              const dayEvents = getEventsForDate(day)
              const isCurrentDay = isToday(day)
              const isSelectedDay = isSelected(day)

              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    'h-24 p-1 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors',
                    isCurrentDay && 'bg-gpms-light/10 border-gpms-light',
                    isSelectedDay && 'bg-gpms-dark/10 border-gpms-dark'
                  )}
                  onClick={() => setSelectedDate(day)}
                >
                  <div className={cn(
                    'text-sm font-medium mb-1',
                    isCurrentDay ? 'text-gpms-dark' : 'text-gray-900'
                  )}>
                    {day.getDate()}
                  </div>
                  
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className={cn(
                          'text-xs px-1 py-0.5 rounded truncate',
                          getEventTypeColor(event.type)
                        )}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{dayEvents.length - 2} أكثر
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Events */}
      {selectedDate && (
        <Card className="hover-lift">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                أحداث {selectedDate.toLocaleDateString('ar')}
              </h3>
              <Badge variant="info">
                {selectedDateEvents.length} حدث
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            {selectedDateEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>لا توجد أحداث في هذا اليوم</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDateEvents.map(event => (
                  <div
                    key={event.id}
                    className={cn(
                      'p-4 border rounded-lg border-l-4',
                      getPriorityColor(event.priority)
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <Badge 
                        variant={event.priority === 'high' ? 'error' : 
                                event.priority === 'medium' ? 'warning' : 'success'}
                        size="sm"
                      >
                        {event.priority === 'high' ? 'عالي' :
                         event.priority === 'medium' ? 'متوسط' : 'منخفض'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                      
                      {event.location && (
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      
                      {event.participants && event.participants.length > 0 && (
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Users className="w-4 h-4" />
                          <span>{event.participants.join(', ')}</span>
                        </div>
                      )}
                      
                      {event.description && (
                        <p className="text-gray-700 mt-2">{event.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add Event Modal Placeholder */}
      {showAddEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">إضافة حدث جديد</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddEvent(false)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center py-8">
                نموذج إضافة حدث جديد سيتم تطويره لاحقاً
              </p>
              <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                <Button
                  variant="outline"
                  onClick={() => setShowAddEvent(false)}
                >
                  إلغاء
                </Button>
                <Button onClick={() => setShowAddEvent(false)}>
                  حفظ
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default CalendarComponent
