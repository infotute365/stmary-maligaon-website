import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  sessionVersion: { type: Number, default: 0 },
  name: {
    type: String,
    default: 'Admin'
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, { timestamps: true })

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  if (!this.isNew) this.sessionVersion = (this.sessionVersion || 0) + 1
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

adminSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

const Admin = mongoose.models.Admin ||  mongoose.model('Admin', adminSchema)
export default Admin
