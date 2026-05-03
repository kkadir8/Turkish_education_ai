import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  plan: 'free' | 'pro';
  usageCount: number;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  plan: { type: String, enum: ['free', 'pro'], default: 'free' },
  usageCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// To prevent redefining the model in Next.js development server
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
