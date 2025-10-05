import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { cn, getActiveFiltersCount } from '../../lib/utils'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Divider from '../../components/ui/Divider'
import { SearchBar } from '../../components/ui/Filter'
import DataTable from '../../components/ui/DataTable'
import SimplePopover from '../../components/ui/SimplePopover'
import AdvancedFilter from '../../components/ui/AdvancedFilter'
import {
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Grid3X3,
  List,
  FolderOpen,
  SlidersHorizontal,
  UserCheck
} from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  students: string[]
  supervisor: string
  submittedDate: string
  progress: number
  lastUpdate: string
  score?: number
  tags: string[]
  department: string
}

const CommitteeProjects: React.FC = () => {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('submittedDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')

  // Mock data
  const [projects] = useState<Project[]>([
    {
      id: '1',
      title: 'نظام إدارة المكتبة الذكية',
      description: 'تطبيق ويب متكامل لإدارة المكتبات الجامعية',
      status: 'under_review',
      priority: 'high',
      students: ['أحمد محمد علي', 'فاطمة حسن محمود'],
      supervisor: 'د. أحمد محمد',
      submittedDate: '2024-01-20',
      progress: 85,
      lastUpdate: '2024-01-25',
      score: 88,
      tags: ['تطوير ويب', 'ذكاء اصطناعي'],
      department: 'علوم الحاسوب'
    },
    {
      id: '2',
      title: 'تطبيق التجارة الإلكترونية',
      description: 'منصة تجارة إلكترونية شاملة مع نظام دفع آمن',
      status: 'approved',
      priority: 'medium',
      students: ['سارة أحمد محمد', 'يوسف محمود'],
      supervisor: 'د. سارة أحمد',
      submittedDate: '2024-01-18',
      progress: 95,
      lastUpdate: '2024-01-24',
      score: 92,
      tags: ['تجارة إلكترونية', 'أمان'],
      department: 'علوم الحاسوب'
    }
  ])

  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'submitted', label: 'مُقدم' },
    { value: 'under_review', label: 'قيد المراجعة' },
    { value: 'approved', label: 'موافق عليه' },
    { value: 'rejected', label: 'مرفوض' },
    { value: 'in_progress', label: 'قيد التطوير' },
    { value: 'completed', label: 'مكتمل' }
  ]

  const priorityOptions = [
    { value: 'all', label: 'جميع الأولويات' },
    { value: 'low', label: 'منخفض' },
    { value: 'medium', label: 'متوسط' },
    { value: 'high', label: 'عالي' }
  ]

  const sortOptions = [
    { value: 'submittedDate', label: 'تاريخ التقديم' },
    { value: 'title', label: 'العنوان' },
    { value: 'status', label: 'الحالة' },
    { value: 'progress', label: 'التقدم' },
    { value: 'score', label: 'الدرجة' }
  ]

  const filteredProjects = projects.filter(project => {
    const matchesSearch = !searchQuery ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.students.some(student => student.toLowerCase().includes(searchQuery.toLowerCase())) ||
      project.supervisor.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleFilterClear = () => {
    setStatusFilter('all')
    setPriorityFilter('all')
    setSortBy('submittedDate')
    setSortOrder('desc')
  }

  const handleViewProject = (project: Project) => {
    // Open project details modal
    const modal = document.createElement('div')
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <h3 class="text-lg font-semibold mb-4">تفاصيل المشروع</h3>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="font-medium">اسم المشروع:</span>
              <p class="text-gray-600">${project.title}</p>
            </div>
            <div>
              <span class="font-medium">الحالة:</span>
              <p class="text-gray-600">${project.status}</p>
            </div>
            <div>
              <span class="font-medium">الأولوية:</span>
              <p class="text-gray-600">${project.priority}</p>
            </div>
            <div>
              <span class="font-medium">التقدم:</span>
              <p class="text-gray-600">${project.progress}%</p>
            </div>
            <div>
              <span class="font-medium">المشرف:</span>
              <p class="text-gray-600">${project.supervisor}</p>
            </div>
            <div>
              <span class="font-medium">الطلاب:</span>
              <p class="text-gray-600">${project.students.join(', ')}</p>
            </div>
            <div>
              <span class="font-medium">تاريخ التقديم:</span>
              <p class="text-gray-600">${new Date(project.submittedDate).toLocaleDateString('ar')}</p>
            </div>
            <div>
              <span class="font-medium">الدرجة:</span>
              <p class="text-gray-600">${project.score || 'لم يتم التقييم بعد'}</p>
            </div>
          </div>
          <div>
            <span class="font-medium">الوصف:</span>
            <p class="text-gray-600 mt-1">${project.description}</p>
          </div>
          ${project.technologies && project.technologies.length > 0 ? `
            <div>
              <span class="font-medium">التقنيات المستخدمة:</span>
              <div class="flex flex-wrap gap-2 mt-1">
                ${project.technologies.map(tech =>
      `<span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">${tech}</span>`
    ).join('')}
              </div>
            </div>
          ` : ''}
        </div>
        <div class="mt-6 flex justify-end">
          <button onclick="this.closest('.fixed').remove()" 
                  class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
            إغلاق
          </button>
        </div>
      </div>
    `
    document.body.appendChild(modal)
  }

  const handleEditProject = (project: Project) => {
    // Open edit project modal
    const modal = document.createElement('div')
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <h3 class="text-lg font-semibold mb-4">تعديل المشروع</h3>
        <form id="editProjectForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">عنوان المشروع</label>
            <input type="text" name="title" value="${project.title}" required 
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
            <textarea name="description" rows="3" required 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">${project.description}</textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
              <select name="status" required 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="pending" ${project.status === 'pending' ? 'selected' : ''}>في الانتظار</option>
                <option value="approved" ${project.status === 'approved' ? 'selected' : ''}>معتمد</option>
                <option value="rejected" ${project.status === 'rejected' ? 'selected' : ''}>مرفوض</option>
                <option value="in_progress" ${project.status === 'in_progress' ? 'selected' : ''}>قيد التنفيذ</option>
                <option value="completed" ${project.status === 'completed' ? 'selected' : ''}>مكتمل</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">الأولوية</label>
              <select name="priority" required 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="low" ${project.priority === 'low' ? 'selected' : ''}>منخفض</option>
                <option value="medium" ${project.priority === 'medium' ? 'selected' : ''}>متوسط</option>
                <option value="high" ${project.priority === 'high' ? 'selected' : ''}>عالي</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ملاحظات</label>
            <textarea name="notes" rows="2" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">${project.notes || ''}</textarea>
          </div>
        </form>
        <div class="mt-6 flex justify-end space-x-3 rtl:space-x-reverse">
          <button onclick="this.closest('.fixed').remove()" 
                  class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
            إلغاء
          </button>
          <button onclick="window.submitProjectEdit('${project.id}'); this.closest('.fixed').remove()" 
                  class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            حفظ التعديلات
          </button>
        </div>
      </div>
    `
    document.body.appendChild(modal)

    // Add submit function to window
    window.submitProjectEdit = (projectId: string) => {
      const form = document.getElementById('editProjectForm') as HTMLFormElement
      const formData = new FormData(form)
      const projectData = {
        title: formData.get('title'),
        description: formData.get('description'),
        status: formData.get('status'),
        priority: formData.get('priority'),
        notes: formData.get('notes')
      }

      console.log('Updating project:', projectId, projectData)
      alert('تم تحديث المشروع بنجاح!')
    }
  }

  const handleApproveProject = (projectId: string) => {
    if (window.confirm('هل أنت متأكد من الموافقة على هذا المشروع؟')) {
      console.log('Approving project:', projectId)
      alert('تم الموافقة على المشروع بنجاح!')
    }
  }

  const handleRejectProject = (projectId: string) => {
    const reason = prompt('سبب الرفض:')
    if (reason) {
      console.log('Rejecting project:', projectId, reason)
      alert('تم رفض المشروع بنجاح!')
    }
  }

  const columns = [
    {
      key: 'title',
      label: 'عنوان المشروع',
      sortable: true,
      render: (project: Project) => (
        <div>
          <h3 className="font-medium text-gray-900">{project.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-1">{project.description}</p>
        </div>
      )
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (project: Project) => (
        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
          {project.status === 'under_review' ? 'قيد المراجعة' : project.status === 'approved' ? 'موافق عليه' : project.status}
        </span>
      )
    },
    {
      key: 'supervisor',
      label: 'المشرف',
      render: (project: Project) => (
        <span className="text-sm text-gray-600">{project.supervisor}</span>
      )
    },
    {
      key: 'submittedDate',
      label: 'تاريخ التقديم',
      sortable: true,
      render: (project: Project) => (
        <span className="text-sm text-gray-600">{new Date(project.submittedDate).toLocaleDateString('ar')}</span>
      )
    },
    {
      key: 'score',
      label: 'الدرجة',
      sortable: true,
      render: (project: Project) => (
        <span className="text-sm text-gray-600">{project.score ? `${project.score}/100` : '-'}</span>
      )
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      render: (project: Project) => (
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button onClick={() => handleViewProject(project)} className="p-2 text-gray-400 hover:text-gray-600" title="عرض">
            <Eye size={16} />
          </button>
          <button onClick={() => handleEditProject(project)} className="p-2 text-gray-400 hover:text-gray-600" title="تعديل">
            <Edit size={16} />
          </button>
          <button onClick={() => handleApproveProject(project.id)} className="p-2 text-gray-400 hover:text-green-600" title="موافقة">
            <CheckCircle size={16} />
          </button>
          <button onClick={() => handleRejectProject(project.id)} className="p-2 text-gray-400 hover:text-red-600" title="رفض">
            <XCircle size={16} />
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="hover-lift">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              {/* <FolderOpen className="w-6 h-6 text-gpms-dark" /> */}
              <div>
                <h1 className="text-xl font-bold text-gray-900">إدارة المشاريع</h1>
                {/* <p className="text-gray-600 mt-1">إدارة ومتابعة جميع المشاريع المقدمة</p> */}
              </div>
            </div>

            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  title="جدول"
                  onClick={() => setViewMode('table')}
                  className={cn(
                    'px-2 py-1 rounded-md text-sm font-medium transition-colors',
                    viewMode === 'table'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  <List size={20} className="mr-1 rtl:mr-0 rtl:ml-1" />
                </button>
                <button
                  title="شبكة"
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'px-2 py-1 rounded-md text-sm font-medium transition-colors',
                    viewMode === 'grid'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  <Grid3X3 size={20} className="mr-1 rtl:mr-0 rtl:ml-1" />
                </button>
              </div>

              {/* Advanced Filter */}
              <SimplePopover
                content={
                  <AdvancedFilter
                    statusOptions={statusOptions}
                    priorityOptions={priorityOptions}
                    sortOptions={sortOptions}
                    statusFilter={statusFilter}
                    priorityFilter={priorityFilter}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onStatusChange={setStatusFilter}
                    onPriorityChange={setPriorityFilter}
                    onSortChange={setSortBy}
                    onSortOrderChange={setSortOrder}
                    onApply={() => { }}
                    onClear={handleFilterClear}
                  />
                }
              >
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    'relative',
                    getActiveFiltersCount(statusFilter, priorityFilter, searchQuery, sortBy, sortOrder) > 0 && 'bg-gpms-light/10 border-gpms-light text-gpms-dark'
                  )}
                >
                  <SlidersHorizontal size={16} className="mr-1 rtl:mr-0 rtl:ml-1" />
                  {t('common.filter')}
                  {getActiveFiltersCount(statusFilter, priorityFilter, searchQuery, sortBy, sortOrder) > 0 && (
                    <span className="absolute -top-1 -right-1 rtl:right-auto rtl:-left-1 bg-gpms-dark text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getActiveFiltersCount(statusFilter, priorityFilter, searchQuery, sortBy, sortOrder)}
                    </span>
                  )}
                </Button>
              </SimplePopover>
            </div>
          </div>
        </CardHeader>
        <Divider />


        <CardContent>
          {/* Search Bar */}
          {/* <div className="mb-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="البحث في المشاريع..."
              className="w-full"
            />
          </div> */}

          {/* Projects Display */}
          {viewMode === 'table' ? (
            <Card className="hover-lift">
              <CardContent className="p-0">
                <DataTable
                  data={filteredProjects}
                  columns={columns}
                  emptyMessage="لا توجد مشاريع"
                  className="min-h-[400px]"
                  onSort={(key, direction) => {
                    setSortBy(key)
                    setSortOrder(direction)
                  }}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                />
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-md font-semibold text-gray-900 mb-2">{project.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                      </div>
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {project.status === 'under_review' ? 'قيد المراجعة' : 'موافق عليه'}
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">الطلاب:</p>
                      <div className="flex flex-wrap gap-1">
                        {project.students.map((student, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {student}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <User size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
                        <span>{project.supervisor}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
                        <span>{new Date(project.submittedDate).toLocaleDateString('ar')}</span>
                      </div>
                    </div>

                    {project.score && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>الدرجة</span>
                          <span>{project.score}/100</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <button
                          onClick={() => handleViewProject(project)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="عرض"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditProject(project)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="تعديل"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleApproveProject(project.id)}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="موافقة"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          onClick={() => handleRejectProject(project.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="رفض"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                      <button
                        onClick={() => handleViewProject(project)}
                        className="text-gpms-dark hover:text-gpms-light text-sm font-medium transition-colors"
                      >
                        عرض التفاصيل
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <Card className="hover-lift">
              <CardContent className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FolderOpen size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مشاريع</h3>
                <p className="text-gray-600">لم يتم العثور على مشاريع تطابق معايير البحث</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default CommitteeProjects