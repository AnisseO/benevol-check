import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['bénévole', 'responsable'], default: 'bénévole' }
});

export default mongoose.model('User', userSchema);