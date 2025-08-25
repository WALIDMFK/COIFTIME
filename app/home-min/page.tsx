"use client";
import Image from "next/image";
import { useState } from "react";

export default function HomeMin() {
  const [showSearch, setShowSearch] = useState(false);
  const notifCount = 3;          // لإظهار الجرس
  const isSubscriber = false;    // لإظهار البانر

  return (
    <main className="mx-auto max-w-md">
      {/* Header (0,10) */}
      <header className="w-full h-14 bg-header flex items-center justify-between px-4">
        <button className="h-6 px-2 rounded-8 bg-btn">🌐</button>
        <div className="flex-1 flex justify-center">
          <Image src="/assets/logo.svg" alt="شعار" width={96} height={32} />
        </div>
        {notifCount > 0 ? (
          <button className="h-6 px-2 rounded-8 bg-btn">🔔</button>
        ) : <span className="w-6" />}
      </header>

      {/* زر فتح البحث (0,1) */}
      <div className="px-4 mt-4">
        <button
          onClick={() => setShowSearch(true)}
          className="w-full h-11 bg-[#1F1F1F] text-muted rounded-8 px-3"
        >
          🔍 ابحث عن صالون أو حلاق أو مدينة…
        </button>
      </div>

      {/* بانر الاشتراك (0,1) */}
      {!isSubscriber && (
        <div className="px-4 mt-3">
          <div className="w-full h-10 bg-banner text-text rounded-8 px-3 flex items-center">
            ✨ اشترك الآن بـ 3.89€
          </div>
        </div>
      )}

      {/* نافذة البحث (*,20) — اختبار بسيط */}
      {showSearch && (
        <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-start pt-10">
          <div className="w-[92%] max-w-md bg-white text-black rounded-8 p-4 shadow-soft">
            <input className="w-full h-10 border rounded-8 px-2" placeholder="ابحث عن صالون أو حلاق أو مدينة…" />
            <div className="mt-3 flex gap-2">
              <button className="flex-1 h-11 rounded-8 bg-blue-500 text-white">ابحث الآن</button>
              <button className="h-11 px-4 rounded-8 bg-gray-200" onClick={() => setShowSearch(false)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
