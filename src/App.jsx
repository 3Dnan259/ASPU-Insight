import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import ResearchReview from './pages/ResearchReview';
import StudentProfile from './pages/Profile';
import Home from './pages/Home';
import Auth from './pages/Auth';
import SetupTwoFA from "./pages/SetupTwoFA";
import VerifyOTP from "./pages/VerifyOTP";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/research_review" element={<ResearchReview />} />
          <Route path="/setup-2fa" element={<SetupTwoFA />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route
            path="/Profile"
            element={
              <ProtectedRoute redirectTo="/auth">
                <StudentProfile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;