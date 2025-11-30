import React, { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Divider from '@/components/ui/Divider'
import ProgressBar from '@/components/ui/ProgressBar'
import { Calendar, MessageSquare, FileText, Clock, User, Plus, Send } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useNotifications } from '@/context/NotificationContext'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import { Form, FormGroup, FormLabel } from '@/components/ui/Form'

interface Milestone {
  id: string
  title: string
  dueDate: string
  completed: boolean
  progress: number
}

interface Meeting {
  id: string
  date: string
  time: string
  location?: string
  notes?: string
  status: 'scheduled' | 'completed' | 'cancelled'
}

interface SupervisorNote {
  id: string
  content: string
  createdAt: string
  supervisorName: string
  studentResponse?: string
  respondedAt?: string
}

interface ProjectProgressTrackerProps {
  projectId: string
  projectTitle: string
  progress: number
  milestones?: Milestone[]
  meetings?: Meeting[]
  supervisorNotes?: SupervisorNote[]
  onAddNote?: (note: string) => Promise<void>
  onAddMeeting?: (meeting: { date: string; time: string; location?: string }) => Promise<void>
  onRespondToNote?: (noteId: string, response: string) => Promise<void>
  canEdit?: boolean
}

const ProjectProgressTracker: React.FC<ProjectProgressTrackerProps> = ({
  projectId,
  projectTitle,
  progress,
  milestones = [],
  meetings = [],
  supervisorNotes = [],
  onAddNote,
  onAddMeeting,
  onRespondToNote,
  canEdit = false
}) => {
  const { user } = useAuth()
  const { addNotification } = useNotifications()
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false)
  const [noteContent, setNoteContent] = useState('')
  const [meetingDate, setMeetingDate] = useState('')
  const [meetingTime, setMeetingTime] = useState('')
  const [meetingLocation, setMeetingLocation] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [respondingToNote, setRespondingToNote] = useState<string | null>(null)
  const [noteResponse, setNoteResponse] = useState('')

  const isSupervisor = user?.role === 'supervisor'
  const isStudent = user?.role === 'student'

  const handleAddNote = async () => {
    if (!noteContent.trim()) {
      addNotification({
        title: 'خطأ',
        message: 'يرجى إدخال محتوى الملاحظة',
        type: 'error'
      })
      return
    }

    setIsSubmitting(true)
    try {
      await onAddNote?.(noteContent)
      setNoteContent('')
      setIsNoteModalOpen(false)
      addNotification({
        title: 'تمت الإضافة',
        message: 'تم إضافة الملاحظة بنجاح',
        type: 'success'
      })
    } catch (error) {
      addNotification({
        title: 'خطأ',
        message: error instanceof Error ? error.message : 'حدث خطأ أثناء إضافة الملاحظة',
        type: 'error'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddMeeting = async () => {
    if (!meetingDate || !meetingTime) {
      addNotification({
        title: 'خطأ',
        message: 'يرجى إدخال التاريخ والوقت',
        type: 'error'
      })
      return
    }

    setIsSubmitting(true)
    try {
      await onAddMeeting?.({
        date: meetingDate,
        time: meetingTime,
        location: meetingLocation || undefined
      })
      setMeetingDate('')
      setMeetingTime('')
      setMeetingLocation('')
      setIsMeetingModalOpen(false)
      addNotification({
        title: 'تمت الإضافة',
        message: 'تم تحديد موعد اللقاء بنجاح',
        type: 'success'
      })
    } catch (error) {
      addNotification({
        title: 'خطأ',
        message: error instanceof Error ? error.message : 'حدث خطأ أثناء تحديد الموعد',
        type: 'error'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRespondToNote = async (noteId: string) => {
    if (!noteResponse.trim()) {
      addNotification({
        title: 'خطأ',
        message: 'يرجى إدخال ردك',
        type: 'error'
      })
      return
    }

    setIsSubmitting(true)
    try {
      await onRespondToNote?.(noteId, noteResponse)
      setNoteResponse('')
      setRespondingToNote(null)
      addNotification({
        title: 'تم الإرسال',
        message: 'تم إرسال ردك بنجاح',
        type: 'success'
      })
    } catch (error) {
      addNotification({
        title: 'خطأ',
        message: error instanceof Error ? error.message : 'حدث خطأ أثناء إرسال الرد',
        type: 'error'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">متابعة التقدم</h2>
            {isSupervisor && canEdit && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsNoteModalOpen(true)}
                >
                  <MessageSquare className="w-4 h-4 ml-1 rtl:ml-0 rtl:mr-1" />
                  إضافة ملاحظة
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMeetingModalOpen(true)}
                >
                  <Calendar className="w-4 h-4 ml-1 rtl:ml-0 rtl:mr-1" />
                  تحديد لقاء
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <Divider />
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">نسبة الإنجاز</span>
                <span className="text-sm font-semibold text-gray-900">{progress}%</span>
              </div>
              <ProgressBar value={progress} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Milestones */}
      {milestones.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">المراحل الرئيسية</h2>
          </CardHeader>
          <Divider />
          <CardContent>
            <div className="space-y-4">
              {milestones.map((milestone) => (
                <div key={milestone.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{milestone.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      milestone.completed
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {milestone.completed ? 'مكتمل' : 'قيد التنفيذ'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={14} className="ml-1 rtl:ml-0 rtl:mr-1" />
                      {new Date(milestone.dueDate).toLocaleDateString('ar-SA')}
                    </div>
                    <div className="flex-1">
                      <ProgressBar value={milestone.progress} size="sm" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Meetings */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">اللقاءات</h2>
        </CardHeader>
        <Divider />
        <CardContent>
          {meetings.length > 0 ? (
            <div className="space-y-3">
              {meetings.map((meeting) => (
                <div key={meeting.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {new Date(meeting.date).toLocaleDateString('ar-SA')}
                        </span>
                        <Clock size={16} className="text-gray-400 ml-2 rtl:ml-0 rtl:mr-2" />
                        <span className="text-gray-700">{meeting.time}</span>
                      </div>
                      {meeting.location && (
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <span className="ml-1 rtl:ml-0 rtl:mr-1">📍</span>
                          {meeting.location}
                        </div>
                      )}
                      {meeting.notes && (
                        <p className="text-sm text-gray-600">{meeting.notes}</p>
                      )}
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      meeting.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : meeting.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {meeting.status === 'completed' ? 'مكتمل' : meeting.status === 'cancelled' ? 'ملغي' : 'مجدول'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">لا توجد لقاءات مجدولة</p>
          )}
        </CardContent>
      </Card>

      {/* Supervisor Notes */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">ملاحظات المشرف</h2>
        </CardHeader>
        <Divider />
        <CardContent>
          {supervisorNotes.length > 0 ? (
            <div className="space-y-4">
              {supervisorNotes.map((note) => (
                <div key={note.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      <span className="font-medium text-gray-900">{note.supervisorName}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(note.createdAt).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{note.content}</p>
                  {note.studentResponse && (
                    <div className="bg-blue-50 border-r-4 border-blue-500 p-3 rounded mb-3 rtl:border-r-0 rtl:border-l-4">
                      <p className="text-sm font-medium text-blue-900 mb-1">رد الطالب:</p>
                      <p className="text-sm text-blue-800">{note.studentResponse}</p>
                      {note.respondedAt && (
                        <p className="text-xs text-blue-600 mt-1">
                          {new Date(note.respondedAt).toLocaleDateString('ar-SA')}
                        </p>
                      )}
                    </div>
                  )}
                  {isStudent && !note.studentResponse && (
                    <div>
                      {respondingToNote === note.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={noteResponse}
                            onChange={(e) => setNoteResponse(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                            placeholder="أدخل ردك..."
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleRespondToNote(note.id)}
                              loading={isSubmitting}
                            >
                              إرسال
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setRespondingToNote(null)
                                setNoteResponse('')
                              }}
                            >
                              إلغاء
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setRespondingToNote(note.id)}
                        >
                          <MessageSquare className="w-4 h-4 ml-1 rtl:ml-0 rtl:mr-1" />
                          الرد على الملاحظة
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">لا توجد ملاحظات</p>
          )}
        </CardContent>
      </Card>

      {/* Add Note Modal */}
      <Modal
        isOpen={isNoteModalOpen}
        onClose={() => {
          setIsNoteModalOpen(false)
          setNoteContent('')
        }}
        title="إضافة ملاحظة"
        size="md"
      >
        <Form onSubmit={(e) => { e.preventDefault(); handleAddNote(); }}>
          <FormGroup>
            <FormLabel htmlFor="noteContent" required>المحتوى</FormLabel>
            <textarea
              id="noteContent"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
              placeholder="أدخل ملاحظتك..."
              required
            />
          </FormGroup>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsNoteModalOpen(false)
                setNoteContent('')
              }}
            >
              إلغاء
            </Button>
            <Button type="submit" loading={isSubmitting}>
              إضافة
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Add Meeting Modal */}
      <Modal
        isOpen={isMeetingModalOpen}
        onClose={() => {
          setIsMeetingModalOpen(false)
          setMeetingDate('')
          setMeetingTime('')
          setMeetingLocation('')
        }}
        title="تحديد موعد لقاء"
        size="md"
      >
        <Form onSubmit={(e) => { e.preventDefault(); handleAddMeeting(); }}>
          <div className="space-y-4">
            <FormGroup>
              <FormLabel htmlFor="meetingDate" required>التاريخ</FormLabel>
              <Input
                id="meetingDate"
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="meetingTime" required>الوقت</FormLabel>
              <Input
                id="meetingTime"
                type="time"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="meetingLocation">المكان (اختياري)</FormLabel>
              <Input
                id="meetingLocation"
                value={meetingLocation}
                onChange={(e) => setMeetingLocation(e.target.value)}
                placeholder="مكتب المشرف، قاعة الاجتماعات..."
              />
            </FormGroup>
            <div className="flex justify-end gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsMeetingModalOpen(false)
                  setMeetingDate('')
                  setMeetingTime('')
                  setMeetingLocation('')
                }}
              >
                إلغاء
              </Button>
              <Button type="submit" loading={isSubmitting}>
                تحديد الموعد
              </Button>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default ProjectProgressTracker

