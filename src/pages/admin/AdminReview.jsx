import { Link } from 'react-router-dom'

export default function AdminReview(){
  return (
    <div className="card">
      <h2>Admin</h2>
      <div className="row">
        <Link className="btn" to="/admin/dashboard">Dashboard</Link>
        <Link className="btn secondary" to="/admin/courses">All Courses</Link>
        <Link className="btn secondary" to="/admin/creators">Creators</Link>
        <Link className="btn secondary" to="/admin/categories">Categories</Link>
      </div>
      <div className="spacer" />
      <p>Pick a section above.</p>
    </div>
  )
}


