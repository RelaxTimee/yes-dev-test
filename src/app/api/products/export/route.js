import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as xlsx from 'xlsx';

export async function GET() {
  try {
    // 1. ดึงข้อมูลสินค้าทั้งหมด
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // 2. แปลงโครงสร้าง (Map) ให้หัวตารางเหมือนไฟล์ Template เป๊ะๆ
    const formattedData = products.map(p => ({
      'SKU': p.sku || '',
      'ชื่อสินค้า': p.name || '',
      'หมวดหมู่': p.category || '',
      'ราคา': p.price || 0,
      'ขนาด': p.size || '',
      'วิธีใช้': p.how_to_use || '',
      'รายละเอียด': p.description || ''
    }));

    // 3. สร้างไฟล์ Excel
    const worksheet = xlsx.utils.json_to_sheet(formattedData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Products');

    // 4. แปลงเป็น Buffer สำหรับดาวน์โหลด
    const buf = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // 5. ส่งกลับเป็นไฟล์ .xlsx
    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Disposition': 'attachment; filename="Luma_Products_Export.xlsx"',
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    });

  } catch (error) {
    return NextResponse.json({ error: 'ไม่สามารถสร้างไฟล์ Excel ได้: ' + error.message }, { status: 500 });
  }
}
