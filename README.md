# Student Fee Management System

A full-stack web application that allows students to manage and update their fee payment status through a secure, login-based system.

## 🚀 Features

### Authentication System
- **Login/Signup**: Secure user authentication with session management
- **Protected Routes**: Profile page requires authentication
- **Session Persistence**: Uses localStorage for session management

### Navigation & Pages
- **Navigation Bar**: Clean navigation with "All Students" and "Profile" tabs
- **All Students Page**: 
  - Real-time table of all students with payment status
  - Statistics cards showing payment overview
  - Status badges for visual payment status indication
- **Profile Page**: 
  - View and edit user details (name, email)
  - Current fee payment status display
  - Pay fees functionality for unpaid students

### Payment System
- **Payment Simulation**: Complete payment flow without real gateway integration
- **Payment Form**: Comprehensive form with validation for card details
- **Payment Processing**: Animated progress indicator during payment
- **Success Page**: Confirmation page with automatic redirect
- **Real-time Updates**: Payment status updates across all pages instantly

### Design & UX
- **Responsive Design**: Mobile-first approach with beautiful UI
- **Professional Theme**: Blue/indigo color scheme with gradients and shadows
- **Form Validation**: Real-time validation with error messages
- **Loading States**: Smooth transitions and loading indicators
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library

### State Management & Storage
- **React Context** - Authentication state management
- **localStorage** - Data persistence and session storage

### UI Components & Styling
- **Radix UI** - Headless component primitives
- **Lucide React** - Beautiful icons
- **Class Variance Authority** - Component variant management
- **Tailwind Merge** - Efficient class merging

### Forms & Validation
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **Input OTP** - Secure input components

## 🎯 Demo Credentials

Use these credentials to test the application:

- **Email**: `alice@student.edu`
- **Password**: `password123`

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd student-fee-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📋 Usage Guide

### For Students

1. **Sign Up/Login**
   - Create a new account or login with demo credentials
   - Sessions are automatically managed

2. **View All Students**
   - See all registered students and their payment status
   - Real-time updates when payments are made

3. **Manage Profile**
   - Edit personal details (name, email)
   - View current fee payment status
   - Pay fees if unpaid

4. **Payment Process**
   - Click "Pay Fees" from profile
   - Fill out payment form with test data
   - Watch payment processing animation
   - Get redirected to success page
   - See updated status everywhere

### Test Payment Data
Use any test data for payment simulation:
- **Card Number**: Any 16-digit number (e.g., 4111111111111111)
- **Expiry**: Any future date
- **CVV**: Any 3-digit number
- **Cardholder**: Any name

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   └── Navigation.tsx   # Main navigation component
├── contexts/
│   └── AuthContext.tsx  # Authentication context
├── pages/
│   ├── Index.tsx        # Landing page
│   ├── StudentsPage.tsx # All students view
│   ├── ProfilePage.tsx  # User profile
│   ├── LoginPage.tsx    # Login form
│   ├── SignupPage.tsx   # Registration form
│   ├── PaymentPage.tsx  # Payment form
│   └── PaymentSuccessPage.tsx # Success confirmation
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── App.tsx              # Main app component
├── main.tsx            # App entry point
└── index.css           # Global styles & design tokens
```

## 🎨 Design System

The application uses a comprehensive design system with:
- **Color Tokens**: HSL-based semantic color system
- **Typography**: Consistent text hierarchy
- **Spacing**: Standardized spacing scale
- **Components**: Reusable UI components with variants
- **Animations**: Smooth transitions and micro-interactions

## 🔮 Future Enhancements

- **Real Payment Gateway**: Integration with Stripe/PayPal
- **Database Integration**: Replace localStorage with proper database
- **Real-time Notifications**: WebSocket-based live updates
- **Admin Dashboard**: Management interface for administrators
- **Email Notifications**: Payment confirmations and reminders
- **Receipt Generation**: PDF receipt downloads
- **Payment History**: Transaction history tracking

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](issues).

---

Built with ❤️ using React, TypeScript, and Tailwind CSS