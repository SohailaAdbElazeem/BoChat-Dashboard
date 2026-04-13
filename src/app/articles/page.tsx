"use client";

import { useState } from "react";

export default function AllArticlesPage() {
	const [expandedId, setExpandedId] = useState(null);
	const [articles, setArticles] = useState([
		{
			id: 1,
			title: "هنا يكون عنوان المقال",
			content:
				'سهولة الفهم: كلمة "فئة" قد تبدو تقنية بعض الشيء؛ استخدام "أقسام" أو "مواضيع" يجعل المستخدم يشعر بسلاسة أكثر في الوصول للمعلومة. التناسق البصري: يفضل أن يكون الخط في هذا الجزء أصغر قليلاً من عنوان المقال الرئيسي لجعل التسلسل الهرمي للمعلومات واضحاً للعين. الهوية: بما أنك تستخدم اللون الأحمر في التصميم، يمكنك وضع "اسم الفئة" داخل مستطيل صغير (Tag) بلون أحمر فاتح جداً ونص أحمر غامق لتمييزه... مشاهدة المزيد',
			views: 4357,
			useful: 1030,
			notUseful: 307,
			type: "سياسة الخصوصية",
			created: "منذ شهر",
			updated: "منذ سنة",
		},
		{
			id: 2,
			title: "عنوان مقال ثاني",
			content:
				'سهولة الفهم: كلمة "فئة" قد تبدو تقنية بعض الشيء؛ استخدام "أقسام" أو "مواضيع" يجعل المستخدم يشعر بسلاسة أكثر في الوصول للمعلومة. التناسق البصري: يفضل أن يكون الخط في هذا الجزء أصغر قليلاً من عنوان المقال الرئيسي لجعل التسلسل الهرمي للمعلومات واضحاً للعين. الهوية: بما أنك تستخدم اللون الأحمر في التصميم، يمكنك وضع "اسم الفئة" داخل مستطيل صغير (Tag) بلون أحمر فاتح جداً ونص أحمر غامق لتمييزه  سهولة الفهم: كلمة "فئة" قد تبدو تقنية بعض الشيء؛ استخدام "أقسام" أو "مواضيع" يجعل المستخدم يشعر بسلاسة أكثر في الوصول للمعلومة. التناسق البصري: يفضل أن يكون الخط في هذا الجزء أصغر قليلاً من عنوان المقال الرئيسي لجعل التسلسل الهرمي للمعلومات واضحاً للعين. الهوية: بما أنك تستخدم اللون الأحمر في التصميم، يمكنك وضع "اسم الفئة" داخل مستطيل صغير (Tag) بلون أحمر فاتح جداً ونص أحمر غامق لتمييزه ...سهولة الفهم: كلمة "فئة" قد تبدو تقنية بعض الشيء؛ استخدام "أقسام" أو "مواضيع" يجعل المستخدم يشعر بسلاسة أكثر في الوصول للمعلومة. التناسق البصري: يفضل أن يكون الخط في هذا الجزء أصغر قليلاً من عنوان المقال الرئيسي لجعل التسلسل الهرمي للمعلومات واضحاً للعين. الهوية: بما أنك تستخدم اللون الأحمر في التصميم، يمكنك وضع "اسم الفئة" داخل مستطيل صغير (Tag) بلون أحمر فاتح جداً ونص أحمر غامق لتمييزه ...',
			views: 2000,
			useful: 900,
			notUseful: 100,
			type: "تقنية",
			created: "منذ أسبوع",
			updated: "منذ يومين",
		},
		{
			id: 3,
			title: "عنوان مقال ثاني",
			content:
				'سهولة الفهم: كلمة "فئة" قد تبدو تقنية بعض الشيء؛ استخدام "أقسام" أو "مواضيع" يجعل المستخدم يشعر بسلاسة أكثر في الوصول للمعلومة. التناسق البصري: يفضل أن يكون الخط في هذا الجزء أصغر قليلاً من عنوان المقال الرئيسي لجعل التسلسل الهرمي للمعلومات واضحاً للعين. الهوية: بما أنك تستخدم اللون الأحمر في التصميم، يمكنك وضع "اسم الفئة" داخل مستطيل صغير (Tag) بلون أحمر فاتح جداً ونص أحمر غامق لتمييزه  سهولة الفهم: كلمة "فئة" قد تبدو تقنية بعض الشيء؛ استخدام "أقسام" أو "مواضيع" يجعل المستخدم يشعر بسلاسة أكثر في الوصول للمعلومة. التناسق البصري: يفضل أن يكون الخط في هذا الجزء أصغر قليلاً من عنوان المقال الرئيسي لجعل التسلسل الهرمي للمعلومات واضحاً للعين. الهوية: بما أنك تستخدم اللون الأحمر في التصميم، يمكنك وضع "اسم الفئة" داخل مستطيل صغير (Tag) بلون أحمر فاتح جداً ونص أحمر غامق لتمييزه ...سهولة الفهم: كلمة "فئة" قد تبدو تقنية بعض الشيء؛ استخدام "أقسام" أو "مواضيع" يجعل المستخدم يشعر بسلاسة أكثر في الوصول للمعلومة. التناسق البصري: يفضل أن يكون الخط في هذا الجزء أصغر قليلاً من عنوان المقال الرئيسي لجعل التسلسل الهرمي للمعلومات واضحاً للعين. الهوية: بما أنك تستخدم اللون الأحمر في التصميم، يمكنك وضع "اسم الفئة" داخل مستطيل صغير (Tag) بلون أحمر فاتح جداً ونص أحمر غامق لتمييزه ...',
			views: 2000,
			useful: 900,
			notUseful: 100,
			type: "تقنية",
			created: "منذ أسبوع",
			updated: "منذ يومين",
		},
	]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedArticle, setSelectedArticle] = useState(null);
	const [openCategory, setOpenCategory] = useState(false);
	const handleDelete = (id) => {
		setArticles((prev) => prev.filter((article) => article.id !== id));
	};
	const handleOpenUpdate = (article) => {
		setSelectedArticle(article);
		setIsModalOpen(true);
	};
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
	return (
		<div
			dir="rtl"
			className="min-h-screen bg-white pt-20 font-[Cairo] flex flex-col items-center"
		>
			{/* Header */}
			<div className="ml-auto mx-24 w-[267px] h-[52px] text-[#D72229] text-[21px] font-medium flex items-center justify-center">
				جميع المقالات المتاحة
			</div>

			{/* Articles List */}
			<div className="mt-3 flex flex-col gap-6 w-[1310px]">
				{articles.map((article) => {
					const isExpanded = expandedId === article.id;

					return (
						<div
							key={article.id}
							className="bg-[#E6E6E6] rounded-[24px] p-6 flex justify-between items-stretch"
						>
							{/* 1️⃣ النص */}
							<div className="flex flex-col gap-3 w-[65%] px-4">
								<h3 className="text-[15px] font-bold text-[#8989A2] text-right">
									{article.title}
								</h3>

								<p className="text-[13px] text-[#8989A2] leading-6 text-right">
									{isExpanded
										? article.content
										: article.content.slice(0, 150) + "..."}

									<span
										onClick={() =>
											setExpandedId(isExpanded ? null : article.id)
										}
										className="text-[#D72229] cursor-pointer mr-2"
									>
										{isExpanded ? "عرض أقل" : "عرض المزيد"}
									</span>
								</p>
							</div>

							{/* LINE 1 */}
							<div className="w-[1px] bg-[#D8D8D8] self-stretch"></div>

							{/* 2️⃣ المعلومات */}
							<div className="text-[12px] text-[#8989A2] flex flex-col gap-1 text-right px-4 w-[20%]">
								<span>المشاهدات: {article.views}</span>
								<span>مفيد: {article.useful}</span>
								<span>غير مفيد: {article.notUseful}</span>
								<span>نوع المقال: {article.type}</span>
								<span>تمت الإضافة: {article.created}</span>
								<span>آخر تحديث: {article.updated}</span>
							</div>

							{/* LINE 2 */}
							<div className="w-[1px] bg-[#D8D8D8] self-stretch"></div>

							{/* 3️⃣ الأزرار */}
							<div className="flex flex-col gap-3 px-4">
								<button
									onClick={() => handleOpenUpdate(article)}
									className="w-[136px] h-[35px] bg-[#D72229] text-white text-[12px] rounded-[12px]"
								>
									تحديث
								</button>

								<button
									onClick={() => handleDelete(article.id)}
									className="w-[136px] h-[35px] border border-[#D72229] text-[#D72229] text-[12px] rounded-[12px]"
								>
									حذف
								</button>
							</div>
						</div>
					);
				})}
			</div>

			{/*  */}
			{isModalOpen && selectedArticle && (
				<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
					<div className="w-[967px] h-auto bg-[#F6F6F6] rounded-[34px] p-8 relative">
						{/* Header */}
						<h2 className="text-center text-[21px] font-bold text-[#D72229] mb-6">
							تحديث مقال
						</h2>

						{/* Title */}
						<div className="flex flex-col gap-2 mb-4">
							<label className="text-[15px] text-[#8989A2]">عنوان المقال</label>

							<input
								value={selectedArticle.title}
								onChange={(e) =>
									setSelectedArticle({
										...selectedArticle,
										title: e.target.value,
									})
								}
								className="h-[50px] rounded-[18px] bg-[#E6E6E6] text-[#8989A2] px-4 outline-none"
							/>
						</div>

						{/* Content */}
						<div className="flex flex-col gap-2 mb-4">
							<label className="text-[15px] text-[#8989A2]">محتوي المقال</label>

							<textarea
								value={selectedArticle.content}
								onChange={(e) =>
									setSelectedArticle({
										...selectedArticle,
										content: e.target.value,
									})
								}
								className="h-[120px] rounded-[18px] bg-[#E6E6E6]  text-[#8989A2] px-4 py-3 outline-none"
							/>
						</div>

						{/* Category */}
						<div className="flex flex-col gap-2 relative mb-6">
							<label className="text-[15px] text-[#8989A2]">التصنيف</label>

							{/* Select Box */}
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

							{/* Dropdown */}
							{openCategory && (
								<div className="absolute top-[75px] left-0 w-full bg-white shadow-[0_0_10px_rgba(0,0,0,0.15)] rounded-xl z-10">
									{categories.map((cat, index) => (
										<div
											key={index}
											onClick={() => {
												setSelectedArticle({
													...selectedArticle,
													type: cat.name,
												});
												setOpenCategory(false);
											}}
											className={`px-4 py-3 hover:bg-gray-100 cursor-pointer flex justify-between text-[#8989A2] bg-[#0000000D]
          ${index !== categories.length - 1 ? "border-b border-[#8989A2]" : ""}`}
										>
											<span>{cat.name}</span>
										</div>
									))}
								</div>
							)}
						</div>

						{/* Buttons */}
						<div className="flex justify-center gap-4">
							<button
								onClick={() => {
									setArticles((prev) =>
										prev.map((a) =>
											a.id === selectedArticle.id ? selectedArticle : a,
										),
									);
									setIsModalOpen(false);
								}}
								className="w-[350px] h-[60px] bg-[#D72229] text-white text-[18px] rounded-[25px]"
							>
								تحديث
							</button>
						</div>

						{/* Close */}
						<button
							onClick={() => setIsModalOpen(false)}
							className="absolute top-4 left-4 text-[#8989A2]"
						>
							✕
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
