import { sendError } from '../security/errors.js'
import TeachingStaff from '../models/TeachingStaff.js'
import { deleteFile } from '../middleware/upload.js'

export const createTeachingStaff = async (req, res) => {
  try {
    const { name, designation, category, dob, qualification, experience, dateOfAppointment, typeOfAppointment, order, isActive } = req.body
    const image = req.file ? `/uploads/images/${req.file.filename}` : null

    const teachingStaff = await TeachingStaff.create({
      isActive: isActive === undefined ? true : isActive,
      name,
      designation,
      category: category || 'tgt',
      image,
      dob: dob || null,
      qualification,
      experience: experience || 0,
      dateOfAppointment: dateOfAppointment || null,
      typeOfAppointment: typeOfAppointment || 'permanent',
      order: order || 0
    })

    res.status(201).json({ success: true, data: teachingStaff })
  } catch (error) {
    sendError(res, error)
  }
}

export const getTeachingStaff = async (req, res) => {
  try {
    const teachingStaff = await TeachingStaff.find({ isActive: true }).sort({ order: 1, createdAt: -1 })
    res.json({ success: true, data: teachingStaff })
  } catch (error) {
    sendError(res, error)
  }
}

export const getAllTeachingStaff = async (req, res) => {
  try {
    const teachingStaff = await TeachingStaff.find().sort({ order: 1, createdAt: -1 })
    res.json({ success: true, data: teachingStaff })
  } catch (error) {
    sendError(res, error)
  }
}

export const getTeachingStaffById = async (req, res) => {
  try {
    const teachingStaff = await TeachingStaff.findOne({ _id: req.params.id, isActive: true })
    if (!teachingStaff) {
      return res.status(404).json({ success: false, message: 'Teaching staff member not found' })
    }
    res.json({ success: true, data: teachingStaff })
  } catch (error) {
    sendError(res, error)
  }
}

export const updateTeachingStaff = async (req, res) => {
  try {
    const teachingStaff = await TeachingStaff.findById(req.params.id)
    if (!teachingStaff) {
      return res.status(404).json({ success: false, message: 'Teaching staff member not found' })
    }

    const { name, designation, category, dob, qualification, experience, dateOfAppointment, typeOfAppointment, order, isActive } = req.body
    let image = teachingStaff.image

    if (req.file) {
      if (teachingStaff.image) {
        const oldPath = `uploads/images/${teachingStaff.image.split('/').pop()}`
        await deleteFile(oldPath, req)
      }
      image = `/uploads/images/${req.file.filename}`
    }

    const updated = await TeachingStaff.findByIdAndUpdate(
      req.params.id,
      { name, designation, category, image, dob, qualification, experience, dateOfAppointment, typeOfAppointment, order, isActive },
      { new: true, runValidators: true }
    )

    if (!updated) return res.status(404).json({ success: false, message: 'Record no longer exists' })
    res.json({ success: true, data: updated })
  } catch (error) {
    sendError(res, error)
  }
}

export const deleteTeachingStaff = async (req, res) => {
  try {
    const teachingStaff = await TeachingStaff.findById(req.params.id)
    if (!teachingStaff) {
      return res.status(404).json({ success: false, message: 'Teaching staff member not found' })
    }

    if (teachingStaff.image) {
      const oldPath = `uploads/images/${teachingStaff.image.split('/').pop()}`
      await deleteFile(oldPath, req)
    }

    await teachingStaff.deleteOne()
    res.json({ success: true, message: 'Deleted successfully' })
  } catch (error) {
    sendError(res, error)
  }
}
