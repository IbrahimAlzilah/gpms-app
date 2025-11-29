import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import UnifiedProposalForm from '@/components/forms/UnifiedProposalForm'
import { useProposalEdit } from './ProposalEdit.hook'
import { useAuth } from '@/context/AuthContext'
import { UpdateProposalInput } from '../schema'

const ProposalEditScreen: React.FC = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { proposal, updateProposal, isLoading, error } = useProposalEdit(id || '')

  const handleSubmit = async (data: UpdateProposalInput) => {
    try {
      await updateProposal(data)
      navigate('/proposals')
    } catch (err) {
      console.error('Error updating proposal:', err)
    }
  }

  if (isLoading && !proposal) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (!proposal) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h1 className="text-xl font-bold text-gray-900">المقترح غير موجود</h1>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/proposals')}>العودة إلى المقترحات</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold text-gray-900">تعديل المقترح</h1>
        </CardHeader>
        <CardContent>
          <UnifiedProposalForm
            isOpen={true}
            onClose={() => navigate('/proposals')}
            onSubmit={handleSubmit}
            editData={proposal}
            mode="edit"
            userRole={(user?.role === 'student' || user?.role === 'supervisor' || user?.role === 'committee') ? user.role : 'student'}
          />
          {error && (
            <div className="mt-4 text-red-600 text-sm">{error}</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ProposalEditScreen

