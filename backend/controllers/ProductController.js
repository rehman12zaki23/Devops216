const express=require('express');
const Product=require('../models/Product')

// add a new Product
  const addProduct=async(req,res)=>{
    try {
      const {title,description,category,brand,price,salePrice,totalStock,image}=req.body;

      const addNewProduct=new Product({
          title,description,category,brand,price,salePrice,totalStock,image
      })

      await addNewProduct.save();
      res.status(201).json({
        success:true,
        data:addNewProduct
      })
      
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success:false,
        message:'Error occured while adding product'
      })
    }
  }

// fetch all products
  const fetchAllProduct=async(req,res)=>{
    try {
      const allProducts=await Product.find({});
      res.status(200).json({
        message:true,
        data:allProducts
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success:false,
        message:'Error occured while adding product'

      })
    }
  }


// edit a product
  const editProduct=async(req,res)=>{
    try {
      const {id}=req.params;
      const {title,description,category,brand,price,salePrice,totalStock,image}=req.body;
      const findProduct=await Product.findById(id);
      if(!findProduct) return res.status(404).json({success:false,message:'Product Not found'})
        findProduct.title=title || findProduct.title
        findProduct.description=description || findProduct.description
        findProduct.category=category || findProduct.category
        findProduct.brand=brand || findProduct.brand
        findProduct.price=price || findProduct.price
        findProduct.salePrice=salePrice || findProduct.salePrice
        findProduct.totalStock=totalStock || findProduct.totalStock
        findProduct.image=image || findProduct.image

        await findProduct.save();
        res.status(200).json({
          success:true,
          data:findProduct
        })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success:false,
        message:'Error occured while adding product'

      })
    }
  }


// delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: deletedProduct,
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error occurred while deleting product',
    });
  }
};

  module.exports={addProduct,editProduct,deleteProduct,fetchAllProduct}