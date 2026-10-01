// src/app/admin/page.jsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // ตอนนี้เป็น Mock Login ไปก่อน (เดี๋ยวค่อยต่อ API)
    if (email === 'admin@luma.com' && password === '123456') {
      router.push('/admin/products');
    } else {
      alert('อีเมลหรือรหัสผ่านไม่ถูกต้อง (ลอง admin@luma.com / 123456)');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* ใช้ z-index หรือกำหนดให้อยู่เหนือ Layout ถ้าต้องการให้เต็มจอจริงๆ แต่เพื่อความเร็วใช้แบบนี้ไปก่อนครับ */}
      <div className="bg-white p-8 rounded-lg shadow-md w-96 max-w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">เข้าสู่ระบบหลังบ้าน</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-black focus:border-black"
              placeholder="admin@luma.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-black focus:border-black"
              placeholder="••••••"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-black text-white rounded py-2 hover:bg-gray-800 transition"
          >
            เข้าสู่ระบบ
          </button>
        </form>
      </div>
    </div>
  );
}