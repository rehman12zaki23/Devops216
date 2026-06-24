const express = require("express");
const {
  addToCart,
  fetchCartItems,
  updateQuantity,
  deleteItem,     
  clearCart       
} = require("../controllers/cart-controller");

const router = express.Router();

router.post("/add", addToCart);
router.get("/get/:userId", fetchCartItems);
router.put("/update/:userId/:productId", updateQuantity);
router.delete("/delete/:userId/:productId", deleteItem);  
router.delete("/clear/:userId", clearCart);             

module.exports = router;
