const Product = require('../models/Product');
const Cart = require('../models/Cart');

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity) {
      return res.status(400).json({ 
        success: false, 
        message: "userId, productId, and quantity are required" 
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, quantity }] });
    } else {
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    
    // Populate the cart items before sending response
    await cart.populate('items.productId');
    
    res.status(200).json({ 
      success: true, 
      message: "Item added to cart", 
      data: cart 
    });

  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: 'items.productId',
    });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    res.status(200).json({ success: true, data: cart });

  } catch (error) {
    console.error("Fetch cart error:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;

    if (!userId || !productId || !quantity) {
      return res.status(400).json({ 
        success: false, 
        message: "userId, productId, and quantity are required" 
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
    } else {
      return res.status(404).json({ success: false, message: "Item not found in cart" });
    }

    await cart.save();
    await cart.populate('items.productId');
    
    res.status(200).json({ 
      success: true, 
      message: "Quantity updated", 
      data: cart 
    });

  } catch (error) {
    console.error("Update quantity error:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    if (!userId || !productId) {
      return res.status(400).json({ 
        success: false, 
        message: "userId and productId are required" 
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);

    await cart.save();
    await cart.populate('items.productId');
    
    res.status(200).json({ 
      success: true, 
      message: "Item removed from cart", 
      data: cart 
    });

  } catch (error) {
    console.error("Delete item error:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.items = []; // Remove all items
    await cart.save();

    res.status(200).json({ success: true, message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};


module.exports = {
  addToCart,
  fetchCartItems,
  updateQuantity,
  deleteItem,
  clearCart
};