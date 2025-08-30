import Link from "next/link";

export default function BannedListCard() {
  return (
    <div className="rounded-3xl bg-[#F6F6F6] p-6 shadow-sm" dir="rtl">
      <p className="text-right text-sm text-gray-600">
        لكي تشاهد قائمة المحظورين اضغط على هذا الزر لعرض جميع الحسابات التي تحت حظرها
      </p>
      <Link
        href="banned-users/banned-list"
        className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-[#EDEDED] px-4 py-3 text-center text-[#D12D2D]"
      >
        مشاهدة قائمة المحظورين
      </Link>
    </div>
  );
}