'use client';
import './css/LoginForm.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('https://bo-chat.space/dashboard/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),

      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'حدث خطأ أثناء تسجيل الدخول');
      }

      // ✅ تسجيل ناجح - اعمل redirect أو حفظ token
      alert('تم تسجيل الدخول بنجاح!');
      // ممكن تستخدم router.push() أو window.location.href
        router.push('/home');

    } catch (err: unknown) {
      setErrorMsg(err.message);
      // console.log(err)
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

          <form dir="rtl" className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-[#8989a28c] px-4 pr-[30px] rounded-[14px] w-full h-[55px] focus:outline-none focus:ring-2 focus:ring-[#D7222926] focus:border-[#D72229]"
              placeholder="الاسم أو الإيميل"
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

            {errorMsg && (
              <p className="text-red-600 text-sm text-center mt-2">{errorMsg}</p>
            )}

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
