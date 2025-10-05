import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

export default function Courses(){
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/api/v1/course/getAllCourses?limit=24&offset=0')
        console.log('Courses API Response:', data)
        setCourses(data.data?.items || [])
      } catch(e){
        console.error('Courses API Error:', e)
        setError(e?.response?.data?.error?.message || 'Failed to load courses')
      } finally { setLoading(false) }
    })()
  }, [])

  if(loading) return <div className="card">Loading...</div>
  if(error) return <div className="card">{error}</div>

  return (
    <div>
      <h2 style={{ marginBottom: '16px', color: 'var(--brand)' }}>Available Courses ({courses.length})</h2>
      {courses.length === 0 ? (
        <div className="card">
          <h3>No courses available</h3>
          <p>There are currently no courses available. Check back later or contact an administrator.</p>
        </div>
      ) : (
        <div className="grid cols-3">
          {courses.map(c => (
            <div className="card" key={c._id}>
              <img src={c.thumbnail} alt={c.courseName} style={{width:'100%',height:160,objectFit:'cover',borderRadius:8,marginBottom:8}} />
              <h3>{c.courseName}</h3>
              <div className="row"><span className="tag">{c.category?.name}</span><span className="tag">${c.price}</span></div>
              <div className="spacer" />
              <Link className="btn" to={`/courses/${c._id}`}>View</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


