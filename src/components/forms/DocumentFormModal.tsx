import React, { useState, useRef } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { cn } from '../../lib/utils'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { Form, FormGroup, FormLabel, FormError } from '../ui/Form'
import Badge from '../ui/Badge'
import ProgressBar from '../ui/ProgressBar'
import { 
  Upload, 
  File,
  FileText,
  Image,
  Video,
  Archive,
  X,
  Save,
  XCircle,
  CheckCircle,
  AlertCircle,
  Download,
  Eye
} from 'lucide-react'

interface DocumentFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  editData?: any
}

interface UploadedFile {
  id: string
  file: File
  name: string
  size: number
  type: string
  progress: number
  status: 'uploading' | 'completed' | 'error'
  error?: string
  url?: string
}

const DocumentFormModal: React.FC<DocumentFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editData
}) => {
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    title: editData?.title || '',
    description: editData?.description || '',
    category: editData?.category || 'document',
    version: editData?.version || '1.0',
    tags: editData?.tags || [],
    projectId: editData?.projectId || '',
    isPublic: editData?.isPublic || false
  })

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [dragActive, setDragActive] = useState(false)

  const categories = [
    { value: 'document', label: 'مستند' },
    { value: 'report', label: 'تقرير' },
    { value: 'presentation', label: 'عرض تقديمي' },
    { value: 'code', label: 'كود مصدري' },
    { value: 'design', label: 'تصميم' },
    { value: 'final_report_chapters', label: 'فصول التقرير النهائي' },
    { value: 'presentation_codes', label: 'أكواد العرض' },
    { value: 'image', label: 'صورة' },
    { value: 'video', label: 'فيديو' },
    { value: 'other', label: 'أخرى' }
  ]

  const projects = [
    { id: '1', title: 'تطبيق إدارة المكتبة الذكية' },
    { id: '2', title: 'نظام إدارة المستشفى' },
    { id: '3', title: 'مشروع الذكاء الاصطناعي' },
    { id: '4', title: 'تطبيق التجارة الإلكترونية' }
  ]

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return Image
    if (type.includes('video')) return Video
    if (type.includes('pdf') || type.includes('document')) return FileText
    if (type.includes('zip') || type.includes('rar')) return Archive
    return File
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.txt', '.jpg', '.png', '.zip', '.rar']
    
    if (file.size > maxSize) {
      return 'حجم الملف كبير جداً. الحد الأقصى 10 ميجابايت'
    }

    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!allowedTypes.includes(fileExtension)) {
      return 'نوع الملف غير مدعوم'
    }

    return null
  }

  const simulateFileUpload = (file: UploadedFile): Promise<void> => {
    return new Promise((resolve, reject) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 20
        if (progress >= 100) {
          progress = 100
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === file.id 
                ? { ...f, progress, status: 'completed', url: URL.createObjectURL(f.file) }
                : f
            )
          )
          clearInterval(interval)
          resolve()
        } else {
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === file.id ? { ...f, progress } : f
            )
          )
        }
      }, 200)

      // Simulate occasional errors
      if (Math.random() < 0.1) {
        setTimeout(() => {
          clearInterval(interval)
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === file.id 
                ? { ...f, status: 'error', error: 'فشل في رفع الملف' }
                : f
            )
          )
          reject(new Error('Upload failed'))
        }, 1000)
      }
    })
  }

  const handleFileSelection = async (files: FileList) => {
    const newFiles: UploadedFile[] = []
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      const validationError = validateFile(file)
      if (validationError) {
        setErrors({ files: validationError })
        continue
      }

      const uploadedFile: UploadedFile = {
        id: Math.random().toString(36).substring(7),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: 'uploading'
      }

      newFiles.push(uploadedFile)
    }

    if (newFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...newFiles])
      setErrors({})

      // Start uploading files
      for (const file of newFiles) {
        try {
          await simulateFileUpload(file)
        } catch (error) {
          console.error('Upload failed for file:', file.name)
        }
      }
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    // Validation
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'عنوان المستند مطلوب'
    }
    
    if (uploadedFiles.length === 0) {
      newErrors.files = 'يرجى رفع ملف واحد على الأقل'
    }

    if (uploadedFiles.some(f => f.status === 'uploading')) {
      newErrors.files = 'انتظر حتى اكتمال رفع جميع الملفات'
    }

    if (uploadedFiles.some(f => f.status === 'error')) {
      newErrors.files = 'يوجد ملفات فشل رفعها. يرجى إعادة المحاولة'
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
        files: uploadedFiles.filter(f => f.status === 'completed')
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
      title: '',
      description: '',
      category: 'document',
      version: '1.0',
      tags: [],
      projectId: '',
      isPublic: false
    })
    setUploadedFiles([])
    setErrors({})
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={editData ? 'تعديل المستند' : 'رفع مستند جديد'}
      size="xl"
    >
      <div className="max-h-[80vh] overflow-y-auto">
        <Form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormGroup>
                <FormLabel htmlFor="title" required>عنوان المستند</FormLabel>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="أدخل عنوان المستند..."
                  error={errors.title}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="category">نوع المستند</FormLabel>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </FormGroup>

              {/* <FormGroup>
                <FormLabel htmlFor="version">رقم الإصدار</FormLabel>
                <Input
                  id="version"
                  value={formData.version}
                  onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                  placeholder="1.0"
                />
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="projectId">المشروع المرتبط</FormLabel>
                <select
                  id="projectId"
                  value={formData.projectId}
                  onChange={(e) => setFormData(prev => ({ ...prev, projectId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                >
                  <option value="">اختر المشروع</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </FormGroup> */}
            </div>

            <FormGroup>
              <FormLabel htmlFor="description">وصف المستند</FormLabel>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="اكتب وصفاً مختصراً للمستند..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
              />
            </FormGroup>

            {/* Public Access */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <input
                type="checkbox"
                id="isPublic"
                checked={formData.isPublic}
                onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                className="rounded border-gray-300 text-gpms-dark focus:ring-gpms-light"
              />
              <label htmlFor="isPublic" className="text-sm text-gray-700">
                جعل المستند عام (يمكن للجميع الوصول إليه)
              </label>
            </div>

            {/* File Upload Area */}
            <FormGroup>
              <FormLabel>الملفات</FormLabel>
              <div
                className={cn(
                  'border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer',
                  dragActive 
                    ? 'border-gpms-light bg-gpms-light/5' 
                    : 'border-gray-300 hover:border-gpms-light'
                )}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                <h3 className="text-md font-medium text-gray-900 mb-2">
                  اسحب الملفات هنا أو انقر للاختيار
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  PDF, DOC, DOCX, PPT, PPTX, TXT, JPG, PNG, ZIP, RAR
                </p>
                <p className="text-sm text-gray-500">
                  حد أقصى 10 ميجابايت لكل ملف
                </p>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.png,.zip,.rar"
                  onChange={(e) => e.target.files && handleFileSelection(e.target.files)}
                  className="hidden"
                />
              </div>

              {errors.files && (
                <FormError>{errors.files}</FormError>
              )}
            </FormGroup>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">الملفات المرفوعة</h3>
                
                {uploadedFiles.map((file) => {
                  const FileIcon = getFileIcon(file.type)
                  
                  return (
                    <div key={file.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <FileIcon className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{file.name}</p>
                            <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          {file.status === 'completed' && (
                            <>
                              <button className="text-gray-400 hover:text-gray-600">
                                <Eye size={16} />
                              </button>
                              <button className="text-gray-400 hover:text-gray-600">
                                <Download size={16} />
                              </button>
                            </>
                          )}
                          
                          <button
                            onClick={() => removeFile(file.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {file.status === 'uploading' && (
                        <ProgressBar
                          value={file.progress}
                          label="جاري الرفع..."
                          color="blue"
                          className="mb-2"
                        />
                      )}

                      {/* Status */}
                      <div className="flex items-center">
                        {file.status === 'completed' && (
                          <div className="flex items-center text-green-600">
                            <CheckCircle size={16} className="mr-1 rtl:mr-0 rtl:ml-1" />
                            <span className="text-sm">تم الرفع بنجاح</span>
                          </div>
                        )}
                        
                        {file.status === 'error' && (
                          <div className="flex items-center text-red-600">
                            <AlertCircle size={16} className="mr-1 rtl:mr-0 rtl:ml-1" />
                            <span className="text-sm">{file.error || 'فشل في الرفع'}</span>
                          </div>
                        )}
                        
                        {file.status === 'uploading' && (
                          <div className="flex items-center text-blue-600">
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin ml-1 rtl:ml-0 rtl:mr-1" />
                            <span className="text-sm">جاري الرفع...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Error Display */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {errors.general}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-6 border-t">
              <Button variant="outline" type="button" onClick={handleCancel}>
                <XCircle className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                إلغاء
              </Button>
              <Button type="submit" loading={isLoading}>
                <Save className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                {editData ? 'تحديث المستند' : 'رفع المستند'}
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </Modal>
  )
}

export default DocumentFormModal
