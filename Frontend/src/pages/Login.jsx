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
          <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <img
                alt="Logo"
                src=""
                className="mx-auto h-10 w-auto"
              />
              <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                Sign in to your account
              </h2>
            </div>
    
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form action="#" method="POST" className="space-y-6" onSubmit={handleSubmit}>
                <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                    Username
                  </label>
                  </div>
                  <div className="mt-2">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={userData.username}
                      autoComplete="username"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      onChange={handleEdit}
                    />
                  </div>
                </div>
    
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                      Password
                    </label>
                    <div className="text-sm">
                      <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                        Forgot password?
                      </a>
                    </div>
                  </div>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={userData.password}
                      required
                      autoComplete="current-password"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      onChange={handleEdit}
                    />
                  </div>
                </div>
    
                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Sign in
                  </button>
                </div>
              </form>
    
              <p className="mt-10 text-center text-sm/6 text-gray-500">
                Not a member?{' '}
                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Start a 14 day free trial
                </a>
              </p>
            </div>
          </div>
      )
}

export default Login