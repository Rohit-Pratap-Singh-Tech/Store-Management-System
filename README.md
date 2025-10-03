<div align="center">

<img src="https://placehold.co/1200x400/2563eb/ffffff?text=Supermarket+Management+System" alt="Supermarket Management System Banner" />

# 🛒 Supermarket Store Management System

### A comprehensive full-stack solution for modern retail operations

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](http://makeapullrequest.com)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Demo](#-demo)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [Team](#-team)
- [License](#-license)

---

## 🎯 About

The **Supermarket Store Management System** is an enterprise-grade application designed to revolutionize retail operations. Built with modern technologies, it provides a seamless experience for managing inventory, sales, employees, and customer interactions in real-time.

### Why This Project?

- 🔄 **Automate** manual retail processes
- 📊 **Analyze** business performance with advanced analytics
- 🔒 **Secure** sensitive data with industry-standard authentication
- 🎨 **Enhance** customer experience with intuitive interfaces
- 📈 **Scale** your business operations effortlessly

---

## ✨ Features

### 🔐 Security & Authentication
- JWT-based authentication system
- Role-based access control (RBAC)
- Encrypted password storage
- Session management

### 👨‍💼 Management Dashboard
- **Multi-role support**: Admin, Manager, Cashier, Inventory Staff
- Real-time sales analytics and reporting
- Employee management and scheduling
- Supplier relationship management
- Customizable notification system

### 📦 Inventory Management
- Real-time stock tracking
- Automated low-stock alerts
- Product categorization and tagging
- Barcode/QR code integration
- Batch and expiry date management
- Supplier order management

### 💰 Point of Sale (POS)
- Fast and intuitive checkout process
- Multiple payment methods support
- Discount and promotion handling
- Digital receipt generation
- Return and refund processing
- Sales history tracking

### 🗺️ Interactive Store Map
- 2D visualization of store layout
- Product location finder
- Block-based organization (Zones A, B, C)
- Real-time stock availability display

### 📊 Analytics & Reporting
- Daily, weekly, and monthly sales reports
- Profit margin analysis
- Best-selling products tracking
- Customer purchase patterns
- Inventory turnover reports
- Export reports in multiple formats (PDF, CSV, Excel)

### 👥 Customer Features
- Loyalty program management
- Purchase history tracking
- Digital receipts
- Customer feedback system

---

## 🎬 Demo

<div align="center">

### Application Preview

<img src="https://placehold.co/800x450/3b82f6/ffffff?text=Dashboard+Preview" alt="Dashboard Preview" />

</div>

<details>
<summary><b>📸 View More Screenshots</b></summary>

<br/>

### Admin Dashboard
<img src="https://placehold.co/800x450/2563eb/ffffff?text=Admin+Dashboard" alt="Admin Dashboard" />

### Inventory Management
<img src="https://placehold.co/800x450/2563eb/ffffff?text=Inventory+Management" alt="Inventory Management" />

### POS System
<img src="https://placehold.co/800x450/2563eb/ffffff?text=POS+System" alt="POS System" />

### Interactive Store Map
<img src="https://placehold.co/800x450/2563eb/ffffff?text=Store+Map" alt="Store Map" />

</details>

---

## 🛠️ Tech Stack

### Frontend
```
React 18          - UI Library
Vite              - Build Tool
React Router      - Navigation
Axios             - HTTP Client
Tailwind CSS      - Styling
Framer Motion     - Animations
Lucide React      - Icons
```

### Backend
```
Python 3.10+           - Programming Language
Django 4.2             - Web Framework
Django REST Framework  - API Development
Djongo                 - MongoDB ODM
PyJWT                  - Authentication
```

### Database
```
MongoDB               - NoSQL Database
```

### DevOps & Tools
```
Git                   - Version Control
Docker (Optional)     - Containerization
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   React UI   │  │ React Router │  │  Tailwind    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              ↕ HTTP/REST
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                                │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Django REST  │  │     JWT      │  │   CORS       │          │
│  │  Framework   │  │     Auth     │  │   Headers    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              ↕ ORM/ODM
┌─────────────────────────────────────────────────────────────────┐
│                      BUSINESS LOGIC LAYER                        │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Models     │  │  Services    │  │  Validators  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              ↕ Djongo
┌─────────────────────────────────────────────────────────────────┐
│                        DATABASE LAYER                            │
│                                                                   │
│                      ┌──────────────┐                            │
│                      │   MongoDB    │                            │
│                      └──────────────┘                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.10 or higher) - [Download](https://www.python.org/)
- **MongoDB** (Community Server) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)

### Quick Start

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/supermarket-management-system.git
cd supermarket-management-system
```

#### 2️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Create `.env` file in backend directory:**

```env
SECRET_KEY=your_django_secret_key_here
MONGO_URI=mongodb://localhost:27017/supermarket_db
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

**Run migrations and start server:**

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser  # Create admin account
python manage.py runserver
```

✅ Backend running at: `http://127.0.0.1:8000`

#### 3️⃣ Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend running at: `http://localhost:5173`

### 🐳 Docker Setup (Optional)

```bash
# Build and run containers
docker-compose up --build

# Stop containers
docker-compose down
```

---

## 📂 Project Structure

```
supermarket-management-system/
│
├── backend/                    # Django Backend
│   ├── api/                   # API endpoints
│   │   ├── migrations/
│   │   ├── serializers.py     # Data serializers
│   │   ├── views.py           # API views
│   │   ├── urls.py            # URL routing
│   │   └── models.py          # Database models
│   │
│   ├── core/                  # Core settings
│   │   ├── settings.py        # Django settings
│   │   ├── urls.py            # Root URL config
│   │   └── wsgi.py            # WSGI config
│   │
│   ├── manage.py              # Django management script
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
│
├── frontend/                  # React Frontend
│   ├── public/                # Static assets
│   │   └── assets/
│   │
│   ├── src/
│   │   ├── api/               # API integration
│   │   │   └── axios.js
│   │   │
│   │   ├── assets/            # Images, fonts, etc.
│   │   │
│   │   ├── components/        # Reusable components
│   │   │   ├── common/        # Shared components
│   │   │   ├── layout/        # Layout components
│   │   │   └── features/      # Feature-specific components
│   │   │
│   │   ├── context/           # React Context
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── hooks/             # Custom hooks
│   │   │   └── useAuth.js
│   │   │
│   │   ├── pages/             # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Inventory.jsx
│   │   │   ├── POS.jsx
│   │   │   └── Login.jsx
│   │   │
│   │   ├── utils/             # Utility functions
│   │   │
│   │   ├── App.jsx            # Main App component
│   │   └── main.jsx           # Entry point
│   │
│   ├── index.html
│   ├── package.json           # NPM dependencies
│   ├── vite.config.js         # Vite configuration
│   └── tailwind.config.js     # Tailwind configuration
│
├── docs/                      # Documentation
├── .gitignore
├── README.md
└── LICENSE
```

---

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register new user |
| POST | `/api/auth/login/` | User login |
| POST | `/api/auth/logout/` | User logout |
| GET | `/api/auth/user/` | Get current user |

### Product Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products/` | List all products |
| POST | `/api/products/` | Create product |
| GET | `/api/products/{id}/` | Get product details |
| PUT | `/api/products/{id}/` | Update product |
| DELETE | `/api/products/{id}/` | Delete product |

### Sales Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sales/` | List all sales |
| POST | `/api/sales/` | Create sale |
| GET | `/api/sales/{id}/` | Get sale details |
| GET | `/api/sales/reports/` | Generate reports |

For complete API documentation, visit `/api/docs/` when running the server.

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create** a new branch (`git checkout -b feature/amazing-feature`)
4. **Make** your changes
5. **Commit** your changes (`git commit -m 'Add some amazing feature'`)
6. **Push** to the branch (`git push origin feature/amazing-feature`)
7. **Open** a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

### Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

---

## 👥 Team

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/your-username">
        <img src="https://placehold.co/100x100/2563eb/ffffff?text=AK" width="100px;" alt="Amit Kumar"/><br />
        <sub><b>Amit Kumar</b></sub>
      </a><br />
      <sub>Backend Development</sub>
    </td>
    <td align="center">
      <a href="https://github.com/your-username">
        <img src="https://placehold.co/100x100/2563eb/ffffff?text=RS" width="100px;" alt="Rohit Pratap Singh"/><br />
        <sub><b>Rohit Pratap Singh</b></sub>
      </a><br />
      <sub>Frontend Development</sub>
    </td>
    <td align="center">
      <a href="https://github.com/your-username">
        <img src="https://placehold.co/100x100/2563eb/ffffff?text=CB" width="100px;" alt="Ch. Bhargav"/><br />
        <sub><b>Ch. Bhargav</b></sub>
      </a><br />
      <sub>Database Management</sub>
    </td>
    <td align="center">
      <a href="https://github.com/your-username">
        <img src="https://placehold.co/100x100/2563eb/ffffff?text=BA" width="100px;" alt="Bhaskar Akshay Sriram"/><br />
        <sub><b>Bhaskar Akshay Sriram</b></sub>
      </a><br />
      <sub>Frontend Development</sub>
    </td>
  </tr>
</table>

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Supermarket Management System Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 🙏 Acknowledgments

- Thanks to all contributors who helped build this project
- Special thanks to the open-source community
- Icons by [Lucide](https://lucide.dev/)
- Inspiration from modern retail management systems

---

## 📞 Support

Having issues? We're here to help!

- 📧 Email: support@supermarket-system.com
- 💬 Discord: [Join our server](https://discord.gg/your-invite)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/your-repo/issues)
- 📖 Wiki: [Project Wiki](https://github.com/your-username/your-repo/wiki)

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

Made with ❤️ by the Supermarket Management System Team

[⬆ Back to Top](#-supermarket-store-management-system)

</div>
