"use client";
import { useMemo, useState } from "react";
import FilterBar, { Filters } from "../_components/FilterBar";
import RegistrationTable from "../_components/RegistrationTable";
import { RegistrationRow } from "../_components/LastLogins";

const norm = (v: unknown) =>
  String(v ?? "")
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0640]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .normalize("NFKD");

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

export default function UsersPage() {
  const [rows] = useState<RegistrationRow[]>([
    {
      id: "ID23896590",
      index: 1,
      userName: "احمد محمد",
      emailOrPhone: "boapp2023@gmail.com",
      birthDate: "1/8/2010",
      status: "نشط",
      type: "جوجل",
      country: "مصر",
      governorate: "لا يوجد",
      gender: "ذكر",
      role: "طالب",
      avatarUrl: "/avatar-placeholder.png",
    },
    {
      id: "ID23896590",
      index: 12,
      userName: "احمد محمد",
      emailOrPhone: "boapp2023@gmail.com",
      birthDate: "1/8/2010",
      status: "نشط",
      type: "جوجل",
      country: "مصر",
      governorate: "لا يوجد",
      gender: "ذكر",
      role: "طالب",
      avatarUrl: "/avatar-placeholder.png",
    },
    {
      id: "ID23896590",
      index: 13,
      userName: "احمد محمد",
      emailOrPhone: "boapp2023@gmail.com",
      birthDate: "1/8/2010",
      status: "نشط",
      type: "جوجل",
      country: "مصر",
      governorate: "لا يوجد",
      gender: "ذكر",
      role: "طالب",
      avatarUrl: "/avatar-placeholder.png",
    },
    {
      id: "ID23896590",
      index: 14,
      userName: "احمد محمد",
      emailOrPhone: "boapp2023@gmail.com",
      birthDate: "1/8/2010",
      status: "نشط",
      type: "جوجل",
      country: "مصر",
      governorate: "لا يوجد",
      gender: "ذكر",
      role: "طالب",
      avatarUrl: "/avatar-placeholder.png",
    },
    {
      id: "ID23896590",
      index: 15,
      userName: "احمد محمد",
      emailOrPhone: "boapp2023@gmail.com",
      birthDate: "1/8/2010",
      status: "نشط",
      type: "جوجل",
      country: "مصر",
      governorate: "لا يوجد",
      gender: "ذكر",
      role: "طالب",
      avatarUrl: "/avatar-placeholder.png",
    },
  ]);

  const [filters, setFilters] = useState<Filters>({ query: "" });
  const filteredRows = useMemo(
    () => applyFilters(rows, filters),
    [rows, filters]
  );

  return (
    <main className="p-4" dir="rtl">
      <FilterBar rows={rows} filters={filters} onChange={setFilters} />
      <div className="mt-4">
        <RegistrationTable rows={filteredRows} title="المستخدمون" />
      </div>
    </main>
  );
}
