'use client';

import React, { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import CustomChart from '../_components/CustomChart';
import { ImagePlus, PictureInPicture2Icon } from 'lucide-react';

type Post = {
  id: string;
  description: string;
  imageUrl?: string;
  author?: string;
  createdAt: Date;
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [desc, setDesc] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const niceTime = (d: Date) =>
    d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

  const submitDisabled = useMemo(
    () => !desc.trim() && !imageUrl,
    [desc, imageUrl]
  );

  const handleAddPost = async () => {
    const newPost: Post = {
      id: crypto.randomUUID(),
      description: desc.trim(),
      imageUrl,
      author: 'الناشر: عبد الله سيد',
      createdAt: new Date(),
    };
    setPosts((p) => [newPost, ...p]);
    setDesc('');
    setImageUrl(undefined);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleDelete = async (id: string) => {
    setPosts((p) => p.filter((x) => x.id !== id));
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setImageUrl(url);
    // لاحقًا: ارفعها للـ API واحفظ الـ URL الحقيقي
  };

  return (
    <main  className="min-h-screen bg-white">
      <div className="mx-auto px-4 py-8 pl-[80px]">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          
          <aside className="lg:col-span-3">
            <div className="bg-[#F6F6F6] rounded-[40px] p-5 space-y-6">
              <div className="text-center text-[#C51918] ">البوستات</div>

              {posts.length === 0 ? (
                <div className="rounded-3xl bg-white p-6 text-center text-gray-500">
                  لا توجد بوستات حالياً
                </div>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="bg-white rounded-3xl p-4">
                    <p className="text-gray-700 leading-7 mb-4">
                      {post.description || '—'}
                    </p>

                    <div className="flex items-center gap-3 rounded-2xl border border-[#4ED5FF] p-3">
                      <div className="flex-1">
                        <div className="text-sm text-gray-700">{post.author}</div>
                        <div className="text-xs text-gray-400">
                          تم النشر {post.createdAt.toLocaleDateString('ar-EG', { month:'long'})} — {niceTime(post.createdAt)}
                        </div>
                      </div>

                      {post.imageUrl && (
                        <div className="w-20 h-28 overflow-hidden rounded-lg border">
                          <Image
                            src={post.imageUrl}
                            alt="post"
                            width={80}
                            height={112}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleDelete(post.id)}
                      className="mt-4 w-full rounded-full bg-[#E51C1A] text-white py-2 text-sm hover:opacity-90"
                    >
                      حذف
                    </button>
                  </div>
                ))
              )}
            </div>
          </aside>

          <section className="lg:col-span-6">
            <div className="bg-[#F6F6F6] rounded-[40px] p-6">
              <h2 className="text-center text-[#C51918]  text-xl mb-6">
                إضافة بوست في قسم النصائح
              </h2>

              <div className="mb-6">
                <label className="block mb-2 text-gray-600">الوصف</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="اكتب ما تريد نشره"
                  className="w-full !h-[200px] rounded-2xl p-4 outline-none border-0 bg-white resize-none"
                />
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-gray-600">ارفع صورة</label>
                <div className="flex gap-4">
                  <div className="flex-1 rounded-2xl bg-white p-4 flex items-center justify-center max-h-28">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt="preview"
                        width={100}
                        height={100}
                        className="object-contain max-h-60"
                      />
                    ) : (
                      <span className="text-gray-400">لا توجد صورة (اختياري)</span>
                    )}
                  </div>

                  <label className="w-32 h-28 rounded-2xl bg-white border-dashed border flex flex-col items-center justify-center cursor-pointer">
                    <div className='bg-[#d722294d] w-[50px] h-[50px] flex items-center justify-center rounded-full'>
                      <ImagePlus className='text-white'/>
                    </div>

                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onFileChange}
                    />
                  </label>
                </div>
              </div>

              <button
                disabled={submitDisabled}
                onClick={handleAddPost}
                className="block mx-auto rounded-full bg-[#C51918] text-white px-10 py-3 text-sm disabled:opacity-50"
              >
                إضافة منشور
              </button>
            </div>
          </section>

          <aside className="lg:col-span-3">
            <CustomChart />
          </aside>
        </div>
      </div>
    </main>
  );
}
