import { deleteFile } from '../middleware/upload.js'
import { sendError } from '../security/errors.js'
import Circular from "../models/Circular.js";

export const createCircular = async (req, res) => {
  try {
    const { title, description, date, time, order, isActive } = req.body;
    const pdf = req.file ? `/api/files/circulars/${req.file.filename}` : null;

    const circularData = {
      isActive: isActive === undefined ? true : isActive,
      title,
      description,
      date: date || new Date(),
      time: time || "00:00:00",
      pdf,
      order: order || 0,
    }
    const circular = await Circular.create(circularData);

    res.status(201).json({ success: true, data: circular });
  } catch (error) {
    sendError(res, error);
  }
};

export const getCirculars = async (req, res) => {
  try {
    const circulars = await Circular.find({ isActive: true }).sort({
      order: 1,
      createdAt: -1,
    });
    res.json({ success: true, data: circulars });
  } catch (error) {
    sendError(res, error);
  }
};

export const getAllCirculars = async (req, res) => {
  try {
    const circulars = await Circular.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: circulars });
  } catch (error) {
    sendError(res, error);
  }
};

export const getCircularById = async (req, res) => {
  try {
    const circular = await Circular.findOne({ _id: req.params.id, isActive: true });
    if (!circular) {
      return res
        .status(404)
        .json({ success: false, message: "Circular not found" });
    }
    res.json({ success: true, data: circular });
  } catch (error) {
    sendError(res, error);
  }
};

export const updateCircular = async (req, res) => {
  try {
    const circular = await Circular.findById(req.params.id);
    if (!circular) {
      return res
        .status(404)
        .json({ success: false, message: "Circular not found" });
    }

    const { title, description, date, time, order, isActive } = req.body;
    let pdf = circular.pdf;

    if (req.file) {
      if (circular.pdf) await deleteFile(`uploads/circulars/${circular.pdf.split("/").pop()}`, req);
      pdf = `/api/files/circulars/${req.file.filename}`;
    }

    const update = { title, description, date, time, pdf, order, isActive };
    const updated = await Circular.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true },
    );

    if (!updated) return res.status(404).json({ success: false, message: 'Record no longer exists' })
    res.json({ success: true, data: updated });
  } catch (error) {
    sendError(res, error);
  }
};

export const deleteCircular = async (req, res) => {
  try {
    const circular = await Circular.findById(req.params.id);
    if (!circular) {
      return res
        .status(404)
        .json({ success: false, message: "Circular not found" });
    }

    await circular.deleteOne();
    if (circular.pdf) await deleteFile(`uploads/circulars/${circular.pdf.split("/").pop()}`, req);
    res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    sendError(res, error);
  }
};
