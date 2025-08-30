/* eslint-disable @next/next/no-img-element */
type PromoItem = {
  id: string;
  title: string;
  description?: string;
  views?: number | string;
  clicks?: number | string;
  noteType?: string;        // نوع الإشعار
  timeAgo?: string;         // إن احتجته
  imageUrl?: string | null; // اختياري
};

export const LeftSidebar: React.FC<{
  items: PromoItem[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}> = ({ items, onDelete, onEdit }) => {
  return (
    <div className="space-y-5">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-[#F6F6F6] rounded-2xl overflow-hidden"
        >
          <div className="flex">
            <aside className="bg-[#F6F6F6] p-4 pr-5 border-l border-[#E5E5E5] !w-[200px] border-r-2">
              <div className="space-y-2 text-[13px] text-gray-500" dir="rtl">
                <div className="flex items-center justify-between">
                  <span>المشاهدات:</span>
                  <span className="text-gray-700 font-medium">{item.views ?? "-"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>النقرات:</span>
                  <span className="text-gray-700 font-medium">{item.clicks ?? "-"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>نوع الإشعار:</span>
                  <span className="text-gray-700 font-medium">
                    {item.noteType ?? "-"}
                  </span>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => onDelete(item.id)}
                  className="w-full h-9 rounded-[15px] bg-[#D72229] text-white text-[12px] hover:opacity-95 transition"
                >
                  حذف
                </button>
                <button
                  onClick={() => onEdit(item.id)}
                  className="w-full h-9 rounded-[15px] border-2 text-[#D72229] border-[#D72229] bg-white text-[12px] hover:bg-[#D72229]/5 transition"
                >
                  تعديل الإشعار
                </button>
              </div>
            </aside>

            <div className="p-2 w-[400px]">
              <div className="flex items-start gap-6">
                  {item.imageUrl ? (
                <div className="order-1 w-[100px] h-[100px] rounded-2xl overflow-hidden shrink-0 hidden md:block">
                    <img
                      src={item.imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                </div>
                  ) 
                : (
                    <></>
                  )}

                {/* النص */}
                <div className="flex-1 text-right">
                  <h3 className="text-[15px] md:text-[22px] text-gray-500 font-semibold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm md:text-base">
                    {item.description ??
                      "هنا سيكون وصف الإشعار وصف الكتابة لسطرين"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
