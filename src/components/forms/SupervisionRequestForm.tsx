import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { cn } from '../../lib/utils'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { Form, FormGroup, FormLabel, FormError } from '../ui/Form'
import { Card, CardContent, CardHeader } from '../ui/Card'
import Badge from '../ui/Badge'
import { 
  UserCheck, 
  Search, 
  Star,
  BookOpen,
  Clock,
  CheckCircle,
  MessageSquare
} from 'lucide-react'

interface SupervisionRequestFormProps {
  onSubmit?: (data: any) => void
  className?: string
}

// Mock supervisors data
const mockSupervisors = [
  {
    id: 1,
    name: 'د. أحمد محمد علي',
    title: 'أستاذ مساعد - هندسة الحاسوب',
    specialization: ['تطوير الويب', 'قواعد البيانات', 'الذكاء الاصطناعي'],
    currentProjects: 5,
    maxCapacity: 8,
    rating: 4.8,
    availability: 'متاح',
    email: 'ahmed.mohamed@university.edu',
    officeHours: 'الأحد والثلاثاء 10:00 ص - 12:00 م',
    biography: 'أستاذ مساعد في قسم هندسة الحاسوب مع خبرة 10 سنوات في تطوير التطبيقات والذكاء الاصطناعي'
  },
  {
    id: 2,
    name: 'د. سارة أحمد حسن',
    title: 'أستاذ مشارك - هندسة البرمجيات',
    specialization: ['هندسة البرمجيات', 'تطبيقات الجوال', 'أمان المعلومات'],
    currentProjects: 7,
    maxCapacity: 8,
    rating: 4.9,
    availability: 'مشغول',
    email: 'sara.ahmed@university.edu',
    officeHours: 'الاثنين والأربعاء 2:00 م - 4:00 م',
    biography: 'أستاذ مشارك متخصص في هندسة البرمجيات وأمان المعلومات مع خبرة واسعة في الأبحاث'
  },
  {
    id: 3,
    name: 'د. خالد محمود الحسن',
    title: 'أستاذ - شبكات الحاسوب',
    specialization: ['شبكات الحاسوب', 'الحوسبة السحابية', 'إنترنت الأشياء'],
    currentProjects: 3,
    maxCapacity: 8,
    rating: 4.7,
    availability: 'متاح',
    email: 'khaled.mahmoud@university.edu',
    officeHours: 'الثلاثاء والخميس 11:00 ص - 1:00 م',
    biography: 'أستاذ في قسم شبكات الحاسوب مع خبرة واسعة في الحوسبة السحابية وإنترنت الأشياء'
  }
]

