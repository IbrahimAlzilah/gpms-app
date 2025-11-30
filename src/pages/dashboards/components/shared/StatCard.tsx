import React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/Card'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: React.ComponentType<{ className?: string }>
  bgColor: string
  color: string
  onClick?: () => void
  className?: string
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  bgColor,
  color,
  onClick,
  className
}) => {
  const changeColors = {
    positive: 'text-green-600 bg-green-50',
    negative: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50'
  }

  const changeIcons = {
    positive: '↑',
    negative: '↓',
    neutral: '→'
  }

  return (
    <div 
      onClick={onClick} 
      className={cn(
        'group cursor-pointer transition-all duration-300',
        onClick && 'hover:scale-[1.02]',
        className
      )}
    >
      <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
        <CardContent className="p-6 relative">
          {/* Decorative background element */}
          <div className={cn(
            'absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-3xl',
            bgColor.replace('bg-', 'bg-')
          )} />
          
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 mb-2">{title}</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
              {change && (
                <div className={cn(
                  'inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium',
                  changeColors[changeType]
                )}>
                  <span>{changeIcons[changeType]}</span>
                  <span>{change}</span>
                </div>
              )}
            </div>
            <div className={cn(
              'p-4 rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6',
              bgColor
            )}>
              <Icon className={cn('w-7 h-7', color)} />
            </div>
          </div>
          
          {/* Bottom accent line */}
          <div className={cn(
            'absolute bottom-0 left-0 right-0 h-1 transition-all duration-300',
            bgColor,
            onClick && 'group-hover:h-1.5'
          )} />
        </CardContent>
      </Card>
    </div>
  )
}

export default StatCard

