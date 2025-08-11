import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    console.log("Received body from frontend:", body);
    const URL = process.env.BASE_URL
  try {
    const res = await fetch(`${URL}login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    console.log("Response from bo-chat.space:", data); 

    if (!res.ok) {
      return NextResponse.json(
        { message: data.message || "فشل تسجيل الدخول" },
        { status: res.status }
      );
    }

    return NextResponse.json({
      token: data.token,
      message: data.message || "تم تسجيل الدخول بنجاح",
    });
  } catch (err: unknown) {
    console.error("Caught error in API route:", err);
    return NextResponse.json(
      { message: "حدث خطأ في السيرفر الوسيط" },
      { status: 500 }
    );
  }
}
