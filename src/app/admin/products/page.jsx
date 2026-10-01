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
    <div className="p-6 text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">รายการสินค้า</h1>
        <UploadExcelButton />
      </div>

      {topProduct && (
        <div className="mb-6 bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-4 shadow-sm">
          <div className="text-4xl"></div>
          <div>
            <h2 className="text-sm font-bold text-yellow-800 uppercase tracking-wide">สินค้าที่ถูกสแกน QR มากที่สุด</h2>
            <p className="text-lg font-medium text-gray-900">{topProduct.name} (SKU: {topProduct.sku})</p>
            <p className="text-sm text-gray-600">สแกนไปแล้วทั้งหมด <span className="font-bold text-black">{topScanCount}</span> ครั้ง</p>
          </div>
        </div>
      )}

      {/* ใช้ Client Component เพื่อให้รองรับ Search & Sort */}
      <ProductTable initialProducts={products} />
    </div>
  );
}
