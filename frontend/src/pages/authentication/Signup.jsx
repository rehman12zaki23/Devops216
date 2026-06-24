import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {useDispatch} from 'react-redux'
import { registerUser } from '../../redux/Slices/authSlice';
import toast from 'react-hot-toast';
const Signup = () => {
  const [name, setname] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const dispatch=useDispatch()
  const navigate=useNavigate();

 const handleSignUp = (e) => {
  e.preventDefault();

  const data = {
    userName: name,
    email,
    password,
  };

  dispatch(registerUser(data)).then((datava) => {
  const res = datava?.payload;
  if (res?.success) {
    toast.success(res.message || 'Registration Successful');
    navigate('/auth/login');
  } else {
    toast.error(res?.message || 'User already exists with the same email');
    
  }
});

};

  return (
    <div className="w-full max-w-md p-8 rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
      <form onSubmit={handleSignUp} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setname(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setemail(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setpassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button
          type="submit"
          className="w-full py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800 transition"
        >
          Sign Up
        </button>
      </form>
      <p className="text-sm text-center mt-4">
        Already have an account?{' '}
        <Link to="/auth/login" className="text-blue-600 hover:underline">
          Log In
        </Link>
      </p>
    </div>
  );
};

export default Signup;
