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
  Megaphone,
  Calendar,
  Clock,
  Save,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

interface Announcement {
  id: string
  title: string
  description: string
  type: 'proposal_submission' | 'project_review' | 'defense_schedule' | 'general'
  startDate: string
  endDate: string
  status: 'active' | 'inactive' | 'upcoming'
  createdAt: string
  createdBy: string
}

const CommitteeAnnouncements: React.FC = () => {
  const { t } = useLanguage()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'proposal_submission' as Announcement['type'],
    startDate: '',
    endDate: ''
  })

  // Mock data
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: '1',
      title: 'فترة تقديم مقترحات مشاريع التخرج',
      description: 'يتم فتح باب تقديم مقترحات مشاريع التخرج للفصل الدراسي الحالي',
      type: 'proposal_submission',
      startDate: '2024-01-01',
      endDate: '2024-02-15',
      status: 'active',
      createdAt: '2024-01-01',
      createdBy: 'د. أحمد محمد'
    },
    {
      id: '2',
      title: 'جدولة مناقشات المشاريع النهائية',
      description: 'سيتم جدولة مناقشات المشاريع النهائية خلال الفترة المحددة',
      type: 'defense_schedule',
      startDate: '2024-05-01',
      endDate: '2024-05-30',
      status: 'upcoming',
      createdAt: '2024-01-15',
      createdBy: 'د. سارة أحمد'
    }
  ])

  const announcementTypes = [
    { value: 'proposal_submission', label: 'تقديم المقترحات' },
    { value: 'project_review', label: 'مراجعة المشاريع' },
    { value: 'defense_schedule', label: 'جدولة المناقشات' },
    { value: 'general', label: 'عام' }
  ]

  const getTypeText = (type: Announcement['type']) => {
    return announcementTypes.find(t => t.value === type)?.label || type
  }

  const getTypeColor = (type: Announcement['type']) => {
    const colors = {
      proposal_submission: 'bg-blue-100 text-blue-800',
      project_review: 'bg-green-100 text-green-800',
      defense_schedule: 'bg-purple-100 text-purple-800',
      general: 'bg-gray-100 text-gray-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status: Announcement['status']) => {
    const statuses = {
      active: 'نشط',
      inactive: 'غير نشط',
      upcoming: 'قادم'
    }
    return statuses[status] || status
  }

  const getStatusColor = (status: Announcement['status']) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      upcoming: 'bg-yellow-100 text-yellow-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'عنوان الإعلان مطلوب'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'وصف الإعلان مطلوب'
    }
    if (!formData.startDate) {
      newErrors.startDate = 'تاريخ البداية مطلوب'
    }
    if (!formData.endDate) {
      newErrors.endDate = 'تاريخ النهاية مطلوب'
    }
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))

      if (editingAnnouncement) {
        // Update existing announcement
        setAnnouncements(prev => prev.map(a =>
          a.id === editingAnnouncement.id
            ? { ...a, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
            : a
        ))
      } else {
        // Create new announcement
        const newAnnouncement: Announcement = {
          id: Date.now().toString(),
          ...formData,
          status: 'active',
          createdAt: new Date().toISOString().split('T')[0],
          createdBy: 'د. أحمد محمد' // Current user
        }
        setAnnouncements(prev => [newAnnouncement, ...prev])
      }

      handleCloseModal()
    } catch (error) {
      setErrors({ general: 'حدث خطأ أثناء حفظ الإعلان' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseModal = () => {
    setFormData({
      title: '',
      description: '',
      type: 'proposal_submission',
      startDate: '',
      endDate: ''
    })
    setEditingAnnouncement(null)
    setErrors({})
    setIsModalOpen(false)
  }

  const handleEdit = (announcement: Announcement) => {
    setFormData({
      title: announcement.title,
      description: announcement.description,
      type: announcement.type,
      startDate: announcement.startDate,
      endDate: announcement.endDate
    })
    setEditingAnnouncement(announcement)
    setIsModalOpen(true)
  }

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [announcementIdToDelete, setAnnouncementIdToDelete] = useState<string | null>(null)
  const handleDelete = (id: string) => {
    setAnnouncementIdToDelete(id)
    setConfirmDeleteOpen(true)
  }
  const confirmDelete = () => {
    if (announcementIdToDelete) {
      setAnnouncements(prev => prev.filter(a => a.id !== announcementIdToDelete))
    }
    setConfirmDeleteOpen(false)
    setAnnouncementIdToDelete(null)
  }
  const cancelDelete = () => {
    setConfirmDeleteOpen(false)
    setAnnouncementIdToDelete(null)
  }

  return (
    <div className="space-y-6">
      <Card className="hover-lift">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Megaphone className="w-6 h-6 text-gpms-dark" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">إعلان الفترات الزمنية</h1>
                <p className="text-gray-600 mt-1">إدارة فترات تقديم المقترحات والمناقشات</p>
              </div>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-gpms-dark text-white hover:bg-gpms-light"
            >
              <Plus className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
              إعلان جديد
            </Button>
          </div>
        </CardHeader>
        <Divider />
        <CardContent>
          {announcements.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Megaphone size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد إعلانات</h3>
              <p className="text-gray-600 mb-4">لم يتم إنشاء أي إعلانات بعد</p>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-gpms-dark text-white hover:bg-gpms-light"
              >
                <Plus className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                إنشاء إعلان جديد
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                        <span className={cn(
                          'px-2 py-1 rounded-full text-xs font-medium',
                          getTypeColor(announcement.type)
                        )}>
                          {getTypeText(announcement.type)}
                        </span>
                        <span className={cn(
                          'px-2 py-1 rounded-full text-xs font-medium',
                          getStatusColor(announcement.status)
                        )}>
                          {getStatusText(announcement.status)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{announcement.description}</p>
                      <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                          من: {announcement.startDate}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                          إلى: {announcement.endDate}
                        </div>
                        <div>
                          أنشئ بواسطة: {announcement.createdBy}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(announcement)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(announcement.id)}
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
        title={editingAnnouncement ? 'تعديل الإعلان' : 'إعلان جديد'}
        size="lg"
        onSubmit={handleSubmit}
      >
        <Form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <FormGroup>
              <FormLabel htmlFor="title" required>عنوان الإعلان</FormLabel>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="أدخل عنوان الإعلان..."
                error={errors.title}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="description" required>وصف الإعلان</FormLabel>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="أدخل وصف الإعلان..."
                rows={4}
                className={cn(
                  'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent',
                  errors.description && 'border-red-500'
                )}
              />
              {errors.description && <FormError>{errors.description}</FormError>}
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="type" required>نوع الإعلان</FormLabel>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Announcement['type'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
              >
                {announcementTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </FormGroup>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormGroup>
                <FormLabel htmlFor="startDate" required>تاريخ البداية</FormLabel>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  error={errors.startDate}
                />
              </FormGroup>
              <FormGroup>
                <FormLabel htmlFor="endDate" required>تاريخ النهاية</FormLabel>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  error={errors.endDate}
                />
              </FormGroup>
            </div>

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
                {editingAnnouncement ? 'تحديث' : 'حفظ'}
              </Button>
            </div>
          </div>
        </Form>
      </Modal>

      <ConfirmDialog
        isOpen={confirmDeleteOpen}
        title="تأكيد الحذف"
        description="هل أنت متأكد من حذف هذا الإعلان؟ لا يمكن التراجع عن ذلك."
        variant="destructive"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  )
}

export default CommitteeAnnouncements


