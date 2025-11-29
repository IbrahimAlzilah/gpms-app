import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { useAnnouncementAdd } from './AnnouncementAdd.hook'
import { CreateAnnouncementInput } from '../schema'

const AnnouncementAddScreen: React.FC = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { createAnnouncement, isLoading, error } = useAnnouncementAdd()
  const [formData, setFormData] = useState<Partial<CreateAnnouncementInput>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createAnnouncement(formData as CreateAnnouncementInput)
      navigate('/announcements')
    } catch (err) {
      console.error('Error creating announcement:', err)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold text-gray-900">إضافة إعلان جديد</h1>
        </CardHeader>
        <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                    العنوان <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    value={formData.title || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    الوصف <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                                    rows={5}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                                        النوع <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="type"
                                        name="type"
                                        value={formData.type || 'general'}
                                        onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'proposal_submission' | 'project_review' | 'defense_schedule' | 'general' }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                                        required
                                    >
                                        <option value="proposal_submission">تقديم مقترحات</option>
                                        <option value="project_review">مراجعة مشاريع</option>
                                        <option value="defense_schedule">جدول مناقشات</option>
                                        <option value="general">عام</option>
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
                                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' | 'upcoming' }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                                    >
                                        <option value="active">نشط</option>
                                        <option value="inactive">غير نشط</option>
                                        <option value="upcoming">قادم</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                                        تاريخ البدء <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="startDate"
                                        name="startDate"
                                        type="date"
                                        value={formData.startDate || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                                        تاريخ الانتهاء <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="endDate"
                                        name="endDate"
                                        type="date"
                                        value={formData.endDate || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/announcements')}
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

export default AnnouncementAddScreen

