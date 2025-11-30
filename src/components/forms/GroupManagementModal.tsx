import React, { useState, useEffect } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import { cn } from '../../lib/utils'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { Form, FormGroup, FormLabel, FormError } from '../ui/Form'
import Badge from '../ui/Badge'
import ConfirmDialog from '../ui/ConfirmDialog'
import { inviteMemberToGroup, removeMemberFromGroup, searchAvailableStudents } from '../../services/groups.service'
import { useNotifications } from '../../context/NotificationContext'
import {
  Users,
  UserPlus,
  UserMinus,
  Mail,
  Save,
  XCircle,
  AlertCircle,
  CheckCircle,
  Crown,
  User,
  Search
} from 'lucide-react'

interface GroupMember {
  id: string
  name: string
  email: string
  studentId: string
  role: 'leader' | 'member'
  status: 'active' | 'pending' | 'invited'
  joinDate: string
}

interface GroupManagementModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  currentGroup?: {
    id: string
    name: string
    members: string[]
  }
  mode?: 'create' | 'edit' | 'invite' | 'leave'
}

const GroupManagementModal: React.FC<GroupManagementModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentGroup,
  mode = 'edit'
}) => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const { addNotification } = useNotifications()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteMessage, setInviteMessage] = useState('')
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false)
  const [memberIdToRemove, setMemberIdToRemove] = useState<string | null>(null)
  const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Array<{ id: string; name: string; email: string; studentId: string }>>([])
  const [isSearching, setIsSearching] = useState(false)

  const MAX_MEMBERS = 4

  const [formData, setFormData] = useState({
    name: currentGroup?.name || '',
    project: '',
    maxMembers: MAX_MEMBERS
  })

  const [members, setMembers] = useState<GroupMember[]>(
    currentGroup ? currentGroup.members.map((name, index) => ({
      id: `${index + 1}`,
      name: name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@university.edu`,
      studentId: `202100${1234 + index}`,
      role: index === 0 ? 'leader' : 'member',
      status: 'active' as const,
      joinDate: new Date().toISOString().split('T')[0]
    })) : [
      {
        id: user?.id || '1',
        name: user?.fullName || 'أحمد محمد علي',
        email: user?.email || 'ahmed.mohamed@university.edu',
        studentId: user?.studentId || '2021001234',
        role: 'leader',
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0]
      }
    ]
  )

  useEffect(() => {
    if (currentGroup) {
      setFormData(prev => ({ ...prev, name: currentGroup.name, project: currentGroup.project || '' }))
    }
  }, [currentGroup])

  const handleSearchStudents = async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const results = await searchAvailableStudents(query)
      setSearchResults(results)
    } catch (error) {
      console.error('Error searching students:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleInviteMember = async () => {
    if (!inviteEmail.trim()) {
      setErrors({ invite: 'البريد الإلكتروني مطلوب' })
      return
    }

    if (!currentGroup?.id) {
      setErrors({ invite: 'يجب إنشاء المجموعة أولاً' })
      return
    }

    if (members.find(m => m.email === inviteEmail)) {
      setErrors({ invite: 'الطالب موجود بالفعل في المجموعة' })
      return
    }

    if (members.length >= formData.maxMembers) {
      setErrors({ invite: 'المجموعة ممتلئة' })
      return
    }

    try {
      await inviteMemberToGroup(currentGroup.id, inviteEmail, inviteMessage)
      
      const student = searchResults.find(s => s.email === inviteEmail)
      if (student) {
        const newMember: GroupMember = {
          id: student.id,
          name: student.name,
          email: student.email,
          studentId: student.studentId,
          role: 'member',
          status: 'invited',
          joinDate: new Date().toISOString().split('T')[0]
        }
        setMembers(prev => [...prev, newMember])
      }

      addNotification({
        title: 'تم إرسال الدعوة',
        message: `تم إرسال دعوة للانضمام للمجموعة إلى ${inviteEmail}`,
        type: 'success'
      })

      setInviteEmail('')
      setInviteMessage('')
      setSearchQuery('')
      setSearchResults([])
      setErrors({})
    } catch (error) {
      setErrors({ invite: error instanceof Error ? error.message : 'حدث خطأ أثناء إرسال الدعوة' })
    }
  }

  const handleRemoveMember = (memberId: string) => {
    setMemberIdToRemove(memberId)
    setConfirmRemoveOpen(true)
  }

  const confirmRemoveMember = async () => {
    if (!memberIdToRemove || !currentGroup?.id) {
      setConfirmRemoveOpen(false)
      setMemberIdToRemove(null)
      return
    }

    try {
      await removeMemberFromGroup(currentGroup.id, memberIdToRemove)
      setMembers(prev => prev.filter(m => m.id !== memberIdToRemove))
      addNotification({
        title: 'تم إزالة العضو',
        message: 'تم إزالة العضو من المجموعة بنجاح',
        type: 'success'
      })
    } catch (error) {
      addNotification({
        title: 'خطأ',
        message: error instanceof Error ? error.message : 'حدث خطأ أثناء إزالة العضو',
        type: 'error'
      })
    } finally {
      setConfirmRemoveOpen(false)
      setMemberIdToRemove(null)
    }
  }

  const cancelRemoveMember = () => {
    setConfirmRemoveOpen(false)
    setMemberIdToRemove(null)
  }

  const handleLeaveGroup = () => {
    setConfirmLeaveOpen(true)
  }

  const confirmLeave = () => {
    onClose()
    setConfirmLeaveOpen(false)
  }

  const cancelLeave = () => {
    setConfirmLeaveOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    // Validation
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'اسم المجموعة مطلوب'
    }

    if (mode === 'create' && !formData.project.trim()) {
      newErrors.project = 'اسم المشروع مطلوب'
    }

    if (mode === 'leave' && members.length <= 1) {
      newErrors.members = 'لا يمكن مغادرة المجموعة - يجب أن يبقى عضو واحد على الأقل'
    }

    if (mode === 'create' && members.length < 1) {
      newErrors.members = 'يجب أن تحتوي المجموعة على عضو واحد على الأقل'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      onSubmit({
        ...formData,
        members
      })
      onClose()

    } catch (error) {
      setErrors({ general: 'حدث خطأ أثناء حفظ البيانات' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: '',
      project: '',
      maxMembers: 4
    })
    setMembers([])
    setInviteEmail('')
    setInviteMessage('')
    setErrors({})
    onClose()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'invited': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط'
      case 'pending': return 'في الانتظار'
      case 'invited': return 'مدعو'
      default: return status
    }
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleCancel}
        title="إدارة المجموعة"
        size="xl"
      >
        <div className="max-h-[80vh] overflow-y-auto">
          <Form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Group Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormGroup>
                  <FormLabel htmlFor="name" required>اسم المجموعة</FormLabel>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="أدخل اسم المجموعة..."
                    error={errors.name}
                  />
                </FormGroup>

                {mode === 'create' && (
                  <FormGroup>
                    <FormLabel htmlFor="project" required>اسم المشروع</FormLabel>
                    <Input
                      id="project"
                      value={formData.project}
                      onChange={(e) => setFormData(prev => ({ ...prev, project: e.target.value }))}
                      placeholder="أدخل اسم المشروع..."
                      error={errors.project}
                    />
                  </FormGroup>
                )}
              </div>

              {/* Group Members */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">أعضاء المجموعة</h3>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-sm text-gray-600">
                      {members.length} / {formData.maxMembers}
                    </span>
                    <Badge variant="info">
                      {members.filter(m => m.status === 'active').length} نشط
                    </Badge>
                  </div>
                </div>

                {/* Members List */}
                <div className="space-y-3">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          {member.role === 'leader' ? (
                            <Crown size={20} className="text-yellow-600" />
                          ) : (
                            <User size={20} className="text-gray-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{member.name}</h4>
                          <p className="text-sm text-gray-600">{member.email}</p>
                          <p className="text-xs text-gray-500">الرقم الجامعي: {member.studentId}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className={cn('px-2 py-1 text-xs rounded-full', getStatusColor(member.status))}>
                          {getStatusText(member.status)}
                        </span>
                        {member.role === 'leader' && (
                          <Badge variant="warning">قائد المجموعة</Badge>
                        )}
                        {member.role !== 'leader' && ( // Don't allow removing the leader
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(member.id)}
                            className="text-red-600 hover:text-red-700 transition-colors"
                            title="إزالة العضو"
                          >
                            <UserMinus size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {errors.members && <FormError>{errors.members}</FormError>}
              </div>

              {/* Invite New Member */}
              {members.length < formData.maxMembers && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">دعوة عضو جديد</h3>

                  <FormGroup>
                    <FormLabel htmlFor="searchStudent">البحث عن طالب</FormLabel>
                    <div className="relative">
                      <Input
                        id="searchStudent"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value)
                          handleSearchStudents(e.target.value)
                        }}
                        placeholder="ابحث بالاسم، البريد الإلكتروني، أو الرقم الجامعي..."
                        error={errors.invite}
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 rtl:left-auto rtl:right-3" />
                    </div>
                    {searchResults.length > 0 && (
                      <div className="mt-2 border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                        {searchResults.map((student) => (
                          <div
                            key={student.id}
                            onClick={() => {
                              setInviteEmail(student.email)
                              setSearchQuery(student.name)
                              setSearchResults([])
                            }}
                            className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <p className="font-medium text-gray-900">{student.name}</p>
                            <p className="text-sm text-gray-600">{student.email}</p>
                            <p className="text-xs text-gray-500">الرقم الجامعي: {student.studentId}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </FormGroup>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormGroup>
                      <FormLabel htmlFor="inviteEmail">البريد الإلكتروني</FormLabel>
                      <Input
                        id="inviteEmail"
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="أدخل البريد الإلكتروني..."
                        error={errors.invite}
                      />
                    </FormGroup>

                    <FormGroup>
                      <FormLabel htmlFor="inviteMessage">رسالة الدعوة (اختيارية)</FormLabel>
                      <Input
                        id="inviteMessage"
                        value={inviteMessage}
                        onChange={(e) => setInviteMessage(e.target.value)}
                        placeholder="رسالة ترحيبية..."
                      />
                    </FormGroup>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleInviteMember}
                    className="flex items-center"
                    disabled={!inviteEmail.trim()}
                  >
                    <UserPlus className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                    دعوة عضو
                  </Button>
                </div>
              )}

              {/* Leave Group Option */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-2">خيارات متقدمة</h4>
                <p className="text-sm text-red-700 mb-3">
                  يمكنك مغادرة المجموعة إذا كنت لا تريد الاستمرار في العمل معها
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleLeaveGroup}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <UserMinus className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                  مغادرة المجموعة
                </Button>
              </div>

              {/* Error Display */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {errors.general}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-4 border-t">
                <Button variant="outline" type="button" onClick={handleCancel}>
                  <XCircle className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                  إلغاء
                </Button>
                <Button type="submit" loading={isLoading}>
                  <Save className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                  حفظ التغييرات
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </Modal>
      <ConfirmDialog
        isOpen={confirmRemoveOpen}
        title="تأكيد إزالة العضو"
        description="هل أنت متأكد من إزالة هذا العضو من المجموعة؟"
        variant="destructive"
        onConfirm={confirmRemoveMember}
        onCancel={cancelRemoveMember}
      />
      <ConfirmDialog
        isOpen={confirmLeaveOpen}
        title="تأكيد مغادرة المجموعة"
        description="هل أنت متأكد من مغادرة المجموعة؟"
        variant="destructive"
        onConfirm={confirmLeave}
        onCancel={cancelLeave}
      />
    </>
  )
}

export default GroupManagementModal
