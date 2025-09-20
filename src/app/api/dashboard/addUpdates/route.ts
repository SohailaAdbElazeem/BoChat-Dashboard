import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // لو محتاج
export async function POST(req: NextRequest) {
  try {
    // التحقق من التوكن من الهيدر
    const auth = req.headers.get('authorization') || '';
    if (!auth?.toLowerCase().startsWith('bearer ')) {
      return NextResponse.json({ message: 'Unauthorized: missing token' }, { status: 401 });
    }

    // استلم الـ FormData من العميل
    const form = await req.formData();

    // ابعت للأبستريم (غيّر للـ https لو متاح)
    const upstream = await fetch('http://bo-chat.space/dashboard/update-app', {
      method: 'POST',
      headers: { Authorization: auth }, // مرر نفس التوكن
      body: form,
    });

    const text = await upstream.text();
    if (!upstream.ok) {
      // مرر الرسالة الحرفية للمساعدة في الديبج
      return new NextResponse(text || 'Upstream error', { status: upstream.status });
    }

    return new NextResponse(text, { status: 200 });
  } catch (err:any) {
    return NextResponse.json({ message: err?.message || 'Proxy failed' }, { status: 500 });
  }
}
