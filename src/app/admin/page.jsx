'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
      window.location.href = '/admin/products';
    } else {
      const data = await res.json();
      alert(data.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 max-w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">เข้าสู่ระบบหลังบ้าน</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="superadmin@luma.com" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน</label><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="password" /></div>
          <button type="submit" className="w-full bg-black text-white rounded py-2 hover:bg-gray-800 transition">เข้าสู่ระบบ</button>
        </form>
      </div>
    </div>
  );
}
