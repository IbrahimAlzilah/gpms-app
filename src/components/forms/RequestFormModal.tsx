import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { cn } from '../../lib/utils'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { Form, FormGroup, FormLabel, FormError } from '../ui/Form'
import Badge from '../ui/Badge'
import { useRequestSubmission } from '../../hooks/forms/useRequestSubmission'
import { 
  MessageSquare, 
  User, 
  Calendar,
  Clock,
  Save,
  XCircle,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

interface RequestFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  editData?: any
}

const RequestFormModal: React.FC<RequestFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editData
}) => {
  const { t } = useLanguage()
  const { isLoading, error, submitRequest, getRequestTypeInfo } = useRequestSubmission()
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState({
    type: editData?.type || 'supervision',
    title: editData?.title || '',
    description: editData?.description || '',
    priority: editData?.priority || 'medium',
    requestedDate: editData?.requestedDate || '',
    supervisor: editData?.supervisor || '',
    reason: editData?.reason || '',
    attachments: editData?.attachments || []
  })

  const requestTypes = [
    { value: 'supervision', label: 'طلب إشراف' },
    { value: 'meeting', label: 'طلب اجتماع' },
    { value: 'extension', label: 'طلب تمديد' },
    { value: 'change_supervisor', label: 'تغيير المشرف' },
    { value: 'change_group', label: 'تغيير المجموعة' },
    { value: 'change_project', label: 'تغيير المشروع' },
    { value: 'other', label: 'طلب آخر' }
  ]

  const priorityLevels = [
    { value: 'low', label: 'منخفض', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'متوسط', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'عالي', color: 'bg-red-100 text-red-800' }
  ]

  const supervisors = [
    { id: '1', name: 'د. أحمد محمد علي' },
    { id: '2', name: 'د. سارة أحمد حسن' },
    { id: '3', name: 'د. خالد محمود الحسن' },
    { id: '4', name: 'د. فاطمة علي محمد' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    try {
      const result = await submitRequest(formData)
      
      if (result.success) {
        onSubmit(formData)
        onClose()
        // Show success message with next step
        if (result.nextStep) {
          alert(`${result.message}\n\n${result.nextStep}`)
        } else {
          alert(result.message)
        }
      } else {
        setErrors({ general: result.message })
      }
      
    } catch (error) {
      setErrors({ general: 'حدث خطأ أثناء إرسال الطلب' })
    }
  }

  const handleCancel = () => {
    setFormData({
      type: 'supervision',
      title: '',
      description: '',
      priority: 'medium',
      requestedDate: '',
      supervisor: '',
      reason: '',
      attachments: []
    })
    setErrors({})
    onClose()
  }

  const getPriorityColor = (priority: string) => {
    const level = priorityLevels.find(p => p.value === priority)
    return level?.color || 'bg-gray-100 text-gray-800'
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={editData ? 'تعديل الطلب' : 'طلب جديد'}
      size="lg"
    >
      <div className="max-h-[80vh] 1overflow-y-auto">
        <Form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Request Type and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <FormGroup>
                <FormLabel htmlFor="type" required>نوع الطلب</FormLabel>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                >
                  {requestTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </FormGroup>

              {/* <FormGroup className='hidden'>
                <FormLabel htmlFor="priority">الأولوية</FormLabel>
                <div className="flex space-x-2 rtl:space-x-reverse">
                  {priorityLevels.map(level => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, priority: level.value }))}
                      className={cn(
                        'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        formData.priority === level.value
                          ? level.color
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      )}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </FormGroup> */}
            </div>

            {/* Title and Description */}
            <FormGroup>
              <FormLabel htmlFor="title" required>عنوان الطلب</FormLabel>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="أدخل عنوان الطلب..."
                error={errors.title}
              />
            </FormGroup>

            {/* Dynamic Fields Based on Request Type */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              {/* Supervisor Selection - Show for supervision and change_supervisor requests */}
              {(formData.type === 'supervision' || formData.type === 'change_supervisor') && (
                <FormGroup>
                  <FormLabel htmlFor="supervisor" required>
                    {formData.type === 'change_supervisor' ? 'المشرف الجديد المطلوب' : 'المشرف المطلوب'}
                  </FormLabel>
                  <select
                    id="supervisor"
                    value={formData.supervisor}
                    onChange={(e) => setFormData(prev => ({ ...prev, supervisor: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                  >
                    <option value="">اختر المشرف</option>
                    {supervisors.map(supervisor => (
                      <option key={supervisor.id} value={supervisor.id}>
                        {supervisor.name}
                      </option>
                    ))}
                  </select>
                </FormGroup>
              )}

              {/* Group Members - Show for change_group requests */}
              {formData.type === 'change_group' && (
                <FormGroup>
                  <FormLabel htmlFor="newGroupMembers">أعضاء المجموعة الجديدة</FormLabel>
                  <textarea
                    id="newGroupMembers"
                    value={formData.reason}
                    onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="اكتب أسماء أعضاء المجموعة الجديدة..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                  />
                </FormGroup>
              )}

              {/* Project Details - Show for change_project requests */}
              {formData.type === 'change_project' && (
                <FormGroup>
                  <FormLabel htmlFor="newProjectDetails">تفاصيل المشروع الجديد</FormLabel>
                  <textarea
                    id="newProjectDetails"
                    value={formData.reason}
                    onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="اكتب تفاصيل المشروع الجديد المطلوب..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                  />
                </FormGroup>
              )}

              {/* Meeting Date - Show for meeting requests */}
              {formData.type === 'meeting' && (
                <FormGroup>
                  <FormLabel htmlFor="requestedDate" required>التاريخ المطلوب للاجتماع</FormLabel>
                  <Input
                    id="requestedDate"
                    type="date"
                    value={formData.requestedDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, requestedDate: e.target.value }))}
                    error={errors.requestedDate}
                    icon={<Calendar size={16} />}
                  />
                </FormGroup>
              )}

              {/* Extension Period - Show for extension requests */}
              {formData.type === 'extension' && (
                <FormGroup>
                  <FormLabel htmlFor="extensionPeriod" required>فترة التمديد المطلوبة</FormLabel>
                  <select
                    id="extensionPeriod"
                    value={formData.reason}
                    onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                  >
                    <option value="">اختر فترة التمديد</option>
                    <option value="1_week">أسبوع واحد</option>
                    <option value="2_weeks">أسبوعين</option>
                    <option value="1_month">شهر واحد</option>
                    <option value="2_months">شهرين</option>
                    <option value="other">فترة أخرى</option>
                  </select>
                </FormGroup>
              )}
            </div>

            <FormGroup>
              <FormLabel htmlFor="description" required>وصف الطلب</FormLabel>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="اكتب وصفاً تفصيلياً للطلب..."
                rows={4}
                className={cn(
                  'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent',
                  errors.description && 'border-red-500'
                )}
              />
              {errors.description && <FormError>{errors.description}</FormError>}
            </FormGroup>

            {/* Reason */}
            {/* <FormGroup>
              <FormLabel htmlFor="reason">السبب/التبرير</FormLabel>
              <textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="اذكر سبب الطلب أو التبرير..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
              />
            </FormGroup> */}

            {/* Status Display for Edit Mode */}
            {editData && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">حالة الطلب</h4>
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <Badge 
                    variant={editData.status === 'approved' ? 'success' : 
                            editData.status === 'rejected' ? 'error' : 'info'}
                  >
                    {editData.status === 'approved' ? 'موافق عليه' :
                     editData.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}
                  </Badge>
                  {editData.status === 'approved' && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle size={16} className="mr-1 rtl:mr-0 rtl:ml-1" />
                      <span className="text-sm">تم الموافقة</span>
                    </div>
                  )}
                  {editData.status === 'rejected' && (
                    <div className="flex items-center text-red-600">
                      <AlertCircle size={16} className="mr-1 rtl:mr-0 rtl:ml-1" />
                      <span className="text-sm">تم الرفض</span>
                    </div>
                  )}
                </div>
              </div>
            )}

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
                {editData ? 'تحديث الطلب' : 'إرسال الطلب'}
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </Modal>
  )
}

export default RequestFormModal
