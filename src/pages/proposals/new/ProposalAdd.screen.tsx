import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import UnifiedProposalForm from '@/components/forms/UnifiedProposalForm'
import { useProposalAdd } from './ProposalAdd.hook'
import { CreateProposalInput } from '../schema'

const ProposalAddScreen: React.FC = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { createProposal, isLoading, error } = useProposalAdd()
  const [isModalOpen, setIsModalOpen] = useState(true)

  const handleSubmit = async (data: CreateProposalInput) => {
    try {
      await createProposal(data)
      navigate('/proposals')
    } catch (err) {
      console.error('Error creating proposal:', err)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold text-gray-900">إضافة مقترح جديد</h1>
        </CardHeader>
        <CardContent>
          <UnifiedProposalForm
            isOpen={isModalOpen}
            onClose={() => navigate('/proposals')}
            onSubmit={handleSubmit}
            mode="create"
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default ProposalAddScreen

