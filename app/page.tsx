import Link from 'next/link'

export default function Page() {
  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">CoifTime 🚀</h1>
      <Link href="/home-min" className="text-blue-400 underline">
        اذهب إلى الصفحة المصغرة
      </Link>
    </main>
  )
}
