# نظام التصفية الموحد - GPMS

## نظرة عامة

تم تطوير نظام تصفية موحد ومتسق لجميع صفحات قوائم البيانات الرئيسية في نظام GPMS. يوفر النظام تجربة مستخدم محسنة مع توفير مساحة العرض من خلال دمج خيارات التصفية في قوائم منسدلة حديثة.

## الصفحات المحدثة

### 1. صفحة قائمة المشاريع (ProjectList.tsx)
- **الموقع**: `src/pages/projects/ProjectList.tsx`
- **المرشحات**: الحالة، الأولوية، آخر تحديث
- **تسمية الزر**: "تصفية متقدمة"

### 2. صفحة قائمة المقترحات (ProposalsList.tsx)
- **الموقع**: `src/pages/proposals/ProposalsList.tsx`
- **المرشحات**: حالة المقترح، دور المقدم، الأولوية
- **تسمية الزر**: "تصفية المقترحات"

### 3. صفحة قائمة الطلبات (RequestsList.tsx)
- **الموقع**: `src/pages/requests/RequestsList.tsx`
- **المرشحات**: حالة الطلب، نوع الطلب، الأولوية
- **تسمية الزر**: "تصفية الطلبات"

### 4. صفحة قائمة المستندات (DocumentsList.tsx)
- **الموقع**: `src/pages/documents/DocumentsList.tsx`
- **المرشحات**: نوع المستند، حالة التسليم، الأولوية
- **تسمية الزر**: "تصفية المستندات"

## المكونات المشتركة

### 1. AdvancedFilter
مكون التصفية المتقدمة الرئيسي المستخدم في جميع الصفحات.

**الخصائص:**
```tsx
interface AdvancedFilterProps {
  statusFilter: string
  onStatusChange: (value: string) => void
  priorityFilter: string
  onPriorityChange: (value: string) => void
  sortBy: string
  onSortByChange: (value: string) => void
  sortOrder: 'asc' | 'desc'
  onSortOrderChange: (order: 'asc' | 'desc') => void
  onApplyFilters: () => void
  onClearFilters: () => void
  isOpen: boolean
  onToggle: () => void
  className?: string
}
```

### 2. FilterButton
زر التصفية مع مؤشر البصري للحالة النشطة.

### 3. FilterPopover
قائمة منسدلة قابلة لإعادة الاستخدام.

### 4. FilterField
حقول التصفية القابلة لإعادة الاستخدام.

## البطاقات (Cards) المخصصة

### 1. ProjectCard
بطاقة عرض المشاريع في الوضع الشبكي.

### 2. ProposalCard
بطاقة عرض المقترحات في الوضع الشبكي.

### 3. RequestCard
بطاقة عرض الطلبات في الوضع الشبكي.

### 4. DocumentCard
بطاقة عرض المستندات في الوضع الشبكي.

## التصميم الموحد

### 1. تخطيط الصفحة
جميع الصفحات تتبع نفس التخطيط:
- **Header Card**: يحتوي على العنوان، الوصف، وأزرار الإجراءات
- **Search Bar**: شريط البحث في المحتوى
- **View Toggle**: تبديل بين العرض الجدولي والشبكي
- **Advanced Filter**: زر التصفية المتقدمة
- **Add Button**: زر إضافة عنصر جديد

### 2. ألوان مميزة لكل صفحة
- **المشاريع**: أزرق (`bg-blue-600`)
- **المقترحات**: بنفسجي (`bg-purple-600`)
- **الطلبات**: برتقالي (`bg-orange-600`)
- **المستندات**: نيلي (`bg-indigo-600`)

### 3. الأيقونات المميزة
- **المشاريع**: `FolderOpen`
- **المقترحات**: `FileText`
- **الطلبات**: `MessageSquare`
- **المستندات**: `FileText`

## الميزات المشتركة

### 1. البحث الذكي
- البحث في العنوان والوصف
- البحث في العلامات (Tags)
- بحث متجاوب وسريع

### 2. التصفية المتقدمة
- تصفية حسب الحالة
- تصفية حسب الأولوية
- تصفية حسب النوع (حسب الصفحة)
- ترتيب متقدم

