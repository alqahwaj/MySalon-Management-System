# MySalon - Complete Salon Management System ✂️

An integrated, enterprise-level SaaS solution for salon management. Built with modern web technologies, this project strictly adheres to **Clean Architecture** principles to ensure scalability, maintainability, and clear separation of concerns.

## 🚀 Tech Stack

### Frontend
- **React.js** with **Vite**
- **Tailwind CSS** for responsive, modern UI
- **i18next** for full Internationalization (AR / EN)
- Context API for State Management (Dark/Light mode, Auth)
- **Axios** with Interceptors for global API error handling

### Backend
- **.NET 8 Web API**
- **Entity Framework Core** with SQL Server
- **Clean Architecture** (Domain, Application, Infrastructure, API Layers)
- **Global Exception Handling** via Custom Middleware
- **Identity Framework** for Authentication & Role-based Authorization

---

## ✨ Key Features

- **Dynamic Booking Engine:** Automatically calculates available time slots based on the specific stylist's working hours and pre-existing bookings.
- **Staff Management:** Full CRUD operations for salon staff, including assigning weekly schedules and off-days.
- **Service Catalog:** Centralized management of salon services, categories, pricing, and durations.
- **Multi-language Support:** Seamless, real-time toggling between Arabic (RTL) and English (LTR).
- **Dark/Light Theme:** Fully responsive UI with an automated or user-triggered theme switcher.
- **Data Seeding:** Built-in EF Core seeding for immediate environment setup.

---

## 📸 Screenshots

### 🔐 Authentication & Theming
![User Registration Page](./screenshots/Registrationpage.png)
![System Login - Dark Theme](./screenshots/loginPage.png)
![System Login - Light Theme](./screenshots/loginpage-light.png)

### 👑 Admin Portal
![Admin Dashboard & Analytics](./screenshots/admin-dashboard.png)
![Salon Configuration & Settings](./screenshots/admin-salon-settings.png)
![System Bookings Management](./screenshots/admin-bookings.png)
![Comprehensive Stylists Management](./screenshots/admin-stylists-management.png)
![Adding New Employee Form](./screenshots/admin-Add-employee.png)
![Adding New Service to Catalog](./screenshots/admin-Adding-service-to-salon.png)
![Staff Weekly Schedule Assignment](./screenshots/admin-staff-schedule.png)

### 💇‍♂️ Stylist Portal
![Stylist Daily Appointments Dashboard](./screenshots/stylist-daily-dashboard.png)
![Stylist Configured Weekly Schedule](./screenshots/stylist-schedule.png)

### 📅 Customer Portal
![Customer Main Dashboard](./screenshots/Customer-dashboard.png)
![Step 1: Select Desired Service](./screenshots/customer-booking-service.png)
![Step 2: Choose Preferred Stylist](./screenshots/customer-booking-stylist.png)
![Step 3: Pick Available Time Slot](./screenshots/customer-booking-time.png)
![Step 4: Booking Summary & Confirmation](./screenshots/customer-booking-summary.png)
![Booking Success Notification](./screenshots/customer-booking-success.png)
![Customer Appointments History & Tracking](./screenshots/customer-appointments.png)

---

## 🛠️ Getting Started

### Prerequisites
- Node.js v18+
- .NET 8 SDK
- SQL Server

### 1. Backend Setup (.NET)
1. Navigate to the `MySalon` directory.
2. Update the SQL connection string in `MySalon.API/appsettings.json` if necessary.
3. Run Entity Framework migrations to create the database and seed the default salon:
   ```bash
   dotnet ef database update

4. Run the API:
Bash
dotnet run --project MySalon.API

### 2. Frontend Setup (React)
1. Navigate to the salon-frontend directory.

2. Install NPM packages:
Bash
npm install

3. Copy .env.example to .env and ensure VITE_DEFAULT_SALON_ID matches the seeded DB.

4. Start the development server:
Bash
npm run dev

--------------------------------------------------------------------
Developed with ❤️ by Mohammad Alqahwaji - Full-Stack .NET Developer.
--------------------------------------------------------------------