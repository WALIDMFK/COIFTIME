export default function HomeMin() {
  const notifCount = 3
  const isSubscriber = false

  return (
    <div className="p-4 space-y-4">
      <header className="grid grid-cols-3 items-center h-14 px-4 bg-header">
        <button className="justify-self-start bg-button text-white px-2 py-1 rounded-lg">🌐</button>
        <img src="/assets/logo.svg" alt="CoifTime" className="h-8 justify-self-center" />
        {notifCount > 0 ? (
          <button className="justify-self-end bg-button text-white px-2 py-1 rounded-lg">🔔</button>
        ) : (
          <span className="justify-self-end" />
        )}
      </header>

      <button className="w-full h-11 px-3 py-2 rounded-lg bg-searchBg text-search text-right">
        🔍 ابحث عن صالون أو حلاق أو مدينة…
      </button>

      {!isSubscriber && (
        <div className="w-full px-0 py-11 rounded-lg bg-bannerBg text-bannerText text-right">
          ✨ اشترك الآن بـ 3.89€
        </div>
      )}
    </div>
  )
}
