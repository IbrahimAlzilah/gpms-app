import React, { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { cn } from '../lib/utils'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Tabs, TabList, Tab, TabContent } from '../components/ui/Tabs'
import { 
  BookOpen,
  MessageSquare,
  BarChart3,
  Plus,
  Grid,
  List
} from 'lucide-react'

// Import all new components
import ProjectsTable from '../components/tables/ProjectsTable'
import RequestsTable from '../components/tables/RequestsTable'
import ReportsTable from '../components/tables/ReportsTable'

interface ComponentsDemoProps {
  className?: string
}

const ComponentsDemo: React.FC<ComponentsDemoProps> = ({ className }) => {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('projects')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

  const tabs = [
    {
      id: 'projects',
      label: 'المشاريع',
      icon: BookOpen,
      component: ProjectsTable
    },
    {
      id: 'requests',
      label: 'الطلبات',
      icon: MessageSquare,
      component: RequestsTable
    },
    {
      id: 'reports',
      label: 'التقارير',
      icon: BarChart3,
      component: ReportsTable
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
              <h1 className="text-xl font-bold text-gray-900">مكونات GPMS المحسنة</h1>
              <p className="text-gray-600 mt-1">
                نماذج داخل Modals وجداول تفاعلية مع دعم RTL/LTR كامل
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
              viewMode === 'grid' && 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'
            )}
          />
        )}
      </div>

      {/* Features Summary */}
      <Card className="hover-lift">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gpms-light rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-md font-semibold text-gray-900 mb-2">نماذج متقدمة</h3>
              <p className="text-gray-600 text-sm">
                نماذج تفاعلية داخل Modals مع التحقق من البيانات والتحميل
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gpms-dark rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-md font-semibold text-gray-900 mb-2">جداول ذكية</h3>
              <p className="text-gray-600 text-sm">
                جداول متجاوبة مع بحث وتصفية وترتيب متقدم
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gpms-green rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-md font-semibold text-gray-900 mb-2">دعم RTL/LTR</h3>
              <p className="text-gray-600 text-sm">
                دعم كامل للعربية والإنجليزية مع تبديل فوري
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ComponentsDemo
