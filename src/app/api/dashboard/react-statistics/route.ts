/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/dashboard/react-statistics/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
  const URL = process.env.NEXT_PUBLIC_API_BASE

export async function GET(req: Request) {
  try {
    // مرّر الهيدرز اللي ممكن يحتاجها الـ API
    const inHeaders = new Headers(req.headers);
    const auth =
      inHeaders.get("authorization") || inHeaders.get("Authorization") || "";

    // بعض الـ APIs بتستخدم مفاتيح مختلفة
    const xApiKey = inHeaders.get("x-api-key") || "";
    const xAccessToken = inHeaders.get("x-access-token") || "";
    const cookie = inHeaders.get("cookie") || "";

    // أحيانًا بعض السيرفرات تحتاج User-Agent/Origin
    const upstreamHeaders: HeadersInit = {
      Accept: "application/json",
      ...(auth ? { Authorization: auth } : {}),
      ...(xApiKey ? { "x-api-key": xApiKey } : {}),
      ...(xAccessToken ? { "x-access-token": xAccessToken } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
      // اختياريًا:
      "User-Agent":
        "BoDashProxy/1.0 (+https://localhost) Next.js runtime",
      Origin: "http://localhost:3000",
      Referer: "http://localhost:3000/",
    };

    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 10000); // timeout 10s

    const upstream = await fetch(`${URL}/reactStatistics`, {
      method: "GET",
      headers: upstreamHeaders,
      cache: "no-store",
      signal: controller.signal,
    }).catch((e) => {
      throw new Error("Network/resolve error: " + e.message);
    });
    clearTimeout(t);

    // نقرأ البودي كنص علشان نبعته كما هو لو فيه رسالة خطأ
    const text = await upstream.text();

    // رجّع نفس الحالة من السيرفر الأصلي (بدل ما نثبّت 502)
    // وحاول نحافظ على الـ JSON لو فعلاً JSON
    const contentType = upstream.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      try {
        const json = JSON.parse(text);
        return NextResponse.json(json, {
          status: upstream.status,
        });
      } catch {
        // لو فشل الـ parse نرجّعه كـ نص
      }
    }

    return new NextResponse(text, {
      status: upstream.status,
      headers: { "content-type": contentType || "text/plain" },
    });
  } catch (e: any) {
    // أخطاء مستوى الشبكة/timeout
    return NextResponse.json(
      {
        error: "Proxy failed before upstream response",
        details: e.message,
      },
      { status: 502 }
    );
  }
}
