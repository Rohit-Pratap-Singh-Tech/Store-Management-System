import React from 'react'

const Hero = () => {
  return (
    <div
      className="min-h-[500px] w-full flex flex-col lg:flex-row items-center justify-between px-4 sm:px-8 lg:px-12 py-8 lg:py-0 relative overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.92), rgba(255,255,255,0.92)), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Image Section */}
      <div className="flex-1 flex justify-center items-center mb-8 lg:mb-0 order-2 lg:order-1">
        <img 
          src="/superMarket.svg" 
          alt="Store Management System" 
          className="max-w-[300px] sm:max-w-[350px] lg:max-w-[400px] max-h-[300px] sm:max-h-[400px] lg:max-h-[500px] object-contain drop-shadow-xl"
        />
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col justify-center items-center lg:items-start text-center lg:text-left pl-0 lg:pl-12 order-1 lg:order-2">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 lg:mb-5 leading-tight drop-shadow">
          Welcome to Store Management System
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-lg lg:max-w-none">
          Streamline your business operations with our comprehensive store management solution. 
          Manage inventory, track sales, and optimize your retail business with ease.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <span className="inline-flex items-center px-4 py-2 bg-white/80 border border-blue-200 rounded-full text-blue-700 font-semibold shadow-sm text-sm">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Trusted by businesses
          </span>
          <span className="inline-flex items-center px-4 py-2 bg-white/80 border border-green-200 rounded-full text-green-700 font-semibold shadow-sm text-sm">
            <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Secure & Reliable
          </span>
        </div>
      </div>
    </div>
  )
}

export default Hero