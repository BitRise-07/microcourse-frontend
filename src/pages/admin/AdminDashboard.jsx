import { useAuth } from '../../auth/AuthContext'

export default function AdminDashboard(){
  const { user } = useAuth()
  
  if(!user){
    return <div className="card">Please login to view dashboard.</div>
  }
  if(user?.accountType !== 'Admin'){
    return <div className="card">Access denied. Admin account required.</div>
  }

  return (
    <div className="grid" style={{gridTemplateColumns:'1fr'}}>
      <div className="card">
        <h2>Welcome, {user?.firstName || ''} {user?.lastName || ''}</h2>
        <div className="row"><span className="tag">{user?.email}</span><span className="tag">Role: {user?.accountType}</span></div>
      </div>
      <div className="card">
        <h3>Admin Dashboard</h3>
        <p>Use the navbar to manage Courses, Creators, and Categories.</p>
        <div className="grid" style={{gridTemplateColumns:'1fr 1fr 1fr', gap:16, marginTop:16}}>
          <div className="card">
            <h4>Courses</h4>
            <p>Manage all courses in the platform</p>
          </div>
          <div className="card">
            <h4>Creators</h4>
            <p>Review and manage creator accounts</p>
          </div>
          <div className="card">
            <h4>Categories</h4>
            <p>Manage course categories</p>
          </div>
        </div>
      </div>
    </div>
  )
}



