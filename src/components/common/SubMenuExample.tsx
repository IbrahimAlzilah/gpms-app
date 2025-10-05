import React from 'react'
import SubMenu from './SubMenu'
import { FileText, Upload, Download, Clock, CheckCircle2 } from 'lucide-react'

// Example usage in different pages:

// Example 1: StudentDocuments.tsx
interface StudentDocumentsProps {
    activeKey: string
    onTabChange: (key: string) => void
    counts: { drafts: number; submitted: number; approved: number; rejected: number }
}

export const StudentDocumentsExample: React.FC<StudentDocumentsProps> = ({ activeKey, onTabChange, counts }) => {
    return (
        <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-lg border p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">إدارة المستندات</h3>
                <SubMenu
                    orientation="vertical"
                    items={[
                        {
                            key: "drafts",
                            label: "مسوداتي",
                            icon: <FileText className="w-5 h-5" />,
                            count: counts.drafts
                        },
                        {
                            key: "submitted",
                            label: "المُرسلة",
                            icon: <Upload className="w-5 h-5" />,
                            count: counts.submitted
                        },
                        {
                            key: "approved",
                            label: "المُعتمدة",
                            icon: <CheckCircle2 className="w-5 h-5" />,
                            count: counts.approved
                        },
                        {
                            key: "rejected",
                            label: "المرفوضة",
                            icon: <Download className="w-5 h-5" />,
                            count: counts.rejected
                        }
                    ]}
                    activeKey={activeKey}
                    onChange={onTabChange}
                    fullWidth
                    size="lg"
                />
            </div>
        </div>
    )
}

// Example 2: Horizontal SubMenu for compact spaces
interface CompactHeaderMenuProps {
    activeKey: string
    onTabChange: (key: string) => void
}

export const CompactHeaderMenu: React.FC<CompactHeaderMenuProps> = ({ activeKey, onTabChange }) => {
    return (
        <div className="border-b border-gray-200 pb-2">
            <SubMenu
                orientation="horizontal"
                items={[
                    { key: "all", label: "الكل", icon: <FileText className="w-4 h-4" /> },
                    { key: "urgent", label: "عاجل", icon: <Clock className="w-4 h-4" /> },
                    { key: "completed", label: "مكتمل", icon: <CheckCircle2 className="w-4 h-4" /> }
                ]}
                activeKey={activeKey}
                onChange={onTabChange}
                size="sm"
                showDividers={false}
            />
        </div>
    )
}

// Example 3: Used in Sidebar context
export const sidebarMenuItems = [
    { key: "dashboard", label: "لوحة التحكم", icon: "🏠" },
    { key: "projects", label: "المشاريع", icon: "📁" },
    { key: "proposals", label: "المقترحات", icon: "📄" },
    { key: "documents", label: "المستندات", icon: "📋" },
    { key: "requests", label: "الطلبات", icon: "📬" }
]

export default SubMenu
