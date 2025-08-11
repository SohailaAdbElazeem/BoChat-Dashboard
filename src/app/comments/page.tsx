// src/app/analytics/page.tsx
import UserGrowthMultiStats from "@/app/_components/UserGrowthMultiStats";

type Point = {
  period: string; // المحور السُفلي (يوم/يومين/أسبوع/...)
  questions: number; // سلسلة 1
  answers: number; // سلسلة 2
  tags: number; // سلسلة 3
};

export default async function AnalyticsPage() {
  // TODO: بدّل البيانات دي ببيانات الـ API عندك
  const viewsData: Point[] = [
    { period: "يوم", questions: 22, answers: 12, tags: 8 },
    { period: "يومين", questions: 26, answers: 10, tags: 6 },
    { period: "أسبوع", questions: 28, answers: 18, tags: 10 },
    { period: "شهر", questions: 34, answers: 16, tags: 9 },
    { period: "نصف سنوي", questions: 30, answers: 22, tags: 7 },
    { period: "سنوي", questions: 36, answers: 24, tags: 11 },
    { period: "الكل", questions: 32, answers: 20, tags: 8 },
  ];

  const commentsData: Point[] = [
    { period: "يوم", questions: 12, answers: 8, tags: 6 },
    { period: "يومين", questions: 16, answers: 9, tags: 5 },
    { period: "أسبوع", questions: 20, answers: 14, tags: 7 },
    { period: "شهر", questions: 22, answers: 18, tags: 8 },
    { period: "نصف سنوي", questions: 26, answers: 20, tags: 9 },
    { period: "سنوي", questions: 30, answers: 22, tags: 10 },
    { period: "الكل", questions: 28, answers: 19, tags: 9 },
  ];

  const sideStatsViews = [
    { label: "مشاهدة الساعة", value: 100 },
    { label: "مشاهدة اليوم", value: 1200 },
    { label: "مشاهدة الأسبوع", value: 3500 },
    { label: "مشاهدة الشهر", value: 20000 },
    { label: "مشاهدة العام", value: 20000, unit: "مرة" },
  ];

  const sideStatsComments = [
    { label: "تعليق الساعة", value: 100 },
    { label: "تعليق اليوم", value: 1200 },
    { label: "تعليق الأسبوع", value: 3500 },
    { label: "تعليق الشهر", value: 20000 },
    { label: "تعليق العام", value: 20000, unit: "مرة" },
  ];

  return (
    <main className="p-6 space-y-6 pl-[80px]" dir="rtl">
      <h1 className="text-[#D72229] text-[20px] mt-0 pr-2">التعليقات</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <UserGrowthMultiStats
          title="نسبة المشاهدة"
          sideLabel="إجمالي النسب"
          sideItems={[
            { label: "مشاهدة الساعة", value: 100 },
            { label: "مشاهدة اليوم", value: 1200 },
            { label: "مشاهدة الأسبوع", value: 3500 },
            { label: "مشاهدة الشهر", value: 20000 },
            { label: "مشاهدة العام", value: 20000, unit: "مرة" },
          ]}
          xKey="period"
          chartData={[
            { period: "يوم", questions: 22, answers: 12, tags: 8 },
            { period: "يومين", questions: 26, answers: 10, tags: 6 },
            { period: "أسبوع", questions: 28, answers: 18, tags: 10 },
            { period: "شهر", questions: 34, answers: 16, tags: 9 },
            { period: "نصف سنوي", questions: 30, answers: 22, tags: 7 },
            { period: "سنوي", questions: 36, answers: 24, tags: 11 },
            { period: "الكل", questions: 32, answers: 20, tags: 8 },
          ]}
          series={[
            {
              key: "questions",
              color: "#2F6DFF",
              name: "سؤال",
            },
            {
              key: "answers",
              color: "#D72229",
              name: "ستورى",
            },
            {
              key: "tags",
              color: "#BFD3FF",
              name: "ريلز",
            }, {
              key: "tags",
              color: "#CBD5E1",
              name: "بوست",
            },
          ]}
        />
        <UserGrowthMultiStats
          title="نسبة المشاهدة"
          sideLabel="إجمالي النسب"
          sideItems={[
            { label: "مشاهدة الساعة", value: 100 },
            { label: "مشاهدة اليوم", value: 1200 },
            { label: "مشاهدة الأسبوع", value: 3500 },
            { label: "مشاهدة الشهر", value: 20000 },
            { label: "مشاهدة العام", value: 20000, unit: "مرة" },
          ]}
          xKey="period"
          chartData={[
            { period: "يوم", questions: 22, answers: 12, tags: 8 },
            { period: "يومين", questions: 26, answers: 10, tags: 6 },
            { period: "أسبوع", questions: 28, answers: 18, tags: 10 },
            { period: "شهر", questions: 34, answers: 16, tags: 9 },
            { period: "نصف سنوي", questions: 30, answers: 22, tags: 7 },
            { period: "سنوي", questions: 36, answers: 24, tags: 11 },
            { period: "الكل", questions: 32, answers: 20, tags: 8 },
          ]}
          series={[
            {
              key: "questions",
              color: "#2F6DFF",
              name: "سؤال",
            },
            {
              key: "answers",
              color: "#D72229",
              name: "ستورى",
            },
            {
              key: "tags",
              color: "#BFD3FF",
              name: "ريلز",
            }, {
              key: "tags",
              color: "#CBD5E1",
              name: "بوست",
            },
          ]}
        />
      </div>
    </main>
  );
}
