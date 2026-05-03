import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import User from '@/lib/models/User';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 403 });
    }

    await connectToDatabase();
    
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Kullanıcıları getirme hatası:', error);
    return NextResponse.json({ error: 'Bir hata oluştu.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 403 });
    }

    const { userId, plan } = await request.json();

    if (!userId || !['free', 'pro'].includes(plan)) {
      return NextResponse.json({ error: 'Geçersiz parametreler.' }, { status: 400 });
    }

    await connectToDatabase();
    
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı.' }, { status: 404 });
    }

    user.plan = plan;
    await user.save();

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    console.error('Kullanıcı güncelleme hatası:', error);
    return NextResponse.json({ error: 'Bir hata oluştu.' }, { status: 500 });
  }
}
