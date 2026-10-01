'use client';

export default function ExportExcelButton() {
  return (
    <a 
      href="/api/products/export" 
      download="Luma_Products_Export.xlsx"
      className="inline-flex items-center justify-center gap-2 px-4 py-2 h-10 rounded-lg transition font-medium text-sm shadow-sm bg-[#B08E7B] hover:bg-[#8e6e5d] text-white"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
      ดาวน์โหลด Excel
    </a>
  );
}
