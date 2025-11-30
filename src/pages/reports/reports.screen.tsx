import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { ReportCard, ReportDisplay } from "./components";
import {
  generateProjectReport,
  generateStudentReport,
  generateEvaluationReport,
  generateStatisticsReport,
  exportReportAsPDF,
  exportReportAsExcel,
  ProjectReport,
  StudentReport,
  EvaluationReport,
  StatisticsReport,
} from "@/services/reports.service";
import {
  FileText,
  Users,
  Award,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";

interface ReportType {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  type: "projects" | "students" | "evaluations" | "statistics";
}

const reportTypes: ReportType[] = [
  {
    id: "projects",
    name: "تقرير المشاريع",
    description: "تقرير شامل عن جميع المشاريع وحالتها وتوزيعها",
    category: "statistics",
    icon: FileText,
    type: "projects",
  },
  {
    id: "students",
    name: "تقرير الطلاب",
    description: "تقرير عن الطلاب المسجلين وغير المسجلين في المشاريع",
    category: "performance",
    icon: Users,
    type: "students",
  },
  {
    id: "evaluations",
    name: "تقرير التقييمات",
    description: "تقرير شامل عن جميع التقييمات والدرجات",
    category: "compliance",
    icon: Award,
    type: "evaluations",
  },
  {
    id: "statistics",
    name: "التقرير الإحصائي العام",
    description: "إحصائيات شاملة عن النظام والمشاريع والطلاب",
    category: "summary",
    icon: BarChart3,
    type: "statistics",
  },
];

const ReportsScreen: React.FC = () => {
  const { t } = useLanguage();
  const { addNotification } = useNotifications();
  const [generatedReports, setGeneratedReports] = useState<
    Record<string, ProjectReport | StudentReport | EvaluationReport | StatisticsReport>
  >({});
  const [generatingReports, setGeneratingReports] = useState<Record<string, boolean>>({});
  const [selectedReport, setSelectedReport] = useState<{
    type: string;
    report: ProjectReport | StudentReport | EvaluationReport | StatisticsReport;
  } | null>(null);

  const handleGenerateReport = async (reportType: ReportType) => {
    setGeneratingReports((prev) => ({ ...prev, [reportType.id]: true }));

    try {
      let report:
        | ProjectReport
        | StudentReport
        | EvaluationReport
        | StatisticsReport;

      switch (reportType.type) {
        case "projects":
          report = await generateProjectReport();
          break;
        case "students":
          report = await generateStudentReport();
          break;
        case "evaluations":
          report = await generateEvaluationReport();
          break;
        case "statistics":
          report = await generateStatisticsReport();
          break;
        default:
          throw new Error("نوع تقرير غير معروف");
      }

      setGeneratedReports((prev) => ({
        ...prev,
        [reportType.id]: report,
      }));

      setSelectedReport({
        type: reportType.type,
        report,
      });

      addNotification({
        type: "success",
        title: "تم توليد التقرير",
        message: `تم توليد ${reportType.name} بنجاح`,
      });
    } catch (error) {
      console.error("Error generating report:", error);
      addNotification({
        type: "error",
        title: "خطأ في توليد التقرير",
        message: "حدث خطأ أثناء توليد التقرير. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setGeneratingReports((prev) => ({ ...prev, [reportType.id]: false }));
    }
  };

  const handleDownload = async (
    reportType: string,
    format: "pdf" | "excel"
  ) => {
    try {
      const reportId = reportTypes.find((rt) => rt.type === reportType)?.id;
      if (!reportId) return;

      let blob: Blob;
      if (format === "pdf") {
        blob = await exportReportAsPDF(
          reportType as "projects" | "students" | "evaluations" | "statistics"
        );
      } else {
        blob = await exportReportAsExcel(
          reportType as "projects" | "students" | "evaluations" | "statistics"
        );
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report_${reportType}_${new Date().getTime()}.${
        format === "pdf" ? "pdf" : "xlsx"
      }`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      addNotification({
        type: "success",
        title: "تم التحميل",
        message: `تم تحميل التقرير بصيغة ${format.toUpperCase()} بنجاح`,
      });
    } catch (error) {
      console.error("Error downloading report:", error);
      addNotification({
        type: "error",
        title: "خطأ في التحميل",
        message: "حدث خطأ أثناء تحميل التقرير. يرجى المحاولة مرة أخرى.",
      });
    }
  };

  const handleBackToReports = () => {
    setSelectedReport(null);
  };

  if (selectedReport) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {reportTypes.find((rt) => rt.type === selectedReport.type)?.name}
              </h1>
              <button
                onClick={handleBackToReports}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                ← العودة إلى التقارير
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <ReportDisplay
              reportType={selectedReport.type}
              report={selectedReport.report}
              onDownload={(format) => handleDownload(selectedReport.type, format)}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                التقارير
              </h1>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportTypes.map((reportType) => {
              const isGenerated = !!generatedReports[reportType.id];
              const isGenerating = generatingReports[reportType.id] || false;
              const generatedReport = generatedReports[reportType.id];

              return (
                <ReportCard
                  key={reportType.id}
                  id={reportType.id}
                  name={reportType.name}
                  description={reportType.description}
                  category={reportType.category}
                  icon={reportType.icon}
                  lastGenerated={
                    isGenerated
                      ? new Date().toISOString()
                      : undefined
                  }
                  status={isGenerating ? "generating" : "available"}
                  onGenerate={() => handleGenerateReport(reportType)}
                  onDownload={(format) =>
                    handleDownload(reportType.type, format)
                  }
                  isGenerating={isGenerating}
                  isGenerated={isGenerated}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsScreen;

