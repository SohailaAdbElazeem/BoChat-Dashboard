/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import FilterBar, { type Filters } from "../_components/FilterBar";
import RegistrationTable from "./_components/RegistrationTable";
import { type RegistrationRow } from "../_components/LastLogins";

const norm = (v: unknown) =>
  String(v ?? "")
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0640]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .normalize("NFKD");
  const token =
        localStorage.getItem("token") ||
        localStorage.getItem("auth_token") ||
        "";
function applyFilters(rows: RegistrationRow[], f: Filters) {
  const q = norm(f.query);
  return rows.filter((r) => {
    if (f.type && r.type !== f.type) return false;
    if (f.status && r.status !== f.status) return false;
    if (f.country && r.country !== f.country) return false;
    if (f.governorate && r.governorate !== f.governorate) return false;
    if (f.gender && r.gender !== f.gender) return false;
    if (f.role && r.role !== f.role) return false;

    if (!q) return true;
    const hay = norm(
      [
        r.userName,
        r.emailOrPhone,
        r.id,
        r.type,
        r.status,
        r.country,
        r.governorate,
        r.gender,
        r.role,
      ].join(" ")
    );
    return hay.includes(q);
  });
}

async function safeFetchJSON(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, init);
  const txt = await res.clone().text().catch(() => "");
  let data: any = {};
  try {
    data = txt ? JSON.parse(txt) : {};
  } catch {
  }
  if (!res.ok) {
    const reason = data?.message || data?.error || `Fetch failed ${res.status}`;
    throw new Error(reason);
  }
  return data ?? {};
}

const fromProvider = (p?: string): RegistrationRow["type"] => {
  const s = (p || "").toLowerCase();
  if (s.includes("google")) return "جوجل";
  if (s.includes("facebook")) return "فيسبوك";
  return "انشاء حساب";
};

function mapUserToRow(u: any, i: number): RegistrationRow {
  const status: RegistrationRow["status"] = u?.active ? "نشط" : "غير نشط";
  const gender: RegistrationRow["gender"] =
    u?.gender === 0 ? "ذكر" : u?.gender === 1 ? "أنثى" : "";

  return {
    no: u?._id,
    postImages: null,
    comments: null,
    likes: null,
    publishedAgo: null,
    avatar: u?.img || "/avatar-placeholder.png",
    views: null,
    postType: null,

    governorate: u?.city || "",
    gender,
    role: u?.case || "مستخدم",
    country: u?.country || "",

    id: u?._id || "—",
    index: i + 1,
    avatarUrl: u?.img || "/avatar-placeholder.png",
    userName: u?.username || u?.name || "—",
    // ما نعرضش useremail عشان هو hash — هنظهر الموبايل لو موجود
    emailOrPhone: (u?.phonenumber && String(u.phonenumber).trim()) || "—",
    type: fromProvider(u?.provider),
    birthDate: String(u?.dateofbirth || "—"),
    status,
  };
}

export default function UsersPage() {
  const [rows, setRows] = useState<RegistrationRow[]>([]);
  const [filters, setFilters] = useState<Filters>({ query: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const didRun = useRef(false);

  const filteredRows = useMemo(
    () => applyFilters(rows, filters),
    [rows, filters]
  );

  useEffect(() => {
      fetch("https://bo-chat.space/dashboard/users",{
        method: "GET",
        headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      }).then(res=> res.json())


    if (didRun.current) return;
    didRun.current = true;

    (async () => {
      setLoading(true);
      setErr(null);

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("auth_token") ||
        "";

      if (!token) {
        setErr("لا يوجد توكن في المتصفح.");
        setLoading(false);
        return;
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const endpoints = [
        "https://bo-chat.space/dashboard/users",
        "http://bo-chat.space/dashboard/users",
      ];
      try {
        let data: any = null;
        let lastErr: unknown = null;
        for (const url of endpoints) {
          try {
            data = await safeFetchJSON(url, {
              method: "GET",
              headers,
              mode: "cors",
            });
            break;
          } catch (e) {
            lastErr = e;
          }
        }
        if (!data && lastErr) throw lastErr;

        const list: any[] = Array.isArray(data?.response)
          ? data.response
          : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.users)
          ? data.users
          : Array.isArray(data)
          ? data
          : [];

        const mapped = list.map(mapUserToRow);

        setRows(mapped);
      } catch (e: any) {
        setErr(e?.message || "تعذر جلب المستخدمين");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="p-4" dir="rtl">
      <FilterBar rows={rows} filters={filters} onChange={setFilters} />

      {loading && (
        <div className="mt-3 rounded-xl bg-[#EDEDED] p-3 text-center text-sm text-gray-600">
          جاري التحميل…
        </div>
      )}
      {err && (
        <div className="mt-3 rounded-xl bg-red-50 p-3 text-center text-sm text-red-700">
          {err}
        </div>
      )}

      <div className="mt-4">
        <RegistrationTable rows={filteredRows} title="المستخدمون" />
      </div>
    </main>
  );
}
