import { prisma } from '@/lib/prisma';
import ProductEditForm from './ProductEditForm';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function EditProductPage({ params }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id: parseInt(id) } });
  if (!product) notFound();

  return (
    <div className="p-6 max-w-6xl mx-auto text-black">
      <Link href="/admin/products" className="text-gray-500 hover:text-gray-800 mb-6 inline-block font-medium">&larr; กลับไปหน้ารายการสินค้า</Link>
      <ProductEditForm product={product} />
    </div>
  );
}
