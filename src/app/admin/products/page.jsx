import { prisma } from '@/lib/prisma';
import UploadExcelButton from './UploadExcelButton';
import ProductTable from './ProductTable';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });

  const topScans = await prisma.scanLog.groupBy({
    by: ['productId'],
    _count: { productId: true },
    orderBy: { _count: { productId: 'desc' } },
    take: 1
  });

  let topProduct = null;
  let topScanCount = 0;
  if (topScans.length > 0) {
    topScanCount = topScans[0]._count.productId;
    topProduct = await prisma.product.findUnique({
      where: { id: topScans[0].productId }
    });
  }

  return (
    <div className="p-8 text-stone-800">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-stone-900">คลังสินค้า</h1>
          <p className="text-stone-500 mt-1">จัดการและอัปเดตข้อมูลผลิตภัณฑ์ Luma Skin</p>
        </div>
        <UploadExcelButton />
      </div>

      {topProduct && (
        <div className="mb-8 bg-white border-l-4 border-rose-400 rounded-r-lg p-5 flex items-center gap-5 shadow-sm">
          <div className="text-4xl bg-rose-50 w-16 h-16 flex items-center justify-center rounded-full text-rose-500">✨</div>
          <div>
            <h2 className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-1">Most Popular Product</h2>
            <p className="text-xl font-serif text-stone-900">{topProduct.name} <span className="text-sm font-sans text-stone-400 ml-2">(SKU: {topProduct.sku})</span></p>
            <p className="text-sm text-stone-500 mt-1">สแกนไปแล้วทั้งหมด <span className="font-bold text-rose-600">{topScanCount}</span> ครั้ง</p>
          </div>
        </div>
      )}

      <ProductTable initialProducts={products} />
    </div>
  );
}
