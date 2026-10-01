// src/app/admin/layout.jsx
import Link from 'next/link';

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold">Luma Admin</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/admin/products" className="block px-4 py-2 rounded bg-gray-800 hover:bg-gray-700">
            จัดการสินค้า
          </Link>
        </nav>
        <div className="p-4">
          <button className="w-full text-left px-4 py-2 rounded hover:bg-red-600 text-red-400 hover:text-white transition">
            ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}