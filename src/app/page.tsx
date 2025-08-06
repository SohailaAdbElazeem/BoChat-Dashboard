'use client';
import MainNavbar from './_components/MainNavbar';
import SideBar from './_components/SideBar';
import MainPage from './home/page'
export default function Home() {
  return (
    <div>
      <MainNavbar/>
      <MainPage/>
      <SideBar />
    </div>
  );
}
