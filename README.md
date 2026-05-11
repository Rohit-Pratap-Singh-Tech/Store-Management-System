# 🛒 Supermarket Management System

A full-stack retail management platform built to streamline supermarket operations including inventory tracking, billing, employee management, analytics, and customer handling.

The system is designed for scalability and real-world retail workflows, providing role-based access, real-time inventory monitoring, sales reporting, and an integrated point-of-sale experience.

---

## 📌 Overview

Managing a supermarket involves handling inventory, billing, staff operations, suppliers, and customer records simultaneously. This project centralizes those operations into a single platform with a modern frontend and secure backend architecture.

The application focuses on:

- Efficient inventory and sales management
- Secure authentication and role-based access
- Real-time operational visibility
- Scalable backend architecture
- Clean and responsive user experience

---

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication
- Role-based access control (Admin, Manager, Cashier, Inventory Staff)
- Secure password hashing
- Session management and protected routes

### 📦 Inventory Management
- Real-time stock tracking
- Product categorization
- Low-stock alerts
- Batch and expiry management
- Supplier management
- Barcode and QR support

### 💳 Point of Sale (POS)
- Fast checkout workflow
- Multiple payment methods
- Discount and promotion handling
- Receipt generation
- Refund and return processing
- Transaction history

### 📊 Dashboard & Analytics
- Daily, weekly, and monthly sales reports
- Revenue and profit analysis
- Best-selling product tracking
- Inventory turnover insights
- Customer purchase analytics
- Export reports in CSV, Excel, and PDF formats

### 🏪 Store Management
- Employee management
- Shift and scheduling support
- Notification system
- Interactive store layout visualization
- Product location tracking

### 👥 Customer Features
- Loyalty program support
- Purchase history
- Digital receipts
- Feedback system

---

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- React Router
- Tailwind CSS
- Axios
- Framer Motion

### Backend
- Django
- Django REST Framework
- PyJWT
- Djongo

### Database
- MongoDB

### DevOps & Tools
- Git
- Docker (Optional)

---

## 🏗️ System Architecture

```text
Client (React + Tailwind)
        │
        ▼
REST API Layer (Django REST Framework)
        │
        ▼
Business Logic & Services
        │
        ▼
MongoDB Database
```

The frontend communicates with the backend using REST APIs. Authentication is handled using JWT tokens, while MongoDB stores application data including users, products, sales records, and inventory information.

---

## 🚀 Installation

### Prerequisites

Make sure the following are installed on your system:

- Node.js (v18+)
- Python (v3.10+)
- MongoDB
- Git

---

## 📥 Clone the Repository

```bash
git clone https://github.com/your-username/supermarket-management-system.git

cd supermarket-management-system
```

---

## ⚙️ Backend Setup

```bash
cd backend

python -m venv venv
```

### Activate Virtual Environment

#### Windows
```bash
venv\Scripts\activate
```

#### Linux/macOS
```bash
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Configure Environment Variables

Create a `.env` file inside the `backend` directory:

```env
SECRET_KEY=your_secret_key
MONGO_URI=mongodb://localhost:27017/supermarket_db
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Run the Server

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend will run at:

```text
http://127.0.0.1:8000
```

---

## 🎨 Frontend Setup

Open another terminal:

```bash
cd frontend

npm install

npm run dev
```

Frontend will run at:

```text
http://localhost:5173
```

---

## 📂 Project Structure

```text
supermarket-management-system/

├── backend/
│   ├── api/
│   ├── core/
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── utils/
│   │
│   ├── package.json
│   └── vite.config.js
│
├── docs/
├── README.md
└── LICENSE
```

---

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register user |
| POST | `/api/auth/login/` | Login user |
| POST | `/api/auth/logout/` | Logout user |
| GET | `/api/auth/user/` | Current authenticated user |

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products/` | Get all products |
| POST | `/api/products/` | Add product |
| GET | `/api/products/{id}/` | Product details |
| PUT | `/api/products/{id}/` | Update product |
| DELETE | `/api/products/{id}/` | Delete product |

### Sales

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sales/` | Get sales |
| POST | `/api/sales/` | Create sale |
| GET | `/api/sales/{id}/` | Sale details |
| GET | `/api/sales/reports/` | Sales reports |

---

## 🤝 Contributing

Contributions are welcome.

To contribute:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push the branch
5. Open a pull request

Please ensure:
- Code follows the existing project structure
- Commit messages are meaningful
- New features include proper testing
- Documentation is updated when necessary

Because eventually every project becomes “temporary code” running something important. Modern civilization is held together by APIs and developers pretending the production server is fine.

---

## 👨‍💻 Team

| Name | Role |
|------|------|
| Amit Kumar | Backend Development |
| Rohit Pratap Singh | Frontend Development |
| Ch. Bhargav | Database Management |
| Bhaskar Akshay Sriram | Frontend Development |

---

## 📄 License

This project is licensed under the MIT License.

---

## 📞 Support

For issues, bug reports, or feature requests:

- Open an issue on GitHub
- Review the documentation
- Contact the development team

---

## 🙌 Acknowledgements

- Open-source contributors and libraries
- React, Django, and MongoDB communities
- Developers who debug production issues at 2 AM while claiming everything is “stable”

---

## ⭐ Star the Repository

If you found this project useful, consider giving it a star on GitHub.

Tiny digital approval badges. The closest thing developers get to emotional compensation.
