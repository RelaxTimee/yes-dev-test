'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AcceptInvitePage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  if (!token) return <div className="p-8 text-center text-black">Invalid Token</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/users/accept-invite', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
      alert('ตั้งรหัสผ่านสำเร็จ! กรุณาเข้าสู่ระบบด้วยอีเมลของคุณ');
      router.push('/admin');
    } else {
      alert('Token ไม่ถูกต้อง หรือหมดอายุ');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black">
      <div className="bg-white p-8 rounded shadow w-96">
        <h1 className="text-xl font-bold mb-4">ตั้งค่ารหัสผ่านใหม่</h1>
        <p className="text-sm text-gray-600 mb-6">กรุณาตั้งรหัสผ่านสำหรับบัญชี Admin ของคุณ</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm">รหัสผ่านใหม่</label>
            <input type="password" required minLength="6" value={password} onChange={e => setPassword(e.target.value)} className="w-full border rounded p-2" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-black text-white py-2 rounded">
            บันทึกและเข้าสู่ระบบ
          </button>
        </form>
      </div>
    </div>
  );
}
