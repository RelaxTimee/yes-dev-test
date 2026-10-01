import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  const { email, password } = await req.json();

  // สร้าง Super Admin อัตโนมัติถ้าไม่มี User ในระบบเลย
  const count = await prisma.user.count();
  if (count === 0) {
    await prisma.user.create({
      data: { email: 'superadmin@luma.com', password: 'password', role: 'super_admin' }
    });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (user && user.password === password) {
    const res = NextResponse.json({ message: 'สำเร็จ', role: user.role });
    // เซ็ต Cookie พร้อมบอก Role
    res.cookies.set('adminAuth', 'true', { path: '/' });
    res.cookies.set('adminRole', user.role, { path: '/' });
    return res;
  }

  return NextResponse.json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง (ลอง superadmin@luma.com / password)' }, { status: 401 });
}
