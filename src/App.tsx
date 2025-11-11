import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import SignUp from './pages/sign-up';
import ForgotPassword from './pages/forgot-password';
import UpdatePassword from './pages/update-password';
import Home from './pages/home';
import UploadRecords from './pages/upload-records';
import UserManagement from './pages/user-management';
import AuthenticatedRoute from './components/authenticated-route';
import { UserProvider } from './contexts/user-context';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/update-password"
            element={
              <AuthenticatedRoute>
                <UpdatePassword />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/"
            element={
              <AuthenticatedRoute>
                <Home />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/upload-records"
            element={
              <AuthenticatedRoute>
                <UploadRecords />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/user-management"
            element={
              <AuthenticatedRoute>
                <UserManagement />
              </AuthenticatedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
