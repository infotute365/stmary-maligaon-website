import { sendError } from '../security/errors.js'
import Staff from '../models/Staff.js'
import { deleteFile } from '../middleware/upload.js'

export const createStaff = async (req, res) => {
  try {
    const { name, designation, dob, qualification, experience, dateOfAppointment, typeOfAppointment, order, isActive } = req.body
    const image = req.file ? `/uploads/images/${req.file.filename}` : null

    const staff = await Staff.create({
      isActive: isActive === undefined ? true : isActive,
      name,
      designation,
      image,
      dob: dob || null,
      qualification,
      experience: experience || 0,
      dateOfAppointment: dateOfAppointment || null,
      typeOfAppointment: typeOfAppointment || 'permanent',
      order: order || 0
    })

    res.status(201).json({ success: true, data: staff })
  } catch (error) {
    sendError(res, error)
  }
}

export const getStaff = async (req, res) => {
  try {
    const staff = await Staff.find({ isActive: true }).sort({ order: 1, createdAt: -1 })
    res.json({ success: true, data: staff })
  } catch (error) {
    sendError(res, error)
  }
}

export const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find().sort({ order: 1, createdAt: -1 })
    res.json({ success: true, data: staff })
  } catch (error) {
    sendError(res, error)
  }
}

export const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findOne({ _id: req.params.id, isActive: true })
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found' })
    }
    res.json({ success: true, data: staff })
  } catch (error) {
    sendError(res, error)
  }
}

export const updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id)
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found' })
    }

    const { name, designation, dob, qualification, experience, dateOfAppointment, typeOfAppointment, order, isActive } = req.body
    let image = staff.image

    if (req.file) {
      if (staff.image) {
        const oldPath = `uploads/images/${staff.image.split('/').pop()}`
        await deleteFile(oldPath, req)
      }
      image = `/uploads/images/${req.file.filename}`
    }

    const updated = await Staff.findByIdAndUpdate(
      req.params.id,
      { name, designation, image, dob, qualification, experience, dateOfAppointment, typeOfAppointment, order, isActive },
      { new: true, runValidators: true }
    )

    if (!updated) return res.status(404).json({ success: false, message: 'Record no longer exists' })
    res.json({ success: true, data: updated })
  } catch (error) {
    sendError(res, error)
  }
}

export const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id)
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found' })
    }

    if (staff.image) {
      const oldPath = `uploads/images/${staff.image.split('/').pop()}`
      await deleteFile(oldPath, req)
    }

    await staff.deleteOne()
    res.json({ success: true, message: 'Deleted successfully' })
  } catch (error) {
    sendError(res, error)
  }
}
