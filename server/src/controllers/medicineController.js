const Medicine = require('../models/Medicine');
const Category = require('../models/Category');

const buildCategoryLookup = (categories) => {
  const lookup = new Map();

  for (const category of categories) {
    const categoryId = String(category._id || '').trim().toLowerCase();
    const legacyId = String(category.id || '').trim().toLowerCase();
    const categoryName = String(category.name || '').trim().toLowerCase();

    if (categoryId) lookup.set(categoryId, category.name);
    if (legacyId) lookup.set(legacyId, category.name);
    if (categoryName) lookup.set(categoryName, category.name);
  }

  return lookup;
};

const getMedicineCategoryName = (medicine, categoryLookup) => {
  const populatedCategoryName = medicine.category?.name || medicine.category?.categoryName || medicine.category?.title;
  if (populatedCategoryName) {
    return populatedCategoryName;
  }

  const rawCategoryValue =
    medicine.category_id ??
    medicine.categoryId ??
    medicine.category?.id ??
    medicine.category?._id ??
    medicine.category?.name ??
    medicine.category ??
    '';

  const normalizedCategoryValue = String(rawCategoryValue).trim().toLowerCase();
  return categoryLookup.get(normalizedCategoryValue) || 'Unassigned';
};

const getMedicines = async (req, res, next) => {
  try {
    const [medicines, categories] = await Promise.all([
      Medicine.find().populate('category').sort({ name: 1 }),
      Category.find().lean().sort({ name: 1 })
    ]);

    const categoryLookup = buildCategoryLookup(categories);
    const normalizedMedicines = medicines.map((medicine) => {
      const plainMedicine = medicine.toObject ? medicine.toObject() : medicine;
      return {
        ...plainMedicine,
        categoryName: getMedicineCategoryName(plainMedicine, categoryLookup)
      };
    });

    return res.json(normalizedMedicines);
  } catch (error) {
    return next(error);
  }
};

const createMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.create(req.body);
    const populatedMedicine = await Medicine.findById(medicine._id).populate('category');
    const categories = await Category.find().lean().sort({ name: 1 });
    const categoryLookup = buildCategoryLookup(categories);
    const plainMedicine = populatedMedicine.toObject ? populatedMedicine.toObject() : populatedMedicine;
    return res.status(201).json({
      ...plainMedicine,
      categoryName: getMedicineCategoryName(plainMedicine, categoryLookup)
    });
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

    const categories = await Category.find().lean().sort({ name: 1 });
    const categoryLookup = buildCategoryLookup(categories);
    const plainMedicine = medicine.toObject ? medicine.toObject() : medicine;

    return res.json({
      ...plainMedicine,
      categoryName: getMedicineCategoryName(plainMedicine, categoryLookup)
    });
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
