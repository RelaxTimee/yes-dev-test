'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeCanvas } from 'qrcode.react';

export default function ProductEditForm({ product }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: product.name || '', category: product.category || '', price: product.price || '',
    size: product.size || '', description: product.description || '', how_to_use: product.how_to_use || '', status: product.status || 'active',
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(product.imageUrl || null);
  const [loading, setLoading] = useState(false);

  const [qrSize, setQrSize] = useState(200);
  const [qrBgColor, setQrBgColor] = useState('#FFFFFF');
  const qrRef = useRef();
  const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/p/${product.sku}`;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return alert('รองรับเฉพาะไฟล์ JPG, PNG และ WEBP');
    if (file.size > 2 * 1024 * 1024) return alert('ขนาดไฟล์ต้องไม่เกิน 2 MB');

    const img = new window.Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      if (img.width < 800 || img.height < 800) alert('คำเตือน: รูปภาพควรมีขนาดอย่างน้อย 800 x 800 px');
      setImageFile(file);
      setPreviewImage(img.src);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const submitData = new FormData();
    Object.keys(formData).forEach(key => submitData.append(key, formData[key]));
    if (imageFile) submitData.append('image', imageFile);
    submitData.append('existingImageUrl', product.imageUrl || '');

    const res = await fetch(`/api/products/${product.id}`, { method: 'PUT', body: submitData });
    if (res.ok) alert('บันทึกข้อมูลสำเร็จ');
    setLoading(false);
    router.refresh();
  };

  const downloadQR = () => {
    const canvas = qrRef.current.querySelector('canvas');
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `QR_${product.sku}.png`;
    link.click();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-black">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">รูปภาพสินค้า</h2>
          {previewImage ? <img src={previewImage} alt="Preview" className="w-full aspect-square object-cover rounded border" /> : <div className="w-full aspect-square bg-gray-100 flex items-center justify-center rounded border"><span className="text-gray-400">Placeholder (ยังไม่มีรูป)</span></div>}
          <input type="file" accept="image/jpeg, image/png, image/webp" onChange={handleImageChange} className="mt-4 w-full" />
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">สร้างและปรับแต่ง QR Code</h2>
          <div ref={qrRef} className="flex justify-center p-4 border rounded mb-4" style={{ backgroundColor: qrBgColor }}><QRCodeCanvas value={publicUrl} size={qrSize} bgColor={qrBgColor} /></div>
          <div className="space-y-4">
            <div><label className="block text-sm">ขนาด: {qrSize}px</label><input type="range" min="100" max="400" value={qrSize} onChange={(e) => setQrSize(Number(e.target.value))} className="w-full" /></div>
            <div><label className="block text-sm">สีพื้นหลัง:</label><input type="color" value={qrBgColor} onChange={(e) => setQrBgColor(e.target.value)} className="w-full h-10 cursor-pointer" /></div>
            <button onClick={downloadQR} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">ดาวน์โหลดภาพ QR Code</button>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
        <h2 className="text-xl font-bold mb-4">แก้ไขข้อมูล (SKU: {product.sku})</h2>
        <div><label className="block text-sm">ชื่อสินค้า</label><input type="text" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full border rounded p-2" required /></div>
        <div><label className="block text-sm">หมวดหมู่</label><select value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} className="w-full border rounded p-2"><option value="">-- เลือก --</option><option value="Cleanser">Cleanser</option><option value="Toner">Toner</option><option value="Serum">Serum</option><option value="Moisturizer">Moisturizer</option><option value="Sunscreen">Sunscreen</option><option value="Mask">Mask</option></select></div>
        <div><label className="block text-sm">ราคา (บาท)</label><input type="number" min="1" value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} className="w-full border rounded p-2" required /></div>
        <div><label className="block text-sm">ขนาด</label><input type="text" value={formData.size} onChange={e=>setFormData({...formData, size: e.target.value})} className="w-full border rounded p-2" /></div>
        <div><label className="block text-sm">รายละเอียด</label><textarea value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className="w-full border rounded p-2" rows="3"></textarea></div>
        <div><label className="block text-sm">วิธีใช้</label><textarea value={formData.how_to_use} onChange={e=>setFormData({...formData, how_to_use: e.target.value})} className="w-full border rounded p-2" rows="2"></textarea></div>
        <div><label className="block text-sm">สถานะ</label><select value={formData.status} onChange={e=>setFormData({...formData, status: e.target.value})} className="w-full border rounded p-2"><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-4">{loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}</button>
      </form>
    </div>
  );
}
