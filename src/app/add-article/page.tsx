"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function AddArticlePage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [categoryError, setCategoryError] = useState("");

  const [token, setToken] = useState<string | null>(null);
  const [toast, setToast] = useState({ message: "", type: "", visible: false });

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
      if (!storedToken) {
        showToast("الرجاء تسجيل الدخول أولاً", "error");
        router.push("/login");
      }
    }
  }, [router]);

  const categories = [
    { name: "الخصوصية والأمان", count: 50 },
    { name: "البداية السريعة", count: 10 },
    { name: "المميزات الذكية", count: 0 },
    { name: "تخصيص التجربة", count: 20 },
    { name: "الحساب والإعدادات", count: 10 },
    { name: "الدفع والاشتراكات", count: 20 },
    { name: "برنامج السفراء", count: 20 },
    { name: "استثمر معنا", count: 16 },
    { name: "المطورون والمساهمون", count: 12 },
    { name: "الأسئلة الشائعة", count: 12 },
  ];

  const URL = process.env.NEXT_PUBLIC_API_BASE;
  if (!URL) {
    console.error("NEXT_PUBLIC_API_BASE is not defined");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTitleError("");
    setContentError("");
    setCategoryError("");

    let hasError = false;
    if (!title.trim()) {
      setTitleError("يرجى إدخال عنوان المقال");
      hasError = true;
    }
    if (!content.trim()) {
      setContentError("يرجى إدخال محتوى المقال");
      hasError = true;
    }
    if (!selectedCategory) {
      setCategoryError("يرجى اختيار تصنيف المقال");
      hasError = true;
    }
    if (hasError) return;

    setLoading(true);
    try {
      if (!token) {
        throw new Error("لم يتم العثور على رمز المصادقة. الرجاء تسجيل الدخول مرة أخرى.");
      }

      const response = await fetch(`${URL}/dashboard/createArticle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title,
          type: selectedCategory,
          desc: content,
        }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        let errorMsg = "فشل في إضافة المقال";
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
          console.error("Error response:", errorData);
        } catch (e) {
          console.error("Could not parse error response");
        }
        throw new Error(errorMsg);
      }

      showToast("تم إضافة المقال بنجاح!", "success");
      // Redirect after a short delay – uncomment if desired
      // setTimeout(() => router.push("/articles"), 1000);
    } catch (err: any) {
      console.error("Submit error:", err);
      showToast(err.message || "حدث خطأ أثناء إرسال البيانات", "error");
      setCategoryError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
        className="min-h-screen bg-white pt-20 font-[Cairo] flex 
    flex-col items-center relative px-4 sm:px-30 md:px-20 pl-[80px] mb-20"
    >
      {/* Header */}
      <div className="w-full max-w-5xl mx-auto text-center md:text-right mb-6">
        <div className="text-[#D72229] text-[21px] font-medium inline-block">
          اضافة مقال للويب سايت
        </div>
      </div>

      {/* Form  */}
      <div className="w-full max-w-[90%] sm:max-w-[600px] md:max-w-[800px] lg:max-w-[967px] rounded-[34px] bg-white shadow-[0_0_5px_rgba(0,0,0,0.2)] mt-6 md:mt-10 p-4 sm:p-6 md:p-8">
        <div className="text-[#D72229] text-[18px] sm:text-[21px] font-bold text-center py-2 rounded-md mb-4 sm:mb-6">
          اضف مقال
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] sm:text-[15px] text-[#8989A2] font-medium">
              عنوان المقال
            </label>
            <input
              type="text"
              placeholder="اكتب هنا العنوان"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError("");
              }}
              className={`h-[45px] sm:h-[50px] rounded-[18px] bg-[#E6E6E6] px-4 text-right outline-none text-sm sm:text-base ${
                titleError ? "border border-red-500" : ""
              }`}
            />
            {titleError && (
              <div className="text-red-500 text-xs sm:text-sm pr-2">{titleError}</div>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] sm:text-[15px] text-[#8989A2] font-medium">
              محتوى المقال
            </label>
            <textarea
              placeholder="اكتب هنا المحتوى"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (contentError) setContentError("");
              }}
              className={`h-[180px] sm:h-[210px] rounded-[18px] bg-[#E6E6E6] px-4 py-3 text-right outline-none text-sm sm:text-base ${
                contentError ? "border border-red-500" : ""
              }`}
            />
            {contentError && (
              <div className="text-red-500 text-xs sm:text-sm pr-2">{contentError}</div>
            )}
          </div>

          {/* Category */}
          <div className="flex flex-col gap-2 relative">
            <label className="text-[13px] sm:text-[15px] text-[#8989A2] font-medium">
              تصنيف المقال
            </label>
            <div
              onClick={() => setOpen(!open)}
              className={`h-[45px] sm:h-[50px] rounded-[18px] bg-[#E6E6E6] px-4 flex items-center justify-between cursor-pointer ${
                categoryError ? "border border-red-500" : ""
              }`}
            >
              <span className="text-[#8989A2] text-sm sm:text-base">
                {selectedCategory || "اختر تصنيف المقال"}
              </span>
              <img
                src="/imgs/Vector (4).svg"
                alt="arrow"
                width={16}
                height={16}
                className={`transition-transform ${open ? "rotate-180" : ""}`}
              />
            </div>
            {categoryError && (
              <div className="text-red-500 text-xs sm:text-sm pr-2">{categoryError}</div>
            )}
            {open && (
              <div className="absolute top-[55px] sm:top-[75px] left-0 w-full bg-white shadow-[0_0_10px_rgba(0,0,0,0.15)] rounded-xl z-10 max-h-60 overflow-y-auto">
                {categories.map((cat, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setOpen(false);
                      if (categoryError) setCategoryError("");
                    }}
                    className={`px-4 py-2 sm:py-3 hover:bg-gray-100 cursor-pointer flex justify-between text-[#8989A2] bg-[#0000000D] text-sm sm:text-base
                    ${index !== categories.length - 1 ? "border-b border-[#8989A2]" : ""}`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-gray-400 text-xs sm:text-sm">{cat.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full sm:w-[350px] h-[50px] sm:h-[60px] bg-[#D72229] text-white rounded-[25px] self-center mt-4 text-base sm:text-lg ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "جاري الإضافة..." : "اضافة"}
          </button>
        </form>
      </div>

      {/* Info Box */}
      <div className="w-full max-w-[90%] sm:max-w-[600px] md:max-w-[800px] lg:max-w-[967px] h-auto bg-[#F6F6F6] rounded-[34px] mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-6">
        <p className="text-[16px] sm:text-[18px] text-[#8989A2] leading-[1.5] sm:leading-[30px] w-full sm:w-[434px] text-right">
          كي تشاهد قائمة المقالات اضغط على هذا الزر لعرض جميع المقالات التي تمت اضافتها
        </p>
        <button
          onClick={() => router.push("/articles")}
          className="w-full sm:w-[361px] h-[50px] sm:h-[55px] bg-[#E6E6E6] rounded-[20px] text-[#D72229] text-[16px] sm:text-[18px]"
        >
          مشاهدة جميع المقالات
        </button>
      </div>

      {/* Toast Notification */}
      <div
        className={`fixed top-20 right-4 sm:right-5 z-50 transition-all duration-300 ease-out ${
          toast.visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        <div
          className={`px-4 sm:px-6 py-3 rounded-lg shadow-lg text-white text-right text-sm sm:text-base ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      </div>
    </div>
  );
}