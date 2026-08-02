"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function AllArticlesPage() {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState(null);
  const [articles, setArticles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [openCategory, setOpenCategory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const limit = 1000;

  // Filter states
  const [filterQuery, setFilterQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [minViews, setMinViews] = useState("");
  const [minUseful, setMinUseful] = useState("");
  const [minNotUseful, setMinNotUseful] = useState("");
  const [createdSince, setCreatedSince] = useState(""); 

  // Toast state
  const [toast, setToast] = useState({ message: "", type: "", visible: false });

  const showToast = (message, type = "success") => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
  };

  const API_BASE = "https://bo-chat.space/dashboard/articles/All";
 
  const getAuthToken = () => localStorage.getItem("token");

  const authFetch = async (url, options = {}) => {
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
      throw new Error("No authentication token");
    }
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
    const response = await fetch(url, { ...options, headers });
    if (response.status === 401) {
      localStorage.removeItem("token");
      router.push("/login");
      throw new Error("Session expired. Please login again.");
    }
    return response;
  };
const getCategoryName = (ctgNumber) => {
  const categoryMap = {
    1: "الخصوصية والأمان",
    2: "البداية السريعة",
    3: "المميزات الذكية",
    4: "تخصيص التجربة",
    5: "الحساب والإعدادات",
    6: "الدفع والاشتراكات",
    7: "برنامج السفراء",
    8: "استثمر معنا",
    9: "المطورون والمساهمون",
    10: "الأسئلة الشائعة",
  };
  return categoryMap[ctgNumber] || "غير مصنف";
};
const getCategoryNumber = (categoryName) => {
  const map = {
    "الخصوصية والأمان": 1,
    "البداية السريعة": 2,
    "المميزات الذكية": 3,
    "تخصيص التجربة": 4,
    "الحساب والإعدادات": 5,
    "الدفع والاشتراكات": 6,
    "برنامج السفراء": 7,
    "استثمر معنا": 8,
    "المطورون والمساهمون": 9,
    "الأسئلة الشائعة": 10,
  };
  return map[categoryName] || 1;
};
const fetchArticles = async () => {
  try {
    setLoading(true);
    const res = await authFetch(`${API_BASE}?page=${currentPage}&limit=${limit}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.log("API Response:", data);
    
    let articlesList = [];
    let total = 0;
    
    if (data.success && data.response) {
      articlesList = data.response.map((item) => {
         let categoryName = item.type;
        if (!categoryName && item.ctg) {
          categoryName = getCategoryName(item.ctg);
        } else if (!categoryName) {
          categoryName = "غير محدد";
        }
        return {
          id: item._id,
          title: item.title,
          content: item.desc || item.content,
          type: categoryName, 
          views: item.viewsCount || 0,
          useful: item.usefulCount || 0,
          notUseful: item.unusefulCount || 0,
          created: item.createdAt ? new Date(item.createdAt).toLocaleDateString('ar-EG') : "منذ قليل",
          updated: item.lastUpdate ? new Date(item.lastUpdate).toLocaleDateString('ar-EG') : "منذ قليل",
        };
      });
      total = data.total || articlesList.length;
    } else if (Array.isArray(data)) {
      articlesList = data.map((item) => {
        let categoryName = item.type;
        if (!categoryName && item.ctg) {
          categoryName = getCategoryName(item.ctg);
        } else if (!categoryName) {
          categoryName = "غير محدد";
        }
        return {
          id: item._id,
          title: item.title,
          content: item.desc || item.content,
          type: categoryName,
          views: item.viewsCount || 0,
          useful: item.usefulCount || 0,
          notUseful: item.unusefulCount || 0,
          created: item.createdAt ? new Date(item.createdAt).toLocaleDateString('ar-EG') : "منذ قليل",
          updated: item.lastUpdate ? new Date(item.lastUpdate).toLocaleDateString('ar-EG') : "منذ قليل",
        };
      });
      total = articlesList.length;
    } else {
      throw new Error("Unexpected API response structure");
    }
    
    setArticles(articlesList);
    setTotalArticles(total);
    setTotalPages(Math.ceil(total / limit));
    setError(null);
  } catch (err) {
    console.error(err);
    if (err.message !== "Session expired. Please login again.") {
      setError("فشل في تحميل المقالات. يرجى المحاولة مرة أخرى.");
    }
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    fetchArticles();
  }, [currentPage]);

  // Filter logic with all six criteria
  const filteredArticles = articles.filter((article) => {
    const matchesQuery =
      filterQuery === "" ||
      article.title.includes(filterQuery) ||
      article.content.includes(filterQuery);

    const matchesType = filterType === "" || article.type === filterType;

    const matchesViews = minViews === "" || article.views >= parseInt(minViews);

    const matchesUseful = minUseful === "" || article.useful >= parseInt(minUseful);

    const matchesNotUseful = minNotUseful === "" || article.notUseful >= parseInt(minNotUseful);

    let matchesCreated = true;
    if (createdSince !== "") {
      const createdDate = new Date(article.created);
      const now = new Date();
      const diffDays = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));
      if (createdSince === "day") matchesCreated = diffDays <= 1;
      else if (createdSince === "week") matchesCreated = diffDays <= 7;
      else if (createdSince === "month") matchesCreated = diffDays <= 30;
      else if (createdSince === "year") matchesCreated = diffDays <= 365;
    }

    return matchesQuery && matchesType && matchesViews && matchesUseful && matchesNotUseful && matchesCreated;
  });

   
  const handleDelete = async (id: string) => {
  if (!confirm("هل أنت متأكد من حذف هذا المقال؟")) return;

  try {
    const response = await authFetch(
      `https://bo-chat.space/dashboard/articles/Delete?articleid=${id}`,
      { method: "DELETE" }
    );

    if (!response.ok) {
       const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Delete failed: ${response.status}`);
    }

     setArticles((prev) => prev.filter((article) => article.id !== id));
    showToast("تم حذف المقال بنجاح", "success");
      } catch (err) {
    console.error("Delete error:", err);
    showToast(`فشل حذف المقال: ${err instanceof Error ? err.message : 'حاول مرة أخرى'}`, "error");
  }
};
  const handleOpenUpdate = (article) => {
    setSelectedArticle({ ...article });
    setIsModalOpen(true);
  };
 
// const handleUpdate = async () => {
//   if (!selectedArticle) return;
//   try {
//     // استخدم getCategoryNumber بدلاً من getCategoryName
//     const ctgNumber = getCategoryNumber(selectedArticle.type);
//     const payload = {
//       articleid: selectedArticle.id,
//       title: selectedArticle.title,
//       ctg: ctgNumber, // هذا يجب أن يكون رقمًا وليس اسمًا
//       content: selectedArticle.content,
//     };
    
//     console.log("Sending payload:", payload); // للتأكد من البيانات
    
//     const res = await authFetch("https://bo-chat.space/dashboard/articles/Update", {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });
    
//     if (!res.ok) {
//       let errorMsg = "Update failed";
//       try {
//         const errData = await res.json();
//         errorMsg = errData.message || errorMsg;
//       } catch(e) {}
//       throw new Error(errorMsg);
//     }
    
//     const result = await res.json();
//     console.log("Update response:", result); // للتأكد من الاستجابة
    
//     setArticles((prev) =>
//       prev.map((a) => (a.id === selectedArticle.id ? selectedArticle : a))
//     );
//     setIsModalOpen(false);
//     setSelectedArticle(null);
//     showToast("تم تحديث المقال بنجاح", "success");
//   } catch (err) {
//     console.error(err);
//     showToast(`فشل تحديث المقال: ${err.message}`, "error");
//   }
// }
const handleUpdate = async () => {
  if (!selectedArticle) return;
  try {
    const ctgNumber = getCategoryNumber(selectedArticle.type);
    const payload = {
      articleid: selectedArticle.id,
      title: selectedArticle.title,
      ctg: ctgNumber,
      content: selectedArticle.content,
    };
    
    console.log("Sending payload:", payload);
    
    const res = await authFetch("https://bo-chat.space/dashboard/articles/Update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    
    if (!res.ok) {
      let errorMsg = "Update failed";
      try {
        const errData = await res.json();
        errorMsg = errData.message || errorMsg;
      } catch(e) {}
      throw new Error(errorMsg);
    }
    
    const result = await res.json();
    console.log("Update response:", result);
    
     await fetchArticles();
    
    setIsModalOpen(false);
    setSelectedArticle(null);
    showToast("تم تحديث المقال بنجاح", "success");
  } catch (err) {
    console.error(err);
    showToast(`فشل تحديث المقال: ${err.message}`, "error");
  }
}

  const categories = [
    { name: "الخصوصية والأمان" },
    { name: "البداية السريعة" },
    { name: "المميزات الذكية" },
    { name: "تخصيص التجربة" },
    { name: "الحساب والإعدادات" },
    { name: "الدفع والاشتراكات" },
    { name: "برنامج السفراء" },
    { name: "استثمر معنا" },
    { name: "المطورون والمساهمون" },
    { name: "الأسئلة الشائعة" },
  ];

  // Pagination controls
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (loading && articles.length === 0) {
    return (
      <div dir="rtl" className="min-h-screen bg-white pt-20 font-[Cairo] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#D72229]"></div>
          <p className="mt-4 text-[#8989A2]">جاري تحميل المقالات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div dir="rtl" className="min-h-screen bg-white pt-20 font-[Cairo] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#D72229]">{error}</p>
          <button onClick={fetchArticles} className="mt-4 px-4 py-2 bg-[#D72229] text-white rounded-lg">
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" 
    className="min-h-screen bg-white pt-20 font-[Cairo] flex flex-col items-center relative px-4 md:px-8 pl-4 md:pl-[80px] sm:px-6 pl-[80px] mb-20" >
      {/* Header */}
      <div className="w-full max-w-7xl mx-auto text-center md:text-right mb-6">
        <div className="text-[#D72229] text-[21px] font-medium inline-block">
          جميع المقالات المتاحة
        </div>
      </div>

      {/* Filter Bar with all six filters */}
      <div className="w-full max-w-7xl mx-auto flex flex-wrap items-center gap-2 bg-[#F6F6F6] p-[15px] rounded-[25px] mb-6">
        {/* Search input */}
        <div className="flex items-center gap-1">
          <div className="w-12 h-12 flex p-[7px] items-center justify-center rounded-[15px] bg-[#8989A2]/25">
            <Search className="text-[#8989A2]" size={20} />
          </div>
          <input
            className="h-12 w-65 rounded-2xl border-2 border-[#E6E6E6] px-3 text-sm"
            placeholder="ابحث بالعنوان أو المحتوى"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
          />
        </div>

        {/* Type dropdown */}
        <select
          className="h-12 rounded-2xl border-2 border-[#E6E6E6] px-4 text-sm bg-white text-[#8989A2]"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">كل التصنيفات</option>
          {categories.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Views filter */}
        <input
          type="number"
          placeholder="المشاهدات ≥"
          className="h-12 w-28 rounded-2xl border-2 border-[#E6E6E6] px-3 text-sm bg-white text-[#8989A2]"
          value={minViews}
          onChange={(e) => setMinViews(e.target.value)}
        />

        {/* Useful filter */}
        <input
          type="number"
          placeholder="مفيد ≥"
          className="h-12 w-28 rounded-2xl border-2 border-[#E6E6E6] px-3 text-sm bg-white text-[#8989A2]"
          value={minUseful}
          onChange={(e) => setMinUseful(e.target.value)}
        />

        {/* Not Useful filter */}
        <input
          type="number"
          placeholder="غير مفيد ≥"
          className="h-12 w-28 rounded-2xl border-2 border-[#E6E6E6] px-3 text-sm bg-white text-[#8989A2]"
          value={minNotUseful}
          onChange={(e) => setMinNotUseful(e.target.value)}
        />

        {/* Creation date filter */}
        <select
          className="h-12 rounded-2xl border-2 border-[#E6E6E6] px-4 text-sm bg-white text-[#8989A2]"
          value={createdSince}
          onChange={(e) => setCreatedSince(e.target.value)}
        >
          <option value="">كل التواريخ</option>
          <option value="day">منذ يوم</option>
          <option value="week">منذ أسبوع</option>
          <option value="month">منذ شهر</option>
          <option value="year">منذ سنة</option>
        </select>
      </div>

      {/* Articles List */}
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-10 text-[#8989A2] text-lg">
            لا توجد مقالات تطابق معايير البحث
          </div>
        ) : (
          filteredArticles.map((article) => {
            const isExpanded = expandedId === article.id;
            return (
              <div
                key={article.id}
                className="bg-[#E6E6E6] rounded-[24px] p-4 sm:p-6 flex flex-col lg:flex-row justify-between items-stretch gap-4"
              >
                {/* Text content */}
                <div className="flex flex-col gap-3 w-full lg:w-[65%] px-2 sm:px-4">
                  <h3 className="text-[15px] font-bold text-[#8989A2] text-right">
                    {article.title}
                  </h3>
                  <p className="text-[13px] text-[#8989A2] leading-6 text-right">
                    {isExpanded
                      ? article.content
                      : article.content.slice(0, 150) + "..."}
                    <span
                      onClick={() => setExpandedId(isExpanded ? null : article.id)}
                      className="text-[#D72229] cursor-pointer mr-2"
                    >
                      {isExpanded ? "عرض أقل" : "عرض المزيد"}
                    </span>
                  </p>
                </div>

                {/* Horizontal separator (mobile) */}
                <div className="block lg:hidden border-t border-[#D8D8D8] my-2"></div>

                {/* Vertical divider (desktop) */}
                <div className="hidden lg:block w-[1px] bg-[#D8D8D8] self-stretch"></div>

                {/* Metadata */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-col gap-1 text-[12px] text-[#8989A2] text-right px-2 sm:px-4 w-full lg:w-[20%]">
                  <span>المشاهدات: {article.views}</span>
                  <span>مفيد: {article.useful}</span>
                  <span>غير مفيد: {article.notUseful}</span>
                  <span>نوع المقال: {article.type}</span>
                  <span>تمت الإضافة: {article.created}</span>
                  <span>آخر تحديث: {article.updated}</span>
                </div>

                {/* Horizontal separator (mobile) */}
                <div className="block lg:hidden border-t border-[#D8D8D8] my-2"></div>

                {/* Vertical divider (desktop) */}
                <div className="hidden lg:block w-[1px] bg-[#D8D8D8] self-stretch"></div>

                {/* Buttons */}
                <div className="flex flex-row lg:flex-col gap-3 px-2 sm:px-4 justify-center lg:justify-start">
                  <button
                    onClick={() => handleOpenUpdate(article)}
                    className="w-full sm:w-[136px] h-[35px] bg-[#D72229] text-white text-[12px] rounded-[12px]"
                  >
                    تحديث
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="w-full sm:w-[136px] h-[35px] border border-[#D72229] text-[#D72229] text-[12px] rounded-[12px]"
                  >
                    حذف
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8 mb-6">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#D72229] text-white hover:bg-red-700"
            }`}
          >
            السابق
          </button>
          <span className="text-[#8989A2]">
            صفحة {currentPage} من {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#D72229] text-white hover:bg-red-700"
            }`}
          >
            التالي
          </button>
        </div>
      )}

      {/* Update Modal */}
      {isModalOpen && selectedArticle && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="w-full max-w-[967px] h-auto max-h-[90vh] overflow-y-auto bg-[#F6F6F6] rounded-[34px] p-6 sm:p-8 relative">
            <h2 className="text-center text-[21px] font-bold text-[#D72229] mb-6">
              تحديث مقال
            </h2>
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-[15px] text-[#8989A2]">عنوان المقال</label>
              <input
                value={selectedArticle.title}
                onChange={(e) =>
                  setSelectedArticle({ ...selectedArticle, title: e.target.value })
                }
                className="h-[50px] rounded-[18px] bg-[#E6E6E6] text-[#8989A2] px-4 outline-none"
              />
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-[15px] text-[#8989A2]">محتوي المقال</label>
              <textarea
                value={selectedArticle.content}
                onChange={(e) =>
                  setSelectedArticle({ ...selectedArticle, content: e.target.value })
                }
                className="h-[120px] rounded-[18px] bg-[#E6E6E6] text-[#8989A2] px-4 py-3 outline-none"
              />
            </div>
            <div className="flex flex-col gap-2 relative mb-6">
              <label className="text-[15px] text-[#8989A2]">التصنيف</label>
              <div
                onClick={() => setOpenCategory(!openCategory)}
                className="h-[50px] rounded-[18px] bg-[#E6E6E6] px-4 flex items-center justify-between cursor-pointer"
              >
                <span className="text-[#8989A2]">
                  {selectedArticle.type || "اختر تصنيف المقال"}
                </span>
                <img
                  src="/imgs/Vector (4).svg"
                  alt="arrow"
                  width={16}
                  height={16}
                  className={`transition-transform ${openCategory ? "rotate-180" : ""}`}
                />
              </div>
              {openCategory && (
                <div className="absolute top-[75px] left-0 w-full bg-white shadow-[0_0_10px_rgba(0,0,0,0.15)] rounded-xl z-10 max-h-60 overflow-y-auto">
                  {categories.map((cat, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedArticle({ ...selectedArticle, type: cat.name });
                        setOpenCategory(false);
                      }}
                      className={`px-4 py-3 hover:bg-gray-100 cursor-pointer flex justify-between text-[#8989A2] bg-[#0000000D] ${
                        idx !== categories.length - 1 ? "border-b border-[#8989A2]" : ""
                      }`}
                    >
                      <span>{cat.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleUpdate}
                className="w-full sm:w-[350px] h-[60px] bg-[#D72229] text-white text-[18px] rounded-[25px]"
              >
                تحديث
              </button>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 left-4 text-[#8989A2] text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}

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