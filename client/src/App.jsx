import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import GuestRoute from './components/GuestRoute';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout'; 
import DocumentPage from './pages/DocumentPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';

// Main application routing
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes accessible only to guests */}
        <Route element={<GuestRoute />}>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Routes accessible only to authenticated users */}
        <Route element={<ProtectedRoute />}>
          {/* Dashboard with main layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
          </Route>
          {/* Document page with its own layout */}
          <Route path="/document/:id" element={<DocumentPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;