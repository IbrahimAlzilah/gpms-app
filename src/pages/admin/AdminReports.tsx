import React from 'react'
import { useLanguage } from '../../context/LanguageContext'

const AdminReports: React.FC = () => {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">تقارير النظام</h1>
          <p className="text-gray-600 mt-1">تقارير شاملة عن النظام والمستخدمين</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <p className="text-gray-600 text-center py-8">
          صفحة تقارير النظام - قيد التطوير
        </p>
      </div>
    </div>
  )
}

export default AdminReports
