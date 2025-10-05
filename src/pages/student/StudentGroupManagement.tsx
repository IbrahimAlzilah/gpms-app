import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { cn } from '../../lib/utils'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Divider from '../../components/ui/Divider'
import GroupManagementModal from '../../components/forms/GroupManagementModal'
import {
  Users,
  UserPlus,
  LogOut,
  PlusCircle,
  LogIn,
  AlertCircle,
  CheckCircle,
  Calendar,
  User
} from 'lucide-react'

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

const StudentGroupManagement: React.FC = () => {
  const { t } = useLanguage()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'create' | 'join' | 'invite' | 'leave'>('create')

  // Mock data
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

  const handleGroupAction = (data: any) => {
    switch (modalType) {
      case 'create':
        // Handle group creation
        setCurrentGroup({
          id: Date.now().toString(),
          name: data.groupName,
          project: data.projectName || '',
          members: [{
            id: '1',
            name: 'أحمد علي', // Current user
            email: 'ahmed.ali@university.edu',
            role: 'leader',
            joinDate: new Date().toISOString().split('T')[0]
          }],
          createdAt: new Date().toISOString().split('T')[0],
          status: 'active'
        })
        break
      case 'join':
        // Handle joining a group
        // Simulate joining a group
        console.log('تم الانضمام للمجموعة بنجاح', data)
        break
      case 'invite':
        // Handle inviting members
        console.log(`تم إرسال دعوة لـ ${data.inviteEmail}`)
        break
      case 'leave':
        // Handle leaving group - UC-06: Check A2 condition
        if (currentGroup && currentGroup.members.length > 1) {
          // A2: At least one member must remain
          setCurrentGroup(null)
          console.log('تم مغادرة المجموعة بنجاح')
        } else if (currentGroup && currentGroup.members.length === 1) {
          // A2: Cannot leave if only one member remains
          console.warn('لا يمكن مغادرة المجموعة - يجب أن يبقى عضو واحد على الأقل في المجموعة')
        } else {
          console.warn('لا توجد مجموعة للمغادرة منها')
        }
        break
    }

    setIsModalOpen(false)
  }

  const getRoleText = (role: string) => {
    return role === 'leader' ? 'قائد المجموعة' : 'عضو'
  }

  const getRoleColor = (role: string) => {
    return role === 'leader'
      ? 'bg-blue-100 text-blue-800'
      : 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      <Card className="hover-lift">
        <CardHeader>
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            {/* <Users className="w-6 h-6 text-gpms-dark" /> */}
            <div>
              <h1 className="text-xl font-bold text-gray-900">إدارة المجموعة</h1>
              {/* <p className="text-gray-600 mt-1">إدارة أعضاء المجموعة ومعلوماتها</p> */}
            </div>
          </div>
        </CardHeader>
        <Divider />
        <CardContent>
          {currentGroup ? (
            <div className="space-y-6">
              {/* Group Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{currentGroup.name}</h3>
                <p className="text-gray-600 mb-2">المشروع: {currentGroup.project}</p>
                <p className="text-sm text-gray-500">تاريخ الإنشاء: {currentGroup.createdAt}</p>
                <div className="flex items-center mt-2">
                  <span className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    currentGroup.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  )}>
                    {currentGroup.status === 'active' ? 'نشطة' : 'معلقة'}
                  </span>
                </div>
              </div>

              {/* Members List */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">أعضاء المجموعة</h4>
                <div className="space-y-3">
                  {currentGroup.members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className="w-10 h-10 bg-gpms-light rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-500">{member.email}</p>
                          <p className="text-xs text-gray-400">انضم في: {member.joinDate}</p>
                        </div>
                      </div>
                      <span className={cn(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        getRoleColor(member.role)
                      )}>
                        {getRoleText(member.role)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => handleModalOpen('invite')}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  <UserPlus className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                  دعوة زملاء
                </Button>
                <Button
                  onClick={() => handleModalOpen('leave')}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                  disabled={currentGroup && currentGroup.members.length === 1}
                  title={currentGroup && currentGroup.members.length === 1 ? "لا يمكن مغادرة المجموعة - يجب أن يبقى عضو واحد على الأقل" : ""}
                >
                  <LogOut className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                  مغادرة المجموعة
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مجموعة</h3>
              <p className="text-gray-600 mb-6">يمكنك إنشاء مجموعة جديدة أو الانضمام لمجموعة موجودة</p>
              <div className="flex justify-center space-x-4 rtl:space-x-reverse">
                <Button
                  onClick={() => handleModalOpen('create')}
                  className="bg-gpms-dark text-white hover:bg-gpms-light"
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

      {/* Modal */}
      <GroupManagementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleGroupAction}
        currentGroup={currentGroup}
      />
    </div>
  )
}

export default StudentGroupManagement
