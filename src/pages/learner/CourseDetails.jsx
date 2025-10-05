import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { useAuth } from '../../auth/AuthContext'

export default function CourseDetails(){
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.post('/api/v1/course/getCourseDetails', { courseId: id })
        setCourse(data.data)
      } catch(e){
        setError(e?.response?.data?.error?.message || 'Failed to load course')
      } finally { setLoading(false) }
    })()
  }, [id])

  const isEnrolled = useMemo(() => {
    if(!course || !user) return false
    const list = course.studentsEnrolled || []
    return list.some(id => String(id) === String(user.id))
  }, [course, user])

  const enroll = async () => {
    try {
      await api.post('/api/v1/course/enroll', { courseId: id })
      const section = course.courseContent?.[0]
      if(section && section.lessons?.[0]){
        navigate(`/learn/${course._id}/${section._id}/${section.lessons[0].order}`)
      }
    } catch(e){
      setError(e?.response?.data?.error?.message || 'Failed to enroll')
    }
  }

  if(loading) return <div className="card">Loading...</div>
  if(error) return <div className="card">{error}</div>
  if(!course) return null

  const firstSection = course.courseContent?.[0]
  return (
    <div className="card">
      <div className="row" style={{justifyContent:'space-between'}}>
        <div>
          <h2>{course.courseName}</h2>
          <p>{course.courseDescription}</p>
          <div>
            {course.tag?.map(t => <span key={t} className="tag">{t}</span>)}
          </div>
        </div>
        <div>
          <img src={course.thumbnail} alt={course.courseName} style={{width:320,borderRadius:8}} />
          <div className="spacer" />
          <div className="row"><span className="tag">{course.category?.name}</span><span className="tag">${course.price}</span></div>
          <div className="spacer" />
          {user ? (
            isEnrolled ? <button className="btn secondary" disabled>Enrolled</button> : <button className="btn" onClick={enroll}>Enroll</button>
          ) : (
            <a className="btn" href="/auth/login">Login to Enroll</a>
          )}
        </div>
      </div>
      <div className="spacer" />
      <h3>Sections</h3>
      <ul>
        {course.courseContent?.map(sec => (
          <li key={sec._id} style={{marginBottom:8}}>
            <strong>{sec.sectionName}</strong>
            <ul>
              {sec.lessons?.sort((a,b)=>a.order-b.order).map(les => (
                <li key={les._id}>
                  {les.order}. {les.title}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      {firstSection?.lessons?.length ? <button className="btn" onClick={()=>navigate(`/learn/${course._id}/${firstSection._id}/${firstSection.lessons[0].order}`)}>Start Learning</button> : null}
    </div>
  )
}


