const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const User=require('../models/User')


// ************ Registration **************

const registerUser=async(req,res)=>{
  const {userName,email,password}=req.body;

  const checkUser=await User.findOne({email})
  if(checkUser) return res.json({success:false,message:'User already exist with the same email'})
  console.log(req.body);
 try {
     const hashPassword=await bcrypt.hash(password,12);
     const newUser=new User({
      userName,
      email,
      password:hashPassword
     }) 
     await newUser.save()
     res.status(200).json({
      success:true,
      message:'Registration successful'
     })
 } catch (error) {
  console.error(error);
  res.status(500).json({
    success:false,
    message:'Some error occured'
  })
 } 
}

// ************ Login **************
const LoginUser=async(req,res)=>{
  const {email,password}=req.body;

  const checkUser=await User.findOne({email})
  if(!checkUser) return res.json({success:false,message:'User doesnt exist ! Please register yourself first'})
  console.log(req.body);
 try {
     const checkPasswordMatch=await bcrypt.compare(password,checkUser.password);
     if(!checkPasswordMatch) return res.json({success:false,message:'Your Password is incorrect.Please try again'})
       const token=jwt.sign({
        id:checkUser._id,
        email:checkUser.email,
        role:checkUser.role,
        userName:checkUser.userName,
        }, process.env.JWT_SECRET || 'CLIENT_SECRET_KEY',{expiresIn:'60min'})

        const cookieSecure = (process.env.COOKIE_SECURE === 'true');

        res.cookie('token', token, { httpOnly: true, secure: cookieSecure }).json({
        success:true,
        message:'Logged in successfully',
        user:{
          email:checkUser.email,
          role:checkUser.role,
          id:checkUser._id,
          userName:checkUser.userName,
        }
      })
    
 } catch (error) {
  console.error(error);
  res.status(500).json({
    success:false,
    message:'Some error occured'
  })
 }
}

// ************ Logout **************
const logout=(req,res)=>{
  res.clearCookie('token').json({
    success:true,
    message:'Logged out Successfully'
  })
}

// ************** auth middleware ***************
const authMiddleware=async(req,res,next)=>{
  const token=req.cookies.token;
  if(!token) return res.status(401).json({
    success:false,
    message:"Unauthorized user"
  })
  try {
  const decoded=jwt.verify(token, process.env.JWT_SECRET || 'CLIENT_SECRET_KEY');
    req.user=decoded;
    next();

  } catch (error) {
    res.status(401).json({
    success:false,
    message:"Unauthorized user"
  })
  }
}


module.exports={registerUser,LoginUser,logout,authMiddleware}
