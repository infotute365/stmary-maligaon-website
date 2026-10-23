import { sendError } from '../security/errors.js'
import ManagingCommittee from '../models/ManagingCommittee.js'
import { deleteFile } from '../middleware/upload.js'

export const createCommittee = async (req, res) => {
  try {
    const { name, designation, address, tenure, order, isActive } = req.body
    const image = req.file ? `/uploads/images/${req.file.filename}` : null

    const committee = await ManagingCommittee.create({
      isActive: isActive === undefined ? true : isActive,
      name,
      designation,
      image,
      address,
      tenure,
      order: order || 0
    })

    res.status(201).json({ success: true, data: committee })
  } catch (error) {
    sendError(res, error)
  }
}

export const getCommittee = async (req, res) => {
  try {
    const committee = await ManagingCommittee.find({ isActive: true }).sort({ order: 1, createdAt: -1 })
    res.json({ success: true, data: committee })
  } catch (error) {
    sendError(res, error)
  }
}

export const getAllCommittee = async (req, res) => {
  try {
    const committee = await ManagingCommittee.find().sort({ order: 1, createdAt: -1 })
    res.json({ success: true, data: committee })
  } catch (error) {
    sendError(res, error)
  }
}

export const getCommitteeById = async (req, res) => {
  try {
    const committee = await ManagingCommittee.findOne({ _id: req.params.id, isActive: true })
    if (!committee) {
      return res.status(404).json({ success: false, message: 'Committee member not found' })
    }
    res.json({ success: true, data: committee })
  } catch (error) {
    sendError(res, error)
  }
}

export const updateCommittee = async (req, res) => {
  try {
    const committee = await ManagingCommittee.findById(req.params.id)
    if (!committee) {
      return res.status(404).json({ success: false, message: 'Committee member not found' })
    }

    const { name, designation, address, tenure, order, isActive } = req.body
    let image = committee.image

    if (req.file) {
      if (committee.image) {
        const oldPath = `uploads/images/${committee.image.split('/').pop()}`
        await deleteFile(oldPath, req)
      }
      image = `/uploads/images/${req.file.filename}`
    }

    const updated = await ManagingCommittee.findByIdAndUpdate(
      req.params.id,
      { name, designation, image, address, tenure, order, isActive },
      { new: true, runValidators: true }
    )

    if (!updated) return res.status(404).json({ success: false, message: 'Record no longer exists' })
    res.json({ success: true, data: updated })
  } catch (error) {
    sendError(res, error)
  }
}

export const deleteCommittee = async (req, res) => {
  try {
    const committee = await ManagingCommittee.findById(req.params.id)
    if (!committee) {
      return res.status(404).json({ success: false, message: 'Committee member not found' })
    }

    if (committee.image) {
      const oldPath = `uploads/images/${committee.image.split('/').pop()}`
      await deleteFile(oldPath, req)
    }

    await committee.deleteOne()
    res.json({ success: true, message: 'Deleted successfully' })
  } catch (error) {
    sendError(res, error)
  }
}
