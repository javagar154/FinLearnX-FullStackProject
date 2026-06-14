import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';

import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import Dashboard from './pages/Dashboard';
import StockMarket from './pages/StockMarket';
import StockDetail from './pages/StockDetail';
import SIPCalculator from './pages/SIPCalculator';
import BudgetTracker from './pages/BudgetTracker';
import LearningHub from './pages/LearningHub';
import CourseViewer from './pages/CourseViewer';
import Portfolio from './pages/Portfolio';
import Quiz from './pages/Quiz';
import PremiumHub from './pages/PremiumHub';
import PremiumReader from './pages/PremiumReader';
import PremiumQuiz from './pages/PremiumQuiz';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="stocks" element={<StockMarket />} />
            <Route path="stocks/:symbol" element={<StockDetail />} />
            <Route path="sip-calculator" element={<SIPCalculator />} />
            <Route path="budget" element={<BudgetTracker />} />
            <Route path="learn" element={<LearningHub />} />
            <Route path="learn/:courseId" element={<CourseViewer />} />
            <Route path="learn/:courseId/:level" element={<CourseViewer />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="quiz/:courseId" element={<Quiz />} />
            <Route path="quiz/:courseId/:level" element={<Quiz />} />
            <Route path="premium" element={<PremiumHub />} />
            <Route path="premium/:courseId" element={<PremiumReader />} />
            <Route path="premium-quiz/:courseId" element={<PremiumQuiz />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false}
          newestOnTop closeOnClick pauseOnHover theme="dark"
          toastStyle={{ background: 'rgba(15,15,45,0.95)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '12px', color: '#f1f5f9' }} />
      </Router>
    </AuthProvider>
  );
}

export default App;
