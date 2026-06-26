import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ResearchReview from './pages/ResearchReview';
import PaperDetail from './pages/PaperDetail';
import StudentProfile from './pages/Profile';
import Home from './pages/Home';
import Auth from './pages/Auth/Auth';
import Submit from './pages/Submit';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
        <Routes>
          <Route path="/"                  element={<Home />} />
          <Route path="/auth"              element={<Auth />} />
          <Route path="/research_review"   element={<ResearchReview />} />
          <Route path="/papers/:id"        element={<PaperDetail />} />   
          <Route
            path="/Profile"
            element={
              <ProtectedRoute redirectTo="/auth">
                <StudentProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/submit"
            element={
              <ProtectedRoute redirectTo="/auth">
                <Submit />
              </ProtectedRoute>
            }
          />
        </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;