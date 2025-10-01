import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { cn } from '../../lib/utils'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { Form, FormGroup, FormLabel, FormError } from '../ui/Form'
import Badge from '../ui/Badge'
import { 
  FileText, 
  Upload, 
  X, 
  Plus,
  User,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Save,
  XCircle,
  Eye,
  Edit
} from 'lucide-react'

interface UnifiedProposalFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  editData?: any
  userRole: 'student' | 'supervisor' | 'committee'
  mode: 'create' | 'edit' | 'view'
}

const UnifiedProposalForm: React.FC<UnifiedProposalFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editData,
  userRole,
  mode = 'create'
}) => {
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState({
    title: editData?.title || '',
    description: editData?.description || '',
    objectives: editData?.objectives || '',
    methodology: editData?.methodology || '',
    timeline: editData?.timeline || '',
    resources: editData?.resources || '',
    expectedOutcomes: editData?.expectedOutcomes || '',
    keywords: editData?.keywords || [],
    teamMembers: editData?.teamMembers || [{ name: '', email: '', phone: '', role: 'developer' }],
    attachments: editData?.attachments || [],
    supervisor: editData?.supervisor || '',
    department: editData?.department || '',
    academicYear: editData?.academicYear || new Date().getFullYear().toString(),
    semester: editData?.semester || '1'
  })

  const [newKeyword, setNewKeyword] = useState('')
  const [newAttachment, setNewAttachment] = useState('')

  const roleOptions = [
    { value: 'developer', label: 'مطور' },
    { value: 'designer', label: 'مصمم' },
    { value: 'tester', label: 'مختبر' },
    { value: 'documenter', label: 'موثق' },
    { value: 'researcher', label: 'باحث' }
  ]

  const departmentOptions = [
    { value: 'cs', label: 'علوم الحاسوب' },
    { value: 'se', label: 'هندسة البرمجيات' },
    { value: 'it', label: 'تقنية المعلومات' },
    { value: 'is', label: 'نظم المعلومات' }
  ]

  const supervisorOptions = [
    { id: '1', name: 'د. أحمد محمد علي' },
    { id: '2', name: 'د. سارة أحمد حسن' },
    { id: '3', name: 'د. خالد محمود الحسن' },
    { id: '4', name: 'د. فاطمة علي محمد' }
  ]

  const getRoleSpecificFields = () => {
    switch (userRole) {
      case 'student':
        return (
          <>
            <FormGroup>
              <FormLabel htmlFor="supervisor" required>المشرف المقترح</FormLabel>
              <select
                id="supervisor"
                value={formData.supervisor}
                onChange={(e) => setFormData(prev => ({ ...prev, supervisor: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                disabled={mode === 'view'}
              >
                <option value="">اختر المشرف</option>
                {supervisorOptions.map(supervisor => (
                  <option key={supervisor.id} value={supervisor.id}>
                    {supervisor.name}
                  </option>
                ))}
              </select>
              {errors.supervisor && <FormError>{errors.supervisor}</FormError>}
            </FormGroup>
          </>
        )
      case 'supervisor':
        return (
          <>
            <FormGroup>
              <FormLabel htmlFor="department" required>القسم</FormLabel>
              <select
                id="department"
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                disabled={mode === 'view'}
              >
                <option value="">اختر القسم</option>
                {departmentOptions.map(dept => (
                  <option key={dept.value} value={dept.value}>
                    {dept.label}
                  </option>
                ))}
              </select>
              {errors.department && <FormError>{errors.department}</FormError>}
            </FormGroup>
          </>
        )
      case 'committee':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormGroup>
                <FormLabel htmlFor="academicYear" required>السنة الأكاديمية</FormLabel>
                <Input
                  id="academicYear"
                  type="number"
                  value={formData.academicYear}
                  onChange={(e) => setFormData(prev => ({ ...prev, academicYear: e.target.value }))}
                  placeholder="2024"
                  disabled={mode === 'view'}
                  error={errors.academicYear}
                />
              </FormGroup>
              <FormGroup>
                <FormLabel htmlFor="semester" required>الفصل الدراسي</FormLabel>
                <select
                  id="semester"
                  value={formData.semester}
                  onChange={(e) => setFormData(prev => ({ ...prev, semester: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                  disabled={mode === 'view'}
                >
                  <option value="1">الفصل الأول</option>
                  <option value="2">الفصل الثاني</option>
                  <option value="3">الفصل الصيفي</option>
                </select>
                {errors.semester && <FormError>{errors.semester}</FormError>}
              </FormGroup>
            </div>
          </>
        )
      default:
        return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (mode === 'view') return
    
    setIsLoading(true)
    setErrors({})

    // Validation
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'عنوان المقترح مطلوب'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'وصف المقترح مطلوب'
    }
    if (!formData.objectives.trim()) {
      newErrors.objectives = 'أهداف المشروع مطلوبة'
    }
    if (!formData.methodology.trim()) {
      newErrors.methodology = 'منهجية العمل مطلوبة'
    }
    if (!formData.timeline.trim()) {
      newErrors.timeline = 'الجدول الزمني مطلوب'
    }
    if (!formData.expectedOutcomes.trim()) {
      newErrors.expectedOutcomes = 'النتائج المتوقعة مطلوبة'
    }
    if (formData.keywords.length === 0) {
      newErrors.keywords = 'يجب إضافة كلمات مفتاحية واحدة على الأقل'
    }
    if (formData.teamMembers.length === 0) {
      newErrors.teamMembers = 'يجب إضافة عضو فريق واحد على الأقل'
    }

    // Role-specific validation
    if (userRole === 'student' && !formData.supervisor) {
      newErrors.supervisor = 'المشرف مطلوب'
    }
    if (userRole === 'supervisor' && !formData.department) {
      newErrors.department = 'القسم مطلوب'
    }
    if (userRole === 'committee' && !formData.academicYear) {
      newErrors.academicYear = 'السنة الأكاديمية مطلوبة'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      onSubmit(formData)
      onClose()
      
    } catch (error) {
      setErrors({ general: 'حدث خطأ أثناء حفظ المقترح' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      objectives: '',
      methodology: '',
      timeline: '',
      resources: '',
      expectedOutcomes: '',
      keywords: [],
      teamMembers: [{ name: '', email: '', phone: '', role: 'developer' }],
      attachments: [],
      supervisor: '',
      department: '',
      academicYear: new Date().getFullYear().toString(),
      semester: '1'
    })
    setErrors({})
    onClose()
  }

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }))
      setNewKeyword('')
    }
  }

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }))
  }

  const addTeamMember = () => {
    setFormData(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, { name: '', email: '', phone: '', role: 'developer' }]
    }))
  }

  const updateTeamMember = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map((member, i) => 
        i === index ? { ...member, [field]: value } : member
      )
    }))
  }

  const removeTeamMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
    }))
  }

  const addAttachment = () => {
    if (newAttachment.trim()) {
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, newAttachment.trim()]
      }))
      setNewAttachment('')
    }
  }

  const removeAttachment = (attachment: string) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter(a => a !== attachment)
    }))
  }

  const getModalTitle = () => {
    const baseTitle = mode === 'edit' ? 'تعديل المقترح' : mode === 'view' ? 'عرض المقترح' : 'مقترح جديد'
    return `${baseTitle} - ${userRole === 'student' ? 'طالب' : userRole === 'supervisor' ? 'مشرف' : 'لجنة'}`
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={getModalTitle()}
      size="xl"
    >
      <div className="max-h-[80vh] overflow-y-auto">
        <Form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
                المعلومات الأساسية
              </h3>
              <div className="space-y-4">
                <FormGroup>
                  <FormLabel htmlFor="title" required>عنوان المقترح</FormLabel>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="أدخل عنوان المقترح..."
                    disabled={mode === 'view'}
                    error={errors.title}
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="description" required>وصف المقترح</FormLabel>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="أدخل وصفاً مفصلاً للمقترح..."
                    rows={4}
                    disabled={mode === 'view'}
                    className={cn(
                      'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent',
                      errors.description && 'border-red-500'
                    )}
                  />
                  {errors.description && <FormError>{errors.description}</FormError>}
                </FormGroup>

                {getRoleSpecificFields()}
              </div>
            </div>

            {/* Project Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
                تفاصيل المشروع
              </h3>
              <div className="space-y-4">
                <FormGroup>
                  <FormLabel htmlFor="objectives" required>أهداف المشروع</FormLabel>
                  <textarea
                    id="objectives"
                    value={formData.objectives}
                    onChange={(e) => setFormData(prev => ({ ...prev, objectives: e.target.value }))}
                    placeholder="اذكر أهداف المشروع الرئيسية..."
                    rows={3}
                    disabled={mode === 'view'}
                    className={cn(
                      'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent',
                      errors.objectives && 'border-red-500'
                    )}
                  />
                  {errors.objectives && <FormError>{errors.objectives}</FormError>}
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="methodology" required>منهجية العمل</FormLabel>
                  <textarea
                    id="methodology"
                    value={formData.methodology}
                    onChange={(e) => setFormData(prev => ({ ...prev, methodology: e.target.value }))}
                    placeholder="اشرح منهجية العمل والخطوات المتبعة..."
                    rows={3}
                    disabled={mode === 'view'}
                    className={cn(
                      'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent',
                      errors.methodology && 'border-red-500'
                    )}
                  />
                  {errors.methodology && <FormError>{errors.methodology}</FormError>}
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="timeline" required>الجدول الزمني</FormLabel>
                  <textarea
                    id="timeline"
                    value={formData.timeline}
                    onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                    placeholder="اذكر الجدول الزمني للمشروع..."
                    rows={3}
                    disabled={mode === 'view'}
                    className={cn(
                      'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent',
                      errors.timeline && 'border-red-500'
                    )}
                  />
                  {errors.timeline && <FormError>{errors.timeline}</FormError>}
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="resources">الموارد المطلوبة</FormLabel>
                  <textarea
                    id="resources"
                    value={formData.resources}
                    onChange={(e) => setFormData(prev => ({ ...prev, resources: e.target.value }))}
                    placeholder="اذكر الموارد المطلوبة للمشروع..."
                    rows={3}
                    disabled={mode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="expectedOutcomes" required>النتائج المتوقعة</FormLabel>
                  <textarea
                    id="expectedOutcomes"
                    value={formData.expectedOutcomes}
                    onChange={(e) => setFormData(prev => ({ ...prev, expectedOutcomes: e.target.value }))}
                    placeholder="اذكر النتائج المتوقعة من المشروع..."
                    rows={3}
                    disabled={mode === 'view'}
                    className={cn(
                      'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent',
                      errors.expectedOutcomes && 'border-red-500'
                    )}
                  />
                  {errors.expectedOutcomes && <FormError>{errors.expectedOutcomes}</FormError>}
                </FormGroup>
              </div>
            </div>

            {/* Keywords */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">الكلمات المفتاحية</h3>
              <div className="space-y-3">
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <Input
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="أدخل كلمة مفتاحية..."
                    disabled={mode === 'view'}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  />
                  {mode !== 'view' && (
                    <Button type="button" onClick={addKeyword} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center space-x-1 rtl:space-x-reverse">
                      <span>{keyword}</span>
                      {mode !== 'view' && (
                        <button
                          type="button"
                          onClick={() => removeKeyword(keyword)}
                          className="ml-1 rtl:mr-1 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                {errors.keywords && <FormError>{errors.keywords}</FormError>}
              </div>
            </div>

            {/* Team Members */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
                أعضاء الفريق
              </h3>
              <div className="space-y-4">
                {formData.teamMembers.map((member, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormGroup>
                        <FormLabel>اسم العضو</FormLabel>
                        <Input
                          value={member.name}
                          onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                          placeholder="اسم العضو"
                          disabled={mode === 'view'}
                        />
                      </FormGroup>
                      <FormGroup>
                        <FormLabel>البريد الإلكتروني</FormLabel>
                        <Input
                          type="email"
                          value={member.email}
                          onChange={(e) => updateTeamMember(index, 'email', e.target.value)}
                          placeholder="البريد الإلكتروني"
                          disabled={mode === 'view'}
                        />
                      </FormGroup>
                      <FormGroup>
                        <FormLabel>رقم الهاتف</FormLabel>
                        <Input
                          value={member.phone}
                          onChange={(e) => updateTeamMember(index, 'phone', e.target.value)}
                          placeholder="رقم الهاتف"
                          disabled={mode === 'view'}
                        />
                      </FormGroup>
                      <FormGroup>
                        <FormLabel>الدور</FormLabel>
                        <select
                          value={member.role}
                          onChange={(e) => updateTeamMember(index, 'role', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                          disabled={mode === 'view'}
                        >
                          {roleOptions.map(role => (
                            <option key={role.value} value={role.value}>
                              {role.label}
                            </option>
                          ))}
                        </select>
                      </FormGroup>
                    </div>
                    {mode !== 'view' && formData.teamMembers.length > 1 && (
                      <div className="mt-3 flex justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeTeamMember(index)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <X className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                          حذف
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                {mode !== 'view' && (
                  <Button type="button" onClick={addTeamMember} variant="outline">
                    <Plus className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                    إضافة عضو
                  </Button>
                )}
                {errors.teamMembers && <FormError>{errors.teamMembers}</FormError>}
              </div>
            </div>

            {/* Attachments */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Upload className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
                المرفقات
              </h3>
              <div className="space-y-3">
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <Input
                    value={newAttachment}
                    onChange={(e) => setNewAttachment(e.target.value)}
                    placeholder="أدخل اسم المرفق..."
                    disabled={mode === 'view'}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAttachment())}
                  />
                  {mode !== 'view' && (
                    <Button type="button" onClick={addAttachment} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  {formData.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{attachment}</span>
                      {mode !== 'view' && (
                        <button
                          type="button"
                          onClick={() => removeAttachment(attachment)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {errors.general}
              </div>
            )}

            {mode !== 'view' && (
              <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-4 border-t">
                <Button variant="outline" type="button" onClick={handleCancel}>
                  <XCircle className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                  إلغاء
                </Button>
                <Button type="submit" loading={isLoading}>
                  <Save className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                  {mode === 'edit' ? 'تحديث' : 'حفظ'}
                </Button>
              </div>
            )}
          </div>
        </Form>
      </div>
    </Modal>
  )
}

export default UnifiedProposalForm


