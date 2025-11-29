import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { useProjectEdit } from './ProjectEdit.hook'
import { UpdateProjectInput } from '../schema'

const ProjectEditScreen: React.FC = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { project, updateProject, isLoading, error } = useProjectEdit(id || '')
  const [formData, setFormData] = useState<Partial<UpdateProjectInput>>({})

  useEffect(() => {
    if (project) {
      setFormData(project)
    }
  }, [project])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProject(formData as UpdateProjectInput)
      navigate('/projects')
    } catch (err) {
      console.error('Error updating project:', err)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold text-gray-900">تعديل المشروع</h1>
        </CardHeader>
        <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                    عنوان المشروع <span className="text-red-500">*</span>
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
                                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                                        الأولوية
                                    </label>
                                    <select
                                        id="priority"
                                        name="priority"
                                        value={formData.priority || 'medium'}
                                        onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                                    >
                                        <option value="low">منخفض</option>
                                        <option value="medium">متوسط</option>
                                        <option value="high">عالي</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="progress" className="block text-sm font-medium text-gray-700 mb-1">
                                        التقدم (%)
                                    </label>
                                    <input
                                        id="progress"
                                        name="progress"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={formData.progress || 0}
                                        onChange={(e) => setFormData(prev => ({ ...prev, progress: Number(e.target.value) }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/projects')}
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

export default ProjectEditScreen

