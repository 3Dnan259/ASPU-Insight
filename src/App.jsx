import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import ResearchReview from './pages/ResearchReview';
import StudentProfile from './pages/Profile';
import Home from './pages/Home';
import Auth from './pages/Auth';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/research_review" element={<ResearchReview />} />
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