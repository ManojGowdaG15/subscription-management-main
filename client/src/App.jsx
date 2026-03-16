import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Public Pages
import Home from './pages/Home';
import Plans from './pages/Plans';
import Login from './pages/Login';
import Register from './pages/Register';
import Browse from './pages/Browse';
import VideoPlayer from './pages/VideoPlayer';

// User Pages
import UserDashboard from './pages/user/Dashboard';
import SubscriptionDetails from './pages/user/SubscriptionDetails';
import MyList from './pages/user/MyList';
import Checkout from './pages/Checkout';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManagePlans from './pages/admin/ManagePlans';
import ManageUsers from './pages/admin/ManageUsers';
import ManageVideos from './pages/admin/ManageVideos';
import ManageCoupons from './pages/admin/ManageCoupons';

// Components
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Routes>
      {/* Public Routes with Layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="browse" element={<Browse />} />
        <Route path="plans" element={<Plans />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* User Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="subscription" element={<SubscriptionDetails />} />
          <Route path="my-list" element={<MyList />} />
          <Route path="checkout/:planId" element={<Checkout />} /> {/* Added Checkout route */}
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="admin">
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="plans" element={<ManagePlans />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="videos" element={<ManageVideos />} />
            <Route path="coupons" element={<ManageCoupons />} />
          </Route>
        </Route>
      </Route>

      {/* Video Player - No Layout (fullscreen) */}
      <Route path="/watch/:id" element={<VideoPlayer />} />

      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;