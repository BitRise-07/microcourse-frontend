import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { useAuth } from '../../auth/AuthContext'

export default function LearnerDashboard(){
  const { user } = useAuth()
  const navigate = useNavigate()
  const [enrolled, setEnrolled] = useState([])
  const [certs, setCerts] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      if (!user) return
      setLoading(true)
      setError('')
      try {
        const [e, c] = await Promise.all([
          api.get('/api/v1/course/enrolled'),
          api.get('/api/v1/course/certificates')
        ])
        setEnrolled(e.data.data || [])
        setCerts(c.data.data || [])
      } catch(err){ 
        console.error('Dashboard API Error:', err)
        setError(err?.response?.data?.error?.message || 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    })()
  }, [user])

  const continueLearning = (course) => {
    const firstSection = course.courseContent?.[0]
    if (firstSection && firstSection.lessons?.[0]) {
      navigate(`/learn/${course._id}/${firstSection._id}/${firstSection.lessons[0].order}`)
    } else {
      navigate(`/courses/${course._id}`)
    }
  }

  if(!user){
    return <div className="card">Please login to view dashboard.</div>
  }
  if(user?.accountType !== 'Learner'){
    return <div className="card">Access denied. Learner account required.</div>
  }

  if(loading) {
    return (
      <div className="grid" style={{gridTemplateColumns:'1fr'}}>
        <div className="card">
          <h2>Loading Dashboard...</h2>
          <p>Please wait while we load your data.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid" style={{gridTemplateColumns:'1fr'}}>
      <div className="card">
        <h2>Welcome, {user?.firstName || ''} {user?.lastName || ''}</h2>
        <div className="row"><span className="tag">{user?.email}</span><span className="tag">Role: {user?.accountType}</span></div>
      </div>
      {error && <div className="card" style={{borderColor:'#ef4444', color:'#fca5a5'}}>
        <h3>Error Loading Dashboard</h3>
        <p>{error}</p>
        <button className="btn" onClick={() => window.location.reload()}>Retry</button>
      </div>}
      <div className="card">
        <h3>Enrolled Courses ({enrolled.length})</h3>
        <div className="grid cols-3">
          {enrolled.map(c => (
            <div className="card" key={c._id}>
              {c.thumbnail && <img src={c.thumbnail} alt={c.courseName} style={{width:'100%',height:140,objectFit:'cover',borderRadius:8,marginBottom:8}} />}
              <h4>{c.courseName}</h4>
              <div className="tag">{c.category?.name}</div>
              {c.courseDescription && <p style={{opacity:.9}}>{c.courseDescription}</p>}
              <div className="spacer" />
              <button 
                className="btn" 
                onClick={() => continueLearning(c)}
                style={{width:'100%'}}
              >
                Continue Learning
              </button>
            </div>
          ))}
          {!enrolled.length && !loading && <div>No enrollments yet. <a href="/courses">Browse courses</a> to get started!</div>}
        </div>
      </div>
      <div className="card">
        <h3>Completed Courses & Certificates ({certs.length})</h3>
        <div className="grid cols-3">
          {certs.map(k => (
            <div className="card" key={k._id}>
              {k.course?.thumbnail && <img src={k.course.thumbnail} alt={k.course?.courseName} style={{width:'100%',height:140,objectFit:'cover',borderRadius:8,marginBottom:8}} />}
              <h4>{k.course?.courseName}</h4>
              {k.course?.courseDescription && <p style={{opacity:.9}}>{k.course.courseDescription}</p>}
              <div className="tag" style={{overflowWrap:'anywhere'}}>Serial: {k.serialHash}</div>
              <div className="spacer" />
              <button 
                className="btn secondary" 
                onClick={() => navigate(`/courses/${k.course?._id}`)}
                style={{width:'100%'}}
              >
                View Certificate
              </button>
            </div>
          ))}
          {!certs.length && !loading && <div>No certificates yet. Complete courses to earn certificates!</div>}
        </div>
      </div>
    </div>
  )
}


