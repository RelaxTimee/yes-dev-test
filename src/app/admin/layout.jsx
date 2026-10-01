import Link from 'next/link';
import { cookies } from 'next/headers';
import LogoutButton from './LogoutButton';

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();
  const role = cookieStore.get('adminRole')?.value;

  return (
    <div className="min-h-screen flex bg-[#FAF7F2] text-stone-800 font-sans">
      {/* Sidebar สี Charcoal เข้ม ตัดกับความมินิมอล */}
      <aside className="w-64 bg-stone-900 text-stone-100 flex flex-col shadow-xl z-10">
        <div className="p-8 pb-6 border-b border-stone-800">
          <h2 className="text-3xl font-serif tracking-wide text-rose-300">LUMA<span className="text-white font-sans text-xl ml-1">SKIN</span></h2>
          <p className="text-xs text-stone-400 mt-2 uppercase tracking-widest">Role: {role}</p>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/admin/products" className="block px-4 py-3 rounded-lg bg-stone-800/50 hover:bg-rose-900/50 hover:text-rose-200 transition-colors duration-200">
            ✨ จัดการสินค้า
          </Link>
          {role === 'super_admin' && (
            <Link href="/admin/users" className="block px-4 py-3 rounded-lg hover:bg-stone-800 transition-colors duration-200">
              👥 จัดการผู้ใช้ (Invite)
            </Link>
          )}
        </nav>
        <div className="p-4 border-t border-stone-800">
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
