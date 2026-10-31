import mongoose from 'mongoose'

const fileVersionSchema = new mongoose.Schema({
  path: { type: String, required: true },
  originalName: { type: String, required: true, maxlength: 180 },
  size: { type: Number, required: true, min: 1, max: 10 * 1024 * 1024 },
  sha256: { type: String, required: true },
  uploadedAt: { type: Date, required: true },
}, { _id: false, strict: 'throw' })

const disclosureDocumentSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  type: { type: String, enum: ['fixed', 'additional'], required: true, immutable: true },
  // Unique bounded slots enforce a maximum of 50 additional documents across instances.
  slot: { type: Number, min: 0, max: 49, unique: true, sparse: true, immutable: true },
  title: { type: String, maxlength: 160 },
  titleKey: { type: String, unique: true, sparse: true },
  current: { type: fileVersionSchema, default: null },
  previous: { type: fileVersionSchema, default: null },
  active: { type: Boolean, default: true },
  revision: { type: Number, min: 1, required: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
}, { timestamps: true, strict: 'throw' })

const DisclosureDocument = mongoose.models.DisclosureDocument || mongoose.model('DisclosureDocument', disclosureDocumentSchema)
export default DisclosureDocument
