import React, { useState, useRef } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { cn } from '../../lib/utils'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { Form, FormGroup, FormLabel, FormError } from '../ui/Form'
import { Card, CardContent, CardHeader } from '../ui/Card'
import Badge from '../ui/Badge'
import ProgressBar from '../ui/ProgressBar'
import { 
  Upload, 
  X, 
  File,
  FileText,
  Image,
  CheckCircle,
  AlertCircle,
  Download,
  Eye
} from 'lucide-react'

interface FileUploadFormProps {
  onSubmit?: (data: any) => void
  allowedTypes?: string[]
  maxFileSize?: number // in MB
  maxFiles?: number
  className?: string
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

const FileUploadForm: React.FC<FileUploadFormProps> = ({
  onSubmit,
  allowedTypes = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.txt', '.jpg', '.png'],
  maxFileSize = 10, // 10MB
  maxFiles = 5,
  className
}) => {
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'document',
    version: '1.0',
    tags: []
  })

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [dragActive, setDragActive] = useState(false)

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return Image
    if (type.includes('pdf') || type.includes('document')) return FileText
    return File
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `حجم الملف كبير جداً. الحد الأقصى ${maxFileSize} ميجابايت`
    }

    // Check file type
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
      
      // Check if we've reached max files limit
      if (uploadedFiles.length + newFiles.length >= maxFiles) {
        setErrors({ files: `لا يمكن رفع أكثر من ${maxFiles} ملفات` })
        break
      }

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

  const retryUpload = async (fileId: string) => {
    const file = uploadedFiles.find(f => f.id === fileId)
    if (file) {
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { ...f, status: 'uploading', progress: 0, error: undefined }
            : f
        )
      )
      
      try {
        await simulateFileUpload(file)
      } catch (error) {
        console.error('Retry upload failed for file:', file.name)
      }
    }
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
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      if (onSubmit) {
        onSubmit({
          ...formData,
          files: uploadedFiles.filter(f => f.status === 'completed')
        })
      }
      
      // Reset form or show success message
      alert('تم رفع الملفات بنجاح!')
      
    } catch (error) {
      setErrors({ general: 'حدث خطأ أثناء حفظ البيانات' })
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
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">رفع المستندات</h2>
              <p className="text-sm text-gray-600">رفع وإدارة ملفات المشروع</p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <option value="document">مستند</option>
                    <option value="report">تقرير</option>
                    <option value="presentation">عرض تقديمي</option>
                    <option value="code">كود مصدري</option>
                    <option value="design">تصميم</option>
                    <option value="other">أخرى</option>
                  </select>
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="version">رقم الإصدار</FormLabel>
                  <Input
                    id="version"
                    value={formData.version}
                    onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                    placeholder="1.0"
                  />
                </FormGroup>
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

              {/* File Upload Area */}
              <FormGroup>
                <FormLabel>الملفات</FormLabel>
                <div
                  className={cn(
                    'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
                    dragActive 
                      ? 'border-gpms-light bg-gpms-light/5' 
                      : 'border-gray-300 hover:border-gpms-light'
                  )}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    اسحب الملفات هنا أو انقر للاختيار
                  </h3>
                  <p className="text-gray-600 mb-2">
                    الأنواع المدعومة: {allowedTypes.join(', ')}
                  </p>
                  <p className="text-sm text-gray-500">
                    حد أقصى {maxFileSize} ميجابايت لكل ملف • حد أقصى {maxFiles} ملفات
                  </p>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={allowedTypes.join(',')}
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
                            
                            {file.status === 'error' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => retryUpload(file.id)}
                              >
                                إعادة المحاولة
                              </Button>
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

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-6 border-t">
                <Button variant="outline" type="button">
                  حفظ كمسودة
                </Button>
                <Button type="submit" loading={isLoading}>
                  حفظ المستندات
                </Button>
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default FileUploadForm
