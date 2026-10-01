import { prisma } from '@/lib/prisma';
import UploadExcelButton from './UploadExcelButton';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });

  // ดึงสินค้าที่ถูกสแกน (ดู) มากที่สุด
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

      {/* Widget สินค้าฮอตฮิต */}
      {topProduct && (
        <div className="mb-6 bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-4 shadow-sm">
          <div className="text-4xl">🔥</div>
          <div>
            <h2 className="text-sm font-bold text-yellow-800 uppercase tracking-wide">สินค้าที่ถูกสแกน QR มากที่สุด</h2>
            <p className="text-lg font-medium text-gray-900">{topProduct.name} (SKU: {topProduct.sku})</p>
            <p className="text-sm text-gray-600">สแกนไปแล้วทั้งหมด <span className="font-bold text-black">{topScanCount}</span> ครั้ง</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ชื่อสินค้า</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ราคา</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">สถานะ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">จัดการ</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">ยังไม่มีสินค้าในระบบ กรุณากด "นำเข้า Excel"</td></tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">฿{product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{product.status}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium"><Link href={`/admin/products/${product.id}`} className="text-indigo-600 hover:text-indigo-900">แก้ไข / จัดการรูปภาพ</Link></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
