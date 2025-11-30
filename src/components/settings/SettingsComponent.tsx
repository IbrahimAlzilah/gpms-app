import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { useTheme } from '../../context/ThemeContext'
import { cn } from '../../lib/utils'
import { Card, CardContent, CardHeader } from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Badge from '../ui/Badge'
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Mail,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Save,
  RefreshCw,
  Check,
  AlertTriangle
} from 'lucide-react'

interface SettingsProps {
  className?: string
}

const SettingsComponent: React.FC<SettingsProps> = ({ className }) => {
  const { t, currentLanguage, changeLanguage } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('profile')
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Profile settings
  const [profileSettings, setProfileSettings] = useState({
    firstName: 'أحمد',
    lastName: 'محمد',
    email: 'ahmed.mohamed@university.edu',
    phone: '+966501234567',
    department: 'هندسة الحاسوب',
    role: 'طالب',
    avatar: null
  })

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    projectUpdates: true,
    deadlineReminders: true,
    meetingAlerts: true,
    systemAnnouncements: true,
    weeklyDigest: true
  })

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5
  })

  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: theme,
    language: currentLanguage,
    fontSize: 'medium',
    density: 'comfortable',
    animations: true,
    reducedMotion: false
  })

  const tabs = [
    { id: 'profile', label: 'الملف الشخصي', icon: User },
    { id: 'notifications', label: 'الإشعارات', icon: Bell },
    { id: 'security', label: 'الأمان', icon: Shield },
    { id: 'appearance', label: 'المظهر', icon: Palette },
    { id: 'system', label: 'النظام', icon: Settings }
  ]

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSaving(false)
    setHasChanges(false)
  }

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setHasChanges(true)

    switch (category) {
      case 'profile':
        setProfileSettings(prev => ({ ...prev, [setting]: value }))
        break
      case 'notifications':
        setNotificationSettings(prev => ({ ...prev, [setting]: value }))
        break
      case 'security':
        setSecuritySettings(prev => ({ ...prev, [setting]: value }))
        break
      case 'appearance':
        setAppearanceSettings(prev => ({ ...prev, [setting]: value }))
        if (setting === 'theme') {
          toggleTheme()
        }
        if (setting === 'language') {
          changeLanguage(value)
        }
        break
    }
  }

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="الاسم الأول"
          value={profileSettings.firstName}
          onChange={(e) => handleSettingChange('profile', 'firstName', e.target.value)}
        />
        <Input
          label="الاسم الأخير"
          value={profileSettings.lastName}
          onChange={(e) => handleSettingChange('profile', 'lastName', e.target.value)}
        />
        <Input
          label="البريد الإلكتروني"
          type="email"
          value={profileSettings.email}
          onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
        />
        <Input
          label="رقم الهاتف"
          value={profileSettings.phone}
          onChange={(e) => handleSettingChange('profile', 'phone', e.target.value)}
        />
        <Input
          label="القسم"
          value={profileSettings.department}
          onChange={(e) => handleSettingChange('profile', 'department', e.target.value)}
        />
        <Input
          label="الدور"
          value={profileSettings.role}
          disabled
        />
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">صورة الملف الشخصي</h3>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="w-20 h-20 bg-gpms-light rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {profileSettings.firstName.charAt(0)}
          </div>
          <div>
            <Button variant="outline" size="sm">
              تغيير الصورة
            </Button>
            <p className="text-sm text-gray-500 mt-1">
              JPG, PNG أو GIF. الحد الأقصى 2 ميجابايت
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">طرق الإشعارات</h3>
        {[
          { key: 'emailNotifications', label: 'الإشعارات عبر البريد الإلكتروني', description: 'تلقي إشعارات مهمة عبر البريد الإلكتروني' },
          { key: 'pushNotifications', label: 'الإشعارات الفورية', description: 'إشعارات فورية في المتصفح' },
          { key: 'smsNotifications', label: 'الإشعارات عبر الرسائل النصية', description: 'إشعارات عاجلة عبر الرسائل النصية' }
        ].map(item => (
          <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">{item.label}</h4>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings[item.key as keyof typeof notificationSettings] as boolean}
                onChange={(e) => handleSettingChange('notifications', item.key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gpms-light/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gpms-light"></div>
            </label>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">أنواع الإشعارات</h3>
        {[
          { key: 'projectUpdates', label: 'تحديثات المشاريع', description: 'إشعارات حول تقدم المشاريع' },
          { key: 'deadlineReminders', label: 'تذكيرات المواعيد النهائية', description: 'تذكيرات قبل انتهاء المواعيد' },
          { key: 'meetingAlerts', label: 'تنبيهات الاجتماعات', description: 'إشعارات الاجتماعات المجدولة' },
          { key: 'systemAnnouncements', label: 'إعلانات النظام', description: 'إعلانات مهمة من النظام' },
          { key: 'weeklyDigest', label: 'التلخيص الأسبوعي', description: 'ملخص أسبوعي للأنشطة' }
        ].map(item => (
          <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">{item.label}</h4>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings[item.key as keyof typeof notificationSettings] as boolean}
                onChange={(e) => handleSettingChange('notifications', item.key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gpms-light/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gpms-light"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">المصادقة الثنائية</h3>
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">تفعيل المصادقة الثنائية</h4>
            <p className="text-sm text-gray-600">إضافة طبقة حماية إضافية لحسابك</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={securitySettings.twoFactorAuth}
              onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gpms-light/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gpms-light"></div>
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">إعدادات الأمان</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">مهلة الجلسة (دقائق)</h4>
            <Input
              type="number"
              value={securitySettings.sessionTimeout}
              onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
            />
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">انتهاء صلاحية كلمة المرور (أيام)</h4>
            <Input
              type="number"
              value={securitySettings.passwordExpiry}
              onChange={(e) => handleSettingChange('security', 'passwordExpiry', parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">تسجيل الدخول</h3>
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">تنبيهات تسجيل الدخول</h4>
            <p className="text-sm text-gray-600">تلقي إشعار عند تسجيل الدخول من جهاز جديد</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={securitySettings.loginAlerts}
              onChange={(e) => handleSettingChange('security', 'loginAlerts', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gpms-light/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gpms-light"></div>
          </label>
        </div>
      </div>
    </div>
  )

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">المظهر</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">السمة</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleSettingChange('appearance', 'theme', 'light')}
                className={cn(
                  'p-3 border rounded-lg flex items-center justify-center space-x-2 rtl:space-x-reverse',
                  appearanceSettings.theme === 'light' ? 'border-gpms-light bg-gpms-light/10' : 'border-gray-200'
                )}
              >
                <Sun className="w-5 h-5" />
                <span>فاتح</span>
              </button>
              <button
                onClick={() => handleSettingChange('appearance', 'theme', 'dark')}
                className={cn(
                  'p-3 border rounded-lg flex items-center justify-center space-x-2 rtl:space-x-reverse',
                  appearanceSettings.theme === 'dark' ? 'border-gpms-light bg-gpms-light/10' : 'border-gray-200'
                )}
              >
                <Moon className="w-5 h-5" />
                <span>مظلم</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">اللغة</label>
            <select
              value={appearanceSettings.language}
              onChange={(e) => handleSettingChange('appearance', 'language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
            >
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">التخصيص</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">حجم الخط</label>
            <select
              value={appearanceSettings.fontSize}
              onChange={(e) => handleSettingChange('appearance', 'fontSize', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
            >
              <option value="small">صغير</option>
              <option value="medium">متوسط</option>
              <option value="large">كبير</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">كثافة المحتوى</label>
            <select
              value={appearanceSettings.density}
              onChange={(e) => handleSettingChange('appearance', 'density', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
            >
              <option value="compact">مضغوط</option>
              <option value="comfortable">مريح</option>
              <option value="spacious">واسع</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">الحركات والتفاعل</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">الحركات</h4>
              <p className="text-sm text-gray-600">تفعيل الحركات والانتقالات</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={appearanceSettings.animations}
                onChange={(e) => handleSettingChange('appearance', 'animations', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gpms-light/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gpms-light"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">تقليل الحركة</h4>
              <p className="text-sm text-gray-600">تقليل الحركات للمستخدمين الذين يفضلون ذلك</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={appearanceSettings.reducedMotion}
                onChange={(e) => handleSettingChange('appearance', 'reducedMotion', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gpms-light/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gpms-light"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">معلومات النظام</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">إصدار النظام</h4>
            <p className="text-sm text-gray-600">v2.1.0</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">آخر تحديث</h4>
            <p className="text-sm text-gray-600">15 يناير 2024</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">حالة الخادم</h4>
            <Badge variant="success">متصل</Badge>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">النسخة الاحتياطية</h4>
            <Badge variant="info">محدثة</Badge>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">إجراءات النظام</h3>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <RefreshCw className="w-4 h-4 me-2" />
            فحص التحديثات
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Database className="w-4 h-4 me-2" />
            إنشاء نسخة احتياطية
          </Button>
          <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
            <AlertTriangle className="w-4 h-4 me-2" />
            مسح بيانات التخزين المؤقت
          </Button>
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileSettings()
      case 'notifications':
        return renderNotificationSettings()
      case 'security':
        return renderSecuritySettings()
      case 'appearance':
        return renderAppearanceSettings()
      case 'system':
        return renderSystemSettings()
      default:
        return null
    }
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <Card className="hover-lift">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Settings className="w-6 h-6 text-gpms-dark" />
              <h2 className="text-xl font-bold text-gray-900">الإعدادات</h2>
            </div>

            {hasChanges && (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Button
                  variant="outline"
                  onClick={() => setHasChanges(false)}
                >
                  إلغاء
                </Button>
                <Button
                  onClick={handleSave}
                  loading={isSaving}
                  className="bg-gpms-dark text-white hover:bg-gpms-light"
                >
                  <Save className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                  حفظ التغييرات
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="lg:col-span-1">
          <Card className="hover-lift">
            <CardContent className="p-0">
              <nav className="space-y-1">
                {tabs.map(tab => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 text-sm font-medium transition-colors',
                        activeTab === tab.id
                          ? 'bg-gpms-light text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <Card className="hover-lift">
            <CardContent className="p-6">
              {renderTabContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default SettingsComponent
