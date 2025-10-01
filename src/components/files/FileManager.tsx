import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { cn } from '../../lib/utils'
import { Card, CardContent, CardHeader } from '../ui/Card'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import Input from '../ui/Input'
import { 
  Upload, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Folder,
  File,
  FileText,
  Image,
  Video,
  Archive,
  Search,
  Filter,
  Grid,
  List,
  MoreVertical,
  Share2,
  Star,
  Clock
} from 'lucide-react'

interface FileItem {
  id: string
  name: string
  type: 'folder' | 'file'
  mimeType?: string
  size: number
  modifiedDate: Date
  author: string
  isStarred: boolean
  isShared: boolean
  tags: string[]
  description?: string
  downloadCount: number
  version: string
}

interface FileManagerProps {
  className?: string
}

const FileManager: React.FC<FileManagerProps> = ({ className }) => {
  const { t } = useLanguage()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [currentFolder, setCurrentFolder] = useState('المجلد الرئيسي')

  // Mock files data
  const files: FileItem[] = [
    {
      id: '1',
      name: 'مقترح المشروع النهائي',
      type: 'file',
      mimeType: 'application/pdf',
      size: 2048576, // 2MB
      modifiedDate: new Date('2024-01-20'),
      author: 'أحمد محمد',
      isStarred: true,
      isShared: true,
      tags: ['مقترح', 'مشروع', 'PDF'],
      description: 'المقترح النهائي لمشروع التخرج',
      downloadCount: 15,
      version: '2.1'
    },
    {
      id: '2',
      name: 'عرض تقديمي - المرحلة الأولى',
      type: 'file',
      mimeType: 'application/vnd.ms-powerpoint',
      size: 5242880, // 5MB
      modifiedDate: new Date('2024-01-18'),
      author: 'سارة أحمد',
      isStarred: false,
      isShared: false,
      tags: ['عرض', 'PowerPoint', 'مرحلة أولى'],
      downloadCount: 8,
      version: '1.0'
    },
    {
      id: '3',
      name: 'صور المشروع',
      type: 'folder',
      size: 0,
      modifiedDate: new Date('2024-01-15'),
      author: 'محمد علي',
      isStarred: false,
      isShared: true,
      tags: ['صور', 'مشروع'],
      downloadCount: 0,
      version: '1.0'
    },
    {
      id: '4',
      name: 'كود المصدر',
      type: 'file',
      mimeType: 'application/zip',
      size: 10485760, // 10MB
      modifiedDate: new Date('2024-01-22'),
      author: 'خالد محمود',
      isStarred: true,
      isShared: false,
      tags: ['كود', 'ZIP', 'مصدر'],
      description: 'ملفات الكود المصدر للمشروع',
      downloadCount: 3,
      version: '3.2'
    },
    {
      id: '5',
      name: 'تقرير التقدم',
      type: 'file',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      size: 1536000, // 1.5MB
      modifiedDate: new Date('2024-01-19'),
      author: 'فاطمة حسن',
      isStarred: false,
      isShared: true,
      tags: ['تقرير', 'Word', 'تقدم'],
      downloadCount: 12,
      version: '1.5'
    }
  ]

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') {
      return <Folder className="w-6 h-6 text-blue-500" />
    }

    const mimeType = file.mimeType || ''
    
    if (mimeType.includes('pdf')) return <FileText className="w-6 h-6 text-red-500" />
    if (mimeType.includes('image')) return <Image className="w-6 h-6 text-green-500" />
    if (mimeType.includes('video')) return <Video className="w-6 h-6 text-purple-500" />
    if (mimeType.includes('zip') || mimeType.includes('rar')) return <Archive className="w-6 h-6 text-orange-500" />
    if (mimeType.includes('word')) return <FileText className="w-6 h-6 text-blue-600" />
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return <FileText className="w-6 h-6 text-orange-600" />
    
    return <File className="w-6 h-6 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const filteredFiles = files
    .filter(file => 
      !searchQuery || 
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name, 'ar')
          break
        case 'date':
          comparison = a.modifiedDate.getTime() - b.modifiedDate.getTime()
          break
        case 'size':
          comparison = a.size - b.size
          break
        case 'type':
          comparison = a.type.localeCompare(b.type)
          break
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }

  const handleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([])
    } else {
      setSelectedFiles(filteredFiles.map(file => file.id))
    }
  }

  const handleFileAction = (action: string, fileId: string) => {
    console.log(`Action: ${action}, File: ${fileId}`)
    // Implement file actions
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <Card className="hover-lift">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Folder className="w-6 h-6 text-gpms-dark" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">إدارة الملفات</h2>
                <p className="text-sm text-gray-600">{currentFolder}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Button
                onClick={() => console.log('Upload files')}
                className="bg-gpms-dark text-white hover:bg-gpms-light"
              >
                <Upload className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                رفع ملفات
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Search and Controls */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="flex-1">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="البحث في الملفات والمجلدات..."
                />
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gpms-light focus:border-transparent"
              >
                <option value="name">الاسم</option>
                <option value="date">التاريخ</option>
                <option value="size">الحجم</option>
                <option value="type">النوع</option>
              </select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
              
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Selection Controls */}
            {selectedFiles.length > 0 && (
              <div className="flex items-center justify-between p-3 bg-gpms-light/10 rounded-lg">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <span className="text-sm font-medium text-gray-700">
                    {selectedFiles.length} ملف محدد
                  </span>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                      تحميل
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                      مشاركة
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                      حذف
                    </Button>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedFiles([])}
                >
                  إلغاء التحديد
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Files Grid/List */}
      <div className={cn(
        'grid gap-4',
        viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'
      )}>
        {filteredFiles.map(file => (
          <Card
            key={file.id}
            className={cn(
              'hover-lift cursor-pointer transition-all',
              selectedFiles.includes(file.id) && 'ring-2 ring-gpms-light bg-gpms-light/5'
            )}
            onClick={() => handleFileSelect(file.id)}
          >
            <CardContent className="p-4">
              {viewMode === 'grid' ? (
                // Grid View
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    {getFileIcon(file)}
                  </div>
                  
                  <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                    {file.name}
                  </h3>
                  
                  <div className="space-y-1 text-xs text-gray-500 mb-3">
                    <div>{formatFileSize(file.size)}</div>
                    <div>{file.modifiedDate.toLocaleDateString('ar')}</div>
                    <div>{file.author}</div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 justify-center mb-3">
                    {file.tags.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="info" size="sm">
                        {tag}
                      </Badge>
                    ))}
                    {file.tags.length > 2 && (
                      <Badge variant="default" size="sm">
                        +{file.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                    {file.isStarred && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                    {file.isShared && <Share2 className="w-4 h-4 text-blue-500" />}
                    <span className="text-xs text-gray-500">{file.version}</span>
                  </div>
                </div>
              ) : (
                // List View
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="flex-shrink-0">
                    {getFileIcon(file)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </h3>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        {file.isStarred && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                        {file.isShared && <Share2 className="w-4 h-4 text-blue-500" />}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleFileAction('more', file.id)
                          }}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 rtl:space-x-reverse text-xs text-gray-500 mb-2">
                      <span>{formatFileSize(file.size)}</span>
                      <span>{file.modifiedDate.toLocaleDateString('ar')}</span>
                      <span>{file.author}</span>
                      <span>v{file.version}</span>
                      <span>{file.downloadCount} تحميل</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {file.tags.map(tag => (
                        <Badge key={tag} variant="info" size="sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleFileAction('view', file.id)
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleFileAction('download', file.id)
                      }}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredFiles.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Folder className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? 'لا توجد ملفات' : 'لا توجد ملفات في هذا المجلد'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery 
                  ? 'لم نتمكن من العثور على ملفات تطابق بحثك.'
                  : 'ابدأ برفع ملفاتك الأولى أو إنشاء مجلد جديد.'
                }
              </p>
              <Button
                onClick={() => console.log('Upload files')}
                className="bg-gpms-dark text-white hover:bg-gpms-light"
              >
                <Upload className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                رفع ملفات
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default FileManager
