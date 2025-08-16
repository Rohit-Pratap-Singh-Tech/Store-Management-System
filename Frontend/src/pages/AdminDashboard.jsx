import React from "react";
import { Link } from "react-router-dom";
import { logout } from "../auth"; 

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-6">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <nav>
          <ul className="space-y-4">
            <li>
              <Link
                to="/signup"
                className="block py-2 px-4 rounded hover:bg-gray-700 font-semibold"
              >
                Add Staff
              </Link>
            </li>
            <li>
              <button
                onClick={logout}
                className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 font-semibold bg-red-600 mt-4"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <Link
            to="/"
            className="py-2 px-4 bg-gray-800 text-white rounded hover:bg-gray-700 font-semibold"
          >
            Home
          </Link>
        </header>

        {/* Dashboard content */}
        <section className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Welcome to the Admin Dashboard
          </h2>
          <p className="text-gray-600">
            Use the sidebar to manage staff and other admin tasks.
          </p>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
