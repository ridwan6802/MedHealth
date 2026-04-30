const Medicine = require('../models/Medicine');

const getMedicines = async (req, res, next) => {
  try {
    const medicines = await Medicine.find().populate('category').sort({ name: 1 });
    return res.json(medicines);
  } catch (error) {
    return next(error);
  }
};

const createMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.create(req.body);
    const populatedMedicine = await Medicine.findById(medicine._id).populate('category');
    return res.status(201).json(populatedMedicine);
  } catch (error) {
    return next(error);
  }
};

const updateMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('category');
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    return res.json(medicine);
  } catch (error) {
    return next(error);
  }
};

const deleteMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    return res.json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getMedicines, createMedicine, updateMedicine, deleteMedicine };
