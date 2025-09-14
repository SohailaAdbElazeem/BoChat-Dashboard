

// File: app/accounts/page.tsx
"use client";
import * as React from "react";
import CustomChart from "@/app/_components/CustomChart";
import AddAccountCard from "./_components/AddAccountCard";
import { Account } from "@/types/admin";
import AccountCard from "./_components/AccoundCard";
import SearchBar from "@/app/_components/SearchBar";

export default function AccountsPage() {
  const [accounts, setAccounts] = React.useState<Account[]>([
    { id: "1", email: "Abdallahsayed23@gmail.com", name: "عبدالله محمد", active: true },
    { id: "2", email: "user@example.com", name: "مستخدم آخر", active: true },
  ]);

  const handleDelete = (id: string) => setAccounts((prev) => prev.filter((x) => x.id !== id));
  const [query, setQuery] = React.useState<string>(''); // <-- مضافة

  return (
    <main className="p-6">
      <div className="mx-auto pl-[60px] grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-12">
        <section className="xl:col-span-4 md:col-span-1">
          {accounts.length === 0 ? (
            <></>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {accounts.map((acc) => (
                <AccountCard key={acc.id} account={acc} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </section>

        <section className="xl:col-span-5 md:col-span-1">
          <AddAccountCard
            onAdded={({ userid, rules }) => {
              setAccounts((prev) => [
                { id: userid, email: "—", name: "—", active: true },
                ...prev,
              ]);
              console.log("Added admin via API:", { userid, rules });
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
