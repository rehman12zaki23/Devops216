const express=require('express');
const {addProduct,deleteProduct,fetchAllProduct,editProduct}=require('../controllers/ProductController')
const router=express.Router();

router.post('/add',addProduct);
router.put('/edit/:id',editProduct);
router.delete('/delete/:id',deleteProduct);
router.get('/fetch',fetchAllProduct);

module.exports=router

