import React, { useState } from 'react'
import axios from 'axios'

const Login = () => {
  const [userData, setData] = useState({
    username:'',
    password:''
  });

  const handleEdit = (e) =>{
    setData({
      ...userData,
      [e.target.name]: e.target.value,
    })
  }
  
  const handleSubmit = async(e) => {
      e.preventDefault()
      try{
        await axios.post('http://127.0.0.1:8000/users/login/',userData)
        console.log('Login successful!')
        setData({username:'', password:''})
      }catch(err){
        console.log(err); 
      }
  }
    return (
      <div className="min-h-[90vh] w-full flex flex-col justify-center items-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200 px-2 py-4 overflow-hidden">
        <div className="w-full max-w-md bg-white/90 shadow-2xl rounded-2xl p-6 border border-indigo-100 backdrop-blur-md">
          <div className="flex flex-col items-center mb-6">
            <img
              alt="Store Management System Logo"
              src="/logo.svg"
              className="h-16 w-auto mb-3 drop-shadow-lg"
            />
            <h3 className="text-base font-semibold text-indigo-600 tracking-tight text-center mb-2">
              Sign in to your account
            </h3>
          </div>
          
          <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
            <div>
                             <label htmlFor="username" className="block text-xs font-medium text-gray-700 mb-1">
                 Username
               </label>
               <input
                 id="username"
                 name="username"
                 type="text"
                 required
                 autoComplete="username"
                 value={userData.username}
                 onChange={handleEdit}
                 placeholder="Enter your username"
                 className="block w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
               />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={userData.password}
                onChange={handleEdit}
                placeholder="Enter your password"
                className="block w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              />
              <div className="flex justify-end mt-1">
                <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </a>
              </div>
            </div>
            
            <div>
                             <button
                 type="submit"
                 className="flex w-full justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-purple-500 px-3 py-2 text-base font-semibold text-white shadow-lg hover:from-indigo-700 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
               >
                 Sign in
               </button>
            </div>
          </form>
          
                     <p className="mt-6 text-center text-sm text-gray-500">
             Don't have an account?{' '}
             <a href="/signup" className="font-semibold text-indigo-600 hover:text-purple-600 transition">
               Sign up here
             </a>
           </p>
          <p className="mt-3 text-center text-xs text-gray-400 font-medium">
            Store Management System
          </p>
        </div>
        <div className="absolute top-0 left-0 w-full h-28 bg-gradient-to-br from-indigo-400/30 to-purple-300/10 pointer-events-none -z-10 rounded-b-2xl blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-28 h-28 bg-gradient-to-tr from-purple-200/40 to-indigo-300/10 pointer-events-none -z-10 rounded-tl-2xl blur-2xl"></div>
      </div>
    )
}

export default Login