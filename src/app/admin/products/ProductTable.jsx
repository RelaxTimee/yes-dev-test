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
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b bg-gray-50">
        <input 
          type="text" 
          placeholder=" ค้นหาสินค้าจาก ชื่อ, SKU หรือ หมวดหมู่..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">ลำดับ</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase cursor-pointer select-none hover:bg-gray-100" onClick={() => requestSort('sku')}>
                SKU {getSortIcon('sku')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase cursor-pointer select-none hover:bg-gray-100" onClick={() => requestSort('name')}>
                ชื่อสินค้า {getSortIcon('name')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase cursor-pointer select-none hover:bg-gray-100" onClick={() => requestSort('category')}>
                หมวดหมู่ {getSortIcon('category')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase cursor-pointer select-none hover:bg-gray-100" onClick={() => requestSort('price')}>
                ราคา {getSortIcon('price')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase cursor-pointer select-none hover:bg-gray-100" onClick={() => requestSort('status')}>
                สถานะ {getSortIcon('status')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">จัดการ</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.length === 0 ? (
              <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-500">ไม่พบสินค้าที่ค้นหา</td></tr>
            ) : (
              filteredProducts.map((product, index) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{product.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {product.category ? (
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs border border-gray-200">{product.category}</span>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">฿{product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${product.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/admin/products/${product.id}`} className="text-blue-600 hover:text-blue-900 font-semibold underline decoration-transparent hover:decoration-blue-900 transition">
                      แก้ไข / จัดการรููปภาพ
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
