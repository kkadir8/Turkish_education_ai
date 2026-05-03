import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import User from '@/lib/models/User';

export async function POST() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Oturum bulunamadı.' }, { status: 401 });
    }

    await connectToDatabase();
    
    const user = await User.findById(session.id);
    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı.' }, { status: 404 });
    }

    // Limit kontrolü
    if (user.plan === 'free' && user.usageCount >= 2) {
      return NextResponse.json({ 
        error: 'Ücretsiz kullanım hakkınız bitti. Devamı için Pro üyelik gerekmektedir.',
        limitReached: true 
      }, { status: 403 });
    }

    // Kullanımı artır
    user.usageCount += 1;
    await user.save();

    return NextResponse.json({ success: true, usageCount: user.usageCount }, { status: 200 });
  } catch (error) {
    console.error('Kullanım artırma hatası:', error);
    return NextResponse.json({ error: 'Bir hata oluştu.' }, { status: 500 });
  }
}
