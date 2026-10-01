import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  const { token, password } = await req.json();

  const invite = await prisma.invite.findUnique({ where: { token } });

  if (!invite || invite.used) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
  }

  // สร้าง User ใหม่ด้วย Role = admin
  await prisma.user.create({
    data: {
      email: invite.email,
      password: password, // แบบง่าย ไม่ได้ hash ตามข้อจำกัดเวลา
      role: 'admin'
    }
  });

  // อัปเดต Invite ว่าถูกใช้แล้ว
  await prisma.invite.update({
    where: { id: invite.id },
    data: { used: true }
  });

  return NextResponse.json({ message: 'Success' });
}
