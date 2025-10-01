import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { cn } from '../../lib/utils'
import { Card, CardContent, CardHeader } from '../ui/Card'
import Button from '../ui/Button'
import { Tabs, TabList, Tab, TabContent } from '../ui/Tabs'
import { 
  BarChart3, 
  Calendar, 
  Search, 
  Folder, 
  MessageSquare, 
  TrendingUp, 
  Settings,
  Plus,
  Grid,
  List
} from 'lucide-react'

// Import all components
import DashboardOverview from './dashboard/DashboardOverview'
import CalendarComponent from './calendar/CalendarComponent'
import AdvancedSearch from './search/AdvancedSearch'
import FileManager from './files/FileManager'
import ChatComponent from './chat/ChatComponent'
import AnalyticsComponent from './analytics/AnalyticsComponent'
import SettingsComponent from './settings/SettingsComponent'

interface MainDashboardProps {
  className?: string
}

const MainDashboard: React.FC<MainDashboardProps> = ({ className }) => {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('overview')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const tabs = [
    {
      id: 'overview',
      label: 'نظرة عامة',
      icon: BarChart3,
      component: DashboardOverview
    },
    {
      id: 'calendar',
      label: 'التقويم',
      icon: Calendar,
      component: CalendarComponent
    },
    {
      id: 'search',
      label: 'البحث المتقدم',
      icon: Search,
      component: AdvancedSearch
    },
    {
      id: 'files',
      label: 'إدارة الملفات',
      icon: Folder,
      component: FileManager
    },
    {
      id: 'chat',
      label: 'المحادثات',
      icon: MessageSquare,
      component: ChatComponent
    },
    {
      id: 'analytics',
      label: 'التحليلات',
      icon: TrendingUp,
      component: AnalyticsComponent
    },
    {
      id: 'settings',
      label: 'الإعدادات',
      icon: Settings,
      component: SettingsComponent
    }
  ]

  const activeTabData = tabs.find(tab => tab.id === activeTab)
  const ActiveComponent = activeTabData?.component

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <Card className="hover-lift">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">لوحة التحكم الرئيسية</h1>
              <p className="text-gray-600 mt-1">
                مرحباً بك في نظام إدارة مشاريع التخرج - GPMS
              </p>
            </div>
            
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
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
              <Button
                className="bg-gpms-dark text-white hover:bg-gpms-light"
              >
                <Plus className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                إضافة جديد
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Navigation Tabs */}
      <Card className="hover-lift">
        <CardContent className="p-0">
          <Tabs>
            <TabList className="border-b border-gray-200">
              {tabs.map(tab => {
                const Icon = tab.icon
                return (
                  <Tab
                    key={tab.id}
                    value={tab.id}
                    isActive={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex items-center space-x-2 rtl:space-x-reverse px-6 py-4"
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </Tab>
                )
              })}
            </TabList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Content Area */}
      <div className="min-h-[600px]">
        {ActiveComponent && (
          <ActiveComponent 
            className={cn(
              viewMode === 'grid' && activeTab !== 'overview' && 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'
            )}
          />
        )}
      </div>

      {/* Quick Actions Footer */}
      <Card className="hover-lift">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-md font-semibold text-gray-900 mb-2">إجراءات سريعة</h3>
              <p className="text-gray-600">الوصول السريع للوظائف الأكثر استخداماً</p>
            </div>
            
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                جدولة اجتماع
              </Button>
              <Button variant="outline" size="sm">
                <Folder className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                رفع ملف
              </Button>
              <Button variant="outline" size="sm">
                <MessageSquare className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                إرسال رسالة
              </Button>
              <Button variant="outline" size="sm">
                <BarChart3 className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                إنشاء تقرير
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MainDashboard
