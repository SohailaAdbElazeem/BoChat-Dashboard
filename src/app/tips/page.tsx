/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import CustomChart from '../_components/CustomChart';

type Post = {
  _id: string;
  body: string;
  media?: string;
  title?: string;
  timestamp: string | Date;
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') ?? '' : '';

  const niceTime = (d: string | Date) =>
    new Date(d).toLocaleString('ar-EG', { hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit' });

  // جلب التحديثات (انت عامله بروكسي /api/dashboard/updates)
  useEffect(() => {
    if (!token) return;
    const run = async () => {
      try {
        const url = new URL('/api/dashboard/updates', window.location.origin);
        url.searchParams.set('userid', '6877d5497b04a3c83759f122');
        url.searchParams.set('token', token);

        const res = await fetch(url.toString(), { method: 'GET' });
        const text = await res.text();
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);
        const data = JSON.parse(text) as Post[];
        setPosts(data);
      } catch (e) {
        console.error(e);
      }
    };
    run();
  }, [token]);

  const submitDisabled = useMemo(() => !title.trim() && !body.trim() && !file, [title, body, file]);

  const handleAddPost = async () => {
    try {
      if (!token) throw new Error('missing token');

      const fd = new FormData();
      if (body.trim()) fd.append('message', body.trim());
      if (title.trim()) fd.append('title', title.trim());
      if (file) fd.append('file', file); // form-data file

      // لو السيرفر مفعّل CORS كويس، تقدر تبعته مباشرة:
      const res = await fetch('http://bo-chat.space/dashboard/update-app', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        } as any,
        body: fd,
      });

      const text = await res.text();
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);

      // لو الـ API بيرجع العنصر المضاف، استخدمه:
      let created: Post | null = null;
      try { created = JSON.parse(text); } catch {}
      if (created && created._id) {
        setPosts((p) => [created!, ...p]);
      } else {
        // fallback: أضف بوست محلي مؤقت
        setPosts((p) => [
          {
            _id: crypto.randomUUID(),
            title: title || undefined,
            body: body || '',
            media: imageUrl,
            timestamp: new Date().toISOString(),
          },
          ...p,
        ]);
      }

      // نظّف الفورم
      setTitle('');
      setBody('');
      setFile(null);
      setImageUrl(undefined);
      if (fileRef.current) fileRef.current.value = '';
    } catch (e) {
      console.error('post failed:', e);
      alert('فشل إرسال المنشور');
    }
  };

  const handleDelete = async (id: string) => {
    setPosts((p) => p.filter((x) => x._id !== id)); // كان x.id غلط
    // TODO: نداء حذف لو عندك API للحذف
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) setImageUrl(URL.createObjectURL(f));
    else setImageUrl(undefined);
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto px-4 py-8 pl-[80px]">
        <div className="grid grid-cols-1 gap-9 lg:grid-cols-12">
          {/* القائمة اليمنى: البوستات */}
          <aside className="lg:col-span-4">
            <div className="space-y-6 pl-[40px] max-h-[100vh] overflow-scroll scrollbar-hidden">
              {posts.length === 0 ? (
                <div className="p-6 text-center font-bold text-[#D72229]">لا توجد بوستات حالياً</div>
              ) : (
                posts.map((post) => (
                  <div key={post._id} className="bg-[#F6F6F6] rounded-[34px] p-4 ">
                    <div className="text-center text-[#D72229] my-2">البوست</div>
                    <p className="text-[#8989A2] leading-7 mb-4 bg-[#E6E6E6] p-3 rounded-[18px]" dir="rtl">
                      {post.title || '—'}
                    </p>
                    <p className="text-[#8989A2] leading-7 mb-4 bg-[#E6E6E6] p-3 rounded-[18px]" dir="rtl">
                      {post.body || '—'}
                    </p>

                    <div className="flex items-center bg-[#E6E6E6] gap-3 rounded-[18px] p-3">
                      <div className="flex-1 text-s text-gray-400">تم النشر {niceTime(post.timestamp)}</div>

                      {post.media && (
                        <div className="w-25 h-30 overflow-hidden rounded-[5px]">
                          <Image src={post.media} alt="post" width={100} height={100} className="object-cover w-full h-full" />
                        </div>
                      )}
                    </div>
                    <div className="d-flex items-center justify-center px-[50px] py-3">
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="mt-4 w-full rounded-[18px] bg-[#D72229] text-white py-3 text-sm hover:opacity-90"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>

          {/* الفورم */}
          <section className="lg:col-span-5" dir="rtl">
            <div className="bg-[#F6F6F6] rounded-[40px] p-6">
              <h2 className="text-center text-[#D72229] text-xl font-bold mb-6">إضافة بوست في قسم النصائح</h2>

              <div className="mb-6">
                <label className="block mb-2 text-[#8989A2]">العنوان</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="اكتب عنوان المنشور"
                  className="w-full !h-[50px] rounded-2xl p-4 outline-none border-0 bg-[#E6E6E6]"
                />
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-[#8989A2]">المحتوى</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="اكتب ما تريد نشره"
                  className="w-full !h-[200px] rounded-2xl p-4 outline-none border-0 bg-[#E6E6E6] resize-none"
                />
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-[#8989A2]">ارفع صورة</label>
                <div className="flex gap-4 bg-[#E6E6E6] h-[180px] p-2 rounded-[18px]">
                  <label className="w-40 h-full rounded-2xl bg-white flex flex-col items-center justify-center cursor-pointer">
                    <div className="bg-[#d722294d] w-[60px] h-[60px] flex items-center justify-center rounded-full">
                      <img src="/imgs/Vector.svg" width={30} alt="icon" />
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
                  </label>
                  <div className="flex-1 rounded-[18px] flex items-center justify-center ">
                    {imageUrl ? (
                      <Image src={imageUrl} alt="preview" width={200} height={160} className="object-contain rounded-[18px]" />
                    ) : (
                      <span className="text-gray-400">لا توجد صورة (اختياري)</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-[70px]">
                <button
                  disabled={submitDisabled}
                  onClick={handleAddPost}
                  className="block mx-auto w-full rounded-[20px] bg-[#D72229] text-white px-10 py-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  إضافة منشور
                </button>
              </div>
            </div>
          </section>

          <aside className="lg:col-span-3">
            <CustomChart apiUrl={''} staticData1={[]} staticData2={[]}/>
          </aside>
        </div>
      </div>
    </main>
  );
}
