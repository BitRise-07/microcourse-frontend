import { useEffect, useState } from 'react'
import api from '../../services/api'
import { useAuth } from '../../auth/AuthContext'

export default function CreatorCourses(){
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/api/v1/course/mine')
        setCourses(data.data || [])
      } catch(e){ setError('Failed to load courses') }
    })()
  }, [])

  return (
    <div className="grid cols-3">
      {error && <div className="card" style={{gridColumn:'1/-1'}}>{error}</div>}
      {courses.map(c => (
        <CourseCard key={c._id} c={c} />
      ))}
      {!courses.length && !error && <div className="card" style={{gridColumn:'1/-1'}}>No courses yet.</div>}
    </div>
  )
}

function CourseCard({ c }){
  const [sectionUpdate, setSectionUpdate] = useState({ sectionId:'', sectionName:'' })
  const [sections, setSections] = useState([])
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  const loadSections = async () => {
    try {
      const { data } = await api.post('/api/v1/course/getCourseDetails', { courseId: c._id })
      const list = data?.data?.courseContent || []
      setSections(list)
      if(list.length && !sectionUpdate.sectionId){
        setSectionUpdate(s => ({ ...s, sectionId: list[0]._id }))
      }
    } catch (e) {
      // ignore
    }
  }

  const updateSection = async (e) => {
    e.preventDefault(); setErr(''); setMsg('')
    try {
      const { data } = await api.post('/api/v1/course/updateSection', sectionUpdate)
      setMsg('Section updated')
    } catch(e){ setErr(e?.response?.data?.error?.message || 'Update failed') }
  }

  return (
    <div className="card">
      <img src={c.thumbnail} alt={c.courseName} style={{width:'100%',height:160,objectFit:'cover',borderRadius:8,marginBottom:8}} />
      <h3>{c.courseName}</h3>
      <div className="tag">Status: {c.status}</div>
      <div className="row"><span className="tag">{c.category?.name}</span><span className="tag">${c.price}</span></div>
      <div className="spacer" />
      <details onToggle={(e)=>{ if(e.currentTarget.open){ loadSections() } }}>
        <summary className="tag btns actives cursor-pointer">Update Section Name</summary>
        <form onSubmit={updateSection}>
          <div className="field">
            <label>Section</label>
            <select value={sectionUpdate.sectionId} onChange={e=>setSectionUpdate(s=>({...s,sectionId:e.target.value}))}>
              {sections.map(s => (
                <option key={s._id} value={s._id}>{s.sectionName}</option>
              ))}
            </select>
          </div>
          <div className="field"><label>New Name</label><input value={sectionUpdate.sectionName} onChange={e=>setSectionUpdate(s=>({...s,sectionName:e.target.value}))} /></div>
          <button className="btn secondary">Update Section</button>
        </form>
        {msg && <div className="tag">{msg}</div>}
        {err && <div className="tag" style={{borderColor:'#ef4444',color:'#fca5a5'}}>{err}</div>}
      </details>
    </div>
  )
}


