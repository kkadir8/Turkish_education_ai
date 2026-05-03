import { NextResponse } from 'next/server';
import { logout } from '@/lib/auth';

export async function POST() {
  try {
    await logout();
    return NextResponse.json({ message: 'Çıkış başarılı.' }, { status: 200 });
  } catch (error) {
    console.error('Çıkış hatası:', error);
    return NextResponse.json({ error: 'Bir hata oluştu.' }, { status: 500 });
  }
}
