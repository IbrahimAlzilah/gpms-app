import React, { useState, useMemo, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { useNotifications } from '@/context/NotificationContext'
import { cn, getActiveFiltersCount } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Divider from '@/components/ui/Divider'
import DataTable from '@/components/ui/DataTable'
import SimplePopover from '@/components/ui/SimplePopover'
import AdvancedFilter from '@/components/ui/AdvancedFilter'
import Modal from '@/components/ui/Modal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Input from '@/components/ui/Input'
import { Form, FormGroup, FormLabel } from '@/components/ui/Form'
import { ViewModeToggle } from '@/components/shared'
import { Eye, Edit, Trash2, Plus, SlidersHorizontal, Shield, Search, XCircle, Power, User as UserIcon, Phone, Building, UserCheck } from 'lucide-react'
import { User, CreateUserInput, UpdateUserInput } from './schema'
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  updateUserPermissions,
  updateUserRole
} from '@/services/users.service'

const UsersScreen: React.FC = () => {
  const { t } = useLanguage()
  const { user: currentUser } = useAuth()
  const { addNotification } = useNotifications()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [sortBy, setSortBy] = useState('joinDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [viewUser, setViewUser] = useState<User | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      const data = await getUsers()
      setUsers(data)
    } catch (error) {
      console.error('Error loading users:', error)
      addNotification({
        title: 'خطأ',
        message: 'فشل في تحميل المستخدمين. يرجى تحديث الصفحة.',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

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

  const availablePermissions = [
    'view_projects',
    'edit_projects',
    'delete_projects',
    'view_proposals',
    'approve_proposals',
    'view_evaluations',
    'create_evaluations',
    'view_reports',
    'manage_users',
    'manage_permissions'
  ]

  const filteredUsers = useMemo(() => {
    return users
      .filter(user => {
        const matchesSearch = !searchQuery ||
          user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.studentId?.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === 'all' || user.status === statusFilter
        const matchesRole = roleFilter === 'all' || user.role === roleFilter

        return matchesSearch && matchesStatus && matchesRole
      })
      .sort((a, b) => {
        let comparison = 0
        const aVal = a[sortBy as keyof User]
        const bVal = b[sortBy as keyof User]

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          comparison = aVal.localeCompare(bVal, 'ar')
        } else if (sortBy === 'joinDate') {
          comparison = new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime()
        }

        return sortOrder === 'asc' ? comparison : -comparison
      })
  }, [users, searchQuery, statusFilter, roleFilter, sortBy, sortOrder])

  const handleFilterClear = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setRoleFilter('all')
    setSortBy('joinDate')
    setSortOrder('desc')
  }

  const handleToggleStatus = async (user: User) => {
    try {
      const newStatus = user.status === 'active' ? 'inactive' : 'active'
      await toggleUserStatus(user.id, newStatus)
      setUsers(prev => prev.map(u =>
        u.id === user.id ? { ...u, status: newStatus } : u
      ))
      addNotification({
        title: 'تم التحديث',
        message: `تم ${newStatus === 'active' ? 'تفعيل' : 'تعطيل'} حساب المستخدم بنجاح`,
        type: 'success'
      })
    } catch (error) {
      addNotification({
        title: 'خطأ',
        message: 'فشل في تحديث حالة المستخدم',
        type: 'error'
      })
    }
  }

  const columns = useMemo(() => [
    {
      key: 'name',
      label: 'الاسم',
      sortable: true,
      render: (user: User) => (
        <div className="flex items-center gap-3">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <UserIcon size={20} className="text-gray-500" />
            </div>
          )}
          <div>
            <h3 className="font-medium text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'الدور',
      sortable: true,
      render: (user: User) => (
        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
          {roleOptions.find(r => r.value === user.role)?.label || user.role}
        </span>
      )
    },
    {
      key: 'status',
      label: 'الحالة',
      sortable: true,
      render: (user: User) => (
        <span className={cn(
          'px-2 py-1 text-xs rounded-full',
          user.status === 'active' ? 'bg-green-100 text-green-800' :
            user.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
              user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
        )}>
          {statusOptions.find(s => s.value === user.status)?.label || user.status}
        </span>
      )
    },
    {
      key: 'department',
      label: 'القسم',
      render: (user: User) => (
        <span className="text-sm text-gray-600">{user.department || '-'}</span>
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
            onClick={() => handleToggleStatus(user)}
            className={cn(
              "transition-colors",
              user.status === 'active' ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"
            )}
            title={user.status === 'active' ? 'تعطيل' : 'تفعيل'}
          >
            <Power size={16} />
          </button>
          {user.id !== currentUser?.id && (
            <button
              onClick={() => setConfirmDeleteId(user.id)}
              className="text-red-600 hover:text-red-700 transition-colors"
              title="حذف"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      )
    }
  ], [currentUser?.id])

  return (
    <div className="space-y-6">
      <Card className="hover-lift">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{t('navigation.users')}</h1>
              <p className="text-sm text-gray-600 mt-1">إدارة المستخدمين والصلاحيات</p>
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
        <Divider />
        <CardContent>
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 right-0 rtl:left-0 rtl:right-auto pr-3 rtl:pl-3 rtl:pr-0 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن اسم، بريد إلكتروني، رقم هاتف، أو رقم طالب..."
                className="w-full pr-10 rtl:pr-3 rtl:pl-10 pl-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gpms-light focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 left-0 rtl:right-0 rtl:left-auto pl-3 rtl:pr-3 rtl:pl-0 flex items-center"
                >
                  <XCircle className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">جاري التحميل...</div>
          ) : viewMode === 'table' ? (
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
                      <div className="flex items-center gap-3 flex-1">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <UserIcon size={24} className="text-gray-500" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="text-md font-semibold text-gray-900 mb-1">{user.name}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      <span className={cn(
                        'px-2 py-1 text-xs rounded-full',
                        user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      )}>
                        {user.status === 'active' ? 'نشط' : 'غير نشط'}
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <UserCheck size={16} className="me-2" />
                        <span>{roleOptions.find(r => r.value === user.role)?.label || user.role}</span>
                      </div>
                      {user.department && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Building size={16} className="me-2" />
                          <span>{user.department}</span>
                        </div>
                      )}
                      {user.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone size={16} className="me-2" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <button
                        onClick={() => setViewUser(user)}
                        className="text-gpms-dark hover:text-gpms-light text-sm font-medium transition-colors"
                      >
                        عرض التفاصيل
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingUser(user)
                            setIsEditModalOpen(true)
                          }}
                          className="p-2 text-blue-600 hover:text-blue-700 transition-colors"
                          title="تعديل"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={cn(
                            "p-2 transition-colors",
                            user.status === 'active' ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"
                          )}
                          title={user.status === 'active' ? 'تعطيل' : 'تفعيل'}
                        >
                          <Power size={16} />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredUsers.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <UserIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا يوجد مستخدمون</h3>
              <p className="text-gray-600">لم يتم العثور على مستخدمين يطابقون معايير البحث</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View User Modal */}
      <Modal
        isOpen={!!viewUser}
        onClose={() => setViewUser(null)}
        title={viewUser ? `تفاصيل المستخدم - ${viewUser.name}` : 'تفاصيل المستخدم'}
        size="lg"
      >
        {viewUser && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
              {viewUser.avatar ? (
                <img src={viewUser.avatar} alt={viewUser.name} className="w-20 h-20 rounded-full" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserIcon size={40} className="text-gray-500" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{viewUser.name}</h3>
                <p className="text-sm text-gray-600">{viewUser.email}</p>
                <span className={cn(
                  'inline-block mt-2 px-2 py-1 text-xs rounded-full',
                  viewUser.status === 'active' ? 'bg-green-100 text-green-800' :
                    viewUser.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                      viewUser.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                )}>
                  {statusOptions.find(s => s.value === viewUser.status)?.label || viewUser.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">الدور:</span>
                <p className="text-gray-900 mt-1">{roleOptions.find(r => r.value === viewUser.role)?.label || viewUser.role}</p>
              </div>
              {viewUser.department && (
                <div>
                  <span className="font-medium text-gray-700">القسم:</span>
                  <p className="text-gray-900 mt-1">{viewUser.department}</p>
                </div>
              )}
              {viewUser.phone && (
                <div>
                  <span className="font-medium text-gray-700">الهاتف:</span>
                  <p className="text-gray-900 mt-1">{viewUser.phone}</p>
                </div>
              )}
              {viewUser.studentId && (
                <div>
                  <span className="font-medium text-gray-700">رقم الطالب:</span>
                  <p className="text-gray-900 mt-1">{viewUser.studentId}</p>
                </div>
              )}
              <div>
                <span className="font-medium text-gray-700">تاريخ الانضمام:</span>
                <p className="text-gray-900 mt-1">{new Date(viewUser.joinDate).toLocaleDateString('ar-SA')}</p>
              </div>
              {viewUser.lastLogin && (
                <div>
                  <span className="font-medium text-gray-700">آخر تسجيل دخول:</span>
                  <p className="text-gray-900 mt-1">{new Date(viewUser.lastLogin).toLocaleDateString('ar-SA')}</p>
                </div>
              )}
            </div>

            {viewUser.permissions && viewUser.permissions.length > 0 && (
              <div>
                <span className="font-medium text-gray-700 mb-2 block">الصلاحيات:</span>
                <div className="flex flex-wrap gap-2">
                  {viewUser.permissions.map((permission, idx) => (
                    <span key={idx} className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Add/Edit User Modal */}
      <UserFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingUser(null)
        }}
        user={editingUser}
        onSuccess={async () => {
          await loadUsers()
          setIsEditModalOpen(false)
          setEditingUser(null)
        }}
      />

      {/* Permissions Modal */}
      <PermissionsModal
        isOpen={isPermissionsModalOpen}
        onClose={() => {
          setIsPermissionsModalOpen(false)
          setEditingUser(null)
        }}
        user={editingUser}
        availablePermissions={availablePermissions}
        onSuccess={async () => {
          await loadUsers()
          setIsPermissionsModalOpen(false)
          setEditingUser(null)
        }}
      />

      <ConfirmDialog
        isOpen={!!confirmDeleteId}
        title="تأكيد الحذف"
        description="هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء."
        variant="destructive"
        onConfirm={async () => {
          try {
            await deleteUser(confirmDeleteId || '')
            await loadUsers()
            addNotification({
              title: 'تم الحذف',
              message: 'تم حذف المستخدم بنجاح',
              type: 'success'
            })
          } catch (error) {
            addNotification({
              title: 'خطأ',
              message: 'فشل في حذف المستخدم',
              type: 'error'
            })
          }
          setConfirmDeleteId(null)
        }}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  )
}

// User Form Modal Component
interface UserFormModalProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  onSuccess: () => void
}

const UserFormModal: React.FC<UserFormModalProps> = ({ isOpen, onClose, user, onSuccess }) => {
  const { addNotification } = useNotifications()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'student' as User['role'],
    status: 'active' as User['status'],
    department: '',
    studentId: '',
    password: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role,
        status: user.status,
        department: user.department || '',
        studentId: user.studentId || '',
        password: ''
      })
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'student',
        status: 'active',
        department: '',
        studentId: '',
        password: ''
      })
    }
  }, [user, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (user) {
        const updateData: UpdateUserInput = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          role: formData.role,
          status: formData.status,
          department: formData.department || undefined,
          studentId: formData.studentId || undefined
        }
        await updateUser(user.id, updateData)
        addNotification({
          title: 'تم التحديث',
          message: 'تم تحديث بيانات المستخدم بنجاح',
          type: 'success'
        })
      } else {
        const createData: CreateUserInput = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          role: formData.role,
          status: formData.status,
          department: formData.department || undefined,
          studentId: formData.studentId || undefined,
          permissions: [],
          tags: []
        }
        await createUser(createData)
        addNotification({
          title: 'تم الإضافة',
          message: 'تم إضافة المستخدم بنجاح',
          type: 'success'
        })
      }
      onSuccess()
    } catch (error) {
      addNotification({
        title: 'خطأ',
        message: error instanceof Error ? error.message : 'فشل في حفظ البيانات',
        type: 'error'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}
      size="md"
    >
      <Form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <FormGroup>
            <FormLabel htmlFor="name" required>الاسم</FormLabel>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="email" required>البريد الإلكتروني</FormLabel>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="phone">الهاتف</FormLabel>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="role" required>الدور</FormLabel>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gpms-light focus:border-transparent"
              required
            >
              <option value="student">طالب</option>
              <option value="supervisor">مشرف</option>
              <option value="committee">لجنة</option>
              <option value="discussion">مناقشة</option>
              <option value="admin">مدير</option>
            </select>
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="status" required>الحالة</FormLabel>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as User['status'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gpms-light focus:border-transparent"
              required
            >
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
              <option value="pending">قيد الانتظار</option>
              <option value="suspended">معلق</option>
            </select>
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="department">القسم</FormLabel>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="studentId">رقم الطالب</FormLabel>
            <Input
              id="studentId"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
            />
          </FormGroup>

          {!user && (
            <FormGroup>
              <FormLabel htmlFor="password" required>كلمة المرور</FormLabel>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </FormGroup>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {user ? 'حفظ التغييرات' : 'إضافة المستخدم'}
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  )
}

// Permissions Modal Component
interface PermissionsModalProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  availablePermissions: string[]
  onSuccess: () => void
}

const PermissionsModal: React.FC<PermissionsModalProps> = ({ isOpen, onClose, user, availablePermissions, onSuccess }) => {
  const { addNotification } = useNotifications()
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [selectedRole, setSelectedRole] = useState<User['role'] | ''>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      setSelectedPermissions(user.permissions || [])
      setSelectedRole(user.role)
    }
  }, [user, isOpen])

  const handleTogglePermission = (permission: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)
    try {
      // Update role if changed
      if (selectedRole !== user.role) {
        await updateUserRole(user.id, selectedRole as User['role'])
      }

      // Update permissions
      await updateUserPermissions(user.id, selectedPermissions)

      addNotification({
        title: 'تم التحديث',
        message: 'تم تحديث الصلاحيات بنجاح',
        type: 'success'
      })
      onSuccess()
    } catch (error) {
      addNotification({
        title: 'خطأ',
        message: 'فشل في تحديث الصلاحيات',
        type: 'error'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`إدارة الصلاحيات - ${user.name}`}
      size="lg"
    >
      <Form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <FormGroup>
            <FormLabel htmlFor="role" required>الدور</FormLabel>
            <select
              id="role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as User['role'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gpms-light focus:border-transparent"
              required
            >
              <option value="student">طالب</option>
              <option value="supervisor">مشرف</option>
              <option value="committee">لجنة</option>
              <option value="discussion">مناقشة</option>
              <option value="admin">مدير</option>
            </select>
          </FormGroup>

          <div>
            <FormLabel>الصلاحيات</FormLabel>
            <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
              {availablePermissions.map((permission) => (
                <label key={permission} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(permission)}
                    onChange={() => handleTogglePermission(permission)}
                    className="w-4 h-4 text-gpms-dark border-gray-300 rounded focus:ring-gpms-light"
                  />
                  <span className="mr-3 rtl:mr-0 rtl:ml-3 text-sm text-gray-700">{permission}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit" loading={isSubmitting}>
              حفظ الصلاحيات
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  )
}

export default UsersScreen
