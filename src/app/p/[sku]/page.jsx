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

  // เก็บ Log การสแกน (ถ้ามีเวลาค่อยทำเป็น API แยกเพื่อไม่ให้บล็อกการโหลด แต่ทำตรงนี้ได้เลย)
  try {
    await prisma.scanLog.create({
      data: { productId: product.id }
    });
  } catch(e) {}

  return (
    <div className="min-h-screen bg-gray-50 text-black font-sans pb-10">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg">
        {/* รูปภาพสินค้า */}
        <div className="w-full aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-400">ภาพสินค้ากำลังอัปเดต</span>
          )}
        </div>

        {/* รายละเอียด */}
        <div className="p-6">
          {product.category && <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">{product.category}</p>}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <p className="text-2xl text-black font-semibold mb-4">฿{product.price}</p>
          
          {product.size && (
            <div className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-700 mb-6">
              ขนาด: {product.size}
            </div>
          )}

          {product.description && (
            <div className="mb-6">
              <h3 className="text-lg font-bold border-b pb-2 mb-2">รายละเอียดสินค้า</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>
          )}

          {product.how_to_use && (
            <div className="mb-6">
              <h3 className="text-lg font-bold border-b pb-2 mb-2">วิธีใช้</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{product.how_to_use}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
