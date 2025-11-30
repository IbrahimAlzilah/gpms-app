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
    <div className={cn('bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800', className)}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
          <div className="w-1 h-5 bg-gpms-primary rounded-full" />
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}

const BarChart: React.FC<BarChartProps> = ({ data, maxValue, className }) => {
  const max = maxValue || Math.max(...data.map(d => d.value))

  return (
    <div className={cn('space-y-5', className)}>
      {data.map((item, index) => (
        <div key={index} className="group space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400 font-medium group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
              {item.label}
            </span>
            <span className="text-gray-900 dark:text-gray-100 font-bold">
              {item.value}
            </span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-1000 ease-out relative',
                item.color || 'bg-gpms-primary'
              )}
              style={{ width: `${(item.value / max) * 100}%` }}
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
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
    <div className={cn('flex flex-col items-center', className)}>
      <div className="relative w-56 h-56 mb-6 group">
        <svg className="w-full h-full transform -rotate-90 drop-shadow-xl" viewBox="0 0 100 100">
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
                className="transition-all duration-300 hover:opacity-90 hover:scale-105 origin-center cursor-pointer"
                stroke="white"
                strokeWidth="2"
                style={{
                  transformBox: 'fill-box',
                  transformOrigin: 'center'
                }}
              >
                <title>{`${item.label}: ${item.value} (${percentage.toFixed(1)}%)`}</title>
              </path>
            )
          })}
          {/* Center Hole for Donut Chart effect */}
          <circle cx="50" cy="50" r="25" fill="white" className="dark:fill-gray-900" />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <span className="block text-2xl font-bold text-gray-900 dark:text-gray-100">{total}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">الإجمالي</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-3 w-full max-w-xs">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between group cursor-default">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full shadow-sm ring-2 ring-white dark:ring-gray-800"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                {item.label}
              </span>
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {((item.value / total) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export { Chart, BarChart, PieChart }