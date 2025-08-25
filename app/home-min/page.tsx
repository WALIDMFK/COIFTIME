"use client";
import { useEffect, useRef, useState } from "react";

/**
 * صفحة: حساب الصالون (نسخة Next.js + Tailwind)
 * ملاحظات:
 * - لا نستخدم أي CDN خارجي (FontAwesome/Tailwind CDN). كل شيء عبر Tailwind المحلي.
 * - أيقونات: نستعمل إيموجي تجريبياً لتجنّب حزم إضافية. تقدّر تركّب react-icons لاحقًا.
 * - الألوان والخطوط مشابهة لستايلك؛ الخط الحقيقي (Tajawal) ممكن نركّبه عبر next/font لاحقًا.
 */

type Section = "dashboard" | "appointments" | "settings";

export default function SalonAccountPage() {
  const [section, setSection] = useState<Section>("dashboard");
  const [tab, setTab] = useState<"members" | "seats">("members");

  // توست بسيط
  const [toast, setToast] = useState<{ show: boolean; msg: string; type: "success" | "error" }>({
    show: false,
    msg: "",
    type: "success",
  });
  const toastTimer = useRef<number | null>(null);
  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ show: true, msg, type });
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
  };

  // مودالات (أسماء حسب السيناريو)
  const [modal, setModal] = useState<null | "addMember" | "addPaidMember" | "bankLink" | "quickBooking" | "confirm">(null);
  const [confirmCfg, setConfirmCfg] = useState<{ title: string; message: string; onOk?: () => void } | null>(null);

  const openConfirm = (title: string, message: string, onOk?: () => void) => {
    setConfirmCfg({ title, message, onOk });
    setModal("confirm");
  };

  const closeModal = () => setModal(null);

  // فواتير المقاعد (قيمة تجريبية)
  const [monthlyTotal, setMonthlyTotal] = useState(3.89);

  const updateMonthlyPlus = () => {
    setMonthlyTotal((v) => +(v + 3.89).toFixed(2));
  };
  const updateMonthlyMinus = () => {
    setMonthlyTotal((v) => Math.max(0, +(v - 3.89).toFixed(2)));
  };

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  return (
    <main className="min-h-screen pb-20 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-900" dir="rtl">
      {/* App Bar */}
      <div className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200 px-4 py-3 shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white grid place-items-center shadow">
              <span className="text-lg">✂️</span>
            </div>
            <div>
              <div className="font-bold">صالون النخبة</div>
              <div className="text-sm text-slate-600">أحمد محمد</div>
            </div>
          </div>

          <div className="relative">
            <span className="text-xl text-slate-600">🔔</span>
            <span className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full bg-red-600 shadow animate-pulse" />
          </div>
        </div>
      </div>

      {/* محتوى الصفحة */}
      <div className="mt-20 px-4">
        {/* الأقسام */}
        {section === "dashboard" && (
          <Dashboard
            tab={tab}
            setTab={setTab}
            monthlyTotal={monthlyTotal}
            onAddMember={() => setModal("addMember")}
            onAddPaidMember={() => setModal("addPaidMember")}
            onAddToPackage={(name) => {
              showToast(`تم ضم ${name} للباقة`);
              updateMonthlyPlus();
            }}
            onRemoveFromPackage={(name) => {
              showToast(`تم إزالة ${name} من الباقة`);
              updateMonthlyMinus();
            }}
            onRemoveMember={(name) => showToast(`تم حذف ${name}`)}
          />
        )}

        {section === "appointments" && (
          <Appointments
            onQuick={(time) => {
              setModal("quickBooking");
              // نقدر نحفظ الوقت في ستايت لو حبيت
            }}
            onConfirm={(msg) => showToast(msg)}
          />
        )}

        {section === "settings" && (
          <Settings
            monthlyTotal={monthlyTotal}
            onLinkBank={() => setModal("bankLink")}
            onSaveSalon={() => showToast("تم حفظ معلومات الصالون")}
            onSavePolicies={() => showToast("تم حفظ السياسات")}
            onSaveHours={() => showToast("تم حفظ ساعات العمل")}
            onManageSeats={() => setTab("seats")}
            onSupport={() => showToast("سيتم توجيهك للدعم الفني")}
            onLogout={() =>
              openConfirm("تسجيل الخروج", "هل أنت متأكد من تسجيل الخروج؟", () => showToast("تم تسجيل الخروج"))
            }
          />
        )}
      </div>

      {/* تبويبات سفلية */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-white/80 backdrop-blur border-t border-slate-200 py-2 shadow">
        <div className="flex justify-around">
          <TabItem
            active={section === "dashboard"}
            label="الرئيسية"
            icon="🏠"
            onClick={() => setSection("dashboard")}
          />
          <TabItem
            active={section === "appointments"}
            label="المواعيد"
            icon="📅"
            onClick={() => setSection("appointments")}
          />
          <TabItem
            active={section === "settings"}
            label="الإعدادات"
            icon="⚙️"
            onClick={() => setSection("settings")}
          />
        </div>
      </div>

      {/* Modals */}
      <Modal show={modal === "addMember"} title="إضافة عضو جديد" onClose={closeModal}>
        <Field label="ID العضو" placeholder="أدخل ID العضو" id="memberId" />
        <div className="mt-6 flex gap-3">
          <Button
            kind="primary"
            className="flex-1"
            onClick={() => {
              closeModal();
              showToast("تم إضافة العضو بنجاح");
            }}
          >
            إضافة العضو
          </Button>
          <Button onClick={closeModal}>إلغاء</Button>
        </div>
      </Modal>

      <Modal show={modal === "addPaidMember"} title="إضافة عضو مدفوع" onClose={closeModal}>
        <Field label="ID العضو" placeholder="أدخل ID العضو" id="paidMemberId" hint="سيتم إضافة €3.89 للفاتورة الشهرية" />
        <div className="mt-6 flex gap-3">
          <Button
            kind="primary"
            className="flex-1"
            onClick={() => {
              closeModal();
              showToast("تم إضافة العضو للباقة المدفوعة");
              updateMonthlyPlus();
            }}
          >
            إضافة للباقة
          </Button>
          <Button onClick={closeModal}>إلغاء</Button>
        </div>
      </Modal>

      <Modal show={modal === "bankLink"} title="ربط الحساب البنكي" onClose={closeModal}>
        <Info title="آمان تام" icon="🛡️" text="نستخدم Stripe لمعالجة الدفعات بأعلى معايير الأمان." tone="blue" />
        <div className="mt-4 space-y-4">
          <Field label="اسم البنك" placeholder="مثال: بنك فرنسا" />
          <Field label="رقم الحساب (IBAN)" placeholder="FR76 1234 5678 9012 3456 7890 123" />
          <Field label="اسم صاحب الحساب" placeholder="أحمد محمد" />
        </div>
        <div className="mt-6 flex gap-3">
          <Button
            kind="primary"
            className="flex-1"
            onClick={() => {
              closeModal();
              showToast("تم ربط الحساب البنكي بنجاح");
            }}
          >
            ربط الحساب
          </Button>
          <Button onClick={closeModal}>إلغاء</Button>
        </div>
      </Modal>

      <Modal show={modal === "quickBooking"} title="حجز سريع" onClose={closeModal}>
        <div className="space-y-4">
          <Field label="العميل" placeholder="اسم العميل أو رقم الهاتف" />
          <Select label="الخدمة" options={["قص شعر - 45د - €25", "تهذيب لحية - 30د - €15", "قص وصبغ - 90د - €65"]} />
          <Select label="الحلاق" options={["محمد الأستاذ", "علي المحترف"]} />
          <Field label="الوقت" placeholder="10:00" type="time" />
        </div>
        <div className="mt-6 flex gap-3">
          <Button
            kind="primary"
            className="flex-1"
            onClick={() => {
              closeModal();
              showToast("تم إنشاء الحجز بنجاح");
            }}
          >
            إنشاء الحجز
          </Button>
          <Button onClick={closeModal}>إلغاء</Button>
        </div>
      </Modal>

      <Modal show={modal === "confirm"} title={confirmCfg?.title ?? "تأكيد"} onClose={closeModal}>
        <p className="text-slate-600 mb-6">{confirmCfg?.message ?? "هل أنت متأكد؟"}</p>
        <div className="flex gap-3">
          <Button
            kind="primary"
            className="flex-1"
            onClick={() => {
              confirmCfg?.onOk?.();
              closeModal();
            }}
          >
            تأكيد
          </Button>
          <Button onClick={closeModal}>إلغاء</Button>
        </div>
      </Modal>

      {/* Toast */}
      <div
        className={`fixed top-24 inset-x-4 z-[100] rounded-xl px-4 py-3 text-white shadow-lg transition-all ${
          toast.show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"
        } ${toast.type === "error" ? "bg-gradient-to-r from-red-500 to-red-600" : "bg-gradient-to-r from-emerald-500 to-emerald-600"}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{toast.type === "error" ? "⚠️" : "✅"}</span>
          <span>{toast.msg || "تم الحفظ بنجاح!"}</span>
        </div>
      </div>
    </main>
  );
}

/* ---------------------- Components ---------------------- */

function TabItem({ active, label, icon, onClick }: { active: boolean; label: string; icon: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`min-w-[72px] min-h-[60px] px-5 py-3 rounded-xl grid place-items-center text-xs transition ${
        active ? "text-blue-600 bg-blue-50 -translate-y-0.5" : "text-slate-500 hover:bg-slate-50"
      }`}
    >
      <span className="text-xl mb-1">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function Modal({
  show,
  title,
  onClose,
  children,
}: {
  show: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm px-4 py-8 grid place-items-start overflow-y-auto" onClick={onClose}>
      <div
        className="w-full max-w-md mx-auto bg-white rounded-2xl p-6 shadow-2xl animate-[modal_.3s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-6">{title}</h2>
        {children}
      </div>
      <style jsx>{`
        @keyframes modal {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}

function Button({
  children,
  kind = "secondary",
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { kind?: "primary" | "secondary" | "danger" | "warning" }) {
  const base =
    "min-h-[44px] px-4 py-2 rounded-xl font-semibold transition grid place-items-center text-sm";
  const map: Record<string, string> = {
    primary: "text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow",
    secondary: "bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 border border-slate-300",
    danger: "text-white bg-gradient-to-r from-red-500 to-red-600",
    warning: "text-white bg-gradient-to-r from-amber-500 to-amber-600",
  };
  return (
    <button className={`${base} ${map[kind]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

function Field({
  label,
  id,
  placeholder,
  type = "text",
  hint,
}: {
  label: string;
  id?: string;
  placeholder?: string;
  type?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="block mb-2 font-semibold text-slate-700">{label}</label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="w-full min-h-[44px] px-4 py-2 rounded-xl border-2 border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-500 focus:bg-white transition"
      />
      {hint && <div className="text-xs text-blue-600 mt-2">{hint}</div>}
    </div>
  );
}

function Select({ label, options }: { label: string; options: string[] }) {
  return (
    <div>
      <label className="block mb-2 font-semibold text-slate-700">{label}</label>
      <select className="w-full min-h-[44px] px-3 py-2 rounded-xl border-2 border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-500 focus:bg-white transition">
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function Info({ title, text, icon, tone = "blue" }: { title: string; text: string; icon?: string; tone?: "blue" | "green" }) {
  const map = {
    blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-800",
    green: "from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-800",
  } as const;
  return (
    <div className={`rounded-lg p-4 border bg-gradient-to-r ${map[tone]}`}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5">{icon ?? "ℹ️"}</span>
        <div className="text-sm">
          <div className="font-semibold mb-1">{title}</div>
          <div>{text}</div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------- Sections ---------------------- */

function Dashboard({
  tab,
  setTab,
  monthlyTotal,
  onAddMember,
  onAddPaidMember,
  onAddToPackage,
  onRemoveFromPackage,
  onRemoveMember,
}: {
  tab: "members" | "seats";
  setTab: (t: "members" | "seats") => void;
  monthlyTotal: number;
  onAddMember: () => void;
  onAddPaidMember: () => void;
  onAddToPackage: (name: string) => void;
  onRemoveFromPackage: (name: string) => void;
  onRemoveMember: (name: string) => void;
}) {
  return (
    <section>
      {/* إحصائيات */}
      <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-4">
        <Stat number="12" label="حجوزات اليوم" />
        <Stat number="8" label="عملاء اليوم" />
        <Stat number="4.8 ★" label="التقييم" />
        <Stat number="€340" label="إيرادات الشهر" />
      </div>

      {/* تبويبات داخلية */}
      <div className="rounded-xl p-1 bg-gradient-to-br from-slate-100 to-slate-200 shadow-inner mb-4">
        <div className="grid grid-cols-2 gap-1">
          <button
            className={`min-h-[44px] rounded-lg font-semibold ${tab === "members" ? "bg-white text-blue-600 shadow" : "text-slate-500"}`}
            onClick={() => setTab("members")}
          >
            الأعضاء
          </button>
          <button
            className={`min-h-[44px] rounded-lg font-semibold ${tab === "seats" ? "bg-white text-blue-600 shadow" : "text-slate-500"}`}
            onClick={() => setTab("seats")}
          >
            المقاعد المدفوعة
          </button>
        </div>
      </div>

      {tab === "members" ? (
        <Members onAddMember={onAddMember} onRemoveMember={onRemoveMember} onAddToPackage={onAddToPackage} />
      ) : (
        <Seats monthlyTotal={monthlyTotal} onAddPaid={onAddPaidMember} onRemoveFromPackage={onRemoveFromPackage} />
      )}
    </section>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="rounded-2xl p-6 text-center bg-white border border-white/60 shadow">
      <div className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-1">
        {number}
      </div>
      <div className="text-sm text-slate-500 font-medium">{label}</div>
    </div>
  );
}

function Members({
  onAddMember,
  onRemoveMember,
  onAddToPackage,
}: {
  onAddMember: () => void;
  onRemoveMember: (name: string) => void;
  onAddToPackage: (name: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">إدارة الأعضاء</h2>
        <Button kind="primary" onClick={onAddMember}>
          ➕ إضافة عضو
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* عضو مدفوع */}
        <div className="relative rounded-2xl p-5 bg-white border-2 border-blue-500 shadow">
          <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full grid place-items-center text-lg shadow"
            style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)" }}>
            👑
          </span>
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white grid place-items-center font-bold">
              م
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-lg">محمد الأستاذ</span>
                <span className="text-amber-500 font-semibold">4.9 ★</span>
              </div>
              <span className="text-xs px-2 py-1 rounded-full text-white" style={{ background: "linear-gradient(135deg,#fbbf24,#f59e0b)" }}>
                عضو مدفوع
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm mb-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <span className="text-blue-700 block">إجمالي الحجوزات:</span>
              <span className="font-bold text-lg text-blue-800">156</span>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <span className="text-blue-700 block">حجوزات اليوم:</span>
              <span className="font-bold text-lg text-blue-800">5 (€85)</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button kind="danger" className="flex-1" onClick={() => onRemoveMember("محمد الأستاذ")}>
              حذف
            </Button>
          </div>
        </div>

        {/* عضو عادي */}
        <div className="rounded-2xl p-5 bg-white border border-white/60 shadow">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white grid place-items-center font-bold">
              ع
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-lg">علي المحترف</span>
                <span className="text-amber-500 font-semibold">4.7 ★</span>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
                مشترك فردي
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm mb-4">
            <div className="bg-slate-50 p-3 rounded-lg">
              <span className="text-slate-600 block">إجمالي الحجوزات:</span>
              <span className="font-bold text-lg">89</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <span className="text-slate-600 block">حجوزات اليوم:</span>
              <span className="font-bold text-lg">3 (€60)</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button kind="primary" className="flex-1" onClick={() => onAddToPackage("علي المحترف")}>
              ضم للباقة
            </Button>
            <Button kind="danger" className="flex-1" onClick={() => onRemoveMember("علي المحترف")}>
              حذف
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Seats({
  monthlyTotal,
  onAddPaid,
  onRemoveFromPackage,
}: {
  monthlyTotal: number;
  onAddPaid: () => void;
  onRemoveFromPackage: (name: string) => void;
}) {
  return (
    <div>
      <div className="rounded-2xl p-6 mb-4 text-white shadow"
        style={{ background: "linear-gradient(135deg,#3b82f6,#1d4ed8)" }}>
        <div className="text-center">
          <div className="text-4xl font-extrabold mb-2">1/10</div>
          <div className="text-xl mb-2">مقاعد مستخدمة</div>
          <div className="text-sm opacity-90">التكلفة الشهرية: <b>€{monthlyTotal.toFixed(2)}</b></div>
          <div className="text-xs mt-3 bg-blue-600/50 px-3 py-2 rounded-lg inline-flex items-center gap-2">
            🔄 يتم التحديث تلقائيًا
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-5 bg-white border border-white/60 shadow">
        <h3 className="font-bold text-lg mb-4">الأعضاء المدفوع عنهم</h3>

        {/* بطاقة إضافة عضو مدفوع */}
        <button
          onClick={onAddPaid}
          className="w-full rounded-2xl border-2 border-dashed border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 py-8 grid place-items-center text-blue-600 mb-4"
        >
          <div className="grid place-items-center gap-2">
            <span className="text-4xl">➕</span>
            <div className="font-bold text-lg">إضافة عضو مدفوع</div>
            <div className="text-sm opacity-80">تكلفة إضافية: €3.89/شهر</div>
          </div>
        </button>

        {/* عضو مدفوع */}
        <div className="rounded-2xl p-5 bg-white border-2 border-blue-500 shadow relative">
          <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full grid place-items-center text-lg shadow"
            style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)" }}>
            👑
          </span>

          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white grid place-items-center font-bold">
              م
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-lg">محمد الأستاذ</span>
                <span className="text-amber-500 font-semibold">4.9 ★</span>
              </div>
              <div className="rounded-lg p-3 bg-blue-50 text-sm text-blue-700 mb-4">
                <div className="flex justify-between">
                  <span className="font-semibold">التكلفة الشهرية:</span>
                  <span className="font-bold">€3.89</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button kind="warning" className="flex-1" onClick={() => onRemoveFromPackage("محمد الأستاذ")}>
                  إزالة من الباقة
                </Button>
                <Button kind="danger" className="flex-1" onClick={() => onRemoveFromPackage("محمد الأستاذ")}>
                  حذف
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Appointments({ onQuick, onConfirm }: { onQuick: (time: string) => void; onConfirm: (msg: string) => void }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">المواعيد</h1>
        <Button kind="primary" onClick={() => onQuick("10:00")}>➕ حجز سريع</Button>
      </div>

      <div className="rounded-2xl p-5 bg-white border border-white/60 shadow mb-6">
        <h2 className="font-bold text-lg mb-4">جدول اليوم - الأحد 14 يناير</h2>
        <div className="space-y-3">
          <Slot time="09:00" title="أحمد علي - قص شعر" sub="مع محمد الأستاذ • 45د • €25" tone="green" badge="مؤكد" />
          <Slot time="10:30" title="سعد محمد - تهذيب لحية" sub="مع علي المحترف • 30د • €15" tone="amber" badge="في الانتظار" />
          <Slot time="12:00" title="متاح للحجز" sub="انقر للحجز السريع" tone="blue" onClick={() => onQuick("12:00")} />
          <Slot time="14:00" title="خالد أحمد - قص وصبغ" sub="مع محمد الأستاذ • 90د • €65" tone="green" badge="مؤكد" />
          <Slot time="16:00" title="متاح للحجز" sub="انقر للحجز السريع" tone="blue" onClick={() => onQuick("16:00")} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <MiniStat number="8" label="حجوزات اليوم" color="text-emerald-600" />
        <MiniStat number="€180" label="إيرادات اليوم" color="text-blue-600" />
        <MiniStat number="2" label="في الانتظار" color="text-amber-600" />
      </div>
    </section>
  );
}

function Slot({
  time,
  title,
  sub,
  tone,
  badge,
  onClick,
}: {
  time: string;
  title: string;
  sub: string;
  tone: "green" | "amber" | "blue";
  badge?: string;
  onClick?: () => void;
}) {
  const map = {
    green: "bg-emerald-50 border-emerald-200 text-emerald-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
  } as const;

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 p-4 rounded-lg border ${map[tone]} ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="text-sm font-bold w-16">{time}</div>
      <div className="flex-1">
        <div className={`font-semibold ${tone === "blue" ? "text-blue-600" : ""}`}>{title}</div>
        <div className="text-sm text-slate-600">{sub}</div>
      </div>
      {badge && <span className="text-xs px-2 py-1 rounded-lg text-white" style={{ background: tone === "green" ? "#10b981" : "#f59e0b" }}>{badge}</span>}
      {!badge && <span className="text-blue-500 text-xl">＋</span>}
    </div>
  );
}

function MiniStat({ number, label, color }: { number: string; label: string; color: string }) {
  return (
    <div className="rounded-2xl p-5 bg-white border border-white/60 shadow text-center">
      <div className={`text-2xl font-bold ${color}`}>{number}</div>
      <div className="text-sm text-slate-600">{label}</div>
    </div>
  );
}

function Settings({
  monthlyTotal,
  onLinkBank,
  onSaveSalon,
  onSavePolicies,
  onSaveHours,
  onManageSeats,
  onSupport,
  onLogout,
}: {
  monthlyTotal: number;
  onLinkBank: () => void;
  onSaveSalon: () => void;
  onSavePolicies: () => void;
  onSaveHours: () => void;
  onManageSeats: () => void;
  onSupport: () => void;
  onLogout: () => void;
}) {
  return (
    <section>
      <h1 className="text-2xl font-bold mb-6">الإعدادات</h1>

      {/* معلومات الصالون */}
      <div className="rounded-2xl p-5 bg-white border border-white/60 shadow mb-6">
        <h2 className="font-bold text-lg mb-4">معلومات الصالون</h2>
        <div className="space-y-4">
          <Field label="اسم الصالون" placeholder="صالون النخبة" />
          <Field label="العنوان" placeholder="شارع الشانزليزيه، باريس" />
          <Field label="رقم الهاتف" placeholder="+33 1 23 45 67 89" />
          <div>
            <label className="block mb-2 font-semibold text-slate-700">طرق الدفع المقبولة</label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> نقداً</label>
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> بطاقة ائتمان</label>
              <label className="flex items-center gap-2"><input type="checkbox" /> PayPal</label>
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> تحويل بنكي</label>
            </div>
          </div>
        </div>
        <Button kind="primary" className="mt-4" onClick={onSaveSalon}>حفظ المعلومات</Button>
      </div>

      {/* السياسات والعربون */}
      <div className="rounded-2xl p-5 bg-white border border-white/60 shadow mb-6">
        <h2 className="font-bold text-lg mb-4">السياسات والعربون</h2>
        <div className="space-y-4">
          <Field label="مبلغ العربون (€)" placeholder="10" type="number" />
          <Select label="سياسة الإلغاء" options={["يمكن الإلغاء قبل 24 ساعة","يمكن الإلغاء قبل 12 ساعة","يمكن الإلغاء قبل 6 ساعات","لا يمكن الإلغاء"]} />
          <div>
            <label className="block mb-2 font-semibold text-slate-700">رسالة ترحيب للعملاء</label>
            <textarea className="w-full min-h-[96px] px-4 py-2 rounded-xl border-2 border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-500 focus:bg-white transition">مرحباً بك في صالون النخبة! نتطلع لخدمتك بأفضل ما لدينا.</textarea>
          </div>
        </div>
        <Button kind="primary" className="mt-4" onClick={onSavePolicies}>حفظ السياسات</Button>
      </div>

      {/* ساعات العمل */}
      <div className="rounded-2xl p-5 bg-white border border-white/60 shadow mb-6">
        <h2 className="font-bold text-lg mb-4">ساعات العمل</h2>
        <div className="space-y-3">
          {[
            { day: "الأحد", open: true, from: "09:00", to: "18:00" },
            { day: "الاثنين", open: true, from: "09:00", to: "18:00" },
            { day: "الثلاثاء", open: false },
            { day: "الأربعاء", open: true, from: "09:00", to: "18:00" },
          ].map((d) => (
            <div key={d.day} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked={!!d.open} />
                <span className={`font-semibold ${d.open ? "" : "text-slate-400"}`}>{d.day}</span>
              </label>
              {d.open ? (
                <div className="flex items-center gap-2">
                  <input className="min-h-[36px] px-2 py-1 rounded-lg border-2 border-slate-200 bg-white" defaultValue={d.from} />
                  <span>إلى</span>
                  <input className="min-h-[36px] px-2 py-1 rounded-lg border-2 border-slate-200 bg-white" defaultValue={d.to} />
                </div>
              ) : (
                <div className="text-sm text-slate-400">مغلق</div>
              )}
            </div>
          ))}
        </div>
        <Button kind="primary" className="mt-4" onClick={onSaveHours}>حفظ ساعات العمل</Button>
      </div>

      {/* الاشتراك + دعم */}
      <div className="rounded-2xl p-5 bg-white border border-white/60 shadow mb-6">
        <h2 className="font-bold text-lg mb-4">إدارة الاشتراك</h2>
        <div className="rounded-lg p-4 bg-gradient-to-r from-blue-50 to-blue-100 mb-4">
          <div className="flex justify-between mb-2">
            <span className="font-semibold">الإجمالي الشهري الحالي:</span>
            <span className="font-bold text-blue-600 text-xl">€{monthlyTotal.toFixed(2)}</span>
          </div>
          <div className="text-xs text-blue-700 bg-blue-100 px-3 py-2 rounded-lg inline-flex items-center gap-2">
            🔄 يتم تحديث الفاتورة تلقائياً عند إضافة/حذف الأعضاء
          </div>
        </div>

        <div className="flex gap-3 mb-4">
          <Button className="flex-1" onClick={onLinkBank}>🏦 ربط حساب المحل</Button>
          <Button kind="primary" className="flex-1" onClick={onManageSeats}>إدارة المقاعد</Button>
        </div>

        <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg">
          🔐 الدفعات آمنة ومشفرة عبر Stripe. يتم تحويل الأرباح لحسابك البنكي تلقائياً.
        </div>
      </div>

      <div className="rounded-2xl p-5 bg-white border border-white/60 shadow mb-12">
        <h2 className="font-bold text-lg mb-4">الدعم والمساعدة</h2>
        <div className="space-y-3">
          <Button className="w-full" onClick={onSupport}>🎧 التواصل مع الدعم الفني</Button>
          <Button className="w-full">❓ الأسئلة الشائعة</Button>
          <Button kind="danger" className="w-full" onClick={onLogout}>🚪 تسجيل الخروج</Button>
        </div>
      </div>
    </section>
  );
}
