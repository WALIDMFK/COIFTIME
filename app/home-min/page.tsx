"use client";
import Image from "next/image";
import { useMemo, useState } from "react";

/** أنواع العناصر داخل المفضلة */
type FavKind = "حلاق" | "صالون" | "مدينة";

type FavoriteItem = {
  id: string;
  النوع: FavKind;
  الاسم: string;
  الموقع: string;
  التقييم: number; // 0..5
  الصورة?: string; // مسار الصورة إن وُجد
  عدد_الحلاقين?: number; // للصالون
  سنوات_الخبرة?: number; // للحلاق
  عدد_الصالونات?: number; // للمدينة
};

/** بيانات وهمية للتجربة */
const SEED: FavoriteItem[] = [
  {
    id: "br1",
    النوع: "حلاق",
    الاسم: "يوسف الحلاق",
    الموقع: "بانتان، باريس",
    التقييم: 4.7,
    سنوات_الخبرة: 6,
  },
  {
    id: "sl1",
    النوع: "صالون",
    الاسم: "صالون الراحة",
    الموقع: "6 Rue Souton 93500",
    التقييم: 4.5,
    عدد_الحلاقين: 5,
  },
  {
    id: "ct1",
    النوع: "مدينة",
    الاسم: "بانتان",
    الموقع: "Île-de-France",
    التقييم: 4.2,
    عدد_الصالونات: 18,
  },
  {
    id: "sl2",
    النوع: "صالون",
    الاسم: "Salon ProCut",
    الموقع: "Le Pré-Saint-Gervais",
    التقييم: 4.9,
    عدد_الحلاقين: 7,
  },
];

const TABS: FavKind[] | ["الكل"] = ["حلاق", "صالون", "مدينة", "الكل"] as any;

/** مكوّن بطاقة موحّدة المقاس */
function FavoriteCard({
  item,
  onRemove,
  onBook,
  onOpen,
  onMap,
}: {
  item: FavoriteItem;
  onRemove: (id: string) => void;
  onBook: (id: string) => void;
  onOpen: (id: string) => void;
  onMap: (id: string) => void;
}) {
  const {
    id,
    النوع,
    الاسم,
    الموقع,
    التقييم,
    الصورة,
    عدد_الحلاقين,
    سنوات_الخبرة,
    عدد_الصالونات,
  } = item;

  /** سطر وصف إضافي حسب النوع */
  const secondaryLine =
    النوع === "صالون"
      ? `عدد الحلاقين: ${عدد_الحلاقين ?? 0}`
      : النوع === "حلاق"
      ? `سنوات الخبرة: ${سنوات_الخبرة ?? 0}`
      : `عدد الصالونات: ${عدد_الصالونات ?? 0}`;

  return (
    <div className="w-full bg-[#111111] rounded-8 p-3 flex gap-3 items-center shadow-soft">
      {/* الصورة (بلاسيهولدر موحّد) */}
      <div className="relative w-16 h-16 rounded-8 overflow-hidden bg-[#1F1F1F] shrink-0">
        <Image
          src={الصورة ?? "/assets/logo.svg"}
          alt={`${الاسم} - صورة`}
          fill
          sizes="64px"
          className="object-contain p-2"
        />
      </div>

      {/* النصوص */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm px-2 py-0.5 bg-[#222] rounded-8">{النوع}</span>
          <span className="text-xs text-[#FBBF24]">★ {التقييم.toFixed(1)}</span>
        </div>
        <div className="font-medium mt-1 truncate">{الاسم}</div>
        <div className="text-sm text-[#9CA3AF] truncate">{الموقع}</div>
        <div className="text-xs text-[#D1D5DB] mt-0.5">{secondaryLine}</div>

        {/* الأزرار */}
        <div className="flex flex-wrap gap-2 mt-3">
          {(النوع === "حلاق" || النوع === "صالون") && (
            <button
              onClick={() => onBook(id)}
              className="h-9 px-3 rounded-8 bg-blue-600 hover:bg-blue-500 text-white"
            >
              حجز
            </button>
          )}

          {النوع === "مدينة" && (
            <button
              onClick={() => onOpen(id)}
              className="h-9 px-3 rounded-8 bg-[#1F2937] hover:bg-[#374151] text-white"
            >
              عرض
            </button>
          )}

          <button
            onClick={() => onMap(id)}
            className="h-9 px-3 rounded-8 bg-[#1F1F1F] hover:bg-[#2A2A2A] text-white border border-white/10"
          >
            📍 عرض على الخريطة
          </button>

          <button
            onClick={() => onRemove(id)}
            className="h-9 px-3 rounded-8 bg-[#DC2626] hover:bg-[#EF4444] text-white"
          >
            إزالة من المفضلة
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState<"حلاق" | "صالون" | "مدينة" | "الكل">(
    "الكل"
  );
  const [items, setItems] = useState<FavoriteItem[]>(SEED);

  const filtered = useMemo(() => {
    if (activeTab === "الكل") return items;
    return items.filter((i) => i.النوع === activeTab);
  }, [activeTab, items]);

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };
  const bookItem = (id: string) => {
    console.log("حجز:", id);
    alert("جارٍ فتح صفحة الحجز…");
  };
  const openItem = (id: string) => {
    console.log("فتح:", id);
    alert("جارٍ فتح التفاصيل…");
  };
  const mapItem = (id: string) => {
    console.log("خريطة:", id);
    alert("جارٍ فتح الخريطة…");
  };

  return (
    <main className="mx-auto max-w-md min-h-screen text-white">
      {/* Header مماثل للهوم */}
      <header className="w-full h-14 bg-[#111111] flex items-center justify-between px-4">
        <button className="h-6 px-2 rounded-8 bg-[#222222]">🌐</button>
        <div className="flex-1 flex justify-center">
          <Image src="/assets/logo.svg" alt="شعار" width={96} height={32} />
        </div>
        <button className="h-6 px-2 rounded-8 bg-[#222222]">🔔</button>
      </header>

      {/* شريط تنقل (تبويبات) */}
      <nav className="bg-[#0E0E0E] px-3 py-3 sticky top-0 z-10">
        <div className="grid grid-cols-4 gap-2">
          {TABS.map((tab: any) => {
            const selected = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`h-10 rounded-8 text-sm ${
                  selected
                    ? "bg-white text-black"
                    : "bg-[#1F1F1F] text-white hover:bg-[#2A2A2A]"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </nav>

      {/* عنوان */}
      <div className="px-4 mt-4 mb-2">
        <h1 className="text-xl font-semibold">المفضلة</h1>
      </div>

      {/* قائمة العناصر */}
      <section className="px-4 pb-8 space-y-3">
        {filtered.length === 0 ? (
          <div className="mt-10 text-center text-[#9CA3AF]">
            لم تقم بإضافة أي مفضلين بعد
          </div>
        ) : (
          filtered.map((item) => (
            <FavoriteCard
              key={item.id}
              item={item}
              onRemove={removeItem}
              onBook={bookItem}
              onOpen={openItem}
              onMap={mapItem}
            />
          ))
        )}
      </section>
    </main>
  );
}
