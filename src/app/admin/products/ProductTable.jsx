'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';

export default function ProductTable({ initialProducts }) {
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const sortedProducts = useMemo(() => {
    let sortableItems = [...initialProducts];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let valA = a[sortConfig.key] || '';
        let valB = b[sortConfig.key] || '';
        
        // ทำให้การเรียง string ถูกต้อง (เช่น ไม่สนใจพิมพ์เล็กพิมพ์ใหญ่)
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [initialProducts, sortConfig]);

  const filteredProducts = useMemo(() => {
    return sortedProducts.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [sortedProducts, search]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) return <span className="text-gray-300 ml-1">↕</span>;
    return sortConfig.direction === 'asc' ? <span className="text-blue-500 ml-1">▲</span> : <span className="text-blue-500 ml-1">▼</span>;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
      <div className="p-5 border-b border-stone-100 bg-white">
        <input 
          type="text" 
          placeholder="🔍 ค้นหาสินค้าจาก ชื่อ, SKU หรือ หมวดหมู่..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-rose-300 focus:ring-1 focus:ring-rose-300 bg-stone-50/50 text-stone-800 placeholder-stone-400 transition"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-stone-100">
          <thead className="bg-stone-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">ลำดับ</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider cursor-pointer select-none hover:bg-stone-100 transition" onClick={() => requestSort('sku')}>
                SKU {getSortIcon('sku')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider cursor-pointer select-none hover:bg-stone-100 transition" onClick={() => requestSort('name')}>
                ชื่อสินค้า {getSortIcon('name')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider cursor-pointer select-none hover:bg-stone-100 transition" onClick={() => requestSort('category')}>
                หมวดหมู่ {getSortIcon('category')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider cursor-pointer select-none hover:bg-stone-100 transition" onClick={() => requestSort('price')}>
                ราคา {getSortIcon('price')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider cursor-pointer select-none hover:bg-stone-100 transition" onClick={() => requestSort('status')}>
                สถานะ {getSortIcon('status')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">จัดการ</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-stone-100">
            {filteredProducts.length === 0 ? (
              <tr><td colSpan="7" className="px-6 py-12 text-center text-stone-400">ไม่พบสินค้าที่ค้นหา</td></tr>
            ) : (
              filteredProducts.map((product, index) => (
                <tr key={product.id} className="hover:bg-rose-50/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-400 font-medium">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-stone-800">{product.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-700">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                    {product.category ? (
                      <span className="bg-stone-100 text-stone-600 px-2.5 py-1 rounded-md text-xs font-medium border border-stone-200/50">{product.category}</span>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-700">฿{product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${product.status === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/admin/products/${product.id}`} className="text-rose-500 hover:text-rose-700 font-semibold underline decoration-transparent hover:decoration-rose-300 transition">
                      แก้ไข / อัปโหลดรูป
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
