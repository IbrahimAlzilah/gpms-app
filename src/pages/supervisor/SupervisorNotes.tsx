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
  Edit,
  Trash2,
  Plus,
  MessageSquare,
  Grid3X3,
  List,
  SlidersHorizontal
} from 'lucide-react'

interface Note {
  id: string
  title: string
  content: string
  project: string
  students: string[]
  createdAt: string
  updatedAt: string
  priority: 'low' | 'medium' | 'high'
  tags: string[]
}

const SupervisorNotes: React.FC = () => {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('updatedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')
  const [isEditing, setIsEditing] = useState<Note | null>(null)

  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'ملاحظة حول تقدم المشروع',
      content: 'يلزم تعزيز منهجية الاختبار وإضافة حالات حافة.',
      project: 'تطبيق إدارة المكتبة الذكية',
      students: ['أحمد محمد', 'فاطمة حسن'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-18',
      priority: 'medium',
      tags: ['اختبار', 'منهجية']
    }
  ])

  const [draft, setDraft] = useState<Pick<Note, 'title' | 'content' | 'project' | 'priority'>>({
    title: '', content: '', project: '', priority: 'medium'
  })

  const priorityOptions = [
    { value: 'all', label: 'جميع الأولويات' },
    { value: 'low', label: 'منخفض' },
    { value: 'medium', label: 'متوسط' },
    { value: 'high', label: 'عالي' }
  ]

  const sortOptions = [
    { value: 'updatedAt', label: 'آخر تحديث' },
    { value: 'createdAt', label: 'تاريخ الإنشاء' },
    { value: 'title', label: 'العنوان' }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredNotes = notes
    .filter(note => {
      const matchesSearch = !searchQuery ||
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesPriority = priorityFilter === 'all' || note.priority === priorityFilter
      return matchesSearch && matchesPriority
    })
    .sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title, 'ar')
          break
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          break
        default:
          comparison = 0
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

  const handleSave = () => {
    if (!draft.title.trim() || !draft.project.trim() || !draft.content.trim()) return

    if (isEditing) {
      setNotes(prev => prev.map(n => n.id === isEditing.id ? {
        ...n,
        title: draft.title,
        content: draft.content,
        project: draft.project,
        priority: draft.priority,
        updatedAt: new Date().toISOString().split('T')[0]
      } : n))
      setIsEditing(null)
    } else {
      const newNote: Note = {
        id: Math.random().toString(36).substring(7),
        title: draft.title,
        content: draft.content,
        project: draft.project,
        students: [],
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        priority: draft.priority,
        tags: []
      }
      setNotes(prev => [newNote, ...prev])
    }

    setDraft({ title: '', content: '', project: '', priority: 'medium' })
  }

  const handleEdit = (note: Note) => {
    setIsEditing(note)
    setDraft({ title: note.title, content: note.content, project: note.project, priority: note.priority })
  }

  const handleDelete = (id: string) => {
    if (!window.confirm('هل تريد حذف هذه الملاحظة؟')) return
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  const handleFilterClear = () => {
    setPriorityFilter('all')
    setSortBy('updatedAt')
    setSortOrder('desc')
  }


  const columns = [
    {
      key: 'title',
      label: 'العنوان',
      sortable: true,
      render: (note: Note) => (
        <div>
          <h3 className="font-medium text-gray-900">{note.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-1">{note.project}</p>
        </div>
      )
    },
    {
      key: 'priority',
      label: 'الأولوية',
      render: (note: Note) => (
        <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getPriorityColor(note.priority))}>
          {note.priority === 'high' ? 'عالي' : note.priority === 'medium' ? 'متوسط' : 'منخفض'}
        </span>
      )
    },
    {
      key: 'updatedAt',
      label: 'آخر تحديث',
      sortable: true,
      render: (note: Note) => (
        <span className="text-sm text-gray-600">{new Date(note.updatedAt).toLocaleDateString('ar')}</span>
      )
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      render: (note: Note) => (
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button onClick={() => handleEdit(note)} className="text-gray-400 hover:text-gray-600" title="تعديل">
            <Edit size={16} />
          </button>
          <button onClick={() => handleDelete(note.id)} className="text-red-600 hover:text-red-700" title="حذف">
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <Card className="hover-lift">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <MessageSquare className="w-6 h-6 text-gpms-dark" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">ملاحظات المشرف</h1>
                <p className="text-gray-600 mt-1">إدارة الملاحظات المرتبطة بمشاريع الطلاب</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  title="جدول"
                  onClick={() => setViewMode('table')}
                  className={cn('px-2 py-1 rounded-md text-sm', viewMode === 'table' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900')}
                >
                  <List size={20} className="mr-1 rtl:mr-0 rtl:ml-1" />
                </button>
                <button
                  title="شبكة"
                  onClick={() => setViewMode('grid')}
                  className={cn('px-2 py-1 rounded-md text-sm', viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900')}
                >
                  <Grid3X3 size={20} className="mr-1 rtl:mr-0 rtl:ml-1" />
                </button>
              </div>
              <SimplePopover
                content={
                  <AdvancedFilter
                    statusOptions={priorityOptions}
                    priorityOptions={priorityOptions}
                    typeOptions={[]}
                    sortOptions={sortOptions}
                    statusFilter={priorityFilter}
                    priorityFilter={priorityFilter}
                    typeFilter={'all'}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onStatusChange={setPriorityFilter}
                    onPriorityChange={setPriorityFilter}
                    onTypeChange={() => { }}
                    onSortChange={setSortBy}
                    onSortOrderChange={setSortOrder}
                    onApply={() => { }}
                    onClear={handleFilterClear}
                  />
                }
              >
                <Button variant="outline" size="sm" className={cn('relative', getActiveFiltersCount(statusFilter, priorityFilter, searchQuery, sortBy, sortOrder) > 0 && 'bg-gpms-light/10 border-gpms-light text-gpms-dark')}>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              {viewMode === 'table' ? (
                <Card className="hover-lift">
                  <CardContent className="p-0">
                    <DataTable
                      data={filteredNotes}
                      columns={columns}
                      emptyMessage="لا توجد ملاحظات"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredNotes.map((note) => (
                    <Card key={note.id} className="hover-lift">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-md font-semibold text-gray-900">{note.title}</h3>
                            <p className="text-xs text-gray-600">{note.project}</p>
                          </div>
                          <span className={cn('px-2 py-1 text-xs rounded-full', getPriorityColor(note.priority))}>
                            {note.priority === 'high' ? 'عالي' : note.priority === 'medium' ? 'متوسط' : 'منخفض'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-3 mb-3">{note.content}</p>
                        {note.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {note.tags.map((tag, idx) => (
                              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{tag}</span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>آخر تحديث: {new Date(note.updatedAt).toLocaleDateString('ar')}</span>
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleEdit(note)} className="text-gray-400 hover:text-gray-600" title="تعديل">
                              <Edit size={16} />
                            </button>
                            <button onClick={() => handleDelete(note.id)} className="text-red-600 hover:text-red-700" title="حذف">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
            <div>
              <Card className="hover-lift">
                <CardHeader>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Plus className="w-5 h-5 text-gpms-dark" />
                    <h3 className="text-md font-semibold text-gray-900">إضافة/تعديل ملاحظة</h3>
                  </div>
                </CardHeader>
                <Divider />
                <CardContent>
                  <div className="space-y-3">
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                      placeholder="العنوان"
                      value={draft.title}
                      onChange={(e) => setDraft(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                      placeholder="المشروع"
                      value={draft.project}
                      onChange={(e) => setDraft(prev => ({ ...prev, project: e.target.value }))}
                    />
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                      placeholder="المحتوى"
                      rows={4}
                      value={draft.content}
                      onChange={(e) => setDraft(prev => ({ ...prev, content: e.target.value }))}
                    />
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                      value={draft.priority}
                      onChange={(e) => setDraft(prev => ({ ...prev, priority: e.target.value as any }))}
                    >
                      <option value="low">منخفض</option>
                      <option value="medium">متوسط</option>
                      <option value="high">عالي</option>
                    </select>
                    <div className="flex justify-end gap-2">
                      {isEditing && (
                        <Button variant="outline" onClick={() => { setIsEditing(null); setDraft({ title: '', content: '', project: '', priority: 'medium' }) }}>إلغاء</Button>
                      )}
                      <Button onClick={handleSave}>{isEditing ? 'تحديث' : 'حفظ'}</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SupervisorNotes


