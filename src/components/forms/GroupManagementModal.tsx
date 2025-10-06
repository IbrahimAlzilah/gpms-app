import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { cn } from '../../lib/utils'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { Form, FormGroup, FormLabel, FormError } from '../ui/Form'
import Badge from '../ui/Badge'
import ConfirmDialog from '../ui/ConfirmDialog'
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
  User
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
  groupData?: {
    id: string
    name: string
    project: string
    members: GroupMember[]
    maxMembers: number
  }
}

const GroupManagementModal: React.FC<GroupManagementModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  groupData
}) => {
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteMessage, setInviteMessage] = useState('')
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false)
  const [memberIdToRemove, setMemberIdToRemove] = useState<string | null>(null)
  const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false)

  const [formData, setFormData] = useState({
    name: groupData?.name || '',
    project: groupData?.project || '',
    maxMembers: groupData?.maxMembers || 4
  })

  const [members, setMembers] = useState<GroupMember[]>(
    groupData?.members || [
      {
        id: '1',
        name: 'أحمد محمد علي',
        email: 'ahmed.mohamed@university.edu',
        studentId: '2021001234',
        role: 'leader',
        status: 'active',
        joinDate: '2024-01-01'
      },
      {
        id: '2',
        name: 'فاطمة حسن محمد',
        email: 'fatima.hassan@university.edu',
        studentId: '2021001235',
        role: 'member',
        status: 'active',
        joinDate: '2024-01-02'
      }
    ]
  )

  const availableStudents = [
    { id: '3', name: 'محمد خالد أحمد', email: 'mohamed.khalid@university.edu', studentId: '2021001236' },
    { id: '4', name: 'سارة أحمد محمود', email: 'sara.ahmed@university.edu', studentId: '2021001237' },
    { id: '5', name: 'علي حسن محمد', email: 'ali.hassan@university.edu', studentId: '2021001238' },
    { id: '6', name: 'نورا سعد أحمد', email: 'nora.saad@university.edu', studentId: '2021001239' }
  ]

  const handleInviteMember = async () => {
    if (!inviteEmail.trim()) {
      setErrors({ invite: 'البريد الإلكتروني مطلوب' })
      return
    }

    const student = availableStudents.find(s => s.email === inviteEmail)
    if (!student) {
      setErrors({ invite: 'الطالب غير موجود في النظام' })
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
    setInviteEmail('')
    setInviteMessage('')
    setErrors({})
  }

  const handleRemoveMember = (memberId: string) => {
    setMemberIdToRemove(memberId)
    setConfirmRemoveOpen(true)
  }

  const confirmRemoveMember = () => {
    if (memberIdToRemove) {
      setMembers(prev => prev.filter(m => m.id !== memberIdToRemove))
    }
    setConfirmRemoveOpen(false)
    setMemberIdToRemove(null)
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

    if (!formData.project.trim()) {
      newErrors.project = 'اسم المشروع مطلوب'
    }

    if (formData.actionType === 'leave' && currentGroup && currentGroup.members.length <= 1) {
      newErrors.members = 'لا يمكن مغادرة المجموعة - يجب أن يبقى عضو واحد على الأقل'
    }

    if (formData.actionType === 'create' && members.length < 2) {
      newErrors.members = 'يجب أن تحتوي المجموعة على عضوين على الأقل'
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
                        {member.id !== '1' && ( // Don't allow removing the current user
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
