const express=require('express')
const {registerUser,LoginUser, logout, authMiddleware}=require('../controllers/authcontroller')


const router=express.Router();

router.post('/signup',registerUser)
router.post('/login',LoginUser)
router.post('/logout',logout)
router.get('/checkauth',authMiddleware,(req,res)=>{
  const user=req.user;
  res.status(200).json({
    success:true,
    message:'Authenticated User',
    user
  })
})


module.exports=router