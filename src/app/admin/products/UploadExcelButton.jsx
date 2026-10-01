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
      <label className={`inline-flex items-center justify-center gap-2 px-4 py-2 h-10 rounded-lg cursor-pointer transition font-medium text-sm shadow-sm text-white ${loading ? 'bg-gray-400' : 'bg-[#2C2A29] hover:bg-black'}`}>
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            กำลังนำเข้า...
          </span>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            นำเข้า Excel
          </>
        )}
        <input type="file" accept=".xlsx" onChange={handleUpload} disabled={loading} className="hidden" />
      </label>
    </div>
  );
}
