import React, { useState, useMemo } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { cn, getActiveFiltersCount } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import DataTable from '@/components/ui/DataTable'
import SimplePopover from '@/components/ui/SimplePopover'
import AdvancedFilter from '@/components/ui/AdvancedFilter'
import Modal from '@/components/ui/Modal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { ViewModeToggle } from '@/components/shared'
import { Eye, Edit, Trash2, Plus, SlidersHorizontal, Shield } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: 'student' | 'supervisor' | 'committee' | 'discussion' | 'admin'
  status: 'active' | 'inactive' | 'pending' | 'suspended'
  department?: string
  studentId?: string
  joinDate: string
  lastLogin?: string
  permissions: string[]
  avatar?: string
  tags: string[]
}

const UsersScreen: React.FC = () => {
  const { t } = useLanguage()
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [sortBy, setSortBy] = useState('joinDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')
  const [, setIsEditModalOpen] = useState(false)
  const [, setIsPermissionsModalOpen] = useState(false)
  const [, setEditingUser] = useState<User | null>(null)
  const [viewUser, setViewUser] = useState<User | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'active', label: 'نشط' },
    { value: 'inactive', label: 'غير نشط' },
    { value: 'pending', label: 'قيد الانتظار' },
    { value: 'suspended', label: 'معلق' }
  ]

  const roleOptions = [
    { value: 'all', label: 'جميع الأدوار' },
    { value: 'student', label: 'طالب' },
    { value: 'supervisor', label: 'مشرف' },
    { value: 'committee', label: 'لجنة' },
    { value: 'discussion', label: 'مناقشة' },
    { value: 'admin', label: 'مدير' }
  ]

  const sortOptions = [
    { value: 'joinDate', label: 'تاريخ الانضمام' },
    { value: 'name', label: 'الاسم' },
    { value: 'role', label: 'الدور' },
    { value: 'status', label: 'الحالة' }
  ]

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = !searchQuery ||
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === 'all' || user.status === statusFilter
      const matchesRole = roleFilter === 'all' || user.role === roleFilter

      return matchesSearch && matchesStatus && matchesRole
    })
  }, [users, searchQuery, statusFilter, roleFilter])

  const handleFilterClear = () => {
    setStatusFilter('all')
    setRoleFilter('all')
    setSortBy('joinDate')
    setSortOrder('desc')
  }

  const columns = useMemo(() => [
    {
      key: 'name',
      label: 'الاسم',
      sortable: true,
      render: (user: User) => (
        <div>
          <h3 className="font-medium text-gray-900">{user.name}</h3>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
      )
    },
    {
      key: 'role',
      label: 'الدور',
      render: (user: User) => (
        <span className="text-sm text-gray-600">{user.role}</span>
      )
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (user: User) => (
        <span className={cn(
          'px-2 py-1 text-xs rounded-full',
          user.status === 'active' ? 'bg-green-100 text-green-800' :
            user.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
              user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
        )}>
          {user.status === 'active' ? 'نشط' :
            user.status === 'inactive' ? 'غير نشط' :
              user.status === 'pending' ? 'قيد الانتظار' : 'معلق'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      render: (user: User) => (
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button
            onClick={() => setViewUser(user)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="عرض"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => {
              setEditingUser(user)
              setIsEditModalOpen(true)
            }}
            className="text-blue-600 hover:text-blue-700 transition-colors"
            title="تعديل"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => {
              setEditingUser(user)
              setIsPermissionsModalOpen(true)
            }}
            className="text-purple-600 hover:text-purple-700 transition-colors"
            title="الصلاحيات"
          >
            <Shield size={16} />
          </button>
          <button
            onClick={() => setConfirmDeleteId(user.id)}
            className="text-red-600 hover:text-red-700 transition-colors"
            title="حذف"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ], [])

  return (
    <div className="space-y-6">
      <Card className="hover-lift">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{t('navigation.users')}</h1>
            </div>
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
              <SimplePopover
                content={
                  <AdvancedFilter
                    statusOptions={statusOptions}
                    priorityOptions={roleOptions}
                    sortOptions={sortOptions}
                    statusFilter={statusFilter}
                    priorityFilter={roleFilter}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onStatusChange={setStatusFilter}
                    onPriorityChange={setRoleFilter}
                    onSortChange={setSortBy}
                    onSortOrderChange={setSortOrder}
                    onApply={() => { }}
                    onClear={handleFilterClear}
                  />
                }
              >
                <Button variant="outline" size="md" className={cn(
                  'relative',
                  getActiveFiltersCount(statusFilter, roleFilter, searchQuery, sortBy, sortOrder) > 0 && 'bg-gpms-light/10 border-gpms-light text-gpms-dark'
                )}>
                  <SlidersHorizontal size={16} className="mr-1 rtl:mr-0 rtl:ml-1" />
                  {t('common.filter')}
                </Button>
              </SimplePopover>
              <Button
                onClick={() => {
                  setEditingUser(null)
                  setIsEditModalOpen(true)
                }}
                className="bg-gpms-dark text-white hover:bg-gpms-light"
              >
                <Plus className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                مستخدم جديد
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'table' ? (
            <DataTable
              data={filteredUsers}
              columns={columns}
              emptyMessage="لا يوجد مستخدمون"
              className="min-h-[400px]"
              onSort={(key, direction) => {
                setSortBy(key)
                setSortOrder(direction)
              }}
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-md font-semibold text-gray-900 mb-2">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <span className={cn(
                        'px-2 py-1 text-xs rounded-full',
                        user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      )}>
                        {user.status === 'active' ? 'نشط' : 'غير نشط'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <button
                        onClick={() => setViewUser(user)}
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
        </CardContent>
      </Card>

      <Modal
        isOpen={!!viewUser}
        onClose={() => setViewUser(null)}
        title={viewUser ? `تفاصيل المستخدم - ${viewUser.name}` : 'تفاصيل المستخدم'}
        size="lg"
      >
        {viewUser && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">الاسم:</span>
                <p className="text-gray-700 mt-1">{viewUser.name}</p>
              </div>
              <div>
                <span className="font-medium">البريد الإلكتروني:</span>
                <p className="text-gray-700 mt-1">{viewUser.email}</p>
              </div>
              <div>
                <span className="font-medium">الدور:</span>
                <p className="text-gray-700 mt-1">{viewUser.role}</p>
              </div>
              <div>
                <span className="font-medium">الحالة:</span>
                <p className="text-gray-700 mt-1">{viewUser.status}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!confirmDeleteId}
        title="تأكيد الحذف"
        description="هل أنت متأكد من حذف هذا المستخدم؟"
        variant="destructive"
        onConfirm={() => {
          setUsers(prev => prev.filter(u => u.id !== confirmDeleteId))
          setConfirmDeleteId(null)
        }}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  )
}

export default UsersScreen
