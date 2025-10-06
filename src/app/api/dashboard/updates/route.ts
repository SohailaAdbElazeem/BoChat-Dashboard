/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import http from "http"; // لأن الـ upstream http مش https
// لو كان https: import https from "https";

export const runtime = "nodejs"; // مهم
  const apiURL = process.env.NEXT_PUBLIC_API_BASE

function getWithBody(urlStr: string, headers: Record<string, string>, bodyObj: any) {
  return new Promise<{ status: number; text: string }>((resolve, reject) => {
    const url = new URL(urlStr);

    const body = JSON.stringify(bodyObj);
    const options: http.RequestOptions = {
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port || (url.protocol === "https:" ? 443 : 80),
      path: url.pathname + url.search,
      method: "GET", 
      headers: {
        ...headers,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body).toString(),
      },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve({ status: res.statusCode || 500, text: data }));
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userid = searchParams.get("userid");
    const token  = searchParams.get("token"); 

    if (!userid || !token) {
      return NextResponse.json({ err: "missing userid or token" }, { status: 400 });
    }

    const upstreamUrl = `${apiURL}/dashboard/get-app-updates`;

    const { status, text } = await getWithBody(
      upstreamUrl,
      { Authorization: `Bearer ${token}` },
      { userid }
    );

    return new NextResponse(text, {
      status,
      headers: { "content-type": "application/json" },
    });
  } catch (e: any) {
    return NextResponse.json({ err: String(e?.message || e) }, { status: 500 });
  }
}
