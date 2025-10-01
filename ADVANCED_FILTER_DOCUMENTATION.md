# نظام التصفية المتقدمة - GPMS

## نظرة عامة

تم تطوير نظام تصفية متقدم ومصغر لصفحة قائمة المشاريع، حيث تم دمج جميع خيارات التصفية في قائمة منسدلة حديثة (Popover) مع وضع زر التصفية بجانب أزرار تبديل نمط العرض.

## المكونات الجديدة

### 1. AdvancedFilter
مكون التصفية المتقدمة الرئيسي الذي يجمع جميع خيارات التصفية في قائمة منسدلة.

**الخصائص:**
- تصفية حسب الحالة (Status)
- تصفية حسب الأولوية (Priority)
- ترتيب حسب معايير مختلفة
- اتجاه الترتيب (تصاعدي/تنازلي)
- أزرار تطبيق ومسح الكل

### 2. FilterButton
زر التصفية مع مؤشر البصري للحالة النشطة.

**الخصائص:**
- أيقونة المصفاة
- مؤشر بصري للتصفية النشطة
- سهم للدلالة على القائمة المنسدلة
- تصميم متجاوب

### 3. FilterPopover
قائمة منسدلة قابلة لإعادة الاستخدام للتصفية.

**الخصائص:**
- خلفية شفافة للإغلاق
- تصميم Card أنيق
- أزرار الإجراءات
- إغلاق تلقائي عند النقر خارجها

### 4. FilterField
حقل تصفية قابل لإعادة الاستخدام.

**الخصائص:**
- Select dropdown
- Toggle buttons للخيارات المحدودة
- تصميم متسق
- دعم RTL/LTR

## الاستخدام

### في صفحة المشاريع

```tsx
import { AdvancedFilter } from './components'

const ProjectList = () => {
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  return (
    <div>
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
    </div>
  )
}
```

### استخدام المكونات الفردية

```tsx
import { FilterButton, FilterPopover, FilterField } from './components'

const CustomFilter = () => {
  return (
    <div className="relative">
      <FilterButton
        onClick={() => setIsOpen(!isOpen)}
        isOpen={isOpen}
        hasActiveFilters={hasFilters}
      />
      
      <FilterPopover
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onApply={handleApply}
        onClear={handleClear}
        title="تصفية مخصصة"
      >
        <FilterField
          label="الحالة"
          value={status}
          onChange={setStatus}
          options={statusOptions}
        />
      </FilterPopover>
    </div>
  )
}
```

## الميزات

### 1. تصميم مصغر
- تم إزالة مساحة التصفية الكبيرة
- دمج جميع الخيارات في قائمة منسدلة
- توفير مساحة أكبر للمحتوى

### 2. تجربة مستخدم محسنة
- زر تصفية واضح مع مؤشر بصري
- قائمة منسدلة سهلة الاستخدام
- أزرار تطبيق ومسح واضحة

### 3. قابلية إعادة الاستخدام
- مكونات منفصلة قابلة للاستخدام في أماكن أخرى
- تصميم متسق عبر التطبيق
- سهولة التخصيص

### 4. دعم RTL/LTR
- تصميم متجاوب للاتجاهين
- نصوص باللغة العربية
- تخطيط صحيح للاتجاه

### 5. إمكانية الوصول
- إغلاق تلقائي عند النقر خارج القائمة
- دعم التنقل بلوحة المفاتيح
- مؤشرات بصرية واضحة

## التخصيص

### تخصيص الألوان
```css
.filter-button-active {
  @apply bg-blue-50 border-blue-200 text-blue-700;
}

.filter-popover {
  @apply shadow-lg border border-gray-200;
}
```

### تخصيص الحجم
```tsx
<FilterPopover
  className="w-96" // عرض مخصص
  title="تصفية مخصصة"
>
  {/* المحتوى */}
</FilterPopover>
```

## الصفحات المحدثة

1. **`src/pages/projects/ProjectList.tsx`** - صفحة قائمة المشاريع الرئيسية
2. **`src/pages/Projects.tsx`** - صفحة المشاريع العامة
3. **`src/components/ui/AdvancedFilter.tsx`** - مكون التصفية المتقدمة
4. **`src/components/ui/FilterButton.tsx`** - زر التصفية
5. **`src/components/ui/FilterPopover.tsx`** - القائمة المنسدلة
6. **`src/components/ui/FilterField.tsx`** - حقول التصفية

## ملاحظات مهمة

1. **الأداء**: المكونات محسنة للأداء مع استخدام React hooks بكفاءة
2. **التجاوب**: تصميم متجاوب يعمل على جميع أحجام الشاشات
3. **الاستقرار**: معالجة شاملة للحالات المختلفة
4. **القابلية للصيانة**: كود منظم وقابل للقراءة
5. **الاختبار**: مكونات قابلة للاختبار بسهولة

## التطوير المستقبلي

- إضافة تصفية بالتاريخ
- تصفية متقدمة بالكلمات المفتاحية
- حفظ تفضيلات التصفية
- تصدير النتائج المفلترة
- تصفية متعددة المعايير
