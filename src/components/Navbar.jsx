import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function Navbar(){
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const inCreatorArea = location.pathname.startsWith('/creator')
  const inAdminArea = location.pathname.startsWith('/admin')
  const inLearnerArea = location.pathname.startsWith('/learner')
  
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')
  return (
    <div className="navbar">
      <div className="navbar-inner container">
        <div className="row">
          <Link to="/courses"><strong>MicroCourses</strong></Link>
        </div>
        <div className="nav-links">
          {inAdminArea ? (
            <>
              <button className={`btn  secondary ${isActive('/admin/dashboard') ? 'active' : ''}`} onClick={()=>navigate('/admin/dashboard')}>Dashboard</button>
              <button className={`btn secondary ${isActive('/admin/courses') ? 'active' : ''}`} onClick={()=>navigate('/admin/courses')}>All Courses</button>
              <button className={`btn secondary ${isActive('/admin/creators') ? 'active' : ''}`} onClick={()=>navigate('/admin/creators')}>Creators</button>
              <button className={`btn secondary ${isActive('/admin/categories') ? 'active' : ''}`} onClick={()=>navigate('/admin/categories')}>Categories</button>
              {user && <button className="btn" onClick={logout}>Logout</button>}
            </>
          ) : inCreatorArea ? (
            <>
              <button className={`btn secondary ${isActive('/creator/dashboard') ? 'active' : ''}`} onClick={()=>navigate('/creator/dashboard')}>Dashboard</button>
              <button className={`btn ${isActive('/creator/dashboard') ? 'active' : ''}`} onClick={()=>navigate('/creator/dashboard')}>Add Course</button>
              <button className={`btn secondary ${isActive('/creator/courses') ? 'active' : ''}`} onClick={()=>navigate('/creator/courses')}>All Courses</button>
              {user && <button className="btn secondary" onClick={logout}>Logout</button>}
            </>
          ) : inLearnerArea ? (
            <>
              <button className={`btn secondary ${isActive('/learner/dashboard') ? 'active' : ''}`} onClick={()=>navigate('/learner/dashboard')}>Dashboard</button>
              <button className={`btn secondary ${isActive('/courses') ? 'active' : ''}`} onClick={()=>navigate('/courses')}>All Courses</button>
              {user && <button className="btn" onClick={logout}>Logout</button>}
            </>
          ) : (
            <>
              {user?.accountType === 'Admin' ? (
                <>
                  <button className={`btn secondary  ${isActive('/admin/dashboard') ? 'active' : ''}`} onClick={()=>navigate('/admin/dashboard')}>Dashboard</button>
                  <button className={`btn secondary ${isActive('/admin/courses') ? 'active' : ''}`} onClick={()=>navigate('/admin/courses')}>All Courses</button>
                  <button className={`btn secondary ${isActive('/admin/creators') ? 'active' : ''}`} onClick={()=>navigate('/admin/creators')}>Creators</button>
                  <button className={`btn secondary ${isActive('/admin/categories') ? 'active' : ''}`} onClick={()=>navigate('/admin/categories')}>Categories</button>
                  <button className="btn" onClick={logout}>Logout</button>
                </>
              ) : user?.accountType === 'Learner' ? (
                <>
                  <button className={`btn secondary ${isActive('/learner/dashboard') ? 'active' : ''}`} onClick={()=>navigate('/learner/dashboard')}>Dashboard</button>
                  <button className={`btn secondary ${isActive('/courses') ? 'active' : ''}`} onClick={()=>navigate('/courses')}>All Courses</button>
                  <button className="btn" onClick={logout}>Logout</button>
                </>
              ) : (
                <>
                  <Link className="btns actives" to="/">Home</Link>
                  <Link className="btns actives" to="/courses">Courses</Link>
                 
                  {!user && <Link className="btns actives" to="/auth/login">Login</Link>}
                  {!user && <Link className="btns actives" to="/auth/signup">Signup</Link>}
                  {user?.accountType === 'Creator' && <Link className="btns actives" to="/creator/dashboard">Dashboard</Link>}
                  {user?.accountType === 'Creator' && <button className="btn" onClick={()=>navigate('/creator/dashboard')}>Add Course</button>}
                  {user?.accountType === 'Creator' && <button className="btn secondary" onClick={()=>navigate('/creator/courses')}>All Courses</button>}
                  {user && user.accountType !== 'Creator' && <Link className="btns actives" to="/creator/apply">Apply Creator</Link>}
                  {user && <button className="btn secondary" onClick={logout}>Logout</button>}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}


