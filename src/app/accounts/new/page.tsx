// File: app/accounts/page.tsx
"use client";

import * as React from "react";
import CustomChart from "@/app/_components/CustomChart";
import AddAccountCard from "./_components/AddAccountCard";
import SearchBar from "@/app/_components/SearchBar";
import AccountCard, { Admin } from "./_components/AccoundCard";

const USER_ID = "6877d5497b04a3c83759f122";

// GET admins
const ADMINS_URL = `http://bo-chat.space/dashboard/admins${USER_ID}`;

// DELETE admin: ثابت + userid في الـ body
const DEL_ADMIN_URL = `http://bo-chat.space/dashboard/delAdmin${USER_ID}`;

export default function AccountsPage() {
  const [admins, setAdmins] = React.useState<Admin[]>([]);
  const [filtered, setFiltered] = React.useState<Admin[]>([]);
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const fetchAdmins = React.useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token in localStorage");

      const res = await fetch(ADMINS_URL, {
        method: "GET",
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const list: Admin[] = Array.isArray(json) ? json : json?.data ?? [];
      setAdmins(list);
      setFiltered(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  // فلترة بالاسم أو الـ userid
  React.useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) return setFiltered(admins);
    setFiltered(
      admins.filter(
        (a) =>
          a.username?.toLowerCase().includes(q) ||
          a.userid?.toLowerCase().includes(q)
      )
    );
  }, [query, admins]);

  const handleDelete = async (userid: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token in localStorage");

      const res = await fetch(DEL_ADMIN_URL, {
        method: "POST", // حسب وصفك
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userid }),
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${msg}`);
      }

      // نجاح: شيل الأدمن من الواجهة
      setAdmins((prev) => prev.filter((a) => a.userid !== userid));
      setFiltered((prev) => prev.filter((a) => a.userid !== userid));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6">
      <div className="mx-auto pl-[60px] grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-12">
        <section className="xl:col-span-4 md:col-span-1">
          {loading && !filtered.length ? (
            <div className="text-sm text-muted-foreground">جارٍ التحميل…</div>
          ) : filtered.length === 0 ? (
            <div className="text-sm text-muted-foreground">لا توجد نتائج.</div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {filtered.map((admin) => (
                <AccountCard
                  key={admin._id}
                  admin={admin}
                  onDelete={handleDelete}
                  loading={loading}
                />
              ))}
            </div>
          )}
        </section>

        <section className="xl:col-span-5 md:col-span-1">
          <AddAccountCard
            onAdded={({ userid, rules }) => {
              // إضافة متفائلة
              const optimistic: Admin = {
                _id: crypto.randomUUID(),
                useremail: "—",
                username: "—",
                userid,
                rules: rules ?? [],
              };
              setAdmins((prev) => [optimistic, ...prev]);
              setFiltered((prev) => [optimistic, ...prev]);
            }}
          />
        </section>

        <aside className="xl:col-span-3 hidden xl:block">
          <SearchBar
            value={query}
            onValueChange={setQuery}
            onSubmit={(val) => setQuery(val)}
            placeholder="اكتب ما تبحث عنه"
            dir="rtl"
            className="mb-2"
          />
          <CustomChart apiUrl={""} staticData1={[]} staticData2={[]} />

        </aside>
      </div>
    </main>
  );
}
