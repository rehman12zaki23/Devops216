const express=require('express');
const {getfilteredProducts,getProductDetails}=require('../controllers/filteredproductscontroller')

const router=express.Router();


router.get('/get',getfilteredProducts)
router.get('/get/:id',getProductDetails)

module.exports=router