import React, { useState, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { Form, FormGroup, FormLabel, FormError } from '../ui/Form'
import { Period, PeriodType, CreatePeriodInput, UpdatePeriodInput } from '@/services/periods.service'
import { useNotifications } from '@/context/NotificationContext'

interface PeriodAnnouncementFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreatePeriodInput | UpdatePeriodInput) => Promise<void>
  period?: Period
}

const PeriodAnnouncementForm: React.FC<PeriodAnnouncementFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  period
}) => {
  const { t } = useLanguage()
  const { addNotification } = useNotifications()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<CreatePeriodInput>({
    type: 'proposal_submission',
    name: '',
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    if (period) {
      setFormData({
        type: period.type,
        name: period.name,
        startDate: period.startDate,
        endDate: period.endDate
      })
    } else {
      setFormData({
        type: 'proposal_submission',
        name: '',
        startDate: '',
        endDate: ''
      })
    }
    setErrors({})
  }, [period, isOpen])

  const periodTypes: Array<{ value: PeriodType; label: string }> = [
    { value: 'proposal_submission', label: 'تقديم المقترحات' },
    { value: 'project_registration', label: 'التسجيل في المشاريع' },
    { value: 'document_submission', label: 'تسليم الوثائق' },
    { value: 'evaluation', label: 'التقييم' },
    { value: 'defense', label: 'المناقشة' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'اسم الفترة مطلوب'
    }

    if (!formData.startDate) {
      newErrors.startDate = 'تاريخ البداية مطلوب'
    }

    if (!formData.endDate) {
      newErrors.endDate = 'تاريخ النهاية مطلوب'
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      if (end <= start) {
        newErrors.endDate = 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية'
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      await onSubmit(formData)
      addNotification({
        title: 'تم الحفظ',
        message: period ? 'تم تحديث الفترة بنجاح' : 'تم إنشاء الفترة بنجاح',
        type: 'success'
      })
      onClose()
    } catch (error) {
      addNotification({
        title: 'خطأ',
        message: error instanceof Error ? error.message : 'حدث خطأ أثناء حفظ الفترة',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      type: 'proposal_submission',
      name: '',
      startDate: '',
      endDate: ''
    })
    setErrors({})
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={period ? 'تعديل الفترة الزمنية' : 'إعلان فترة زمنية جديدة'}
      size="md"
    >
      <Form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <FormGroup>
            <FormLabel htmlFor="type" required>نوع الفترة</FormLabel>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as PeriodType }))}
              disabled={!!period}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent disabled:bg-gray-100"
            >
              {periodTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="name" required>اسم الفترة</FormLabel>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="مثال: فترة تقديم المقترحات للفصل الدراسي الأول 2024"
              error={errors.name}
            />
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

          {errors.general && <FormError>{errors.general}</FormError>}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={handleCancel}>
              إلغاء
            </Button>
            <Button type="submit" loading={isLoading}>
              {period ? 'تحديث' : 'إنشاء'}
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  )
}

export default PeriodAnnouncementForm