### 3. عرض مزدوج
- **الوضع الجدولي**: عرض تفصيلي في جدول
- **الوضع الشبكي**: عرض بصري في بطاقات

### 4. إدارة الحالة
- حفظ حالة التصفية
- تطبيق التصفية عند الطلب
- إلغاء التصفية بضغطة واحدة

## الاستخدام

### إنشاء صفحة جديدة مع التصفية

```tsx
import React, { useState } from 'react'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import { SearchBar } from '../../components/ui/Filter'
import { Table } from '../../components/ui/Table'
import GridView, { CustomCard } from '../../components/ui/GridView'
import ViewToggle from '../../components/ui/ViewToggle'
import AdvancedFilter from '../../components/ui/AdvancedFilter'

const CustomList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('updatedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const handleApplyFilters = () => {
    // تطبيق التصفية
  }

  const handleClearFilters = () => {
    setStatusFilter('all')
    setPriorityFilter('all')
    setSortBy('updatedAt')
    setSortOrder('desc')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="hover-lift">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <CustomIcon className="w-6 h-6 text-custom-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">قائمة مخصصة</h1>
                <p className="text-gray-600 mt-1">وصف الصفحة</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <ViewToggle
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
              
              <AdvancedFilter
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                priorityFilter={priorityFilter}
                onPriorityChange={setPriorityFilter}
                sortBy={sortBy}
                onSortByChange={setSortBy}
                sortOrder={sortOrder}
                onSortOrderChange={setSortOrder}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
                isOpen={isFilterOpen}
                onToggle={() => setIsFilterOpen(!isFilterOpen)}
              />

              <Button className="bg-custom-600 text-white hover:bg-custom-700">
                <Plus className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                إضافة جديد
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="البحث..."
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Content Display */}
      {viewMode === 'table' ? (
        <Card className="hover-lift">
          <CardContent className="p-0">
            <Table
              data={filteredData}
              columns={columns}
              emptyMessage="لا توجد عناصر"
              className="min-h-[400px]"
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {filteredData.map((item) => (
            <CustomCard
              key={item.id}
              item={item}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CustomList
```

## التخصيص

### تخصيص الألوان
```css
.custom-page {
  --primary-color: #your-color;
  --primary-hover: #your-hover-color;
}
```

### تخصيص المرشحات
```tsx
const customStatusOptions = [
  { value: 'all', label: 'جميع الحالات' },
  { value: 'custom1', label: 'حالة مخصصة 1' },
  { value: 'custom2', label: 'حالة مخصصة 2' }
]
```

## الملفات المحدثة

### الصفحات الجديدة
1. `src/pages/projects/ProjectList.tsx`
2. `src/pages/proposals/ProposalsList.tsx`
3. `src/pages/requests/RequestsList.tsx`
4. `src/pages/documents/DocumentsList.tsx`

### الصفحات الرئيسية
1. `src/pages/Projects.tsx`
2. `src/pages/Proposals.tsx`
3. `src/pages/Requests.tsx`
4. `src/pages/Documents.tsx`

### المكونات المحدثة
1. `src/components/ui/GridView.tsx` - إضافة ProposalCard و DocumentCard
2. `src/components/index.ts` - تصدير المكونات الجديدة

## ملاحظات مهمة

1. **الاتساق**: جميع الصفحات تتبع نفس التخطيط والتصميم
2. **القابلية لإعادة الاستخدام**: المكونات قابلة للاستخدام في صفحات أخرى
3. **الأداء**: تحسين الأداء مع استخدام React hooks بكفاءة
4. **التجاوب**: تصميم متجاوب لجميع أحجام الشاشات
5. **إمكانية الوصول**: دعم كامل للتنقل بلوحة المفاتيح
6. **دعم RTL/LTR**: تصميم متوافق مع الاتجاهين

## التطوير المستقبلي

- إضافة تصفية بالتاريخ
- تصفية متقدمة بالكلمات المفتاحية
- حفظ تفضيلات التصفية
- تصدير النتائج المفلترة
- تصفية متعددة المعايير
- إحصائيات التصفية
