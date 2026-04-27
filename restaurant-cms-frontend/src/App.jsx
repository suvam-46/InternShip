import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import CategoryManager from './pages/admin/CategoryManager';
import BannerManager from './pages/admin/BannerManager';
import SiteManager from './pages/admin/SiteManager';
import Register from './pages/admin/Register';
import Profile from './pages/admin/Profile';
import MenuItemManager from './pages/admin/MenuItemManager';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="categories" element={<CategoryManager />} />
            <Route path="categories/:categoryId/items" element={<MenuItemManager />} />
            <Route path="banners" element={<BannerManager />} />
            <Route path="site" element={<SiteManager />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
