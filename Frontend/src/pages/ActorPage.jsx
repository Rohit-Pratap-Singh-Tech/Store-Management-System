import React from 'react'
import { useNavigate } from 'react-router-dom'

const ActorPage = () => {
  const navigate = useNavigate()
  const roles = [
    {
      id: 'admin',
      title: 'Admin',
      description: 'Manage and control store activities',
      icon: '⚙️',
      roleValue: 'Admin'
    },
    {
      id: 'manager',
      title: 'Manager',
      description: 'Oversee store operations and staff',
      icon: '👔',
      roleValue: 'Manager'
    },
    {
      id: 'cashier',
      title: 'Cashier',
      description: 'Handle sales and transactions efficiently',
      icon: '🧾',
      roleValue: 'Cashier'
    },
    {
      id: 'inventory',
      title: 'Inventory Manager',
      description: 'Track and manage store inventory',
      icon: '📋',
      roleValue: 'InventoryManager'
    }
  ]

  const handleRoleClick = (role) => {
    // Save the selected role in localStorage or state as needed
    localStorage.setItem('selectedRole', role.roleValue)
    // Redirect to login page
    navigate('/login')
  }

  return (
    <div className="min-h-[400px] w-full bg-white p-4 sm:p-6 lg:p-8">
      <div className="h-full grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => handleRoleClick(role)}
            className="flex items-center p-4 sm:p-6 bg-gray-50 rounded-lg hover:bg-blue-50 hover:shadow-md transition-all duration-300 border border-gray-200 w-full text-left"
            type="button"
          >
            <div className="flex items-center space-x-3 sm:space-x-4 w-full">
              <div className="text-3xl sm:text-4xl text-blue-600 flex-shrink-0">
                {role.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">
                  {role.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  {role.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ActorPage