import { useState } from 'react'
import { Link } from 'react-router-dom'

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
   <div>
    <Link to='/signup'>
      <h1 className='text-3xl font-bold underline'>Sign Up</h1>
    </Link>
    <Link to='/login'>
      <h1 className='text-3xl font-bold underline'>Login</h1>
    </Link>
   </div>
  )
}

export default App
