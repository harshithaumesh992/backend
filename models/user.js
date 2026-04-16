const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  address: { type: String, required: false },  // Made optional for registration
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  permissions: {
    viewProducts: { type: Boolean, default: false },
    viewCart: { type: Boolean, default: false },
    viewProfile: { type: Boolean, default: false },
    viewPayment: { type: Boolean, default: false },
    manageOrders: { type: Boolean, default: false },
    manageUsers: { type: Boolean, default: false },
    viewAnalytics: { type: Boolean, default: false },
    manageChat: { type: Boolean, default: false }
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  console.log('Pre-save hook triggered for user:', this.email);
  if (!this.isModified('password')) {
    console.log('Password not modified, skipping hash');
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('Password hashed successfully');
    next();
  } catch (error) {
    console.error('Error hashing password:', error);
    next(error);
  }
});

// Compare password method
userSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);