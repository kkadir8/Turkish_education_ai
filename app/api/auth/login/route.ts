import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/db';
import User from '@/lib/models/User';
import { login } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (!normalizedEmail || !password) {
      return NextResponse.json({ error: 'Lütfen tüm alanları doldurun.' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı.' }, { status: 401 });
    }

    if (!user.password) {
      return NextResponse.json({ error: 'Bu hesap için şifre ile giriş aktif değil.' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Hatalı şifre.' }, { status: 401 });
    }

    // Create session cookie
    await login(user);

    return NextResponse.json({ message: 'Giriş başarılı.' }, { status: 200 });
  } catch (error) {
    console.error('Giriş hatası:', error);
    return NextResponse.json({ error: 'Bir hata oluştu.' }, { status: 500 });
  }
}
