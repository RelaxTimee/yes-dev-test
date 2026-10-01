import Link from 'next/link';
import { cookies } from 'next/headers';
import LogoutButton from './LogoutButton';

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();
  const role = cookieStore.get('adminRole')?.value;

  return (
    <div className="h-screen flex bg-luma-light text-luma-text overflow-hidden">
      {/* Sidebar: Fix ความสูงเท่าจอภาพ และเปลี่ยนสีให้เข้าธีม Luma */}
      <aside className="w-64 bg-luma-text text-white flex flex-col shadow-xl flex-shrink-0">
        <div className="p-7">
          <h2 className="text-2xl font-serif font-bold text-luma-rose tracking-wide">LUMA SKIN</h2>
          <p className="text-xs text-white/50 mt-1 uppercase tracking-wider">Role: {role}</p>
        </div>
        
        {/* Navigation area */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto mt-4">
          <Link href="/admin/products" className="block px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition font-medium tracking-wide">
            📦 จัดการสินค้า
          </Link>
          {role === 'super_admin' && (
            <Link href="/admin/users" className="block px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition font-medium tracking-wide">
              👥 จัดการผู้ใช้ (Invite)
            </Link>
          )}
        </nav>
        
        {/* Logout ติดอยู่ล่างสุดเสมอ */}
        <div className="p-4 border-t border-white/10">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content: สกอร์ลแยกอิสระ */}
      <main className="flex-1 overflow-y-auto bg-[#FDFBF7]">
        {children}
      </main>
    </div>
  );
}
