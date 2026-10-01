import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req) {
  const { email } = await req.json();

  const token = crypto.randomBytes(32).toString('hex');

  try {
    const invite = await prisma.invite.create({
      data: { email, token }
    });

    // จำลองการส่งอีเมล (Log ลง Console ตามโจทย์)
    const inviteUrl = `http://localhost:3000/invite?token=${token}`;
    console.log('\n=======================================');
    console.log(`✉️ EMAIL LOG (จำลองการส่งอีเมล):`);
    console.log(`To: ${email}`);
    console.log(`Subject: You are invited to join Luma Admin!`);
    console.log(`Click here to set your password and login:`);
    console.log(inviteUrl);
    console.log('=======================================\n');

    return NextResponse.json({ message: 'Success', invite });
  } catch (error) {
    return NextResponse.json({ error: 'Failed or already invited' }, { status: 400 });
  }
}
