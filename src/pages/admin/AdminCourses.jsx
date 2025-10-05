import { useEffect, useState } from 'react'
import api from '../../services/api'

export default function AdminCourses(){
  const [courses, setCourses] = useState([])
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const { data } = await api.get('/api/v1/admin/courses')
      setCourses(data.data || [])
    } catch(e){ setError('Failed to load courses') }
  }

  useEffect(() => { load() }, [])

  const toggleStatus = async (courseId, current) => {
    try {
      const next = current === 'Published' ? 'Draft' : 'Published'
      await api.post('/api/v1/admin/course/status', { courseId, status: next })
      await load()
    } catch(e){ alert('Failed to update status') }
  }

  return (
    <div className="grid cols-3">
      {error && <div className="card" style={{gridColumn:'1/-1'}}>{error}</div>}
      {courses.map(c => (
        <div className="card" key={c._id}>
          {c.thumbnail && (
            <img 
              src={c.thumbnail} 
              alt={c.courseName} 
              style={{width:'100%',height:140,objectFit:'cover',borderRadius:8,marginBottom:8}} 
            />
          )}
          <h3>{c.courseName}</h3>
          <div className="tag">{c.category?.name}</div>
          <div className="tag">Instructor: {c.instructor?.firstName} {c.instructor?.lastName}</div>
          <div className="tag">Status: {c.status}</div>
          <div className="spacer" />
          <button className="btn" onClick={()=>toggleStatus(c._id, c.status)}>{c.status === 'Published' ? 'Set Draft' : 'Publish'}</button>
        </div>
      ))}
    </div>
  )
}





