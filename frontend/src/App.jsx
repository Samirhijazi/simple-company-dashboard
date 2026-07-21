import { AuthProvider } from "./context/AuthContext"
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./pages/login";
function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