const SupervisionRequestForm: React.FC<SupervisionRequestFormProps> = ({
  onSubmit,
  className
}) => {
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSupervisor, setSelectedSupervisor] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    projectTitle: '',
    projectDescription: '',
    reasonForChoice: '',
    previousContact: false,
    contactDetails: '',
    preferredMeetingTime: '',
    additionalNotes: ''
  })

  const filteredSupervisors = mockSupervisors.filter(supervisor =>
    supervisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supervisor.specialization.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    // Validation
    const newErrors: Record<string, string> = {}
    
    if (!selectedSupervisor) {
      newErrors.supervisor = 'يرجى اختيار مشرف'
    }
    
    if (!formData.projectTitle.trim()) {
      newErrors.projectTitle = 'عنوان المشروع مطلوب'
    }
    
    if (!formData.projectDescription.trim()) {
      newErrors.projectDescription = 'وصف المشروع مطلوب'
    }
    
    if (!formData.reasonForChoice.trim()) {
      newErrors.reasonForChoice = 'سبب اختيار المشرف مطلوب'
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
        onSubmit({
          ...formData,
          supervisor: selectedSupervisor
        })
      }
      
      // Reset form or show success message
      alert('تم إرسال طلب الإشراف بنجاح!')
      
    } catch (error) {
      setErrors({ general: 'حدث خطأ أثناء إرسال الطلب' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('max-w-6xl mx-auto', className)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Supervisors List */}
        <div className="lg:col-span-2">
          <Card className="animate-fade-in">
            <CardHeader>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-10 h-10 bg-gpms-light rounded-lg flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">اختيار المشرف</h2>
                  <p className="text-sm text-gray-600">اختر المشرف المناسب لمشروعك</p>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="البحث بالاسم أو التخصص..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                  />
                </div>
              </div>

              {/* Supervisors Grid */}
              <div className="space-y-4">
                {filteredSupervisors.map((supervisor) => (
                  <div
                    key={supervisor.id}
                    className={cn(
                      'border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md',
                      selectedSupervisor?.id === supervisor.id
                        ? 'border-gpms-light bg-gpms-light/5'
                        : 'border-gray-200'
                    )}
                    onClick={() => setSelectedSupervisor(supervisor)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{supervisor.name}</h3>
                        <p className="text-sm text-gray-600">{supervisor.title}</p>
                      </div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Badge 
                          variant={supervisor.availability === 'متاح' ? 'success' : 'warning'}
                          size="sm"
                        >
                          {supervisor.availability}
                        </Badge>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-gray-600 mr-1 rtl:mr-0 rtl:ml-1">
                            {supervisor.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-3">{supervisor.biography}</p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {supervisor.specialization.map((spec, index) => (
                        <Badge key={index} variant="info" size="sm">
                          {spec}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                        <span>المشاريع: {supervisor.currentProjects}/{supervisor.maxCapacity}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                        <span>{supervisor.officeHours}</span>
                      </div>
                    </div>

                    {selectedSupervisor?.id === supervisor.id && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center text-gpms-dark">
                          <CheckCircle className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                          <span className="text-sm font-medium">تم اختيار هذا المشرف</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {errors.supervisor && (
                <div className="mt-4 text-red-600 text-sm">{errors.supervisor}</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Request Form */}
        <div>
          <Card className="animate-slide-in-right">
            <CardHeader>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-10 h-10 bg-gpms-dark rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">طلب الإشراف</h2>
                  <p className="text-sm text-gray-600">املأ تفاصيل الطلب</p>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <FormGroup>
                    <FormLabel htmlFor="projectTitle" required>عنوان المشروع</FormLabel>
                    <Input
                      id="projectTitle"
                      value={formData.projectTitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, projectTitle: e.target.value }))}
                      placeholder="عنوان المشروع..."
                      error={errors.projectTitle}
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel htmlFor="projectDescription" required>وصف مختصر للمشروع</FormLabel>
                    <textarea
                      id="projectDescription"
                      value={formData.projectDescription}
                      onChange={(e) => setFormData(prev => ({ ...prev, projectDescription: e.target.value }))}
                      placeholder="وصف مختصر للمشروع..."
                      rows={3}
                      className={cn(
                        'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent',
                        errors.projectDescription && 'border-red-500'
                      )}
                    />
                    {errors.projectDescription && <FormError>{errors.projectDescription}</FormError>}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel htmlFor="reasonForChoice" required>سبب اختيار هذا المشرف</FormLabel>
                    <textarea
                      id="reasonForChoice"
                      value={formData.reasonForChoice}
                      onChange={(e) => setFormData(prev => ({ ...prev, reasonForChoice: e.target.value }))}
                      placeholder="لماذا اخترت هذا المشرف؟"
                      rows={3}
                      className={cn(
                        'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent',
                        errors.reasonForChoice && 'border-red-500'
                      )}
                    />
                    {errors.reasonForChoice && <FormError>{errors.reasonForChoice}</FormError>}
                  </FormGroup>

                  <FormGroup>
                    <label className="flex items-center space-x-2 rtl:space-x-reverse">
                      <input
                        type="checkbox"
                        checked={formData.previousContact}
                        onChange={(e) => setFormData(prev => ({ ...prev, previousContact: e.target.checked }))}
                        className="rounded border-gray-300 text-gpms-dark focus:ring-gpms-light"
                      />
                      <span className="text-sm text-gray-700">تواصلت مع المشرف مسبقاً</span>
                    </label>
                  </FormGroup>

                  {formData.previousContact && (
                    <FormGroup>
                      <FormLabel htmlFor="contactDetails">تفاصيل التواصل السابق</FormLabel>
                      <textarea
                        id="contactDetails"
                        value={formData.contactDetails}
                        onChange={(e) => setFormData(prev => ({ ...prev, contactDetails: e.target.value }))}
                        placeholder="اذكر تفاصيل التواصل السابق..."
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                      />
                    </FormGroup>
                  )}

                  <FormGroup>
                    <FormLabel htmlFor="preferredMeetingTime">الوقت المفضل للاجتماع</FormLabel>
                    <Input
                      id="preferredMeetingTime"
                      value={formData.preferredMeetingTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, preferredMeetingTime: e.target.value }))}
                      placeholder="مثال: الأحد 10:00 ص"
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel htmlFor="additionalNotes">ملاحظات إضافية</FormLabel>
                    <textarea
                      id="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                      placeholder="أي ملاحظات إضافية..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                    />
                  </FormGroup>

                  {errors.general && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      {errors.general}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    loading={isLoading}
                    className="w-full"
                    disabled={!selectedSupervisor}
                  >
                    إرسال طلب الإشراف
                  </Button>
                </div>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default SupervisionRequestForm
