import mongoose from 'mongoose'
import { contentGroups } from '../../content/registry.js'

const siteContentSchema = new mongoose.Schema({
  // The stable key is also MongoDB's primary key, so uniqueness does not depend on index setup.
  _id: { type: String, required: true },
  key: { type: String, required: true, immutable: true },
  group: { type: String, enum: Object.keys(contentGroups), required: true, immutable: true },
  value: { type: mongoose.Schema.Types.Mixed, default: null },
  revision: { type: Number, required: true, min: 1 },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
}, { timestamps: true, strict: 'throw' })

const SiteContent = mongoose.models.SiteContent || mongoose.model('SiteContent', siteContentSchema)
export default SiteContent
