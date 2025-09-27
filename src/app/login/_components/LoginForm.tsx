'use client'

import { useState } from 'react';
import { CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import './css/LoginForm.css';
import { useRouter } from 'next/navigation';

function LoginForm() {
  const [useremail, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        throw new Error(data?.message || 'بيانات الدخول غير صحيحة !');
      }

      if (!data.token) {
        throw new Error('التوكن غير موجود في الرد!');
      }

      localStorage.setItem('token', data.token);
      setSuccessMsg('تم تسجيل الدخول بنجاح !');
      
      setTimeout(() => {
        router.push('/');
      }, 2000);

    } catch (err: unknown) {
      setErrorMsg(err.message || 'فشل تسجيل الدخول !');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      {successMsg && (
        <Alert variant="default" dir="rtl" className="bg-green-500 rounded-[50px] border border-green w-fit absolute right-[10px] top-[100px]">
          <CheckCircle className="h-4 w-4 !text-white" />
          <AlertDescription className="text-[#fff]">{successMsg}</AlertDescription>
        </Alert>
      )}
      {errorMsg && (
        <Alert variant="destructive" dir="rtl" className="w-[350] bg-red-500 rounded-[50px] absolute right-[10px] top-[100px]">
          <XCircle className="h-4 w-4 !text-white" />
          <AlertDescription className="!text-[#fff]">{errorMsg}</AlertDescription>
        </Alert>
      )}
      
      <div className="relative w-full max-w-[500px]">
        <div className="absolute inset-0 bg-[#D7222926] w-[580] rounded-[14px] translate-x-[-40px] translate-y-[50px] -z-10 hide-this"></div>
        <div className="login-wrapper bg-white p-8 sm:p-[60px] relative rounded-[14px] -md flex flex-col items-center gap-6">
          <h1 className="text-[#D72229] text-[22px]">تسجيل الدخول</h1>
          <form dir="rtl" className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              value={useremail}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-[#8989a28c] px-4 pr-[30px] rounded-[14px] w-full h-[55px] focus:outline-none focus:ring-2 focus:ring-[#D7222926] focus:border-[#D72229] dark:placeholder:text-[#000]"
              placeholder="الإيميل"
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} // يتم تغيير الـ type بين text و password بناءً على الحالة
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-[#8989a28c] px-4 pr-[30px] rounded-[14px] w-full h-[55px] focus:outline-none focus:ring-2 focus:ring-[#D7222926] focus:border-[#D72229] dark:placeholder:text-[#000]"
                placeholder="كلمة السر"
                required
              />
              <div
                className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="text-gray-500 h-5 w-5 transition-all duration-300" />
                ) : (
                  <Eye className="text-gray-500 h-5 w-5 transition-all duration-300" />
                )}
              </div>
            </div>

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
