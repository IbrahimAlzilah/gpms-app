import React from 'react'
import { cn } from '../../lib/utils'

interface TableProps {
  children: React.ReactNode
  className?: string
}

const Table: React.FC<TableProps> = ({ children, className }) => {
  return (
    <div className="overflow-x-auto">
      <table className={cn('w-full border-collapse', className)}>
        {children}
      </table>
    </div>
  )
}

const TableHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => {
  return (
    <thead className={cn('bg-gray-50', className)}>
      {children}
    </thead>
  )
}

const TableBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => {
  return (
    <tbody className={cn('divide-y divide-gray-200', className)}>
      {children}
    </tbody>
  )
}

const TableRow: React.FC<{ 
  children: React.ReactNode
  className?: string
  onClick?: () => void
}> = ({ children, className, onClick }) => {
  return (
    <tr 
      className={cn(
        'hover:bg-gray-50 transition-colors',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  )
}

const TableHead: React.FC<{ 
  children: React.ReactNode
  className?: string
  sortable?: boolean
  sortDirection?: 'asc' | 'desc'
  onSort?: () => void
}> = ({ 
  children, 
  className, 
  sortable = false, 
  sortDirection, 
  onSort 
}) => {
  return (
    <th
      className={cn(
        'px-6 py-3 text-right rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider',
        sortable && 'cursor-pointer hover:bg-gray-100',
        className
      )}
      onClick={sortable ? onSort : undefined}
    >
      <div className="flex items-center space-x-1 rtl:space-x-reverse">
        <span>{children}</span>
        {sortable && (
          <div className="flex flex-col">
            <svg
              className={cn(
                'w-3 h-3',
                sortDirection === 'asc' ? 'text-gray-900' : 'text-gray-400'
              )}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
            <svg
              className={cn(
                'w-3 h-3 -mt-1',
                sortDirection === 'desc' ? 'text-gray-900' : 'text-gray-400'
              )}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" />
            </svg>
          </div>
        )}
      </div>
    </th>
  )
}

const TableCell: React.FC<{ 
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => {
  return (
    <td className={cn('px-6 py-4 whitespace-nowrap text-sm text-gray-900', className)}>
      {children}
    </td>
  )
}

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell }
