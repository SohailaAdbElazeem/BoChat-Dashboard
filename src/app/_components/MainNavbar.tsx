/* eslint-disable @next/next/no-img-element */
import ThemeToggle from "../_components/ThemeToggle"
import './css/MainNavbar.css'
function MainNavbar(){
    return(
        <nav className="py-[10px] flex justify-between items-center container">
                <div className="flex justify-between gap-20" >
                    <div className="bg-[#D72229] w-fit px-[15px] rounded-r-[20px] flex items-center justify-center">
                        <img src="/logo.png" width={35} alt="Logo" />
                    </div>
                    <div className="user-info rounded-[25px] bg-[#D72229] w-70 py-[8px] px-[25px]  relative" dir="rtl">
                        <p className="text-[#fff] text-[18px]">اسم المستخدم</p>
                        <p className="text-[#fff] text-[14px]">Abdallahsayed23@gmail.com</p>
                        <img src="/imgs/avatar.png" className="absolute img-avatar" width={50} alt="" />
                    </div>
                </div>
                <div className="px-10">
                    <ThemeToggle/>
                </div>
            </nav>
    )
}

export default MainNavbar