import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import fs from 'fs';

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const formData = await req.formData();
    
    // ดึง existing images จากหน้าเว็บ
    let existingImages = [];
    try {
      existingImages = JSON.parse(formData.get('existingImages') || '[]');
    } catch(e) {}

    // ดึงไฟล์ที่อัปโหลดใหม่
    const files = formData.getAll('images');
    let newImageUrls = [...existingImages];

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) await mkdir(uploadDir, { recursive: true });

    for (const file of files) {
      if (file && file !== 'null' && typeof file !== 'string') {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
        await writeFile(path.join(uploadDir, fileName), buffer);
        newImageUrls.push(`/uploads/${fileName}`);
      }
    }

    // fallback เผื่อไม่มีรูปใน images แต่อาจจะมีรูปเก่าใน imageUrl
    let fallbackImageUrl = newImageUrls.length > 0 ? newImageUrls[0] : formData.get('existingImageUrl');

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name: formData.get('name'), 
        category: formData.get('category'), 
        price: parseFloat(formData.get('price')),
        size: formData.get('size'), 
        description: formData.get('description'), 
        how_to_use: formData.get('how_to_use'),
        status: formData.get('status'), 
        imageUrl: fallbackImageUrl, // เก็บรูปแรกไว้สำหรับหน้าตาราง
        images: JSON.stringify(newImageUrls) // เก็บทุกรูป
      }
    });

    return NextResponse.json({ message: 'สำเร็จ', product: updatedProduct });
  } catch (error) {
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการอัปเดต' }, { status: 500 });
  }
}
