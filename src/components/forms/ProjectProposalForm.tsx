import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { cn } from '../../lib/utils'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { Form, FormGroup, FormLabel, FormError } from '../ui/Form'
import { Card, CardContent, CardHeader } from '../ui/Card'
import { 
  FileText, 
  Upload, 
  X, 
  Plus,
  User,
  Mail,
  Phone,
  Calendar,
  BookOpen
} from 'lucide-react'

interface ProjectProposalFormProps {
  onSubmit?: (data: any) => void
  className?: string
}

const ProjectProposalForm: React.FC<ProjectProposalFormProps> = ({
  onSubmit,
  className
}) => {
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    objectives: '',
    methodology: '',
    timeline: '',
    resources: '',
    expectedOutcomes: '',
    keywords: [],
    teamMembers: [{ name: '', email: '', phone: '', role: 'developer' }],
    attachments: []
  })

  const [newKeyword, setNewKeyword] = useState('')

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
    if (formData.teamMembers.length > 1) {
      setFormData(prev => ({
        ...prev,
        teamMembers: prev.teamMembers.filter((_, i) => i !== index)
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    // Validation
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'عنوان المشروع مطلوب'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'وصف المشروع مطلوب'
    }
    
    if (!formData.objectives.trim()) {
      newErrors.objectives = 'أهداف المشروع مطلوبة'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      if (onSubmit) {
        onSubmit(formData)
      }
      
      // Reset form or show success message
      alert('تم إرسال مقترح المشروع بنجاح!')
      
    } catch (error) {
      setErrors({ general: 'حدث خطأ أثناء إرسال المقترح' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('max-w-4xl mx-auto', className)}>
      <Card className="animate-fade-in">
        <CardHeader>
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-10 h-10 bg-gpms-light rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">مقترح مشروع التخرج</h2>
              <p className="text-sm text-gray-600">املأ جميع البيانات المطلوبة لتقديم مقترح المشروع</p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">المعلومات الأساسية</h3>
              
              <FormGroup>
                <FormLabel htmlFor="title" required>عنوان المشروع</FormLabel>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="أدخل عنوان المشروع..."
                  error={errors.title}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="description" required>وصف المشروع</FormLabel>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="اكتب وصفاً تفصيلياً للمشروع..."
                  rows={4}
                  className={cn(
                    'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent',
                    errors.description && 'border-red-500'
                  )}
                />
                {errors.description && <FormError>{errors.description}</FormError>}
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="objectives" required>أهداف المشروع</FormLabel>
                <textarea
                  id="objectives"
                  value={formData.objectives}
                  onChange={(e) => setFormData(prev => ({ ...prev, objectives: e.target.value }))}
                  placeholder="اذكر الأهداف الرئيسية للمشروع..."
                  rows={3}
                  className={cn(
                    'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent',
                    errors.objectives && 'border-red-500'
                  )}
                />
                {errors.objectives && <FormError>{errors.objectives}</FormError>}
              </FormGroup>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormGroup>
                  <FormLabel htmlFor="methodology">المنهجية</FormLabel>
                  <textarea
                    id="methodology"
                    value={formData.methodology}
                    onChange={(e) => setFormData(prev => ({ ...prev, methodology: e.target.value }))}
                    placeholder="اشرح المنهجية المتبعة..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="timeline">الجدول الزمني</FormLabel>
                  <textarea
                    id="timeline"
                    value={formData.timeline}
                    onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                    placeholder="حدد الجدول الزمني للمشروع..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                  />
                </FormGroup>
              </div>

              <FormGroup>
                <FormLabel htmlFor="resources">الموارد المطلوبة</FormLabel>
                <textarea
                  id="resources"
                  value={formData.resources}
                  onChange={(e) => setFormData(prev => ({ ...prev, resources: e.target.value }))}
                  placeholder="اذكر الموارد والأدوات المطلوبة..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                />
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="expectedOutcomes">النتائج المتوقعة</FormLabel>
                <textarea
                  id="expectedOutcomes"
                  value={formData.expectedOutcomes}
                  onChange={(e) => setFormData(prev => ({ ...prev, expectedOutcomes: e.target.value }))}
                  placeholder="اذكر النتائج والمخرجات المتوقعة..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                />
              </FormGroup>

              {/* Keywords */}
              <FormGroup>
                <FormLabel>الكلمات المفتاحية</FormLabel>
                <div className="space-y-3">
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Input
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      placeholder="أضف كلمة مفتاحية..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                    />
                    <Button type="button" onClick={addKeyword} size="sm">
                      <Plus size={16} />
                    </Button>
                  </div>
                  {formData.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-gpms-light text-white text-sm rounded-full"
                        >
                          {keyword}
                          <button
                            type="button"
                            onClick={() => removeKeyword(keyword)}
                            className="mr-2 rtl:mr-0 rtl:ml-2 hover:text-red-200"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </FormGroup>

              {/* Team Members */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">أعضاء الفريق</h3>
                  <Button type="button" onClick={addTeamMember} size="sm" variant="outline">
                    <Plus size={16} className="mr-1 rtl:mr-0 rtl:ml-1" />
                    إضافة عضو
                  </Button>
                </div>

                {formData.teamMembers.map((member, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">العضو {index + 1}</h4>
                      {formData.teamMembers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTeamMember(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        value={member.name}
                        onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                        placeholder="الاسم الكامل"
                        icon={<User size={16} />}
                      />
                      <Input
                        value={member.email}
                        onChange={(e) => updateTeamMember(index, 'email', e.target.value)}
                        placeholder="البريد الإلكتروني"
                        type="email"
                        icon={<Mail size={16} />}
                      />
                      <Input
                        value={member.phone}
                        onChange={(e) => updateTeamMember(index, 'phone', e.target.value)}
                        placeholder="رقم الهاتف"
                        icon={<Phone size={16} />}
                      />
                      <select
                        value={member.role}
                        onChange={(e) => updateTeamMember(index, 'role', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                      >
                        <option value="developer">مطور</option>
                        <option value="designer">مصمم</option>
                        <option value="researcher">باحث</option>
                        <option value="analyst">محلل</option>
                        <option value="tester">مختبر</option>
                      </select>
                    </div>
                  </Card>
                ))}
              </div>

              {/* File Attachments */}
              <FormGroup>
                <FormLabel>المرفقات</FormLabel>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gpms-light transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">اسحب الملفات هنا أو انقر للاختيار</p>
                  <p className="text-sm text-gray-500">PDF, DOC, DOCX, PPT, PPTX (حد أقصى 10 ميجابايت)</p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    className="hidden"
                    onChange={(e) => {
                      // Handle file upload
                      const files = Array.from(e.target.files || [])
                      console.log('Selected files:', files)
                    }}
                  />
                </div>
              </FormGroup>

              {/* Error Display */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {errors.general}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-6 border-t">
                <Button variant="outline" type="button">
                  حفظ كمسودة
                </Button>
                <Button type="submit" loading={isLoading}>
                  إرسال المقترح
                </Button>
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProjectProposalForm
