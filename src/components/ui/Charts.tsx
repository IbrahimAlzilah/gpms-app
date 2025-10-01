import React from 'react'
import { cn } from '../../lib/utils'

interface ChartProps {
  title?: string
  children: React.ReactNode
  className?: string
}

interface BarChartProps {
  data: { label: string; value: number; color?: string }[]
  maxValue?: number
  className?: string
}

interface PieChartProps {
  data: { label: string; value: number; color: string }[]
  className?: string
}

const Chart: React.FC<ChartProps> = ({ title, children, className }) => {
  return (
    <div className={cn('bg-white rounded-xl p-6 shadow-sm border border-gray-200', className)}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      {children}
    </div>
  )
}

const BarChart: React.FC<BarChartProps> = ({ data, maxValue, className }) => {
  const max = maxValue || Math.max(...data.map(d => d.value))
  
  return (
    <div className={cn('space-y-4', className)}>
      {data.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">{item.label}</span>
            <span className="text-gray-900 font-medium">{item.value}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={cn(
                'h-3 rounded-full transition-all duration-300',
                item.color || 'bg-gpms-light'
              )}
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

const PieChart: React.FC<PieChartProps> = ({ data, className }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let cumulativePercentage = 0
  
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-center">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100
              const startAngle = cumulativePercentage * 3.6
              const endAngle = (cumulativePercentage + percentage) * 3.6
              cumulativePercentage += percentage
              
              const radius = 40
              const x1 = 50 + radius * Math.cos((startAngle * Math.PI) / 180)
              const y1 = 50 + radius * Math.sin((startAngle * Math.PI) / 180)
              const x2 = 50 + radius * Math.cos((endAngle * Math.PI) / 180)
              const y2 = 50 + radius * Math.sin((endAngle * Math.PI) / 180)
              
              const largeArcFlag = percentage > 50 ? 1 : 0
              
              const pathData = [
                `M 50 50`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ')
              
              return (
                <path
                  key={index}
                  d={pathData}
                  fill={item.color}
                  stroke="white"
                  strokeWidth="0.5"
                />
              )
            })}
          </svg>
        </div>
      </div>
      
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-gray-700">{item.label}</span>
            <span className="text-sm text-gray-900 font-medium">
              {((item.value / total) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export { Chart, BarChart, PieChart }