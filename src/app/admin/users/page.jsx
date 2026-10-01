import { prisma } from '@/lib/prisma';
import InviteForm from './InviteForm';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const users = await prisma.user.findMany();
  const invites = await prisma.invite.findMany();

  return (
    <div className="p-6 text-black">
      <h1 className="text-2xl font-bold mb-6">จัดการผู้ใช้งาน (Super Admin Only)</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-bold mb-4">เชิญ Admin ใหม่</h2>
          <InviteForm />
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-bold mb-4">รายชื่อผู้ใช้ในระบบ</h2>
          <ul className="space-y-2">
            {users.map(u => (
              <li key={u.id} className="flex justify-between border-b pb-2">
                <span>{u.email}</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{u.role}</span>
              </li>
            ))}
          </ul>

          <h2 className="text-lg font-bold mt-6 mb-4">คำเชิญที่ยังไม่ตอบรับ</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            {invites.filter(i => !i.used).map(i => (
              <li key={i.id}>- {i.email}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
