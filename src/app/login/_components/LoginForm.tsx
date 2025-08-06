/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import './css/LoginForm.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle } from 'lucide-react';

function LoginForm() {
  const [useremail, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await fetch('https://bo-chat.space/dashboard/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          useremail,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'بيانات الدخول غير صحيحة');
      }

      if (!data.token) {
        throw new Error('التوكن غير موجود في الرد');
      }

      localStorage.setItem('token', data.token);
      setSuccessMsg('تم تسجيل الدخول بنجاح!');
      
      // بعد 2 ثانية يروح لـ /home
      setTimeout(() => {
        router.push('/');
      }, 2000);

    } catch (err: any) {
      setErrorMsg(err.message || 'فشل تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="relative w-full max-w-[500px]">
        <div className="absolute inset-0 bg-[#D7222926] w-[600px] rounded-[14px] translate-x-[-50px] translate-y-[50px] -z-10 hide-this"></div>

        <div className="login-wrapper bg-white p-8 sm:p-[60px] relative rounded-[14px] shadow-md flex flex-col items-center gap-6">
          <h1 className="text-[#D72229] text-[22px]">تسجيل الدخول</h1>

          {successMsg && (
            <Alert variant="default" className="w-full bg-green-100 border border-green-500 text-green-700">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>تم بنجاح</AlertTitle>
              <AlertDescription>{successMsg}</AlertDescription>
            </Alert>
          )}

          {errorMsg && (
            <Alert variant="destructive" className="w-full">
              <AlertTitle>خطأ</AlertTitle>
              <AlertDescription>{errorMsg}</AlertDescription>
            </Alert>
          )}

          <form dir="rtl" className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              value={useremail}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-[#8989a28c] px-4 pr-[30px] rounded-[14px] w-full h-[55px] focus:outline-none focus:ring-2 focus:ring-[#D7222926] focus:border-[#D72229]"
              placeholder="الإيميل"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-[#8989a28c] px-4 pr-[30px] rounded-[14px] w-full h-[55px] focus:outline-none focus:ring-2 focus:ring-[#D7222926] focus:border-[#D72229]"
              placeholder="كلمة السر"
              required
            />

            <button
              type="submit"
              className="bg-[#D72229] text-white w-full h-[55px] rounded-[14px]"
              disabled={loading}
            >
              {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
