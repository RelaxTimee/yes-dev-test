import Link from 'next/link';
import { cookies } from 'next/headers';
import LogoutButton from './LogoutButton';

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();
  const role = cookieStore.get('adminRole')?.value;

  return (
    <div className="min-h-screen flex bg-gray-100 text-black">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold">Luma Admin</h2>
          <p className="text-xs text-gray-400 mt-1">Role: {role}</p>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/admin/products" className="block px-4 py-2 rounded bg-gray-800 hover:bg-gray-700">
            📦 จัดการสินค้า
          </Link>
          {role === 'super_admin' && (
            <Link href="/admin/users" className="block px-4 py-2 rounded bg-gray-800 hover:bg-gray-700">
              👥 จัดการผู้ใช้ (Invite)
            </Link>
          )}
        </nav>
        <div className="p-4">
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
