import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { BarChart, PieChart } from '@/components/ui/Charts'
import { cn } from '@/lib/utils'

interface ChartData {
  label: string
  value: number
  color?: string
}

interface DashboardChartsProps {
  barChartData?: ChartData[]
  pieChartData?: ChartData[]
  className?: string
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({
  barChartData,
  pieChartData,
  className
}) => {
  if (!barChartData && !pieChartData) {
    return null
  }

  return (
    <div className={cn('grid grid-cols-1 lg:grid-cols-2 gap-6', className)}>
      {barChartData && barChartData.length > 0 && (
        <Card className="hover-lift">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">إحصائيات المشاريع</h3>
          </CardHeader>
          <CardContent>
            <BarChart data={barChartData} />
            <div className="grid grid-cols-3 gap-4 text-center mt-4">
              {barChartData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full mx-auto',
                      item.color || 'bg-blue-500'
                    )}
                  ></div>
                  <div className="text-sm font-medium text-gray-900">{item.value}</div>
                  <div className="text-xs text-gray-500">{item.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {pieChartData && pieChartData.length > 0 && (
        <Card className="hover-lift">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">التوزيع حسب القسم</h3>
          </CardHeader>
          <CardContent>
            <PieChart
              data={pieChartData.map((item, index) => ({
                ...item,
                color: item.color || ['#1A3B6A', '#5E8BC2', '#6CC04A', '#F59E0B'][index % 4]
              }))}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default DashboardCharts

