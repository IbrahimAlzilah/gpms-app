import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { cn } from '../../lib/utils'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Divider from '../../components/ui/Divider'
import Input from '../../components/ui/Input'
import { Form, FormGroup, FormLabel, FormError } from '../../components/ui/Form'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import {
  Users,
  UserPlus,
  Calendar,
  Save,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin
} from 'lucide-react'

interface CommitteeMember {
  id: string
  name: string
  email: string
  role: 'chair' | 'member' | 'external'
  department: string
  specialization: string
}

interface DiscussionCommittee {
  id: string
  name: string
  members: CommitteeMember[]
  projectId: string
  projectTitle: string
  studentName: string
  scheduledDate: string
  scheduledTime: string
  location: string
  status: 'assigned' | 'pending' | 'completed'
  createdAt: string
}

const CommitteeDistribution: React.FC = () => {
  const { t } = useLanguage()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCommittee, setEditingCommittee] = useState<DiscussionCommittee | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    name: '',
    projectId: '',
    scheduledDate: '',
    scheduledTime: '',
    location: '',
    selectedMembers: [] as string[]
  })

  // Mock data
  const [committees, setCommittees] = useState<DiscussionCommittee[]>([
    {
      id: '1',
      name: 'لجنة مناقشة المشروع الأول',
      members: [
        {
          id: '1',
          name: 'د. أحمد محمد علي',
          email: 'ahmed.mohammed@university.edu',
          role: 'chair',
          department: 'علوم الحاسوب',
          specialization: 'الذكاء الاصطناعي'
        },
        {
          id: '2',
          name: 'د. فاطمة حسن أحمد',
          email: 'fatima.hassan@university.edu',
          role: 'member',
          department: 'هندسة البرمجيات',
          specialization: 'تطوير التطبيقات'
        },
        {
          id: '3',
          name: 'د. خالد محمود الحسن',
          email: 'khalid.mahmoud@university.edu',
          role: 'external',
          department: 'تقنية المعلومات',
          specialization: 'أمن المعلومات'
        }
      ],
      projectId: '1',
      projectTitle: 'تطبيق إدارة المكتبة الذكية',
      studentName: 'أحمد علي محمد',
      scheduledDate: '2024-06-15',
      scheduledTime: '10:00',
      location: 'قاعة المناقشات - مبنى الهندسة',
      status: 'assigned',
      createdAt: '2024-05-01'
    }
  ])

  const availableMembers: CommitteeMember[] = [
    {
      id: '1',
      name: 'د. أحمد محمد علي',
      email: 'ahmed.mohammed@university.edu',
      role: 'chair',
      department: 'علوم الحاسوب',
      specialization: 'الذكاء الاصطناعي'
    },
    {
      id: '2',
      name: 'د. فاطمة حسن أحمد',
      email: 'fatima.hassan@university.edu',
      role: 'member',
      department: 'هندسة البرمجيات',
      specialization: 'تطوير التطبيقات'
    },
    {
      id: '3',
      name: 'د. خالد محمود الحسن',
      email: 'khalid.mahmoud@university.edu',
      role: 'external',
      department: 'تقنية المعلومات',
      specialization: 'أمن المعلومات'
    },
    {
      id: '4',
      name: 'د. سارة أحمد محمد',
      email: 'sara.ahmed@university.edu',
      role: 'member',
      department: 'نظم المعلومات',
      specialization: 'قواعد البيانات'
    }
  ]

  const availableProjects = [
    { id: '1', title: 'تطبيق إدارة المكتبة الذكية', student: 'أحمد علي محمد' },
    { id: '2', title: 'نظام إدارة المستودعات الذكي', student: 'فاطمة حسن أحمد' },
    { id: '3', title: 'منصة التعلم الإلكتروني التفاعلية', student: 'محمد خالد علي' }
  ]

  const getRoleText = (role: string) => {
    const roles = {
      chair: 'رئيس اللجنة',
      member: 'عضو',
      external: 'عضو خارجي'
    }
    return roles[role as keyof typeof roles] || role
  }

  const getRoleColor = (role: string) => {
    const colors = {
      chair: 'bg-blue-100 text-blue-800',
      member: 'bg-green-100 text-green-800',
      external: 'bg-purple-100 text-purple-800'
    }
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status: string) => {
    const statuses = {
      assigned: 'مُعيَّنة',
      pending: 'معلقة',
      completed: 'مكتملة'
    }
    return statuses[status as keyof typeof statuses] || status
  }

  const getStatusColor = (status: string) => {
    const colors = {
      assigned: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'اسم اللجنة مطلوب'
    }
    if (!formData.projectId) {
      newErrors.projectId = 'المشروع مطلوب'
    }
    if (!formData.scheduledDate) {
      newErrors.scheduledDate = 'تاريخ المناقشة مطلوب'
    }
    if (!formData.scheduledTime) {
      newErrors.scheduledTime = 'وقت المناقشة مطلوب'
    }
    if (!formData.location.trim()) {
      newErrors.location = 'مكان المناقشة مطلوب'
    }
    if (formData.selectedMembers.length === 0) {
      newErrors.members = 'يجب اختيار أعضاء اللجنة'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))

      const selectedProject = availableProjects.find(p => p.id === formData.projectId)
      const selectedMembersData = availableMembers.filter(m => formData.selectedMembers.includes(m.id))

      if (editingCommittee) {
        // Update existing committee
        setCommittees(prev => prev.map(c =>
          c.id === editingCommittee.id
            ? {
              ...c,
              name: formData.name,
              members: selectedMembersData,
              projectId: formData.projectId,
              projectTitle: selectedProject?.title || '',
              studentName: selectedProject?.student || '',
              scheduledDate: formData.scheduledDate,
              scheduledTime: formData.scheduledTime,
              location: formData.location
            }
            : c
        ))
      } else {
        // Create new committee
        const newCommittee: DiscussionCommittee = {
          id: Date.now().toString(),
          name: formData.name,
          members: selectedMembersData,
          projectId: formData.projectId,
          projectTitle: selectedProject?.title || '',
          studentName: selectedProject?.student || '',
          scheduledDate: formData.scheduledDate,
          scheduledTime: formData.scheduledTime,
          location: formData.location,
          status: 'assigned',
          createdAt: new Date().toISOString().split('T')[0]
        }
        setCommittees(prev => [newCommittee, ...prev])
      }

      handleCloseModal()
    } catch (error) {
      setErrors({ general: 'حدث خطأ أثناء حفظ اللجنة' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseModal = () => {
    setFormData({
      name: '',
      projectId: '',
      scheduledDate: '',
      scheduledTime: '',
      location: '',
      selectedMembers: []
    })
    setEditingCommittee(null)
    setErrors({})
    setIsModalOpen(false)
  }

  const handleEdit = (committee: DiscussionCommittee) => {
    setFormData({
      name: committee.name,
      projectId: committee.projectId,
      scheduledDate: committee.scheduledDate,
      scheduledTime: committee.scheduledTime,
      location: committee.location,
      selectedMembers: committee.members.map(m => m.id)
    })
    setEditingCommittee(committee)
    setIsModalOpen(true)
  }

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [committeeIdToDelete, setCommitteeIdToDelete] = useState<string | null>(null)
  const handleDelete = (id: string) => {
    setCommitteeIdToDelete(id)
    setConfirmDeleteOpen(true)
  }
  const confirmDelete = () => {
    if (committeeIdToDelete) {
      setCommittees(prev => prev.filter(c => c.id !== committeeIdToDelete))
    }
    setConfirmDeleteOpen(false)
    setCommitteeIdToDelete(null)
  }
  const cancelDelete = () => {
    setConfirmDeleteOpen(false)
    setCommitteeIdToDelete(null)
  }

  const handleMemberToggle = (memberId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedMembers: prev.selectedMembers.includes(memberId)
        ? prev.selectedMembers.filter(id => id !== memberId)
        : [...prev.selectedMembers, memberId]
    }))
  }

  return (
    <div className="space-y-6">
      <Card className="hover-lift">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Users className="w-6 h-6 text-gpms-dark" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">توزيع لجان المناقشة</h1>
                <p className="text-gray-600 mt-1">إدارة وتوزيع لجان مناقشة المشاريع النهائية</p>
              </div>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-gpms-dark text-white hover:bg-gpms-light"
            >
              <Plus className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
              لجنة جديدة
            </Button>
          </div>
        </CardHeader>
        <Divider />
        <CardContent>
          {committees.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد لجان</h3>
              <p className="text-gray-600 mb-4">لم يتم إنشاء أي لجان مناقشة بعد</p>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-gpms-dark text-white hover:bg-gpms-light"
              >
                <Plus className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                إنشاء لجنة جديدة
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {committees.map((committee) => (
                <div key={committee.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{committee.name}</h3>
                        <span className={cn(
                          'px-2 py-1 rounded-full text-xs font-medium',
                          getStatusColor(committee.status)
                        )}>
                          {getStatusText(committee.status)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">المشروع:</p>
                          <p className="font-medium text-gray-900">{committee.projectTitle}</p>
                          <p className="text-sm text-gray-500">الطالب: {committee.studentName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">التوقيت:</p>
                          <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm">
                            <Calendar className="w-4 h-4" />
                            <span>{committee.scheduledDate}</span>
                            <Clock className="w-4 h-4" />
                            <span>{committee.scheduledTime}</span>
                          </div>
                          <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-500 mt-1">
                            <MapPin className="w-4 h-4" />
                            <span>{committee.location}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-2">أعضاء اللجنة:</p>
                        <div className="flex flex-wrap gap-2">
                          {committee.members.map((member) => (
                            <div key={member.id} className="flex items-center space-x-2 rtl:space-x-reverse">
                              <span className={cn(
                                'px-2 py-1 rounded-full text-xs font-medium',
                                getRoleColor(member.role)
                              )}>
                                {member.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(committee)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(committee.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCommittee ? 'تعديل اللجنة' : 'لجنة جديدة'}
        size="xl"
        onSubmit={handleSubmit}
      >
        <Form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <FormGroup>
              <FormLabel htmlFor="name" required>اسم اللجنة</FormLabel>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="أدخل اسم اللجنة..."
                error={errors.name}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="projectId" required>المشروع</FormLabel>
              <select
                id="projectId"
                value={formData.projectId}
                onChange={(e) => setFormData(prev => ({ ...prev, projectId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
              >
                <option value="">اختر المشروع</option>
                {availableProjects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.title} - {project.student}
                  </option>
                ))}
              </select>
              {errors.projectId && <FormError>{errors.projectId}</FormError>}
            </FormGroup>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormGroup>
                <FormLabel htmlFor="scheduledDate" required>تاريخ المناقشة</FormLabel>
                <Input
                  id="scheduledDate"
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  error={errors.scheduledDate}
                />
              </FormGroup>
              <FormGroup>
                <FormLabel htmlFor="scheduledTime" required>وقت المناقشة</FormLabel>
                <Input
                  id="scheduledTime"
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                  error={errors.scheduledTime}
                />
              </FormGroup>
            </div>

            <FormGroup>
              <FormLabel htmlFor="location" required>مكان المناقشة</FormLabel>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="أدخل مكان المناقشة..."
                error={errors.location}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel required>أعضاء اللجنة</FormLabel>
              <div className="space-y-2">
                {availableMembers.map((member) => (
                  <div key={member.id} className="flex items-center space-x-3 rtl:space-x-reverse">
                    <input
                      type="checkbox"
                      id={`member-${member.id}`}
                      checked={formData.selectedMembers.includes(member.id)}
                      onChange={() => handleMemberToggle(member.id)}
                      className="w-4 h-4 text-gpms-dark border-gray-300 rounded focus:ring-gpms-light"
                    />
                    <label htmlFor={`member-${member.id}`} className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-500">{member.department} - {member.specialization}</p>
                        </div>
                        <span className={cn(
                          'px-2 py-1 rounded-full text-xs font-medium',
                          getRoleColor(member.role)
                        )}>
                          {getRoleText(member.role)}
                        </span>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              {errors.members && <FormError>{errors.members}</FormError>}
            </FormGroup>

            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {errors.general}
              </div>
            )}

            <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-4 border-t">
              <Button variant="outline" type="button" onClick={handleCloseModal}>
                إلغاء
              </Button>
              <Button type="submit" loading={isLoading}>
                <Save className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                {editingCommittee ? 'تحديث' : 'حفظ'}
              </Button>
            </div>
          </div>
        </Form>
      </Modal>

      <ConfirmDialog
        isOpen={confirmDeleteOpen}
        title="تأكيد الحذف"
        description="هل أنت متأكد من حذف هذه اللجنة؟ لا يمكن التراجع عن ذلك."
        variant="destructive"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  )
}

export default CommitteeDistribution


