import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import { AuthProvider } from './auth/AuthContext'
import ProtectedRoute from './auth/ProtectedRoute'
import RoleRoute from './auth/RoleRoute'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import SendOtp from './pages/auth/SendOtp'

import Courses from './pages/learner/Courses'
import CourseDetails from './pages/learner/CourseDetails'
import LearnPlayer from './pages/learner/LearnPlayer'
import Progress from './pages/learner/Progress'
import LearnerDashboard from './pages/learner/LearnerDashboard'

import CreatorApply from './pages/creator/CreatorApply'
import CreatorDashboard from './pages/creator/CreatorDashboard'
import CreatorCourses from './pages/creator/CreatorCourses'

import AdminReview from './pages/admin/AdminReview'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminCourses from './pages/admin/AdminCourses'
import AdminCreators from './pages/admin/AdminCreators'
import AdminCategories from './pages/admin/AdminCategories'

export default function App(){
  return (
    <AuthProvider>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />

      
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/auth/send-otp" element={<SendOtp />} />

     
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/learn/:courseId/:sectionId/:lessonOrder" element={<LearnPlayer />} />
            <Route path="/progress" element={<Progress />} />
          </Route>
          <Route element={<RoleRoute roles={["Learner"]} />}>
            <Route path="/learner/dashboard" element={<LearnerDashboard />} />
          </Route>

         
          <Route element={<ProtectedRoute />}>
            <Route path="/creator/apply" element={<CreatorApply />} />
          </Route>
          <Route element={<RoleRoute roles={["Creator"]} />}>
            <Route path="/creator/dashboard" element={<CreatorDashboard />} />
            <Route path="/creator/courses" element={<CreatorCourses />} />
          </Route>

          <Route element={<RoleRoute roles={["Admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/courses" element={<AdminCourses />} />
            <Route path="/admin/creators" element={<AdminCreators />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/review/courses" element={<AdminReview />} />
          </Route>

          <Route path="*" element={<div className="card">Not found</div>} />
        </Routes>
      </div>
    </AuthProvider>
  )
}


