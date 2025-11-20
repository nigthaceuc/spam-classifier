// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';
import MessagesPage from './pages/Messages';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <main className="max-w-3xl mx-auto py-10 px-4">
          <Routes>
            {/* flujo de auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />

            {/* pantalla de mensajes (clasificador de spam) */}
            <Route path="/messages" element={<MessagesPage />} />

            {/* que la raíz redirija al login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* cualquier ruta rara → login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

