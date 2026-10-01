'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeCanvas } from 'qrcode.react';

export default function ProductEditForm({ product }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: product.name || '', category: product.category || '', price: product.price || '',
    size: product.size || '', description: product.description || '', how_to_use: product.how_to_use || '', status: product.status || 'active',
  });
  
  // แปลง images จาก JSON string ให้เป็น Array
  const initImages = product.images ? JSON.parse(product.images) : (product.imageUrl ? [product.imageUrl] : []);
  
  const [existingImages, setExistingImages] = useState(initImages);
  const [newFiles, setNewFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  
  const [loading, setLoading] = useState(false);

  const [qrSize, setQrSize] = useState(200);
  const [qrBgColor, setQrBgColor] = useState('#FFFFFF');
  const qrRef = useRef();
  const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/p/${product.sku}`;

  const isDataIncomplete = product.price <= 0;

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const newPreviews = [];

    files.forEach(file => {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return alert(`ไฟล์ ${file.name} ไม่รองรับ (รับเฉพาะ JPG, PNG, WEBP)`);
      if (file.size > 2 * 1024 * 1024) return alert(`ไฟล์ ${file.name} ใหญ่เกิน 2 MB`);
      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    setNewFiles([...newFiles, ...validFiles]);
    setPreviewImages([...previewImages, ...newPreviews]);
  };

  const removeExistingImage = (index) => {
    const updated = [...existingImages];
    updated.splice(index, 1);
    setExistingImages(updated);
  };

  const removeNewFile = (index) => {
    const updatedFiles = [...newFiles];
    updatedFiles.splice(index, 1);
    setNewFiles(updatedFiles);

    const updatedPreviews = [...previewImages];
    updatedPreviews.splice(index, 1);
    setPreviewImages(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const submitData = new FormData();
    Object.keys(formData).forEach(key => submitData.append(key, formData[key]));
    
    // ส่งข้อมูลรูปเก่าที่เหลืออยู่
    submitData.append('existingImages', JSON.stringify(existingImages));
    // ส่งไฟล์รูปใหม่ทั้งหมด
    newFiles.forEach(file => {
      submitData.append('images', file);
    });

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
          <h2 className="text-xl font-bold mb-4">รูปภาพสินค้า (ใส่ได้หลายรูป)</h2>
          
          <div className="grid grid-cols-3 gap-2 mb-4">
            {/* รูปเก่า */}
            {existingImages.map((imgUrl, idx) => (
              <div key={`exist-${idx}`} className="relative aspect-square border rounded overflow-hidden group">
                <img src={imgUrl} className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeExistingImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition">✕</button>
              </div>
            ))}
            {/* รูปใหม่ที่เพิ่งเลือก */}
            {previewImages.map((imgUrl, idx) => (
              <div key={`new-${idx}`} className="relative aspect-square border-2 border-green-300 rounded overflow-hidden group">
                <img src={imgUrl} className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeNewFile(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition">✕</button>
              </div>
            ))}
          </div>

          <input type="file" multiple accept="image/jpeg, image/png, image/webp" onChange={handleImageChange} className="mt-4 w-full text-sm" />
          <p className="text-xs text-gray-400 mt-2">เลือกไฟล์ได้ทีละหลายไฟล์ (ลากคลุมตอนเลือกไฟล์)</p>
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
        
        {isDataIncomplete && (
          <div className="p-3 bg-red-100 text-red-800 border border-red-300 rounded text-sm font-semibold mb-4">
            ⚠️ ข้อมูลที่นำเข้าจาก Excel ไม่สมบูรณ์ หรือ มีข้อมูลผิดพลาด กรุณาตรวจสอบและแก้ไขข้อมูลให้ถูกต้อง (เช่น ราคา) ก่อนนำไปใช้งาน
          </div>
        )}

        <div><label className="block text-sm font-bold">ชื่อสินค้า</label><input type="text" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full border rounded p-2" required /></div>
        <div><label className="block text-sm font-bold">หมวดหมู่</label><select value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} className="w-full border rounded p-2"><option value="">-- เลือก --</option><option value="Cleanser">Cleanser</option><option value="Toner">Toner</option><option value="Serum">Serum</option><option value="Moisturizer">Moisturizer</option><option value="Sunscreen">Sunscreen</option><option value="Mask">Mask</option><option value="Lotion">Lotion</option></select></div>
        <div><label className="block text-sm font-bold">ราคา (บาท) <span className="text-red-500">*</span></label><input type="number" min="1" value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} className={`w-full border rounded p-2 ${formData.price <= 0 ? 'border-red-500 bg-red-50' : ''}`} required /></div>
        <div><label className="block text-sm font-bold">ขนาด</label><input type="text" value={formData.size} onChange={e=>setFormData({...formData, size: e.target.value})} className="w-full border rounded p-2" /></div>
        <div><label className="block text-sm font-bold">รายละเอียด</label><textarea value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className="w-full border rounded p-2" rows="3"></textarea></div>
        <div><label className="block text-sm font-bold">วิธีใช้</label><textarea value={formData.how_to_use} onChange={e=>setFormData({...formData, how_to_use: e.target.value})} className="w-full border rounded p-2" rows="2"></textarea></div>
        <div><label className="block text-sm font-bold">สถานะ</label><select value={formData.status} onChange={e=>setFormData({...formData, status: e.target.value})} className={`w-full border rounded p-2 ${formData.status === 'inactive' ? 'border-red-300 text-red-600' : ''}`}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-4 font-bold text-lg">{loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}</button>
      </form>
    </div>
  );
}
