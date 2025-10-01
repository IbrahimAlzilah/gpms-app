# تحسينات Layout - GPMS

## الميزات الجديدة

### 1. Sidebar ثابت مع دعم RTL/LTR
- **LTR**: Sidebar يظهر على يسار الصفحة
- **RTL**: Sidebar يظهر على يمين الصفحة
- **متجاوب**: يختفي على الشاشات الصغيرة ويظهر كـ overlay

### 2. Main Content متجاوب
- يأخذ باقي المساحة بجانب الـ Sidebar
- يتكيف مع حجم الشاشة
- يدعم RTL/LTR بشكل كامل

### 3. Grid/Table Toggle
- **ProjectsTable**: عرض المشاريع في جدول أو بطاقات
- **RequestsTable**: عرض الطلبات في جدول أو بطاقات
- **ReportsTable**: عرض التقارير في جدول أو بطاقات

## الملفات المحدثة

### Layout Components
- `src/components/layout/ResponsiveLayout.tsx` - Layout محسن مع دعم RTL/LTR
- `src/components/layout/DashboardLayout.tsx` - يستخدم ResponsiveLayout
- `src/components/layout/Sidebar.tsx` - Sidebar محسن

### UI Components
- `src/components/ui/GridView.tsx` - مكون Grid View مع بطاقات
- `src/components/ui/ViewToggle.tsx` - زر تبديل بين الجدول والشبكة

### Tables
- `src/components/tables/ProjectsTable.tsx` - مع Grid/Table toggle
- `src/components/tables/RequestsTable.tsx` - مع Grid/Table toggle
- `src/components/tables/ReportsTable.tsx` - مع Grid/Table toggle

### CSS
- `src/index.css` - تحسينات RTL/LTR و responsive design

## الاستخدام

### ResponsiveLayout
```tsx
import { ResponsiveLayout } from './components'

<ResponsiveLayout>
  <YourContent />
</ResponsiveLayout>
```

### ViewToggle
```tsx
import { ViewToggle } from './components'

<ViewToggle
  viewMode={viewMode}
  onViewModeChange={setViewMode}
/>
```

### GridView
```tsx
import { GridView, ProjectCard } from './components'

<GridView
  data={projects}
  renderItem={(project) => (
    <ProjectCard
      project={project}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  )}
/>
```

## التصميم المتجاوب

### الشاشات المختلفة
- **Mobile (< 640px)**: عمود واحد
- **Tablet (640px - 768px)**: عمودين
- **Desktop (768px - 1024px)**: 3 أعمدة
- **Large Desktop (1024px - 1280px)**: 4 أعمدة
- **XL Desktop (> 1280px)**: 5 أعمدة

### RTL/LTR Support
- دعم كامل للاتجاهين
- CSS classes مخصصة
- تخطيط مرن يتكيف مع اللغة

## الاختبار

استخدم `LayoutTest` component لاختبار Layout:

```tsx
import { LayoutTest } from './components'

<LayoutTest />
```

## ملاحظات مهمة

1. **Sidebar**: ثابت على الشاشات الكبيرة، overlay على الصغيرة
2. **Main Content**: يتكيف مع وجود/عدم وجود Sidebar
3. **RTL/LTR**: يعمل تلقائياً حسب اللغة المختارة
4. **Responsive**: يعمل على جميع أحجام الشاشات
5. **Performance**: محسن للأداء مع transitions سلسة
