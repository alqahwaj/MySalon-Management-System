# Lumière Salon — Multi-Role Booking System Frontend

A complete salon booking system frontend built with React 18, Vite 5, Tailwind CSS v3, and React Router v6.

## Features

- **Multi-Role Dashboard** — Admin, Stylist, Customer each see tailored stats and navigation
- **Booking Flow** — 4-step wizard: Service → Stylist → Date & Time → Confirm
- **Appointments Calendar** — List/tab view with Cancel and Reschedule modals
- **Dark / Light Mode** — Tailwind `class` strategy, persisted in localStorage
- **Arabic / English Toggle** — Full RTL layout flip when Arabic is selected
- **JWT Auth** — Axios interceptor auto-injects `Bearer <token>` from localStorage

## Quick Start (Windows / Mac / Linux)

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file and set your backend URL
copy .env.example .env       # Windows
cp   .env.example .env       # Mac/Linux

# 3. Edit .env — set your .NET backend address
VITE_API_BASE_URL=https://your-backend.com

# 4. Start the dev server
npm run dev
```

Open http://localhost:5173 in your browser.

## Build for Production

```bash
npm run build
# output is in ./dist/
```

## Project Structure

```
src/
  api/
    axios.js              # Axios instance with JWT interceptor
  context/
    AuthContext.jsx       # User auth state (login/logout)
    ThemeContext.jsx      # Dark/light mode
    LanguageContext.jsx   # EN/AR + RTL switching
  i18n/
    index.js              # i18next setup
    en.json               # English translations
    ar.json               # Arabic translations
  components/
    layout/
      Layout.jsx          # Protected layout (sidebar + outlet)
      Sidebar.jsx         # Role-aware navigation + toggles
    ui/
      Button.jsx          # Reusable button (variants: primary/outline/danger/ghost)
      Input.jsx           # Labelled input with error state
      Card.jsx            # Card container
      Modal.jsx           # Accessible modal overlay
      Badge.jsx           # Appointment status badge
  pages/
    Login.jsx             # Public login page
    Register.jsx          # Public customer registration
    Dashboard.jsx         # Role-based dashboard (Admin/Stylist/Customer)
    BookingPage.jsx       # Multi-step booking flow
    AppointmentsCalendar.jsx  # Appointments list with cancel/reschedule
    NotFound.jsx          # 404 page
  App.jsx                 # Router + providers
  main.jsx                # React entry point
  index.css               # Tailwind directives + custom styles
```

## API Endpoints Used

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /Auth/login | Sign in, returns JWT |
| POST | /Auth/register-customer | Register new customer |
| GET  | /Services | List all services |
| GET  | /Stylist | List all stylists |
| GET  | /Booking/available-slots?stylistId=&date= | Get available slots |
| POST | /Booking | Create a booking |
| GET  | /Booking/customer/all | Get customer's bookings |
| PUT  | /Booking/{id}/cancel | Cancel a booking |
| PUT  | /Booking/{id}/reschedule | Reschedule a booking |

> **Note:** All pages gracefully fall back to mock data when the backend is unavailable, so the UI is fully explorable without a running API.

## Tech Stack

- React 18.3
- Vite 5.2
- Tailwind CSS 3.4 (`darkMode: 'class'`)
- React Router DOM 6.22
- Axios 1.6 (with request interceptor for JWT)
- react-i18next + i18next (EN / AR with RTL)
