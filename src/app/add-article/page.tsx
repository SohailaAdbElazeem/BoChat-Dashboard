"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddArticlePage() {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState("");
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
	return (
		<div
			dir="rtl"
			className="min-h-screen bg-white flex flex-col items-center pt-20 font-[Cairo] pb-20"
		>
			{/* Title */}

			<div className="ml-auto text-[#D72229] mx-24 text-[21px] font-medium h-[52px] w-[267px] flex items-center justify-center rounded-md">
				اضافة مقال للويب سايت
			</div>

			{/* Form Container */}
			<div className="w-[967px] rounded-[34px] bg-white shadow-[0_0_5px_rgba(0,0,0,0.2)] mt-10 p-8">
				{/* Header */}
				<div className="text-[#D72229] text-[21px] font-bold text-center py-2 rounded-md mb-6">
					اضف مقال
				</div>

				{/* Form */}
				<form className="flex flex-col gap-5">
					{/* Title */}
					<div className="flex flex-col gap-2">
						<label className="text-[15px] text-[#8989A2] font-medium">
							عنوان المقال
						</label>
						<input
							type="text"
							placeholder="اكتب هنا العنوان"
							className="h-[50px] rounded-[18px] bg-[#E6E6E6] px-4 text-right outline-none placeholder:text-[#8989A2]"
						/>
					</div>

					{/* Content */}
					<div className="flex flex-col gap-2">
						<label className="text-[15px] text-[#8989A2] font-medium">
							محتوى المقال
						</label>
						<textarea
							placeholder="اكتب هنا المحتوى"
							className="h-[210px] rounded-[18px] bg-[#E6E6E6] px-4 py-3 text-right outline-none placeholder:text-[#8989A2]"
						/>
					</div>

					{/* Category */}

					<div className="flex flex-col gap-2 relative">
						<label className="text-[15px] text-[#8989A2] font-medium">
							تصنيف المقال
						</label>

						{/* Select Box */}
						<div
							onClick={() => setOpen(!open)}
							className="h-[50px] rounded-[18px] bg-[#E6E6E6] px-4 flex items-center justify-between cursor-pointer"
						>
							<span className="text-[#8989A2]">
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

						{/* Dropdown */}
						{open && (
							<div className="absolute top-[75px] left-0 w-full bg-white shadow-[0_0_10px_rgba(0,0,0,0.15)] rounded-xl z-10">
								{categories.map((cat, index) => (
									<div
										key={index}
										onClick={() => {
											setSelectedCategory(cat.name);
											setOpen(false);
										}}
										className={`px-4 py-3 hover:bg-gray-100 cursor-pointer flex justify-between text-[#8989A2] bg-[#0000000D]
        ${index !== categories.length - 1 ? "border-b border-[#8989A2]" : ""}`}
									>
										<span>{cat.name}</span>
										<span className="text-gray-400">{cat.count}</span>
									</div>
								))}
							</div>
						)}
					</div>
					{/* Submit */}
					<button
						type="submit"
						className="w-[350px] h-[60px] bg-[#D72229] text-white rounded-[25px] self-center mt-4"
					>
						اضافة
					</button>
				</form>
			</div>

			{/* Bottom Section */}
			<div className="w-[967px] h-[118px] bg-[#F6F6F6] rounded-[34px] mt-6 flex items-center justify-between px-6">
				<p className="text-[18px] text-[#8989A2] leading-[30px] w-[434px] text-right">
					كي تشاهد قائمة المقالات اضغط على هذا الزر لعرض جميع المقالات التي تمت
					اضافتها
				</p>

				<button
					onClick={() => router.push("/articles")}
					className="w-[361px] h-[55px] bg-[#E6E6E6] rounded-[20px] text-[#D72229] text-[18px]"
				>
					مشاهدة جميع المقالات
				</button>
			</div>
		</div>
	);
}
