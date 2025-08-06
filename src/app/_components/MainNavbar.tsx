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
                <div className="px-10 flex gap-3 items-center">
                    <button className="flex items-center gap-1 px-3 py-2 rounded-full bg-red-100 text-red-600 text-sm font-medium">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.08 1.04l-4.25 4.65a.75.75 0 01-1.08 0l-4.25-4.65a.75.75 0 01.02-1.06z"
                            clipRule="evenodd"
                            />
                        </svg>
                        <span>AR</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 5v1.5a6.5 6.5 0 016.44 5.69l1.49-.19a8 8 0 00-7.93-6zM6.5 12A5.5 5.5 0 0112 6.5V5a7 7 0 100 14v-1.5A5.5 5.5 0 016.5 12zm8.57-1.56l-.66.75c.27.24.54.5.81.75-.33.39-.66.77-.96 1.14a19.5 19.5 0 01-2.23-2.89H13V9h-3v1.19H8.74v1.5h1.14a20.7 20.7 0 002.67 3.34l-.41.44c-.33.36-.71.78-1.12 1.2l1.08 1.04c.4-.43.8-.85 1.17-1.25l.36-.39a20 20 0 002.47 2.1l.81-1.35a17.7 17.7 0 01-2.1-1.9 15.6 15.6 0 001.27-1.5 17.2 17.2 0 001.7 2.21l.82-1.34a18.6 18.6 0 01-2.25-2.84z" />
                        </svg>
                        </button>

                    <ThemeToggle/>
                    <button
                        onClick={handleLogout}
                        className="bg-[#D72229] text-white px-4 py-1 rounded-[20px] hover:bg-red-700 transition"
                    >
                        تسجيل الخروج
                    </button>
                </div>
            </nav>
    )
}

export default MainNavbar