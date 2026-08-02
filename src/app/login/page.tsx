/* eslint-disable @next/next/no-img-element */
'use client';

import ThemeToggle from "../_components/ThemeToggle";
import LoginForm from "./_components/LoginForm";


export default function LoginPage() {
    return (
        // <main className="h-[100vh]">
        //     <nav className="container py-[10] px-4 sm:px-8 md:px-16 mx-auto flex items-center justify-between ">
        //         <a href={"/"}>
        //         <img src="/BO CHAT.SVG" alt="Bo Chat"  className="mb-1"/>
        //         <img src="/DASHBOARD.SVG" alt="Dashboard" />
        //         </a>
        //         <ThemeToggle/>
        //     </nav>
            
        //     <LoginForm/>
        //     <footer className="text-center absolute left-[50%] bottom-[15px] translate-x-[-50%]">
        //         <h4>هذا النظام يتم ادارته بواسطة شركة <span className="text-[#D72229]">باندا اوراكل</span></h4>
        //     </footer>
        // </main>

        <main className="h-screen overflow-hidden pt-4">
        <nav className="container px-4 sm:px-8 md:px-16 mx-auto flex items-center justify-between">
            <a href="/">
            <img src="/BO CHAT.SVG" alt="Bo Chat" className="mb-1" />
            <img src="/DASHBOARD.SVG" alt="Dashboard" />
            </a>

            <ThemeToggle />
        </nav>

        <LoginForm />

        <footer className="text-center absolute left-1/2 bottom-4 -translate-x-1/2">
            <h4>
            هذا النظام يتم ادارته بواسطة شركة
            <span className="text-[#D72229]"> باندا اوراكل</span>
            </h4>
        </footer>
        </main>
    );
}
