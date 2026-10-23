import { sendError } from '../security/errors.js'
import Gallery from "../models/Gallery.js";
import { deleteFile } from "../middleware/upload.js";

export const createGallery = async (req, res) => {
  try {
    const { eventName, description, date, isActive } = req.body;

    let images = [];

    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => {
        return {
          url: `/uploads/images/${file.filename}`,
          caption: "",
        };
      });
    }

    const gallery = await Gallery.create({
      isActive: isActive === undefined ? true : isActive,
      eventName,
      description,
      images,
      date: date || new Date(),
    });

    res.status(201).json({ success: true, data: gallery });
  } catch (error) {
    console.error("Create gallery error:", error);
    sendError(res, error);
  }
};

export const getGalleries = async (req, res) => {
  try {
    const galleries = await Gallery.find({ isActive: true }).sort({
      date: -1,
      createdAt: -1,
    });
    res.json({ success: true, data: galleries });
  } catch (error) {
    console.error("Get galleries error:", error);
    sendError(res, error);
  }
};

export const getAllGalleries = async (req, res) => {
  try {
    const galleries = await Gallery.find().sort({ date: -1, createdAt: -1 });
    res.json({ success: true, data: galleries });
  } catch (error) {
    console.error("Get all galleries error:", error);
    sendError(res, error);
  }
};

export const getGalleryById = async (req, res) => {
  try {
    const gallery = await Gallery.findOne({ _id: req.params.id, isActive: true });
    if (!gallery) {
      return res
        .status(404)
        .json({ success: false, message: "Gallery not found" });
    }
    res.json({ success: true, data: gallery });
  } catch (error) {
    console.error("Get gallery by id error:", error);
    sendError(res, error);
  }
};

export const updateGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) {
      return res
        .status(404)
        .json({ success: false, message: "Gallery not found" });
    }

    const { eventName, description, date, isActive } = req.body;
    let images = gallery.images;

    if (req.files && req.files.length > 0) {
      for (const img of gallery.images) {
        const oldPath = `uploads/images/${img.url.split("/").pop()}`;
        await deleteFile(oldPath, req);
      }

      images = req.files.map((file) => {
        return {
          url: `/uploads/images/${file.filename}`,
          caption: "",
        };
      });
    }

    const updated = await Gallery.findByIdAndUpdate(
      req.params.id,
      {
        eventName,
        description,
        images,
        date,
        isActive: isActive !== undefined ? isActive : gallery.isActive,
      },
      { new: true, runValidators: true },
    );

    if (!updated) return res.status(404).json({ success: false, message: 'Record no longer exists' })
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("Update gallery error:", error);
    sendError(res, error);
  }
};

export const deleteGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) {
      return res
        .status(404)
        .json({ success: false, message: "Gallery not found" });
    }

    for (const img of gallery.images) {
      const oldPath = `uploads/images/${img.url.split("/").pop()}`;
      await deleteFile(oldPath, req);
    }

    await gallery.deleteOne();
    res.json({ success: true, message: "Gallery deleted successfully" });
  } catch (error) {
    console.error("Delete gallery error:", error);
    sendError(res, error);
  }
};

export const toggleGalleryStatus = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) {
      return res
        .status(404)
        .json({ success: false, message: "Gallery not found" });
    }

    gallery.isActive = !gallery.isActive;
    await gallery.save();

    res.json({
      success: true,
      message: `Gallery ${gallery.isActive ? "activated" : "deactivated"} successfully`,
      data: gallery,
    });
  } catch (error) {
    console.error("Toggle gallery status error:", error);
    sendError(res, error);
  }
};
