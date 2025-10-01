import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { cn } from '../../lib/utils'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { SearchBar } from '../../components/ui/Filter'
import SimplePopover from '../../components/ui/SimplePopover'
import AdvancedFilter from '../../components/ui/AdvancedFilter'
import {
  Eye,
  Edit,
  Trash2,
  Plus,
  User,
  Mail,
  Phone,
  Calendar,
  Grid3X3,
  List,
  Users,
  SlidersHorizontal,
  Shield,
  UserCheck,
  UserX,
  Clock
} from 'lucide-react'

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

const AdminUsers: React.FC = () => {
  const { } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [sortBy, setSortBy] = useState('joinDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')

  // Mock data - مستخدمي النظام
  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'أحمد محمد علي',
      email: 'ahmed.mohamed@university.edu',
      phone: '+966501234567',
      role: 'student',
      status: 'active',
      department: 'علوم الحاسوب',
      studentId: '2021001234',
      joinDate: '2021-09-01',
      lastLogin: '2024-01-25',
      permissions: ['view_projects', 'submit_proposals'],
      tags: ['مستوى رابع', 'مشروع تخرج']
    },
    {
      id: '2',
      name: 'د. سارة أحمد محمد',
      email: 'sara.ahmed@university.edu',
      phone: '+966502345678',
      role: 'supervisor',
      status: 'active',
      department: 'علوم الحاسوب',
      joinDate: '2018-09-01',
      lastLogin: '2024-01-24',
      permissions: ['supervise_projects', 'evaluate_proposals', 'manage_students'],
      tags: ['أستاذ مساعد', 'خبرة 6 سنوات']
    },
    {
      id: '3',
      name: 'د. خالد محمود حسن',
      email: 'khalid.mahmoud@university.edu',
      role: 'committee',
      status: 'active',
      department: 'هندسة البرمجيات',
      joinDate: '2015-09-01',
      lastLogin: '2024-01-23',
      permissions: ['review_projects', 'approve_proposals', 'manage_schedules'],
      tags: ['أستاذ مشارك', 'رئيس اللجنة']
    },
    {
      id: '4',
      name: 'فاطمة حسن محمود',
      email: 'fatima.hassan@university.edu',
      phone: '+966503456789',
      role: 'student',
      status: 'pending',
      department: 'علوم الحاسوب',
      studentId: '2021001235',
      joinDate: '2024-01-20',
      permissions: ['view_projects'],
      tags: ['مستوى رابع', 'جديد']
    },
    {
      id: '5',
      name: 'د. نورا سعد أحمد',
      email: 'nora.saad@university.edu',
      role: 'discussion',
      status: 'active',
      department: 'تقنية المعلومات',
      joinDate: '2019-09-01',
      lastLogin: '2024-01-22',
      permissions: ['evaluate_final_projects', 'conduct_defense'],
      tags: ['أستاذ مساعد', 'خبرة 5 سنوات']
    },
    {
      id: '6',
      name: 'محمد علي سعد',
      email: 'mohamed.ali@university.edu',
      phone: '+966504567890',
      role: 'student',
      status: 'suspended',
      department: 'نظم المعلومات',
      studentId: '2020001234',
      joinDate: '2020-09-01',
      lastLogin: '2024-01-15',
      permissions: ['view_projects'],
      tags: ['مستوى خامس', 'معلق']
    },
    {
      id: '7',
      name: 'د. أحمد محمد السعد',
      email: 'ahmed.mohamed.saad@university.edu',
      role: 'admin',
      status: 'active',
      department: 'علوم الحاسوب',
      joinDate: '2010-09-01',
      lastLogin: '2024-01-25',
      permissions: ['full_access', 'manage_users', 'system_settings'],
      tags: ['أستاذ', 'مدير النظام']
    }
  ])

  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'active', label: 'نشط' },
    { value: 'inactive', label: 'غير نشط' },
    { value: 'pending', label: 'في الانتظار' },
    { value: 'suspended', label: 'معلق' }
  ]

  const roleOptions = [
    { value: 'all', label: 'جميع الأدوار' },
    { value: 'student', label: 'طالب' },
    { value: 'supervisor', label: 'مشرف' },
    { value: 'committee', label: 'لجنة المشاريع' },
    { value: 'discussion', label: 'لجنة المناقشة' },
    { value: 'admin', label: 'مدير النظام' }
  ]

  const sortOptions = [
    { value: 'joinDate', label: 'تاريخ الانضمام' },
    { value: 'name', label: 'الاسم' },
    { value: 'role', label: 'الدور' },
    { value: 'status', label: 'الحالة' },
    { value: 'lastLogin', label: 'آخر دخول' }
  ]

  const getRoleText = (role: string) => {
    switch (role) {
      case 'student': return 'طالب'
      case 'supervisor': return 'مشرف'
      case 'committee': return 'لجنة المشاريع'
      case 'discussion': return 'لجنة المناقشة'
      case 'admin': return 'مدير النظام'
      default: return role
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student': return 'bg-blue-100 text-blue-800'
      case 'supervisor': return 'bg-green-100 text-green-800'
      case 'committee': return 'bg-purple-100 text-purple-800'
      case 'discussion': return 'bg-orange-100 text-orange-800'
      case 'admin': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط'
      case 'inactive': return 'غير نشط'
      case 'pending': return 'في الانتظار'
      case 'suspended': return 'معلق'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchQuery ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.phone && user.phone.includes(searchQuery)) ||
      (user.studentId && user.studentId.includes(searchQuery)) ||
      (user.department && user.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
      user.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    const matchesRole = roleFilter === 'all' || user.role === roleFilter

    return matchesSearch && matchesStatus && matchesRole
  })

  const handleFilterClear = () => {
    setStatusFilter('all')
    setRoleFilter('all')
    setSortBy('joinDate')
    setSortOrder('desc')
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (statusFilter !== 'all') count++
    if (roleFilter !== 'all') count++
    if (sortBy !== 'joinDate') count++
    if (sortOrder !== 'desc') count++
    return count
  }

  const handleEditUser = (user: User) => {
    // Open edit user modal
    // TODO: Implement edit user functionality
  }

  const handleManagePermissions = (user: User) => {
    // Open permissions management modal
    // TODO: Implement permissions management functionality
    const permissions = [
      'view_projects',
      'submit_proposals',
      'supervise_projects',
      'evaluate_proposals',
      'manage_students',
      'review_projects',
      'approve_proposals',
      'manage_schedules',
      'evaluate_final_projects',
      'conduct_defense',
      'full_access',
      'manage_users',
      'system_settings'
    ]
    
    const currentPermissions = user.permissions
    const availablePermissions = permissions.filter(p => !currentPermissions.includes(p))
    
    const message = `
إدارة الصلاحيات للمستخدم: ${user.name}
الدور: ${getRoleText(user.role)}

الصلاحيات الحالية:
${currentPermissions.map(p => `- ${p}`).join('\n')}

الصلاحيات المتاحة:
${availablePermissions.map(p => `- ${p}`).join('\n')}

يمكنك إضافة أو إزالة الصلاحيات حسب الحاجة.
    `
    
    alert(message)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="hover-lift">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Users className="w-6 h-6 text-gpms-dark" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">إدارة المستخدمين</h1>
                <p className="text-gray-600 mt-1">إدارة المستخدمين والصلاحيات والأدوار</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  title="جدول"
                  onClick={() => setViewMode('table')}
                  className={cn(
                    'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                    viewMode === 'table'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  <List size={20} className="ml-1 rtl:ml-0 rtl:mr-1" />
                </button>
                <button
                  title="شبكة"
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                    viewMode === 'grid'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  <Grid3X3 size={20} className="ml-1 rtl:ml-0 rtl:mr-1" />
                </button>
              </div>

              {/* Advanced Filter */}
              <SimplePopover
                content={
                  <AdvancedFilter
                    statusOptions={statusOptions}
                    priorityOptions={roleOptions}
                    typeOptions={roleOptions}
                    sortOptions={sortOptions}
                    statusFilter={statusFilter}
                    priorityFilter={roleFilter}
                    typeFilter={roleFilter}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onStatusChange={setStatusFilter}
                    onPriorityChange={setRoleFilter}
                    onTypeChange={setRoleFilter}
                    onSortChange={setSortBy}
                    onSortOrderChange={setSortOrder}
                    onApply={() => {}}
                    onClear={handleFilterClear}
                  />
                }
              >
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    'relative',
                    getActiveFiltersCount() > 0 && 'bg-gpms-light/10 border-gpms-light text-gpms-dark'
                  )}
                >
                  <SlidersHorizontal size={16} className="ml-1 rtl:ml-0 rtl:mr-1" />
                  تصفية المستخدمين
                  {getActiveFiltersCount() > 0 && (
                    <span className="absolute -top-1 -right-1 rtl:right-auto rtl:-left-1 bg-gpms-dark text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getActiveFiltersCount()}
                    </span>
                  )}
                </Button>
              </SimplePopover>

              <Button className="bg-gpms-dark text-white hover:bg-gpms-light">
                <Plus className="w-4 h-4 ml-1 rtl:ml-0 rtl:mr-1" />
                إضافة مستخدم
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Search Bar */}
          <div className="mb-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="البحث في المستخدمين..."
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Display */}
      {viewMode === 'table' ? (
        <Card className="hover-lift">
          <CardContent className="text-center py-12">
            <p className="text-gray-600">عرض الجدول - قيد التطوير</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="hover-lift">
              <CardContent className="p-6">
                {/* User Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-12 h-12 bg-gpms-light rounded-full flex items-center justify-center">
                      <User size={24} className="text-gpms-dark" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className={cn('px-2 py-1 text-xs rounded-full', getRoleColor(user.role))}>
                      {getRoleText(user.role)}
                    </span>
                    <span className={cn('px-2 py-1 text-xs rounded-full', getStatusColor(user.status))}>
                      {getStatusText(user.status)}
                    </span>
                  </div>
                </div>

                {/* User Info */}
                <div className="space-y-3 mb-4">
                  {user.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  
                  {user.studentId && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Shield size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
                      <span>الرقم الجامعي: {user.studentId}</span>
                    </div>
                  )}

                  {user.department && (
                    <div className="flex items-center text-sm text-gray-600">
                      <User size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
                      <span>{user.department}</span>
                    </div>
                  )}

                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
                    <span>انضم: {new Date(user.joinDate).toLocaleDateString('ar')}</span>
                  </div>

                  {user.lastLogin && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
                      <span>آخر دخول: {new Date(user.lastLogin).toLocaleDateString('ar')}</span>
                    </div>
                  )}
                </div>

                {/* Permissions */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">الصلاحيات:</h4>
                  <div className="flex flex-wrap gap-1">
                    {user.permissions.slice(0, 3).map((permission, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {permission.replace('_', ' ')}
                      </span>
                    ))}
                    {user.permissions.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        +{user.permissions.length - 3} أخرى
                      </span>
                    )}
                  </div>
                </div>

                {/* Tags */}
                {user.tags.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {user.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors" title="عرض">
                      <Eye size={16} />
                    </button>
                    <button 
                      onClick={() => handleEditUser(user)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors" 
                      title="تعديل"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleManagePermissions(user)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors" 
                      title="إدارة الصلاحيات"
                    >
                      <Shield size={16} />
                    </button>
                    {user.status === 'active' ? (
                      <button className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="تعطيل">
                        <UserX size={16} />
                      </button>
                    ) : (
                      <button className="p-2 text-gray-400 hover:text-green-600 transition-colors" title="تفعيل">
                        <UserCheck size={16} />
                      </button>
                    )}
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="حذف">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <button className="text-gpms-dark hover:text-gpms-light text-sm font-medium transition-colors">
                    عرض التفاصيل
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <Card className="hover-lift">
          <CardContent className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مستخدمين</h3>
            <p className="text-gray-600">لم يتم العثور على مستخدمين تطابق معايير البحث</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default AdminUsers