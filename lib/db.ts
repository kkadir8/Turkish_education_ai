import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(async (mongoose) => {
      // Varsayılan Admin Kullanıcısını oluştur
      try {
        const adminEmail = 'kerimgedik07@gmail.com';
        const adminExists = await User.findOne({ email: adminEmail });
        
        if (!adminExists) {
          const hashedPassword = await bcrypt.hash('Kerim25.', 10);
          await User.create({
            name: 'Kerim Gedik (Admin)',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
            plan: 'pro'
          });
          console.log('Varsayılan Admin hesabı oluşturuldu.');
        }
      } catch (error) {
        console.error('Admin hesabı oluşturulurken hata:', error);
      }

      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
