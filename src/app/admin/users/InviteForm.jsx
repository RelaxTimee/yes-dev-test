'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InviteForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/users/invite', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (res.ok) {
      alert('สร้างคำเชิญสำเร็จ! (จำลองการส่งอีเมลแล้ว กรุณาดูที่ Terminal/Console)');
      setEmail('');
      router.refresh();
    } else {
      alert('เกิดข้อผิดพลาด หรืออีเมลนี้ถูกเชิญไปแล้ว');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleInvite} className="space-y-4">
      <div>
        <label className="block text-sm">อีเมลที่ต้องการเชิญ</label>
        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded p-2" />
      </div>
      <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded">
        {loading ? 'กำลังส่ง...' : 'ส่งคำเชิญ'}
      </button>
    </form>
  );
}
