import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function PublicProductPage({ params }) {
  const { sku } = await params;
  
  const product = await prisma.product.findUnique({
    where: { sku: sku.toUpperCase() }
  });

  if (!product || product.status === 'inactive') {
    notFound();
  }

  // เก็บ Log การสแกน
  try {
    await prisma.scanLog.create({
      data: { productId: product.id }
    });
  } catch(e) {}

  // Parse รูปภาพที่ได้จาก DB
  const images = product.images ? JSON.parse(product.images) : (product.imageUrl ? [product.imageUrl] : []);

  return (
    <div className="min-h-screen bg-gray-100 text-black font-sans pb-24">
      {/* ใส่ max-w-md เพื่อให้ดูเหมือนหน้าจอมือถือเสมอ แม้จะเปิดบนคอม */}
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl relative">
        
        {/* รูปภาพสินค้าแบบ Carousel สไลด์ได้ */}
        <div className="relative w-full aspect-square bg-gray-50 flex overflow-x-auto snap-x snap-mandatory hide-scrollbar">
          {images.length > 0 ? (
            images.map((imgUrl, idx) => (
              <img key={idx} src={imgUrl} alt={`${product.name} - ${idx+1}`} className="w-full h-full object-cover flex-shrink-0 snap-center" />
            ))
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <span className="text-4xl mb-2">📸</span>
              <span>ภาพสินค้ากำลังอัปเดต</span>
            </div>
          )}

          {/* จุดบอกจำนวนรูป (Dots) ถ้ามีหลายรูป */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
              {images.map((_, idx) => (
                <div key={idx} className="w-2 h-2 rounded-full bg-white/70 shadow-sm backdrop-blur-sm"></div>
              ))}
            </div>
          )}
          
          {/* Badge */}
          <div className="absolute top-4 left-4 bg-black text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10">
            {product.category || 'Luma Skincare'}
          </div>
        </div>

        {/* รายละเอียด */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>
          </div>
          
          <div className="flex items-end gap-3 mb-6">
            <p className="text-3xl font-extrabold text-blue-600">฿{product.price}</p>
            <p className="text-sm text-gray-400 mb-1">SKU: {product.sku}</p>
          </div>
          
          {product.size && (
            <div className="inline-block bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 text-sm font-semibold text-blue-800 mb-6">
              📦 ปริมาณ: {product.size}
            </div>
          )}

          <hr className="my-6 border-gray-100" />

          {product.description && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-3">
                <span>✨</span> รายละเอียดสินค้า
              </h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">{product.description}</p>
            </div>
          )}

          {product.how_to_use && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-3">
                <span>💧</span> วิธีใช้
              </h3>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {product.how_to_use}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Bottom Bar สำหรับ Mobile UI */}
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
          {/* จำกัดความกว้างให้เท่ากับตัวเครื่อง (max-w-md) */}
          <div className="w-full max-w-md bg-white border-t border-gray-200 px-4 py-3 flex gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] pointer-events-auto">
            <button className="flex-1 bg-gray-900 text-white font-bold text-sm py-3.5 rounded-xl hover:bg-gray-800 active:scale-95 transition-all flex justify-center items-center gap-2 shadow-md">
              <span>🛒</span> สนใจสั่งซื้อ
            </button>
            <button className="w-14 flex-none bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 active:scale-95 transition-all flex justify-center items-center shadow-sm border border-blue-100" title="แชร์">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
            </button>
          </div>
        </div>

      </div>
      
      {/* เพิ่ม CSS เล็กน้อยสำหรับซ่อน Scrollbar ของ Carousel */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
