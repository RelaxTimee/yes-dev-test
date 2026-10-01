import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import fs from 'fs';

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const formData = await req.formData();
    
    let imageUrl = formData.get('existingImageUrl');
    const file = formData.get('image');

    if (file && file !== 'null') {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) await mkdir(uploadDir, { recursive: true });

      const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
      await writeFile(path.join(uploadDir, fileName), buffer);
      imageUrl = `/uploads/${fileName}`; 
    }

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name: formData.get('name'), category: formData.get('category'), price: parseFloat(formData.get('price')),
        size: formData.get('size'), description: formData.get('description'), how_to_use: formData.get('how_to_use'),
        status: formData.get('status'), imageUrl
      }
    });

    return NextResponse.json({ message: 'สำเร็จ', product: updatedProduct });
  } catch (error) {
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
}
