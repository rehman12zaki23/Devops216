const Product = require('../models/Product');

const getfilteredProducts = async (req, res) => {
  try {

    const {category,brand,sort}=req.query;

    let filter={};
    if(category){
      const categories=category.split(',');
      filter.category={$in:categories}
    }

    if(brand){
      const brands=brand.split(',');
      filter.brand={$in:brands}
    }
   
    let sortOption={};
    if(sort === 'high'){
      sortOption.price=-1;
    } else if (sort === 'low'){
      sortOption.price=1;
    } else if (sort === 'atz'){
      sortOption.title=1;
    } else if ( sort === 'zta'){
      sortOption.title=-1;
    }
   
    const products = await Product.find(filter).sort(sortOption);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch filtered products',
    });
  }
};

const getProductDetails=async(req,res)=>{
  try {
      const {id}=req.params;
      const product=await Product.find({_id:id});
      res.status(200).json({
        success:true,
        data:product,
      })
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch filtered products',
    });
  }
};

module.exports = { getfilteredProducts,getProductDetails};
