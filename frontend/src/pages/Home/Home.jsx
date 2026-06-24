import React from 'react'
import Navbar from '../../components/Home/Navbar'
import Mainpage from '../../components/Home/Mainpage'
import { Outlet } from 'react-router-dom'
import Footer from '../../components/Home/Footer'
import Chatbot from '../../components/common/Chatbot'

const Home = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#f8f9fa'
    }}>
      <Navbar />
      <main style={{ flex: 1, padding: '2rem 0' }}>
        <Outlet />
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}

export default Home
