import React, { useState, useEffect } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { cn } from '../../lib/utils'
import { Card, CardContent, CardHeader } from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Badge from '../ui/Badge'
import { SearchBar, FilterDropdown, FilterBar } from '../ui/Filter'
import { 
  Search, 
  Filter, 
  X,
  BookOpen,
  User,
  Calendar,
  Tag,
  SortAsc,
  SortDesc,
  Grid,
  List
} from 'lucide-react'

interface SearchResult {
  id: string
  type: 'project' | 'student' | 'supervisor' | 'document'
  title: string
  description: string
  tags: string[]
  date: Date
  author?: string
  status?: string
  relevance: number
}

interface AdvancedSearchProps {
  onResults?: (results: SearchResult[]) => void
  className?: string
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onResults, className }) => {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    dateRange: 'all',
    department: 'all'
  })
  const [sortBy, setSortBy] = useState('relevance')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: '1',
      type: 'project',
      title: 'تطبيق إدارة المكتبة الذكية',
      description: 'تطبيق ويب متطور لإدارة المكتبات باستخدام تقنيات الذكاء الاصطناعي',
      tags: ['تطوير ويب', 'ذكاء اصطناعي', 'قواعد البيانات'],
      date: new Date('2024-01-15'),
      author: 'الطالب أحمد محمد',
      status: 'قيد التنفيذ',
      relevance: 95
    },
    {
      id: '2',
      type: 'student',
      title: 'محمد أحمد علي',
      description: 'طالب في السنة الأخيرة - تخصص هندسة البرمجيات',
      tags: ['هندسة البرمجيات', 'تطوير تطبيقات', 'قواعد البيانات'],
      date: new Date('2024-01-10'),
      status: 'نشط',
      relevance: 88
    },
    {
      id: '3',
      type: 'supervisor',
      title: 'د. سارة أحمد حسن',
      description: 'أستاذ مشارك في قسم هندسة البرمجيات - متخصصة في أمان المعلومات',
      tags: ['أمان المعلومات', 'هندسة البرمجيات', 'البحث العلمي'],
      date: new Date('2024-01-08'),
      status: 'متاح',
      relevance: 92
    },
    {
      id: '4',
      type: 'document',
      title: 'تقرير المرحلة الأولى - مشروع الذكاء الاصطناعي',
      description: 'تقرير مفصل عن التقدم المحرز في المرحلة الأولى من المشروع',
      tags: ['تقرير', 'ذكاء اصطناعي', 'تقدم المشروع'],
      date: new Date('2024-01-20'),
      author: 'الطالب فاطمة علي',
      status: 'مكتمل',
      relevance: 85
    },
    {
      id: '5',
      type: 'project',
      title: 'نظام إدارة المستشفى',
      description: 'نظام شامل لإدارة العمليات الطبية والمواعيد في المستشفيات',
      tags: ['إدارة المستشفى', 'قواعد البيانات', 'واجهة مستخدم'],
      date: new Date('2024-01-12'),
      author: 'الطالب خالد محمود',
      status: 'معلق',
      relevance: 78
    }
  ]

  const typeOptions = [
    { value: 'all', label: 'جميع الأنواع' },
    { value: 'project', label: 'المشاريع' },
    { value: 'student', label: 'الطلاب' },
    { value: 'supervisor', label: 'المشرفين' },
    { value: 'document', label: 'المستندات' }
  ]

  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'active', label: 'نشط' },
    { value: 'completed', label: 'مكتمل' },
    { value: 'pending', label: 'معلق' },
    { value: 'inactive', label: 'غير نشط' }
  ]

  const dateRangeOptions = [
    { value: 'all', label: 'جميع التواريخ' },
    { value: 'today', label: 'اليوم' },
    { value: 'week', label: 'هذا الأسبوع' },
    { value: 'month', label: 'هذا الشهر' },
    { value: 'year', label: 'هذا العام' }
  ]

  const departmentOptions = [
    { value: 'all', label: 'جميع الأقسام' },
    { value: 'cs', label: 'هندسة الحاسوب' },
    { value: 'se', label: 'هندسة البرمجيات' },
    { value: 'is', label: 'أمن المعلومات' },
    { value: 'ai', label: 'الذكاء الاصطناعي' }
  ]

  const sortOptions = [
    { value: 'relevance', label: 'الأكثر صلة' },
    { value: 'date', label: 'التاريخ' },
    { value: 'title', label: 'العنوان' },
    { value: 'author', label: 'المؤلف' }
  ]

  const performSearch = async () => {
    setIsSearching(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    let filteredResults = mockResults.filter(result => {
      // Text search
      const matchesQuery = !searchQuery || 
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      // Type filter
      const matchesType = filters.type === 'all' || result.type === filters.type
      
      // Status filter
      const matchesStatus = filters.status === 'all' || result.status === filters.status
      
      return matchesQuery && matchesType && matchesStatus
    })

    // Sort results
    filteredResults.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'relevance':
          comparison = b.relevance - a.relevance
          break
        case 'date':
          comparison = b.date.getTime() - a.date.getTime()
          break
        case 'title':
          comparison = a.title.localeCompare(b.title, 'ar')
          break
        case 'author':
          comparison = (a.author || '').localeCompare(b.author || '', 'ar')
          break
      }
      
      return sortOrder === 'asc' ? -comparison : comparison
    })

    setResults(filteredResults)
    setIsSearching(false)
    
    if (onResults) {
      onResults(filteredResults)
    }
  }

  useEffect(() => {
    if (searchQuery) {
      const timeoutId = setTimeout(performSearch, 500)
      return () => clearTimeout(timeoutId)
    } else {
      setResults([])
    }
  }, [searchQuery, filters, sortBy, sortOrder])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'project': return <BookOpen className="w-5 h-5" />
      case 'student': return <User className="w-5 h-5" />
      case 'supervisor': return <User className="w-5 h-5" />
      case 'document': return <BookOpen className="w-5 h-5" />
      default: return <BookOpen className="w-5 h-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'project': return 'bg-blue-100 text-blue-800'
      case 'student': return 'bg-green-100 text-green-800'
      case 'supervisor': return 'bg-purple-100 text-purple-800'
      case 'document': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'نشط':
      case 'متاح':
      case 'مكتمل': return 'success'
      case 'قيد التنفيذ': return 'info'
      case 'معلق': return 'warning'
      case 'غير نشط': return 'error'
      default: return 'default'
    }
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Search Header */}
      <Card className="hover-lift">
        <CardHeader>
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Search className="w-6 h-6 text-gpms-dark" />
            <h2 className="text-xl font-bold text-gray-900">البحث المتقدم</h2>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="ابحث في المشاريع، الطلاب، المشرفين، والمستندات..."
                className="w-full"
              />
            </div>

            {/* Filters */}
            <FilterBar>
              <FilterDropdown
                label="النوع"
                value={filters.type}
                onChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
                options={typeOptions}
              />
              
              <FilterDropdown
                label="الحالة"
                value={filters.status}
                onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                options={statusOptions}
              />
              
              <FilterDropdown
                label="التاريخ"
                value={filters.dateRange}
                onChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}
                options={dateRangeOptions}
              />
              
              <FilterDropdown
                label="القسم"
                value={filters.department}
                onChange={(value) => setFilters(prev => ({ ...prev, department: value }))}
                options={departmentOptions}
              />
            </FilterBar>

            {/* Sort and View Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                </Button>
              </div>

              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {isSearching ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-gpms-dark border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">جاري البحث...</p>
            </div>
          </CardContent>
        </Card>
      ) : results.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              نتائج البحث ({results.length})
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('')
                setResults([])
              }}
            >
              <X className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
              مسح البحث
            </Button>
          </div>

          <div className={cn(
            'grid gap-4',
            viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
          )}>
            {results.map(result => (
              <Card key={result.id} className="hover-lift cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    <div className={cn(
                      'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
                      getTypeColor(result.type)
                    )}>
                      {getTypeIcon(result.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {result.title}
                        </h4>
                        {result.status && (
                          <Badge variant={getStatusColor(result.status)} size="sm">
                            {result.status}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {result.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {result.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="info" size="sm">
                            {tag}
                          </Badge>
                        ))}
                        {result.tags.length > 3 && (
                          <Badge variant="default" size="sm">
                            +{result.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Calendar className="w-3 h-3" />
                          <span>{result.date.toLocaleDateString('ar')}</span>
                        </div>
                        {result.author && (
                          <span className="truncate">{result.author}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : searchQuery ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد نتائج</h3>
              <p className="text-gray-600">
                لم نتمكن من العثور على أي نتائج تطابق بحثك. جرب كلمات مختلفة أو أعد صياغة البحث.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

export default AdvancedSearch
