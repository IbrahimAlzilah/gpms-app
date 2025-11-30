import React, { useState, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Divider from '@/components/ui/Divider'
import GroupManagementModal from '@/components/forms/GroupManagementModal'
import { Users, UserPlus, LogOut, PlusCircle, LogIn } from 'lucide-react'
import { 
  getStudentGroup, 
  createGroup, 
  joinGroup, 
  leaveGroup, 
  Group,
  validateGroupCreation,
  validateGroupJoin,
  validateGroupLeave
} from '@/services/groups.service'
import { useNotifications } from '@/context/NotificationContext'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import { Form, FormGroup, FormLabel } from '@/components/ui/Form'

const GroupsScreen: React.FC = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const { addNotification } = useNotifications()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'create' | 'join' | 'invite' | 'leave'>('create')
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [joinGroupId, setJoinGroupId] = useState('')

  useEffect(() => {
    loadStudentGroup()
  }, [user])

  const loadStudentGroup = async () => {
    if (!user?.id) return
    
    setIsLoading(true)
    try {
      const group = await getStudentGroup(user.id)
      setCurrentGroup(group)
    } catch (error) {
      console.error('Error loading group:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleModalOpen = (type: 'create' | 'join' | 'invite' | 'leave') => {
    setModalType(type)
    if (type === 'join') {
      setIsJoinModalOpen(true)
    } else {
      setIsModalOpen(true)
    }
  }

  const handleGroupAction = async (data: { groupName?: string; projectName?: string; members?: any[]; [key: string]: unknown }) => {
    if (!user?.id) return

    try {
      switch (modalType) {
        case 'create':
          // Validate group creation
          const createValidation = await validateGroupCreation(user.id)
          if (!createValidation.canCreate) {
            addNotification({
              title: 'لا يمكن إنشاء المجموعة',
              message: createValidation.message || 'الطالب عضو بالفعل في مجموعة أخرى',
              type: 'error'
            })
            return
          }

          const newGroup = await createGroup({
            name: data.groupName || '',
            project: data.projectName,
            members: data.members || [],
            status: 'active'
          })
          setCurrentGroup(newGroup)
          addNotification({
            title: 'تم إنشاء المجموعة',
            message: `تم إنشاء المجموعة "${newGroup.name}" بنجاح. أنت الآن قائد المجموعة.`,
            type: 'success',
            category: 'project'
          })
          break
        case 'invite':
          // Handled in GroupManagementModal
          await loadStudentGroup()
          break
        case 'leave':
          if (currentGroup) {
            // Validate leaving group
            const leaveValidation = await validateGroupLeave(currentGroup.id, user.id)
            if (!leaveValidation.canLeave) {
              addNotification({
                title: 'لا يمكن مغادرة المجموعة',
                message: leaveValidation.message || 'يجب أن يبقى عضو واحد على الأقل في المجموعة',
                type: 'error'
              })
              return
            }

            // Show warning if leader
            if (leaveValidation.message) {
              const confirm = window.confirm(leaveValidation.message + '\n\nهل تريد المتابعة؟')
              if (!confirm) return
            }

            await leaveGroup(currentGroup.id, user.id)
            setCurrentGroup(null)
            addNotification({
              title: 'تم مغادرة المجموعة',
              message: 'تم مغادرة المجموعة بنجاح',
              type: 'success',
              category: 'project'
            })
          }
          break
        default:
          break
      }
      setIsModalOpen(false)
    } catch (error) {
      addNotification({
        title: 'خطأ',
        message: error instanceof Error ? error.message : 'حدث خطأ أثناء تنفيذ العملية',
        type: 'error'
      })
    }
  }

  const handleJoinGroup = async () => {
    if (!joinGroupId.trim() || !user?.id) {
      addNotification({
        title: 'خطأ',
        message: 'يرجى إدخال معرف المجموعة',
        type: 'error'
      })
      return
    }

    try {
      // Validate joining group
      const joinValidation = await validateGroupJoin(joinGroupId.trim(), user.id)
      if (!joinValidation.canJoin) {
        addNotification({
          title: 'لا يمكن الانضمام للمجموعة',
          message: joinValidation.message || 'لا يمكن الانضمام لهذه المجموعة',
          type: 'error'
        })
        return
      }

      const group = await joinGroup(joinGroupId.trim(), user.id)
      setCurrentGroup(group)
      setIsJoinModalOpen(false)
      setJoinGroupId('')
      addNotification({
        title: 'تم الانضمام للمجموعة',
        message: `تم الانضمام للمجموعة "${group.name}" بنجاح`,
        type: 'success',
        category: 'project'
      })
    } catch (error) {
      addNotification({
        title: 'خطأ',
        message: error instanceof Error ? error.message : 'حدث خطأ أثناء الانضمام للمجموعة',
        type: 'error'
      })
    }
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
        mode={modalType === 'create' ? 'create' : modalType === 'invite' ? 'invite' : 'edit'}
        currentGroup={currentGroup ? {
          id: currentGroup.id,
          name: currentGroup.name,
          members: currentGroup.members.map(m => m.name)
        } : undefined}
      />

      {/* Join Group Modal */}
      <Modal
        isOpen={isJoinModalOpen}
        onClose={() => {
          setIsJoinModalOpen(false)
          setJoinGroupId('')
        }}
        title="الانضمام لمجموعة"
        size="sm"
      >
        <Form onSubmit={(e) => { e.preventDefault(); handleJoinGroup(); }}>
          <FormGroup>
            <FormLabel htmlFor="groupId" required>معرف المجموعة</FormLabel>
            <Input
              id="groupId"
              value={joinGroupId}
              onChange={(e) => setJoinGroupId(e.target.value)}
              placeholder="أدخل معرف المجموعة..."
            />
            <p className="text-sm text-gray-500 mt-2">
              يمكنك الحصول على معرف المجموعة من قائد المجموعة
            </p>
          </FormGroup>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsJoinModalOpen(false)
                setJoinGroupId('')
              }}
            >
              إلغاء
            </Button>
            <Button type="submit">
              الانضمام
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default GroupsScreen
