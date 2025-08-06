/* eslint-disable @next/next/no-img-element */
import ThemeToggle from "../_components/ThemeToggle"
import './css/MainNavbar.css'
import { useRouter } from 'next/navigation';

function MainNavbar(){
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };
    return(
        <nav className="py-[10px] flex justify-between items-center">
                <div className="flex gap-[20px]" >
                    <div className="bg-[#D72229] w-fit px-[15px] rounded-r-[20px] flex items-center justify-center">
                        <img src="/logo.png" width={35} alt="Logo" />
                    </div>
                    <div className="user-info rounded-[25px] bg-[#D72229] w-75 py-[8px] px-[25px]  relative" dir="rtl">
                        <p className="text-[#fff] text-[18px]">اسم المستخدم</p>
                        <p className="text-[#fff] text-[14px]">Abdallahsayed23@gmail.com</p>
                        <img src="/imgs/avatar.png" className="absolute img-avatar" width={50} alt="" />
                    </div>
                </div>
                <div className="px-10 flex gap-3">
                    <ThemeToggle/>
                    <button
                        onClick={handleLogout}
                        className="bg-[#D72229] text-white px-4 py-2 rounded-[20px] hover:bg-red-700 transition"
                    >
                        تسجيل الخروج
                    </button>
                </div>
            </nav>
    )
}

export default MainNavbar