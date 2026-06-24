const express = require('express');
const router = express.Router();

// ✅ Load environment variables FIRST
require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Cart = require('../models/Cart');
const mongoose = require('mongoose');

router.post('/create-checkout-session', async (req, res) => {
  const { userId, cartItems } = req.body;

  try {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid or missing userId' });
    }

    let items;
    if (cartItems && Array.isArray(cartItems) && cartItems.length > 0) {
      items = cartItems;
    } else {
      const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) })
        .populate('items.productId');

      if (!cart || cart.items.length === 0) {
        return res.status(404).json({ error: 'Cart is empty or not found' });
      }

      items = cart.items.map(item => ({
        productId: item.productId._id,
        name: item.productId.title,
        price: item.productId.price,
        quantity: item.quantity,
        image: item.productId.image
      }));
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items to checkout' });
    }

    const lineItems = items.map(item => {
      if (!item.price || item.price <= 0 || !item.quantity || item.quantity <= 0) {
        throw new Error(`Invalid item data: ${item.name || 'Unknown item'}`);
      }

      const productData = {
        name: (item.name || 'Product').substring(0, 100),
        description: `Quantity: ${item.quantity}`.substring(0, 300),
      };

      if (
        item.image &&
        typeof item.image === 'string' &&
        item.image.length < 2000 &&
        (item.image.startsWith('http://') || item.image.startsWith('https://'))
      ) {
        productData.images = [item.image];
      }

      return {
        price_data: {
          currency: 'usd',
          product_data: productData,
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      success_url: `http://localhost:5173/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: 'http://localhost:5173/cart',
      metadata: {
        userId: userId.toString(),
      },
    });

    console.log('Stripe session created:', session.id);
    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error('Stripe session creation error:', error);
    let errorMessage = 'Failed to create checkout session';

    if (error.message?.includes('URL must be 2048 characters or less')) {
      errorMessage = 'Product information too long. Please try with fewer items.';
    } else if (error.message?.includes('Invalid URL')) {
      errorMessage = 'Invalid product image URL detected.';
    } else if (error.type === 'StripeInvalidRequestError') {
      errorMessage = 'Invalid request to payment processor: ' + error.message;
    }

    res.status(500).json({
      error: errorMessage,
      details: error.message,
    });
  }
});

module.exports = router;
