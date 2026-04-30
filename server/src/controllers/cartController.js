const Cart = require('../models/Cart');
const Medicine = require('../models/Medicine');

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.medicine');
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
    cart = await Cart.findById(cart._id).populate('items.medicine');
  }
  return cart;
};

const getCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    return res.json(cart);
  } catch (error) {
    return next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const { medicineId, quantity = 1 } = req.body;
    const medicine = await Medicine.findById(medicineId);

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    const requestedQuantity = Number(quantity);
    if (requestedQuantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find((item) => item.medicine.toString() === medicineId);
    const nextQuantity = existingItem ? existingItem.quantity + requestedQuantity : requestedQuantity;

    if (nextQuantity > medicine.stock) {
      return res.status(400).json({ message: `Only ${medicine.stock} items available in stock` });
    }

    if (existingItem) {
      existingItem.quantity = nextQuantity;
    } else {
      cart.items.push({ medicine: medicineId, quantity: requestedQuantity });
    }

    await cart.save();
    cart = await Cart.findById(cart._id).populate('items.medicine');
    return res.status(201).json(cart);
  } catch (error) {
    return next(error);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const { medicineId } = req.params;
    const { quantity } = req.body;
    const requestedQuantity = Number(quantity);

    if (requestedQuantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const cartItem = cart.items.find((item) => item.medicine.toString() === medicineId);
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    if (requestedQuantity > medicine.stock) {
      return res.status(400).json({ message: `Only ${medicine.stock} items available in stock` });
    }

    cartItem.quantity = requestedQuantity;
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.medicine');
    return res.json(populatedCart);
  } catch (error) {
    return next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const { medicineId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter((item) => item.medicine.toString() !== medicineId);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.medicine');
    return res.json(populatedCart);
  } catch (error) {
    return next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.json({ message: 'Cart already empty' });
    }

    cart.items = [];
    await cart.save();

    return res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
