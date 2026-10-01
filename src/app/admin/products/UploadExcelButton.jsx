'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadExcelButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/products/import', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.errors && data.errors.length > 0) alert(data.message + '\n\nข้อผิดพลาด:\n' + data.errors.join('\n'));
      else alert(data.message || 'อัปโหลดสำเร็จ');
      router.refresh(); 
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการอัปโหลด');
    } finally {
      setLoading(false);
      e.target.value = ''; 
    }
  };

  return (
    <div>
      <label className={`px-5 py-2.5 rounded-full cursor-pointer transition shadow-sm font-medium ${loading ? 'bg-stone-400' : 'bg-rose-500 hover:bg-rose-600'} text-white`}>
        {loading ? '⏳ กำลังนำเข้า...' : '📥 นำเข้า Excel'}
        <input type="file" accept=".xlsx" onChange={handleUpload} disabled={loading} className="hidden" />
      </label>
    </div>
  );
}
