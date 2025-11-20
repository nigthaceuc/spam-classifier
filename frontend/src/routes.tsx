// src/routes.tsx
import { createBrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';
import MessagesPage from './pages/Messages';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/verify-otp',
    element: <VerifyOtp />,
  },
  {
    path: '/messages',
    element: <MessagesPage />,
  },
]);
