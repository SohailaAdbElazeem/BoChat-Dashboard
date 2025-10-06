/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import CustomChart from '../_components/CustomChart';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const fileRef = useRef<HTMLInputElement | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') ?? '' : '';

  const niceTime = (d: string | Date) =>
    new Date(d).toLocaleString('ar-EG', { hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit' });
const apiURL = process.env.NEXT_PUBLIC_API_BASE
const adminId = localStorage.getItem("userid")
  // === جلب التحديثات ===
  useEffect(() => {
    if (!token) return;

    fetch(`${apiURL}/dashboard/get-app-updates/${adminId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const text = await res.text();
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);
        return JSON.parse(text) as Post[];
      })
      .then((data) => setPosts(data))
      .catch((e) => console.error(e));
  }, [token]);

  const submitDisabled = useMemo(() => !title.trim() && !body.trim() && !file, [title, body, file]);

  const handleAddPost = async () => {
    try {
      if (!token) throw new Error('missing token');

      const fd = new FormData();
      if (body.trim()) fd.append('message', body.trim());
      if (title.trim()) fd.append('title', title.trim());
      if (file) fd.append('file', file);

      const res = await fetch(`${apiURL}/dashboard/update-app`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` } as any,
        body: fd,
      });

      const text = await res.text();
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);

      let created: Post | null = null;
      try { created = JSON.parse(text); } catch {}

      if (created && created._id) {
        setPosts((p) => [created!, ...p]);
      } else {
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

      setTitle('');
      setBody('');
      setFile(null);
      setImageUrl(undefined);
      if (fileRef.current) fileRef.current.value = '';
    } catch (e) {
      console.error('post failed:', e);
      alert('فشل إرسال المنشور');
    }
    window.location.reload();
  };

  // === Utils للحذف ===
  function decodeJwt<T = any>(t: string): T | null {
    try {
      const [, p] = t.split('.');
      if (!p) return null;
      const json = JSON.parse(atob(p.replace(/-/g, '+').replace(/_/g, '/')));
      return json as T;
    } catch { return null; }
  }

  async function tryFetch(url: string, init: RequestInit) {
    const res = await fetch(url, init);
    const text = await res.text();
    return { ok: res.ok, status: res.status, text };
  }

  // === حذف البوست (مع fallback formats) ===
  const handleDelete = async (id: string) => {
    if (!token) {
      alert('مفقود التوكن');
      return;
    }

    const payload = decodeJwt<any>(token) || {};
    const adminIdFromToken =
      payload.adminid || payload.adminId || payload.userId || payload.userid || payload.id || null;

    const adminId =
      (typeof window !== 'undefined' ? localStorage.getItem('userid') : null) ||
      adminIdFromToken ||
      ''; // بدّلها لو عندك قيمة مؤكدة

    // optimistic update
    setDeletingIds((prev) => new Set(prev).add(id));
    const prevPosts = posts;
    setPosts((p) => p.filter((x) => x._id !== id));

    const url = `${apiURL}/dashboard/del-app-update`;

    try {
      // 1) DELETE + JSON
      let resp = await tryFetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({ adviceid: id, adminid: adminId }),
      });

      // 2) DELETE + x-www-form-urlencoded
      if (!resp.ok && /invalid data/i.test(resp.text)) {
        const formBody = new URLSearchParams({ adviceid: id, adminid: String(adminId) }).toString();
        resp = await tryFetch(url, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formBody,
        });
      }

      // 3) POST (إذا السيرفر بيقبل POST لنفس الراوت)
      if (!resp.ok && /invalid data/i.test(resp.text)) {
        resp = await tryFetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: JSON.stringify({ adviceid: id, adminid: adminId }),
        });
      }

      if (!resp.ok) {
        console.error('delete failed:', resp.status, resp.text);
        setPosts(prevPosts); // rollback
        throw new Error(`HTTP ${resp.status}: ${resp.text}`);
      }
    } catch (e) {
      console.error(e);
      alert('فشل حذف المنشور');
      setPosts(prevPosts); // rollback لو حصل خطأ
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        window.location.reload();
        return next;
      });
    }
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
          <aside className="lg:col-span-4">
            <div className="space-y-6 pl-[40px] max-h-[100vh] overflow-scroll scrollbar-hidden">
              {posts.length === 0 ? (
                <div className="p-6 text-center font-bold text-[#D72229]">لا توجد بوستات حالياً</div>
              ) : (
                posts.map((post) => {
                  const isDeleting = deletingIds.has(post._id);
                  return (
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
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              disabled={isDeleting}
                              className="mt-4 w-full rounded-[18px] bg-[#D72229] text-white py-3 text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isDeleting ? '... جاري الحذف' : 'حذف'}
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className='!z-9999999999999999' >
                            <AlertDialogHeader >
                              <AlertDialogTitle className='text-end'>تأكيد الحذف</AlertDialogTitle>
                              <AlertDialogDescription  className='text-end'>
                                هل أنت متأكد أنك تريد حذف هذا المنشور؟ لا يمكن التراجع بعد ذلك.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter  className='!gap-1 '> 
                              <AlertDialogCancel className='cursor-pointer '>إلغاء</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(post._id)} className='bg-[#D72229] cursor-pointer'>
                                تأكيد الحذف
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                      </div>
                    </div>
                  );
                })
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
                  className="w-full !ه-[50px] rounded-2xl p-4 outline-none border-0 bg-[#E6E6E6]"
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
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      disabled={submitDisabled}
                      className="block mx-auto w-full rounded-[20px] bg-[#D72229] text-white px-10 py-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      إضافة منشور
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className='text-end'>تأكيد الإضافة</AlertDialogTitle>
                      <AlertDialogDescription className='text-end'>
                        هل تريد بالتأكيد إضافة هذا المنشور؟
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className='cursor-pointer '>إلغاء</AlertDialogCancel>
                      <AlertDialogAction onClick={handleAddPost} className='bg-[#D72229] cursor-pointer '>
                        تأكيد الإضافة
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </section>

          <aside className="lg:col-span-3">
            <CustomChart apiUrl={''} staticData1={[]} staticData2={[]} />
          </aside>
        </div>
      </div>
    </main>
  );
}
