'use client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "adminAuth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "adminRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = '/admin';
  };

  return (
    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 rounded hover:bg-red-600 text-red-400 hover:text-white transition">
      ออกจากระบบ
    </button>
  );
}
