import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as xlsx from 'xlsx';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    const errors = [];
    let successCount = 0;

    for (const [index, row] of data.entries()) {
      const rowNum = index + 2; 
      const { sku, name, category, price, size, description, how_to_use, status } = row;

      if (!sku || !name) {
        errors.push(`แถวที่ ${rowNum}: ข้อมูลบังคับ (sku, name) หายไป ไม่สามารถนำเข้าได้`);
        continue;
      }

      let isError = false;
      let safePrice = typeof price === 'string' ? parseFloat(price.replace(/,/g, '')) : price;
      let safeStatus = (status || 'active').toString().toLowerCase();

      if (isNaN(safePrice) || safePrice <= 0) {
        errors.push(`แถวที่ ${rowNum} (${sku}): ราคาผิดปกติ (ระบบเซ็ตราคาเป็น 0 และปรับสถานะเป็น inactive ให้แก้ทีหลัง)`);
        safePrice = 0;
        isError = true;
      }

      if (safeStatus !== 'active' && safeStatus !== 'inactive') {
        errors.push(`แถวที่ ${rowNum} (${sku}): status ผิดปกติ (ระบบปรับเป็น inactive ให้)`);
        safeStatus = 'inactive';
        isError = true;
      }

      if (isError) safeStatus = 'inactive'; // ถ้ามีอะไรผิดพลาด ให้ซ่อนจากหน้าเว็บลูกค้าก่อน

      try {
        await prisma.product.upsert({
          where: { sku: sku.toString().toUpperCase() },
          update: { name: name.toString(), category: category?.toString() || null, price: safePrice, size: size?.toString() || null, description: description?.toString() || null, how_to_use: how_to_use?.toString() || null, status: safeStatus },
          create: { sku: sku.toString().toUpperCase(), name: name.toString(), category: category?.toString() || null, price: safePrice, size: size?.toString() || null, description: description?.toString() || null, how_to_use: how_to_use?.toString() || null, status: safeStatus },
        });
        successCount++;
      } catch (err) {
        errors.push(`แถวที่ ${rowNum}: บันทึกข้อมูลล้มเหลว`);
      }
    }

    return NextResponse.json({ message: `อัปโหลดสำเร็จ ${successCount} รายการ`, errors });
  } catch (error) {
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการอ่านไฟล์' }, { status: 500 });
  }
}
