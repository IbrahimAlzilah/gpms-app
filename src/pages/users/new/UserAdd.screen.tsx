import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { useUserAdd } from './UserAdd.hook'
import { CreateUserInput } from '../schema'

const UserAddScreen: React.FC = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { createUser, isLoading, error } = useUserAdd()
  const [formData, setFormData] = useState<Partial<CreateUserInput>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createUser(formData as CreateUserInput)
      navigate('/users')
    } catch (err) {
      console.error('Error creating user:', err)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold text-gray-900">إضافة مستخدم جديد</h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  الاسم <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    البريد الإلكتروني <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    الهاتف
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    الدور <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role || 'student'}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'student' | 'supervisor' | 'committee' | 'discussion' | 'admin' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                    required
                  >
                    <option value="student">طالب</option>
                    <option value="supervisor">مشرف</option>
                    <option value="committee">لجنة</option>
                    <option value="discussion">مناقشة</option>
                    <option value="admin">مدير</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    الحالة
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status || 'active'}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' | 'pending' | 'suspended' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                  >
                    <option value="active">نشط</option>
                    <option value="inactive">غير نشط</option>
                    <option value="pending">قيد الانتظار</option>
                    <option value="suspended">معلق</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/users')}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gpms-dark text-white hover:bg-gpms-light"
              >
                {isLoading ? 'جاري الحفظ...' : 'حفظ'}
              </Button>
            </div>
            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default UserAddScreen

