# Hospital Management System

A web-based Hospital Management System built with Node.js, Express, MySQL, and vanilla JavaScript.

## Features

- Admin authentication
- Patient registration with OTP verification
- Patient data management (CRUD operations)
- Responsive design
- Dashboard with statistics

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hospital-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=hospital_db
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password
```

4. Set up the database:
```bash
mysql -u your_mysql_username -p < database.sql
```

5. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Default Admin Credentials

- Username: `admin`
- Password: `admin@123`

## Project Structure

```
hospital-management-system/
├── config/
│   └── database.js
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── login.js
│   │   └── dashboard.js
│   ├── index.html
│   └── dashboard.html
├── routes/
│   ├── auth.js
│   └── patients.js
├── database.sql
├── package.json
├── server.js
└── README.md
```

## API Endpoints

### Authentication
- POST `/api/auth/login` - Admin login
- POST `/api/auth/logout` - Admin logout
- GET `/api/auth/check-auth` - Check authentication status

### Patients
- GET `/api/patients` - Get all patients
- POST `/api/patients/register` - Register new patient
- PUT `/api/patients/:id` - Update patient
- DELETE `/api/patients/:id` - Delete patient
- POST `/api/patients/send-otp` - Send OTP for verification

## Security Features

- Session-based authentication
- Password hashing
- Input validation
- SQL injection prevention
- XSS protection

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 