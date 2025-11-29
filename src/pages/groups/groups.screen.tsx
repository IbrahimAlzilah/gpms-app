import React, { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Divider from '@/components/ui/Divider'
import GroupManagementModal from '@/components/forms/GroupManagementModal'
import { Users, UserPlus, LogOut, PlusCircle, LogIn } from 'lucide-react'

interface GroupMember {
  id: string
  name: string
  email: string
  role: 'leader' | 'member'
  joinDate: string
}

interface Group {
  id: string
  name: string
  project: string
  members: GroupMember[]
  createdAt: string
  status: 'active' | 'pending' | 'inactive'
}

const GroupsScreen: React.FC = () => {
  const { t } = useLanguage()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'create' | 'join' | 'invite' | 'leave'>('create')

  const [currentGroup, setCurrentGroup] = useState<Group | null>({
    id: '1',
    name: 'مجموعة التطوير الذكي',
    project: 'تطبيق إدارة المكتبة الذكية',
    members: [
      {
        id: '1',
        name: 'أحمد علي',
        email: 'ahmed.ali@university.edu',
        role: 'leader',
        joinDate: '2024-01-01'
      },
      {
        id: '2',
        name: 'فاطمة حسن',
        email: 'fatima.hassan@university.edu',
        role: 'member',
        joinDate: '2024-01-05'
      },
      {
        id: '3',
        name: 'محمد خالد',
        email: 'mohammed.khalid@university.edu',
        role: 'member',
        joinDate: '2024-01-10'
      }
    ],
    createdAt: '2024-01-01',
    status: 'active'
  })

  const handleModalOpen = (type: 'create' | 'join' | 'invite' | 'leave') => {
    setModalType(type)
    setIsModalOpen(true)
  }

  const handleGroupAction = (data: { groupName?: string; projectName?: string; [key: string]: unknown }) => {
    switch (modalType) {
      case 'create':
        setCurrentGroup({
          id: Date.now().toString(),
          name: data.groupName,
          project: data.projectName || '',
          members: [{
            id: '1',
            name: 'أحمد علي',
            email: 'ahmed.ali@university.edu',
            role: 'leader',
            joinDate: new Date().toISOString().split('T')[0]
          }],
          createdAt: new Date().toISOString().split('T')[0],
          status: 'active'
        })
        break
      default:
        break
    }
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <Card className="hover-lift">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">إدارة المجموعة</h1>
            </div>
            {!currentGroup && (
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Button
                  onClick={() => handleModalOpen('create')}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  <PlusCircle className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                  إنشاء مجموعة
                </Button>
                <Button
                  onClick={() => handleModalOpen('join')}
                  variant="outline"
                >
                  <LogIn className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                  الانضمام لمجموعة
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <Divider />
        <CardContent>
          {currentGroup ? (
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{currentGroup.name}</h3>
                    <p className="text-sm text-gray-600">{currentGroup.project}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    {currentGroup.status === 'active' ? 'نشطة' : 'غير نشطة'}
                  </span>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">أعضاء المجموعة</h4>
                  <div className="space-y-2">
                    {currentGroup.members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <Users className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{member.name}</p>
                            <p className="text-xs text-gray-500">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          {member.role === 'leader' && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              قائد
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => handleModalOpen('invite')}
                    variant="outline"
                  >
                    <UserPlus className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                    دعوة عضو
                  </Button>
                  <Button
                    onClick={() => handleModalOpen('leave')}
                    variant="outline"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                    مغادرة المجموعة
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مجموعة</h3>
              <p className="text-gray-600 mb-6">يمكنك إنشاء مجموعة جديدة أو الانضمام إلى مجموعة موجودة</p>
              <div className="flex justify-center gap-3">
                <Button
                  onClick={() => handleModalOpen('create')}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  <PlusCircle className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                  إنشاء مجموعة
                </Button>
                <Button
                  onClick={() => handleModalOpen('join')}
                  variant="outline"
                >
                  <LogIn className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                  الانضمام لمجموعة
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <GroupManagementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleGroupAction}
        currentGroup={currentGroup ? {
          id: currentGroup.id,
          name: currentGroup.name,
          members: currentGroup.members.map(m => m.name)
        } : undefined}
      />
    </div>
  )
}

export default GroupsScreen
